import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { DashboardStats, QuizHistory, LeaderboardEntry } from "@/types/quiz";

// Mock data - replace with actual API calls
const fetchDashboardStats = async (): Promise<DashboardStats> => ({
  totalQuizzesTaken: 25,
  averageScore: 78.5,
  bestTopic: "React",
  worstTopic: "TypeScript",
  quizzesByDifficulty: {
    easy: 10,
    medium: 8,
    hard: 7,
  },
});

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => ([
  { username: "User1", score: 95, topic: "React", date: "2024-03-10" },
  { username: "User2", score: 90, topic: "TypeScript", date: "2024-03-09" },
  { username: "User3", score: 85, topic: "JavaScript", date: "2024-03-08" },
]);

const fetchQuizHistory = async (): Promise<QuizHistory[]> => ([
  { id: "1", date: "2024-03-10", topic: "React", score: 8, totalQuestions: 10, difficulty: "medium" },
  { id: "2", date: "2024-03-09", topic: "TypeScript", score: 7, totalQuestions: 10, difficulty: "hard" },
  { id: "3", date: "2024-03-08", topic: "JavaScript", score: 9, totalQuestions: 10, difficulty: "easy" },
]);

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  });

  const { data: history } = useQuery({
    queryKey: ['quizHistory'],
    queryFn: fetchQuizHistory,
  });

  const difficultyData = stats ? [
    { name: 'Easy', value: stats.quizzesByDifficulty.easy },
    { name: 'Medium', value: stats.quizzesByDifficulty.medium },
    { name: 'Hard', value: stats.quizzesByDifficulty.hard },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12 gradient-text">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Quizzes</h3>
            <p className="text-3xl font-bold">{stats?.totalQuizzesTaken}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Average Score</h3>
            <p className="text-3xl font-bold">{stats?.averageScore}%</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Best Topic</h3>
            <p className="text-3xl font-bold">{stats?.bestTopic}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Needs Improvement</h3>
            <p className="text-3xl font-bold">{stats?.worstTopic}</p>
          </Card>
        </div>

        {/* Quiz Distribution Chart */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Quizzes by Difficulty</h2>
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
        </Card>

        {/* Leaderboard */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Leaderboard</h2>
          <div className="space-y-4">
            {leaderboard?.map((entry, index) => (
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
            ))}
          </div>
        </Card>

        {/* Quiz History */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Recent Quizzes</h2>
          <div className="space-y-4">
            {history?.map((quiz) => (
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
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;