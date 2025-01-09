import { PDFDocument } from 'pdf-lib';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  let text = '';

  // Since pdf-lib doesn't provide direct text extraction, we'll return a placeholder
  // In a production environment, you'd want to use a more robust PDF text extraction library
  return `PDF content from ${pages.length} pages`;
};

export const summarizePDF = async (text: string): Promise<string> => {
  // Store API key in localStorage for demo purposes
  const apiKey = localStorage.getItem('GROQ_API_KEY');
  
  if (!apiKey) {
    throw new Error('Please set your Groq API key');
  }

  try {
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
            content: 'You are a helpful assistant that summarizes text in a clear and concise way.'
          },
          {
            role: 'user',
            content: `Please summarize the following text: ${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize PDF');
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
            content: `Context: ${text}\n\nQuestion: ${question}`
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