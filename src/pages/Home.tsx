import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 gradient-text">
          Welcome to QuizAI
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Your AI-powered learning companion
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Take a Quiz</h2>
            <p className="text-gray-600 mb-6">
              Generate AI-powered quizzes on any topic or upload your study materials
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
              <Link to="/quiz">Start Quiz</Link>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Study Resources</h2>
            <p className="text-gray-600 mb-6">
              Access curated learning materials and study guides
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Link to="/resources">View Resources</Link>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Dashboard</h2>
            <p className="text-gray-600 mb-6">
              View your progress, leaderboard, and quiz history
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-red-500">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;