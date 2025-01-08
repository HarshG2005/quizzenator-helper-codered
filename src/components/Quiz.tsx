import { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generateQuiz } from '@/services/quizService';
import type { QuizState, QuizResult, QuizConfig } from '@/types/quiz';
import { Loader2 } from "lucide-react";
import QuizConfig from './QuizConfig';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

const Quiz = () => {
  const { toast } = useToast();
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    isLoading: false,
    error: null,
    userAnswers: [],
    timeRemaining: 0,
  });

  const handleStartQuiz = async (config: QuizConfig) => {
    setQuizState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      timeRemaining: config.timeLimit,
    }));

    try {
      const questions = await generateQuiz(config.topic, config.numberOfQuestions, config.difficulty);
      setQuizState(prev => ({
        ...prev,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        showResults: false,
        isLoading: false,
        userAnswers: [],
        timeRemaining: config.timeLimit,
      }));
    } catch (error) {
      setQuizState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to generate quiz. Please try again.',
      }));
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnswer = (selectedAnswer: string) => {
    setQuizState(prev => {
      const newUserAnswers = [...prev.userAnswers];
      newUserAnswers[prev.currentQuestionIndex] = selectedAnswer;
      
      const isCorrect = selectedAnswer === prev.questions[prev.currentQuestionIndex].correctAnswer;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      const newIndex = prev.currentQuestionIndex + 1;
      const showResults = newIndex >= prev.questions.length;

      return {
        ...prev,
        score: newScore,
        currentQuestionIndex: newIndex,
        showResults,
        userAnswers: newUserAnswers,
        timeRemaining: showResults ? 0 : prev.timeRemaining,
      };
    });
  };

  const handleReset = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      isLoading: false,
      error: null,
      userAnswers: [],
      timeRemaining: 0,
    });
  };

  const getQuizResults = (): QuizResult[] => {
    return quizState.questions.map((question, index) => ({
      question: question.question,
      userAnswer: quizState.userAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect: quizState.userAnswers[index] === question.correctAnswer,
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
        <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            AI Quiz Generator
          </h1>
          
          {!quizState.questions.length && !quizState.isLoading && (
            <QuizConfig onStart={handleStartQuiz} isLoading={quizState.isLoading} />
          )}

          {quizState.isLoading && (
            <div className="text-center py-8">
              <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-600" />
              <p className="text-indigo-600">Generating your quiz...</p>
            </div>
          )}

          {quizState.error && (
            <div className="text-red-500 text-center py-4">
              {quizState.error}
            </div>
          )}

          {quizState.questions.length > 0 && !quizState.showResults && !quizState.isLoading && (
            <QuizQuestion
              question={quizState.questions[quizState.currentQuestionIndex]}
              currentIndex={quizState.currentQuestionIndex}
              totalQuestions={quizState.questions.length}
              timeRemaining={quizState.timeRemaining}
              onAnswer={handleAnswer}
            />
          )}

          {quizState.showResults && (
            <QuizResults
              results={getQuizResults()}
              score={quizState.score}
              onReset={handleReset}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;