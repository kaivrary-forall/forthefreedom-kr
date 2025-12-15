const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
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
    required: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    enum: ['임명', '승진', '전보', '해촉', '징계'],
    default: '임명'
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
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 인덱스 설정
personnelSchema.index({ createdAt: -1 });
personnelSchema.index({ priority: -1 });
personnelSchema.index({ status: 1 });

module.exports = mongoose.model('Personnel', personnelSchema);
