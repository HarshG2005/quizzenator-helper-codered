export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  showResults: boolean;
  isLoading: boolean;
  error: string | null;
}