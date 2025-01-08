import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generateQuiz } from '@/services/quizService';
import type { Question, QuizState } from '@/types/quiz';
import { Loader2 } from "lucide-react";

const Quiz = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    isLoading: false,
    error: null,
  });

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setQuizState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const questions = await generateQuiz(topic);
      setQuizState(prev => ({
        ...prev,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        showResults: false,
        isLoading: false,
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
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! Keep going!",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
    }

    setQuizState(prev => {
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      const newIndex = prev.currentQuestionIndex + 1;
      const showResults = newIndex >= prev.questions.length;

      return {
        ...prev,
        score: newScore,
        currentQuestionIndex: newIndex,
        showResults,
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
    });
    setTopic('');
  };

  const renderQuestion = (question: Question) => (
    <div className="quiz-appear space-y-4">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="p-4 text-left h-auto"
            onClick={() => handleAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="quiz-appear text-center space-y-4">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">
        Your score: {quizState.score} out of {quizState.questions.length}
      </p>
      <p className="text-lg">
        Percentage: {((quizState.score / quizState.questions.length) * 100).toFixed(1)}%
      </p>
      <Button onClick={handleReset} className="mt-4">
        Start New Quiz
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">AI Quiz Generator</h1>
          
          {!quizState.questions.length && !quizState.isLoading && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter a topic (e.g., 'Ancient Rome', 'Quantum Physics')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mb-4"
              />
              <Button 
                onClick={handleStartQuiz}
                className="w-full"
                disabled={quizState.isLoading}
              >
                Generate Quiz
              </Button>
            </div>
          )}

          {quizState.isLoading && (
            <div className="text-center py-8">
              <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
              <p>Generating your quiz...</p>
            </div>
          )}

          {quizState.error && (
            <div className="text-red-500 text-center py-4">
              {quizState.error}
            </div>
          )}

          {quizState.questions.length > 0 && !quizState.showResults && !quizState.isLoading && (
            <div>
              <div className="mb-4 text-sm text-gray-500">
                Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
              </div>
              {renderQuestion(quizState.questions[quizState.currentQuestionIndex])}
            </div>
          )}

          {quizState.showResults && renderResults()}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;