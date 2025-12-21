const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['중요', '일반', '긴급']
  },
  priority: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true,
    default: '관리자'
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 인덱스 설정
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ priority: -1 });
noticeSchema.index({ status: 1 });

module.exports = mongoose.model('Notice', noticeSchema); 