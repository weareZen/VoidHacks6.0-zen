import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/hooks/use-toast';

export default function ReportSubmission() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    attachments: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        title: "Success",
        description: "Report submitted successfully",
      });
      
      setFormData({ title: '', content: '', attachments: [] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Report Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <Textarea
        placeholder="Report Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />
      <Input
        type="file"
        multiple
        onChange={(e) => setFormData({ ...formData, attachments: Array.from(e.target.files) })}
      />
      <Button type="submit">Submit Report</Button>
    </form>
  );
} 