import { Button } from "@/components/ui/button";
import type { Question } from "@/types/quiz";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswer: (answer: string) => void;
}

const QuizQuestion = ({ 
  question, 
  currentIndex, 
  totalQuestions, 
  timeRemaining: initialTime,
  onAnswer 
}: QuizQuestionProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onAnswer(''); // Submit empty answer when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAnswer]);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime, question]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <div className={`text-sm font-medium ${timeRemaining <= 10 ? 'text-red-500' : 'text-gray-500'}`}>
          Time remaining: {timeRemaining}s
        </div>
      </div>
      
      <div className="quiz-appear space-y-4">
        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-4 text-left h-auto hover:bg-primary/10 transition-all duration-300"
              onClick={() => onAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/resources">
              <Book className="w-4 h-4" />
              View Study Resources
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;