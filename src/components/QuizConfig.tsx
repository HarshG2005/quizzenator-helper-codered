import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";
import type { QuizConfig } from "@/types/quiz";
import { useRef } from "react";
import { useToast } from "./ui/use-toast";

interface QuizConfigProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

const QuizConfig = ({ onStart, isLoading }: QuizConfigProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<QuizConfig>({
    numberOfQuestions: 5,
    difficulty: 'medium',
    timeLimit: 30,
    topic: '',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setConfig(prev => ({ ...prev, topic: file.name.replace('.pdf', '') }));
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

  const handleStart = () => {
    if (!config.topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }
    onStart(config);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter a topic (e.g., 'Ancient Rome', 'Quantum Physics')"
            value={config.topic}
            onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
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

        <div className="space-y-2">
          <Label>Number of Questions</Label>
          <Slider
            value={[config.numberOfQuestions]}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, numberOfQuestions: value }))}
            min={5}
            max={20}
            step={5}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground text-center">
            {config.numberOfQuestions} questions
          </div>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <RadioGroup
            value={config.difficulty}
            onValueChange={(value: 'easy' | 'medium' | 'hard') => 
              setConfig(prev => ({ ...prev, difficulty: value }))}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy">Easy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard">Hard</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Time Limit per Question (seconds)</Label>
          <Slider
            value={[config.timeLimit]}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, timeLimit: value }))}
            min={10}
            max={120}
            step={10}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground text-center">
            {config.timeLimit} seconds per question
          </div>
        </div>
      </div>

      <Button 
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
        disabled={isLoading}
      >
        Generate Quiz
      </Button>
    </div>
  );
};

export default QuizConfig;