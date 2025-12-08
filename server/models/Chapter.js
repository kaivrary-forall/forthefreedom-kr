const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true,
    default: 'seoul',
    index: true
  },
  // 지역구 이름 (분리)
  districtName: {
    type: String,
    trim: true,
    default: null
  },
  districtSuffix: {
    type: String,
    trim: true,
    default: null  // 갑, 을, 병 또는 null (단일 지역구)
  },
  // 기존 name 필드는 districtName + districtSuffix 조합으로 자동 생성
  name: {
    type: String,
    trim: true
  },
  // 행정동 (#으로 구분된 문자열로 저장)
  dongsRaw: {
    type: String,
    trim: true,
    default: ''
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
  // 당협위원장 정보 (성/이름 분리)
  chairmanSurname: {
    type: String,
    trim: true,
    default: null
  },
  chairmanGivenName: {
    type: String,
    trim: true,
    default: null
  },
  // 기존 chairmanName은 성+이름 조합으로 자동 생성
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

// 저장 전 name과 chairmanName 자동 생성
chapterSchema.pre('save', function(next) {
  // 지역구 이름 조합
  if (this.districtName) {
    this.name = this.districtSuffix 
      ? `${this.districtName} ${this.districtSuffix}` 
      : this.districtName;
  }
  
  // 위원장 이름 조합
  if (this.chairmanSurname || this.chairmanGivenName) {
    this.chairmanName = `${this.chairmanSurname || ''}${this.chairmanGivenName || ''}`.trim() || null;
  }
  
  // dongsRaw에서 dongs 배열 생성
  if (this.dongsRaw) {
    this.dongs = this.dongsRaw.split('#').filter(d => d.trim()).map(d => d.trim());
  }
  
  next();
});

// 복합 인덱스 설정 (unique 제거 - 마이그레이션 호환성)
chapterSchema.index({ province: 1, name: 1 });
chapterSchema.index({ province: 1, order: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
