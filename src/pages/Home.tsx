import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">
            <Link to="/">QUIZZER</Link>
          </h1>
          <div className="space-x-6">
            <Link to="/quiz" className="text-white hover:text-indigo-100">
              Quiz
            </Link>
            <Link to="/resources" className="text-white hover:text-indigo-100">
              Resources
            </Link>
            <Link to="/dashboard" className="text-white hover:text-indigo-100">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8 gradient-text typewriter">
            Welcome to QUIZZER!
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Your AI-powered learning companion
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Take a Quiz Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Take a Quiz</h2>
              <p className="text-gray-600 mb-6">
                Generate AI-powered quizzes on any topic or upload your study materials
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
                <Link to="/quiz">Start Quiz</Link>
              </Button>
            </Card>

            {/* Study Resources Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Study Resources</h2>
              <p className="text-gray-600 mb-6">
                Access curated learning materials and study guides
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Link to="/resources">View Resources</Link>
              </Button>
            </Card>

            {/* Dashboard Card */}
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
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
