const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['임명', '전보', '퇴임', '승진', '기타'],
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
  excerpt: {
    type: String,
    default: ''
  },
  effectiveDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
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

personnelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Personnel', personnelSchema);
