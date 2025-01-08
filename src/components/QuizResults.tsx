import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuizResult } from "@/types/quiz";

interface QuizResultsProps {
  results: QuizResult[];
  score: number;
  onReset: () => void;
}

const QuizResults = ({ results, score, onReset }: QuizResultsProps) => {
  return (
    <div className="quiz-appear space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-2xl">
          Your score: {score} out of {results.length}
        </p>
        <p className="text-xl">
          ({((score / results.length) * 100).toFixed(1)}%)
        </p>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className={`p-4 border-l-4 ${
            result.isCorrect ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'
          }`}>
            <h3 className="font-semibold mb-2">{result.question}</h3>
            <p className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
              Your answer: {result.userAnswer || 'Time expired'}
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
        onClick={onReset}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
      >
        Start New Quiz
      </Button>
    </div>
  );
};

export default QuizResults;