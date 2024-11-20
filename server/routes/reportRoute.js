const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Report submission and retrieval
router.post('/submit', authMiddleware, upload.array('attachments', 5), reportController.submitReport);
router.get('/student/:studentId', authMiddleware, reportController.getStudentReports);
router.get('/mentor/:mentorId', authMiddleware, reportController.getMentorReports);

// Report evaluation
router.post('/:reportId/evaluate', authMiddleware, reportController.evaluateReport);
router.delete('/:reportId', authMiddleware, reportController.deleteReport);

// Analytics
router.get('/analytics', authMiddleware, reportController.getReportAnalytics);

module.exports = router; 