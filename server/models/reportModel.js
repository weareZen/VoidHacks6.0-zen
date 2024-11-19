const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['FORTNIGHTLY', 'ASSIGNMENT', 'FINAL_EVALUATION'],
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  deadline: {
    type: Date,
    required: true
  },
  submissionDate: {
    type: Date
  },
  evaluation: {
    points: {
      type: Number,
      min: 0,
      max: 10
    },
    feedback: String,
    evaluatedAt: Date,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor'
    }
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUBMITTED', 'EVALUATED', 'OVERDUE'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report; 