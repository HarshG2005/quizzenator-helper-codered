export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizConfig {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
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

export interface QuizHistory {
  id: string;
  date: string;
  topic: string;
  score: number;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  topic: string;
  date: string;
}

export interface DashboardStats {
  totalQuizzesTaken: number;
  averageScore: number;
  bestTopic: string;
  worstTopic: string;
  quizzesByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}