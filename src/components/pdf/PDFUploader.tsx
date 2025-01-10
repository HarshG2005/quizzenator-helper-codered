import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { extractTextFromPDF, summarizePDF } from "@/services/pdfService";

interface PDFUploaderProps {
  onPDFProcessed: (text: string, summary: string, filename: string) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const PDFUploader = ({ onPDFProcessed, isProcessing, setIsProcessing }: PDFUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsProcessing(true);
      try {
        const text = await extractTextFromPDF(file);
        if (!text) {
          throw new Error('No text could be extracted from the PDF');
        }
        
        const summarized = await summarizePDF(text);
        onPDFProcessed(text, summarized, file.name.replace('.pdf', ''));
        
        toast({
          title: "Success",
          description: "PDF has been successfully processed and summarized.",
        });
      } catch (error) {
        console.error('PDF processing error:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to process PDF",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } else {
      toast({
        title: "Error",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Input
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
        disabled={isProcessing}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload PDF
      </Button>
    </div>
  );
};

export default PDFUploader;