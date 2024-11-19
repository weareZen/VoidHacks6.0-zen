import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../components/hooks/use-toast';

const REPORT_TYPES = {
  FORTNIGHTLY: {
    label: 'Fortnightly Report',
    description: 'Submit your bi-weekly progress report',
    deadline: '15 days'
  },
  ASSIGNMENT: {
    label: 'Monthly Assignment',
    description: 'Complete the assignment given by your internal mentor',
    deadline: '30 days'
  },
  FINAL_EVALUATION: {
    label: 'Industry Mentor Evaluation',
    description: 'Final evaluation by your industry mentor',
    deadline: 'End of internship'
  }
};

export default function ReportSubmission() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    content: '',
    attachments: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit report');

      toast({
        title: 'Success',
        description: 'Report submitted successfully',
        variant: 'success'
      });

      // Reset form
      setFormData({
        type: '',
        title: '',
        content: '',
        attachments: []
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle file upload logic here
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_TYPES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.type && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {REPORT_TYPES[formData.type].description}
                  <br />
                  Deadline: {REPORT_TYPES[formData.type].deadline}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Input
            placeholder="Report Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />

          <Textarea
            placeholder="Report Content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
          />

          <div className="space-y-2">
            <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload').click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Attachments
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            {formData.attachments.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {formData.attachments.length} file(s) selected
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 