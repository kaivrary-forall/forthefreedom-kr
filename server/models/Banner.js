const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  subtitle: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  originalName: {
    type: String
  },
  linkUrl: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: '자세히 보기'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 순서대로 정렬
bannerSchema.index({ order: 1 });
bannerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
