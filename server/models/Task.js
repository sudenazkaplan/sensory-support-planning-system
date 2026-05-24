const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['personal', 'school', 'health', 'social', 'other'],
    default: 'personal'
  }
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)