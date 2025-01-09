import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { chatWithPDF } from "@/services/pdfService";

interface PDFChatProps {
  pdfText: string;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const PDFChat = ({ pdfText, isProcessing, setIsProcessing }: PDFChatProps) => {
  const { toast } = useToast();
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');

  const handleAskQuestion = async () => {
    if (!question.trim() || !pdfText) {
      toast({
        title: "Error",
        description: "Please enter a question and upload a PDF first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await chatWithPDF(pdfText, question);
      setAnswer(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process question",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-semibold">Chat with PDF</h3>
        <Textarea
          placeholder="Ask a question about the PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button 
          onClick={handleAskQuestion}
          disabled={isProcessing}
          className="w-full"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
        {answer && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Answer:</h4>
            <p className="text-sm text-muted-foreground">{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFChat;