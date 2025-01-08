import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generateQuiz } from '@/services/quizService';
import type { Question, QuizState, QuizResult } from '@/types/quiz';
import { Loader2, Upload } from "lucide-react";

const Quiz = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [topic, setTopic] = useState('');
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    isLoading: false,
    error: null,
    userAnswers: [],
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
        userAnswers: [],
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
    });
    setTopic('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // For now, just set the filename as the topic
      // In a real implementation, you would process the PDF
      setTopic(file.name.replace('.pdf', ''));
      toast({
        title: "PDF Uploaded",
        description: "PDF processing is not implemented yet. Using filename as topic.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const getQuizResults = (): QuizResult[] => {
    return quizState.questions.map((question, index) => ({
      question: question.question,
      userAnswer: quizState.userAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect: quizState.userAnswers[index] === question.correctAnswer,
    }));
  };

  const renderQuestion = (question: Question) => (
    <div className="quiz-appear space-y-4">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="p-4 text-left h-auto hover:bg-primary/10 transition-all duration-300"
            onClick={() => handleAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderResults = () => {
    const results = getQuizResults();
    return (
      <div className="quiz-appear space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-2xl">
            Your score: {quizState.score} out of {quizState.questions.length}
          </p>
          <p className="text-xl">
            ({((quizState.score / quizState.questions.length) * 100).toFixed(1)}%)
          </p>
        </div>
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className={`p-4 border-l-4 ${
              result.isCorrect ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'
            }`}>
              <h3 className="font-semibold mb-2">{result.question}</h3>
              <p className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                Your answer: {result.userAnswer}
              </p>
              {!result.isCorrect && (
                <p className="text-green-700 mt-1">
                  Correct answer: {result.correctAnswer}
                </p>
              )}
            </Card>
          ))}
        </div>
        
        <Button 
          onClick={handleReset}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          Start New Quiz
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            AI Quiz Generator
          </h1>
          
          {!quizState.questions.length && !quizState.isLoading && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter a topic (e.g., 'Ancient Rome', 'Quantum Physics')"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PDF
                </Button>
              </div>
              <Button 
                onClick={handleStartQuiz}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                disabled={quizState.isLoading}
              >
                Generate Quiz
              </Button>
            </div>
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