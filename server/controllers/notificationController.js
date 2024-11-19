const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const { userId, userType } = req.query;
    const notifications = await Notification.find({
      recipient: userId,
      recipientModel: userType === 'student' ? 'Student' : 'Mentor'
    })
    .sort({ createdAt: -1 })
    .limit(20);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error marking notification as read',
      error: error.message 
    });
  }
}; 