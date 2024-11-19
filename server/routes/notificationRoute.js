const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Make sure the controller methods exist before adding routes
router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/:notificationId/mark-read', authMiddleware, notificationController.markAsRead);

module.exports = router; 