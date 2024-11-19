const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  userType: {
    type: String,
    default: "mentor",
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

  // Internal Mentor Specific Data
  assignedStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // References the Student model
    },
  ],
  department: {
    type: String,
    trim: true,
  },
  officeLocation: {
    type: String,
    trim: true,
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
});

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
