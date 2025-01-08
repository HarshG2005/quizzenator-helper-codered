const GROQ_API_KEY = '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';

const generateQuizPrompt = (topic: string) => {
  return `Generate a quiz about ${topic}. Return exactly 5 multiple choice questions in this JSON format:
  {
    "questions": [
      {
        "question": "Question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Correct option here (must match exactly one of the options)"
      }
    ]
  }
  Make sure the questions are engaging and educational. Each question must have exactly 4 options.`;
};

export const generateQuiz = async (topic: string) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: generateQuizPrompt(topic),
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    return parsedContent.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};