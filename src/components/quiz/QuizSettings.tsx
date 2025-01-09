import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import type { QuizConfig } from "@/types/quiz";

interface QuizSettingsProps {
  config: QuizConfig;
  onConfigChange: (config: QuizConfig) => void;
}

const QuizSettings = ({ config, onConfigChange }: QuizSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Number of Questions</Label>
        <Slider
          value={[config.numberOfQuestions]}
          onValueChange={([value]) => onConfigChange({ ...config, numberOfQuestions: value })}
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
            onConfigChange({ ...config, difficulty: value })}
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
          onValueChange={([value]) => onConfigChange({ ...config, timeLimit: value })}
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
  );
};

export default QuizSettings;