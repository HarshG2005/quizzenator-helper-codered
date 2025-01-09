import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { DashboardStats, QuizHistory, LeaderboardEntry } from "@/types/quiz";
import { Trophy, ChartBar, History, Brain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
 

// Mock data - replace with actual API calls
const fetchDashboardStats = async (): Promise<DashboardStats> => ({
  totalQuizzesTaken: Math.floor(Math.random() * 50), // Simulating dynamic data
  averageScore: Math.floor(Math.random() * 100),
  bestTopic: ["React", "TypeScript", "JavaScript"][Math.floor(Math.random() * 3)],
  worstTopic: ["CSS", "HTML", "Node.js"][Math.floor(Math.random() * 3)],
  quizzesByDifficulty: {
    easy: Math.floor(Math.random() * 15),
    medium: Math.floor(Math.random() * 12),
    hard: Math.floor(Math.random() * 10),
  },
});

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => ([
  { username: "User1", score: Math.floor(Math.random() * 100), topic: "React", date: "2024-03-10" },
  { username: "User2", score: Math.floor(Math.random() * 100), topic: "TypeScript", date: "2024-03-09" },
  { username: "User3", score: Math.floor(Math.random() * 100), topic: "JavaScript", date: "2024-03-08" },
]);

const fetchQuizHistory = async (): Promise<QuizHistory[]> => ([
  { id: "1", date: "2024-03-10", topic: "React", score: Math.floor(Math.random() * 10), totalQuestions: 10, difficulty: "medium" },
  { id: "2", date: "2024-03-09", topic: "TypeScript", score: Math.floor(Math.random() * 10), totalQuestions: 10, difficulty: "hard" },
  { id: "3", date: "2024-03-08", topic: "JavaScript", score: Math.floor(Math.random() * 10), totalQuestions: 10, difficulty: "easy" },
]);

const StatCard = ({ icon: Icon, title, value, isLoading }: { 
  icon: React.ElementType, 
  title: string, 
  value: string | number,
  isLoading: boolean 
}) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <Icon className="w-8 h-8 text-indigo-500" />
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 300000, // Refetch every  seconds
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 300000,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['quizHistory'],
    queryFn: fetchQuizHistory,
    refetchInterval: 300000,
  });

  const difficultyData = stats ? [
    { name: 'Easy', value: stats.quizzesByDifficulty.easy },
    { name: 'Medium', value: stats.quizzesByDifficulty.medium },
    { name: 'Hard', value: stats.quizzesByDifficulty.hard },
  ] : [];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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
            <Link to="/home" className="text-white hover:text-indigo-100">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center mb-12 gradient-text">Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={ChartBar} 
              title="Total Quizzes" 
              value={stats?.totalQuizzesTaken || 0}
              isLoading={statsLoading}
            />
            <StatCard 
              icon={Brain} 
              title="Average Score" 
              value={`${stats?.averageScore || 0}%`}
              isLoading={statsLoading}
            />
            <StatCard 
              icon={Trophy} 
              title="Best Topic" 
              value={stats?.bestTopic || '-'}
              isLoading={statsLoading}
            />
            <StatCard 
              icon={History} 
              title="Needs Improvement" 
              value={stats?.worstTopic || '-'}
              isLoading={statsLoading}
            />
          </div>

          {/* Quiz Distribution Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Quizzes by Difficulty</h2>
            {statsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer className="h-[300px]" config={{}}>
                <BarChart data={difficultyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={({ active, payload }) => (
                    active && payload?.length ? (
                      <div className="bg-white p-2 border rounded shadow">
                        <p>{`${payload[0].name}: ${payload[0].value} quizzes`}</p>
                      </div>
                    ) : null
                  )} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            )}
          </Card>

          {/* Leaderboard */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Leaderboard</h2>
            <div className="space-y-4">
              {leaderboardLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : (
                leaderboard?.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">{index + 1}</span>
                      <span>{entry.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{entry.topic}</span>
                      <span className="font-bold">{entry.score}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quiz History */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Recent Quizzes</h2>
            <div className="space-y-4">
              {historyLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : (
                history?.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                      <h3 className="font-semibold">{quiz.topic}</h3>
                      <p className="text-sm text-gray-600">{quiz.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 rounded bg-gray-100 text-sm">
                        {quiz.difficulty}
                      </span>
                      <span className="font-bold">
                        {quiz.score}/{quiz.totalQuestions}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>        
      </div>
    </div>
  );
};

export default Dashboard;
