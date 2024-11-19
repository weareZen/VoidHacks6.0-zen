import ReportSubmission from '../components/ReportSubmission';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function SubmitReport() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Report</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportSubmission />
        </CardContent>
      </Card>
    </div>
  );
} 