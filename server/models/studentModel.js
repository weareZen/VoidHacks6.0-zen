const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userType: {
    type: String,
    default: "student",
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  enrollementNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Internship Information (Filled by Admin)
  internshipDetails: {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyAddress: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    internshipType: {
      type: String,
      enum: ["Full-time", "Part-time"],
      required: true,
    },
    externalMentor: {
      name: {
        type: String,
        trim: true,
      },
      contactInfo: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed"],
      default: "Pending",
    },
  },

  // Internal Mentor (Assigned by Admin)
  internalMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor", // References the Mentor model
  },

  // Progress Tracking
  progress: {
    totalReports: {
      type: Number,
      default: 0,
    },
    completedReports: {
      type: Number,
      default: 0,
    },
    overallCompletionPercentage: {
      type: Number,
      default: 0,
    },
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Add this inside the studentSchema
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
