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
    default: ''
  },
  imageActive: {
    type: Boolean,
    default: true
  },
  mobileImageUrl: {
    type: String,
    default: ''
  },
  mobileImageActive: {
    type: Boolean,
    default: true
  },
  originalName: {
    type: String
  },
  mobileOriginalName: {
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
  source: {
    type: String,
    trim: true,
    default: ''
  },
  sourceColor: {
    type: String,
    enum: ['white', 'black', 'gray'],
    default: 'white'
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
