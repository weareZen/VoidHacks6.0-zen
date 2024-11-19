const Report = require('../models/reportModel');
const Student = require('../models/studentModel');
const Notification = require('../models/notificationModel');

// Submit Report
exports.submitReport = async (req, res) => {
  try {
    const { type, title, content, attachments } = req.body;
    const studentId = req.user.id;

    const student = await Student.findById(studentId).populate('internalMentor');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const report = new Report({
      type,
      student: studentId,
      mentor: student.internalMentor._id,
      title,
      content,
      attachments,
      deadline: calculateDeadline(type),
      submissionDate: new Date(),
      status: 'SUBMITTED'
    });

    await report.save();
    
    // Update student progress
    await updateStudentProgress(studentId);

    res.status(201).json({ 
      message: 'Report submitted successfully',
      report 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error submitting report',
      error: error.message 
    });
  }
};

// Evaluate Report
exports.evaluateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { points, feedback } = req.body;
    const mentorId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.evaluation = {
      points,
      feedback,
      evaluatedAt: new Date(),
      evaluatedBy: mentorId
    };
    report.status = 'EVALUATED';

    await report.save();
    
    // Update student progress after evaluation
    await updateStudentProgress(report.student);

    res.status(200).json({ 
      message: 'Report evaluated successfully',
      report 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error evaluating report',
      error: error.message 
    });
  }
};

// Helper function to calculate deadline based on report type
const calculateDeadline = (type) => {
  const date = new Date();
  switch (type) {
    case 'FORTNIGHTLY':
      date.setDate(date.getDate() + 15);
      break;
    case 'ASSIGNMENT':
      date.setDate(date.getDate() + 30);
      break;
    case 'FINAL_EVALUATION':
      // Set to internship end date
      break;
  }
  return date;
};

// Helper function to update student progress
const updateStudentProgress = async (studentId) => {
  const student = await Student.findById(studentId);
  const reports = await Report.find({ student: studentId });
  
  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'EVALUATED').length;
  const overallCompletionPercentage = (completedReports / totalReports) * 100;

  student.progress = {
    totalReports,
    completedReports,
    overallCompletionPercentage
  };

  await student.save();
};

// Get Reports for Student
exports.getStudentReports = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const reports = await Report.find({ student: studentId })
      .populate('mentor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching reports',
      error: error.message 
    });
  }
};

// Get Reports for Mentor
exports.getMentorReports = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const reports = await Report.find({ mentor: mentorId })
      .populate('student', 'firstName lastName')
      .sort({ createdAt: -1 });

    const pendingReports = reports.filter(r => r.status === 'SUBMITTED');
    const allReports = reports;

    res.status(200).json({ pendingReports, allReports });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching reports',
      error: error.message 
    });
  }
};

// Get Report Analytics
exports.getReportAnalytics = async (req, res) => {
  try {
    const { studentId, mentorId } = req.query;
    let reports;

    if (studentId) {
      reports = await Report.find({ student: studentId });
    } else if (mentorId) {
      reports = await Report.find({ mentor: mentorId });
    }

    const analytics = {
      totalReports: reports.length,
      evaluatedReports: reports.filter(r => r.status === 'EVALUATED').length,
      averageScore: reports
        .filter(r => r.evaluation?.points)
        .reduce((acc, curr) => acc + curr.evaluation.points, 0) / reports.length || 0,
      reportTypes: {
        FORTNIGHTLY: reports.filter(r => r.type === 'FORTNIGHTLY').length,
        ASSIGNMENT: reports.filter(r => r.type === 'ASSIGNMENT').length,
        FINAL_EVALUATION: reports.filter(r => r.type === 'FINAL_EVALUATION').length
      }
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching analytics',
      error: error.message 
    });
  }
};

// Create notification helper function
const createNotification = async (recipientId, recipientModel, type, title, message) => {
  const notification = new Notification({
    recipient: recipientId,
    recipientModel,
    type,
    title,
    message
  });
  await notification.save();
}; 