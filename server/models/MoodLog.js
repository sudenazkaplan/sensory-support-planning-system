const mongoose = require('mongoose')

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['very_good', 'good', 'neutral', 'bad', 'very_bad'],
    required: true
  },
  score: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('MoodLog', moodLogSchema)