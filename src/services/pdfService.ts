import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from "@/integrations/supabase/client";

// Initialize pdf.js worker
/* @vite-ignore */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += `${pageText}\n\n`;
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

const truncateText = (text: string, maxLength: number = 4000): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\n[Content truncated due to length...]';
};

export const summarizePDF = async (text: string): Promise<string> => {
  const apiKey = localStorage.getItem('GROQ_API_KEY');
  
  if (!apiKey) {
    throw new Error('Please set your Groq API key');
  }

  try {
    const truncatedText = truncateText(text);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates clear, concise summaries. Focus on the main points and key takeaways. Structure the summary with bullet points for better readability.'
          },
          {
            role: 'user',
            content: `Please provide a structured summary of the following text, highlighting the main points and key concepts: ${truncatedText}`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing PDF:', error);
    throw error;
  }
};

export const chatWithPDF = async (pdfText: string, question: string): Promise<string> => {
  const apiKey = localStorage.getItem('GROQ_API_KEY');
  
  if (!apiKey) {
    throw new Error('Please set your Groq API key');
  }

  try {
    const truncatedText = truncateText(pdfText);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on the provided PDF content. Be concise and accurate in your responses.'
          },
          {
            role: 'user',
            content: `Context: ${truncatedText}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process question');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error processing question:', error);
    throw error;
  }
};

export const saveQuizAttempt = async (
  topic: string,
  score: number,
  totalQuestions: number,
  difficulty: string
) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      topic,
      score,
      total_questions: totalQuestions,
      difficulty,
      user_id: user.id
    });

  if (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
};