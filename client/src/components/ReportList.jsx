import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

const getStatusColor = (status) => {
  switch (status) {
    case 'SUBMITTED': return 'bg-yellow-500';
    case 'EVALUATED': return 'bg-green-500';
    case 'PENDING': return 'bg-gray-500';
    case 'OVERDUE': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default function ReportList({ reports }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report._id}>
            <TableCell>{report.title}</TableCell>
            <TableCell>{report.type}</TableCell>
            <TableCell>{new Date(report.deadline).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </TableCell>
            <TableCell>
              {report.evaluation?.points ?? 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 