import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from '../context/AuthContext';

export default function ReportSubmission({ onSubmitSuccess }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    content: '',
    files: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      
      Array.from(formData.files).forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      const response = await fetch('http://localhost:5000/api/v1/reports/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit report');
      }

      toast({
        title: "Success",
        description: "Report submitted successfully",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      setFormData({ type: '', title: '', content: '', files: [] });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
      <Select
        value={formData.type}
        onValueChange={(value) => setFormData({ ...formData, type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Report Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FORTNIGHTLY">Fortnightly Report</SelectItem>
          <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
          <SelectItem value="FINAL_EVALUATION">Final Evaluation</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Report Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Textarea
        placeholder="Report Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        required
        className="min-h-[200px]"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Attachments (PDF, DOC, DOCX, JPG, PNG)
        </label>
        <Input
          type="file"
          onChange={(e) => setFormData({ ...formData, files: e.target.files })}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-100"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Button type="submit" disabled={isLoading || !formData.type || !formData.title || !formData.content}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>

      {formData.files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
          <ul className="text-sm space-y-1">
            {Array.from(formData.files).map((file, index) => (
              <li key={index} className="text-muted-foreground">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
} 