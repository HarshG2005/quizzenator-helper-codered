import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Book, Calculator, TestTube, Globe, History, Microscope } from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    icon: Calculator,
    description: "Algebra, Calculus, Geometry, and more",
    resources: ["Khan Academy", "MIT OpenCourseWare", "IXL Math"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Science",
    icon: TestTube,
    description: "Physics, Chemistry, Biology",
    resources: ["Coursera", "edX", "Science Daily"],
    color: "from-green-500 to-teal-500"
  },
  {
    name: "History",
    icon: History,
    description: "World History, Civilizations",
    resources: ["History.com", "BBC History", "National Geographic"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "Literature",
    icon: Book,
    description: "Classic Literature, Poetry, Essays",
    resources: ["Project Gutenberg", "SparkNotes", "LitCharts"],
    color: "from-red-500 to-pink-500"
  },
  {
    name: "Biology",
    icon: Microscope,
    description: "Cell Biology, Genetics, Ecology",
    resources: ["Biology Online", "Nature.com", "NCBI"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    name: "Geography",
    icon: Globe,
    description: "Physical & Human Geography",
    resources: ["National Geographic", "WorldAtlas", "GeoLounge"],
    color: "from-teal-500 to-blue-500"
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold gradient-text">Study Resources</h1>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${subject.color} text-white mb-4`}>
                <subject.icon size={24} />
              </div>
              <h2 className="text-2xl font-semibold mb-3">{subject.name}</h2>
              <p className="text-gray-600 mb-4">{subject.description}</p>
              <div className="space-y-2">
                {subject.resources.map((resource) => (
                  <div key={resource} className="text-sm text-gray-500">
                    • {resource}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;