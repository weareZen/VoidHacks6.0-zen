const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, reportController.submitReport);
router.post('/:reportId/evaluate', authMiddleware, reportController.evaluateReport);
router.get('/student/:studentId', authMiddleware, reportController.getStudentReports);
router.get('/mentor/:mentorId', authMiddleware, reportController.getMentorReports);
router.get('/analytics', authMiddleware, reportController.getReportAnalytics);

module.exports = router; 