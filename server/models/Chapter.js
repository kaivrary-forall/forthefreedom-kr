const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  // 시/도 (서울특별시, 부산광역시 등)
  province: {
    type: String,
    required: true,
    trim: true,
    default: '서울특별시'
  },
  
  // 지역구 이름 (예: "강남 갑", "종로", "중성동 을")
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // 행정동 (# 구분자로 저장)
  dongsRaw: {
    type: String,
    trim: true,
    default: null
  },
  
  // 카카오톡 팀채팅 링크
  kakaoLink: {
    type: String,
    trim: true,
    default: null
  },
  
  // 참고사항 (예: "성동구", "중구 전 지역 + 성동구 일부")
  note: {
    type: String,
    trim: true,
    default: null
  },
  
  // === 위원장 정보 ===
  chairmanName: {
    type: String,
    trim: true,
    default: null
  },
  
  // 위원장 SNS
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
  
  // 위원장 회원 ID (나중에 회원 프로필 연동용)
  chairmanMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null
  },
  
  // 표시 순서
  order: {
    type: Number,
    default: 0
  },
  
  // 활성화 여부
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual: 행정동 배열
chapterSchema.virtual('dongs').get(function() {
  if (!this.dongsRaw) return [];
  return this.dongsRaw.split('#').filter(d => d.trim());
});

// Virtual: 공석 여부
chapterSchema.virtual('isVacant').get(function() {
  return !this.chairmanName;
});

// JSON 변환시 virtual 포함
chapterSchema.set('toJSON', { virtuals: true });
chapterSchema.set('toObject', { virtuals: true });

// 인덱스
chapterSchema.index({ province: 1, name: 1 });
chapterSchema.index({ province: 1, order: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
