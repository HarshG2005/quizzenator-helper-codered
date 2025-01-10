import { PDFDocument } from 'pdf-lib';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    let fullText = '';

    // Extract basic information from each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // Get page dimensions and metadata as a basic representation
      const { width, height } = page.getSize();
      fullText += `Page ${i + 1} (${width}x${height}):\n`;
      
      // Add page content placeholder
      // Note: pdf-lib has limited text extraction capabilities
      fullText += `[Page content ${i + 1}]\n\n`;
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
    // Truncate text to prevent 413 error
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

export const chatWithPDF = async (text: string, question: string): Promise<string> => {
  const apiKey = localStorage.getItem('GROQ_API_KEY');
  
  if (!apiKey) {
    throw new Error('Please set your Groq API key');
  }

  try {
    // Truncate text to prevent 413 error
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
            content: 'You are a helpful assistant that answers questions based on the provided context.'
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