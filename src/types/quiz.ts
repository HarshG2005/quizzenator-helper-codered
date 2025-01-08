export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizConfig {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds per question
  topic: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  showResults: boolean;
  isLoading: boolean;
  error: string | null;
  userAnswers: string[];
  timeRemaining: number;
}

export interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}