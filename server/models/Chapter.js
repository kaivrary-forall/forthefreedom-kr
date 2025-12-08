const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true,
    default: 'seoul',
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dongs: [{
    type: String,
    trim: true
  }],
  kakaoLink: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  // 당협위원장 정보
  chairmanName: {
    type: String,
    trim: true,
    default: null
  },
  // SNS 채널들
  chairmanWebsite: {
    type: String,
    trim: true,
    default: null
  },
  chairmanInstagram: {
    type: String,
    trim: true,
    default: null
  },
  chairmanFacebook: {
    type: String,
    trim: true,
    default: null
  },
  chairmanThreads: {
    type: String,
    trim: true,
    default: null
  },
  chairmanX: {
    type: String,
    trim: true,
    default: null
  },
  chairmanNaverBlog: {
    type: String,
    trim: true,
    default: null
  },
  chairmanYoutube: {
    type: String,
    trim: true,
    default: null
  },
  chairmanMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null
  },
  // 정렬 순서
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 복합 인덱스 설정
chapterSchema.index({ province: 1, name: 1 }, { unique: true });
chapterSchema.index({ province: 1, order: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
