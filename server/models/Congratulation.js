const mongoose = require('mongoose');

const congratulationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['결혼', '출산', '돌잔치', '회갑', '칠순', '조의', '기타'],
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
  targetName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showOnSideCard: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
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

congratulationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Congratulation', congratulationSchema);
