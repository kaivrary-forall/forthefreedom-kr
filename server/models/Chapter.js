const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  // 시/도 (서울특별시, 부산광역시 등)
  province: {
    type: String,
    required: true,
    trim: true,
    default: '서울특별시'
  },
  
  // === 지역구 이름 (분리 저장) ===
  // 예: "강남" + "갑" = "강남갑"
  districtName: {
    type: String,
    trim: true,
    default: null  // 기존 데이터 호환성
  },
  districtSuffix: {
    type: String,
    trim: true,
    enum: ['갑', '을', '병', '정', '무', null, ''],
    default: null
  },
  
  // 자동 생성되는 전체 이름 (districtName + districtSuffix)
  name: {
    type: String,
    trim: true
  },
  
  // === 위원장 정보 (분리 저장) ===
  // 예: "홍" + "길동" = "홍길동"
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
  
  // 자동 생성되는 전체 이름 (chairmanSurname + chairmanGivenName)
  chairmanName: {
    type: String,
    trim: true,
    default: null
  },
  
  // 위원장 연락처
  chairmanPhone: {
    type: String,
    trim: true,
    default: null
  },
  
  // 위원장 이메일
  chairmanEmail: {
    type: String,
    trim: true,
    default: null
  },
  
  // === 행정동 정보 ===
  // 저장 형식: "역삼동#삼성동#대치동" (# 구분자)
  dongsRaw: {
    type: String,
    trim: true,
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

// Pre-save hook: 자동 필드 생성
chapterSchema.pre('save', function(next) {
  // name 자동 생성
  if (this.districtName) {
    this.name = this.districtName + (this.districtSuffix || '');
  }
  
  // chairmanName 자동 생성
  if (this.chairmanSurname || this.chairmanGivenName) {
    this.chairmanName = (this.chairmanSurname || '') + (this.chairmanGivenName || '');
  } else {
    this.chairmanName = null;
  }
  
  next();
});

// Virtual: 행정동 배열로 변환
chapterSchema.virtual('dongs').get(function() {
  if (!this.dongsRaw) return [];
  return this.dongsRaw.split('#').filter(d => d.trim());
});

// Virtual: 행정동 표시용 문자열
chapterSchema.virtual('dongsDisplay').get(function() {
  if (!this.dongsRaw) return '';
  return this.dongsRaw.split('#').filter(d => d.trim()).join(', ');
});

// Virtual: 공석 여부
chapterSchema.virtual('isVacant').get(function() {
  return !this.chairmanName;
});

// JSON 변환시 virtual 포함
chapterSchema.set('toJSON', { virtuals: true });
chapterSchema.set('toObject', { virtuals: true });

// 인덱스 (unique 제거 - 마이그레이션 호환성)
chapterSchema.index({ province: 1, name: 1 });
chapterSchema.index({ province: 1, order: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
