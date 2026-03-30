const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['applied', 'interview', 'rejected', 'offer'],
      default: 'applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    resume: {
      fileName: String,
      fileData: String, // Base64 encoded PDF
      uploadedDate: {
        type: Date,
        default: null,
      },
      fileSize: Number, // File size in bytes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
