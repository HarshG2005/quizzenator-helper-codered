import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "./ui/card";
import type { QuizConfig } from "@/types/quiz";
import { useToast } from "./ui/use-toast";
import PDFUploader from "./pdf/PDFUploader";
import PDFChat from "./pdf/PDFChat";
import QuizSettings from "./quiz/QuizSettings";

interface QuizConfigProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

const QuizConfigComponent = ({ onStart, isLoading }: QuizConfigProps) => {
  const { toast } = useToast();
  const [pdfText, setPdfText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState<QuizConfig>({
    numberOfQuestions: 5,
    difficulty: 'medium',
    timeLimit: 30,
    topic: '',
  });

  const handlePDFProcessed = (text: string, summary: string, filename: string) => {
    setPdfText(text);
    setSummary(summary);
    setConfig(prev => ({ ...prev, topic: filename }));
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
          <PDFUploader
            onPDFProcessed={handlePDFProcessed}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </div>

        {summary && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">PDF Summary</h3>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </CardContent>
          </Card>
        )}

        {pdfText && (
          <PDFChat
            pdfText={pdfText}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}

        <QuizSettings
          config={config}
          onConfigChange={setConfig}
        />
      </div>

      <Button 
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
        disabled={isLoading || isProcessing}
      >
        Generate Quiz
      </Button>
    </div>
  );
};

export default QuizConfigComponent;