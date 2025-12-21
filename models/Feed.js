const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 인덱스
feedSchema.index({ createdAt: -1 });
feedSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Feed', feedSchema);
