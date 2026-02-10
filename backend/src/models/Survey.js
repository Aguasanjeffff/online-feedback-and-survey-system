const mongoose = require('mongoose');
const crypto = require('crypto');

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    default: () => crypto.randomBytes(8).toString('hex')
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'short-answer', 'rating'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [String], // For multiple choice
  required: {
    type: Boolean,
    default: false
  }
});

const surveySchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [questionSchema],
  isOpen: {
    type: Boolean,
    default: true
  },
  publicLink: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
surveySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Survey', surveySchema);