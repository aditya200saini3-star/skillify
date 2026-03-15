
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  duration: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    enum: ['web', 'data', 'ai', 'cyber', 'cloud', 'mobile'],
    required: true
  },
  goal: {
    type: String,
    enum: ['academic', 'job', 'skill', 'certification'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  provider: String,
  link: String,
  difficulty: {
    type: Number,
    min: 1,
    max: 3
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);

