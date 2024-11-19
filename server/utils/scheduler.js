const cron = require('node-cron');
const { checkOverdueReports, checkAndCreateDueReports } = require('../controllers/reportController');
const Student = require('../models/studentModel');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Check for overdue reports
    await checkOverdueReports();

    // Create due reports for all active students
    const students = await Student.find({ 'internshipDetails.status': 'Approved' });
    for (const student of students) {
      await checkAndCreateDueReports(student._id);
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
});

module.exports = cron.schedule('0 0 * * *', async () => {
  try {
    // Check for overdue reports
    await checkOverdueReports();

    // Create due reports for all active students
    const students = await Student.find({ 'internshipDetails.status': 'Approved' });
    for (const student of students) {
      await checkAndCreateDueReports(student._id);
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
}); 