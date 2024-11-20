const cron = require('node-cron');
const Student = require('../models/studentModel');
const { checkAndCreateDueReports, checkOverdueReports } = require('../controllers/reportController');

// Run daily at midnight
const initializeScheduler = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      // Check for all active students
      const activeStudents = await Student.find({
        'internshipDetails.status': 'Approved',
        'internshipDetails.endDate': { $gt: new Date() }
      });

      // Create due reports for each student
      for (const student of activeStudents) {
        await checkAndCreateDueReports(student._id);
      }

      // Check for overdue reports
      await checkOverdueReports();
    } catch (error) {
      console.log('Scheduler error:', error);
    }
  });
};

module.exports = initializeScheduler; 