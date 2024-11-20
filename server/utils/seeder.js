const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('../models/studentModel');
const Mentor = require('../models/mentorModel');
const Report = require('../models/reportModel');
const Notification = require('../models/notificationModel');
const Admin = require('../models/adminModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Zen"
    });
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const generateDummyData = async () => {
  try {
    // Clear existing data
    await Promise.all([
      Student.deleteMany({}),
      Mentor.deleteMany({}),
      Report.deleteMany({}),
      Notification.deleteMany({}),
      Admin.deleteMany({})
    ]);

    // Create admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      phone_number: '1234567890'
    });

    // Create mentors
    const hashedMentorPassword = await bcrypt.hash('mentor123', 10);
    const mentors = await Mentor.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: hashedMentorPassword,
        phoneNumber: '1234567890',
        department: 'Computer Science',
        officeLocation: 'Building A'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: hashedMentorPassword,
        phoneNumber: '0987654321',
        department: 'Information Technology',
        officeLocation: 'Building B'
      }
    ]);

    // Create students
    const hashedStudentPassword = await bcrypt.hash('student123', 10);
    const students = await Student.create([
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        enrollementNumber: 'EN001',
        email: 'alice@example.com',
        password: hashedStudentPassword,
        phoneNumber: '1122334455',
        internshipDetails: {
          companyName: 'Tech Corp',
          companyAddress: '123 Tech Street',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30'),
          internshipType: 'Full-time',
          status: 'Approved'
        },
        internalMentor: mentors[0]._id
      },
      {
        firstName: 'Bob',
        lastName: 'Wilson',
        enrollementNumber: 'EN002',
        email: 'bob@example.com',
        password: hashedStudentPassword,
        phoneNumber: '5544332211',
        internshipDetails: {
          companyName: 'Innovation Labs',
          companyAddress: '456 Innovation Ave',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-07-31'),
          internshipType: 'Full-time',
          status: 'Approved'
        },
        internalMentor: mentors[1]._id
      }
    ]);

    // Update mentor's assignedStudents
    await Mentor.findByIdAndUpdate(mentors[0]._id, {
      $push: { assignedStudents: students[0]._id }
    });
    await Mentor.findByIdAndUpdate(mentors[1]._id, {
      $push: { assignedStudents: students[1]._id }
    });

    // Create reports
    const reports = await Report.create([
      {
        type: 'FORTNIGHTLY',
        title: 'First Fortnight Report',
        content: 'Progress report for the first two weeks',
        student: students[0]._id,
        mentor: mentors[0]._id,
        deadline: new Date('2024-04-15'),
        status: 'SUBMITTED',
        submissionDate: new Date('2024-04-14')
      },
      {
        type: 'ASSIGNMENT',
        title: 'Monthly Assignment 1',
        content: 'Technical documentation project',
        student: students[0]._id,
        mentor: mentors[0]._id,
        deadline: new Date('2024-04-30'),
        status: 'PENDING'
      },
      {
        type: 'FORTNIGHTLY',
        title: 'First Fortnight Report',
        content: 'Progress report for the first two weeks',
        student: students[1]._id,
        mentor: mentors[1]._id,
        deadline: new Date('2024-04-15'),
        status: 'EVALUATED',
        submissionDate: new Date('2024-04-13'),
        evaluation: {
          points: 8,
          feedback: 'Excellent work!',
          evaluatedAt: new Date('2024-04-14'),
          evaluatedBy: mentors[1]._id
        }
      }
    ]);

    // Create notifications
    await Notification.create([
      {
        recipient: students[0]._id,
        recipientModel: 'Student',
        title: 'Report Due Soon',
        message: 'Your fortnightly report is due in 2 days',
        type: 'DEADLINE_REMINDER'
      },
      {
        recipient: mentors[0]._id,
        recipientModel: 'Mentor',
        title: 'New Submission',
        message: 'Alice Johnson has submitted their fortnightly report',
        type: 'REPORT_SUBMISSION'
      }
    ]);

    console.log('Dummy data created successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('Mentor - Email: john.doe@example.com, Password: mentor123');
    console.log('Student - Email: alice@example.com, Password: student123');

  } catch (error) {
    console.error('Error generating dummy data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the seeder
connectDB().then(() => {
  generateDummyData();
}); 