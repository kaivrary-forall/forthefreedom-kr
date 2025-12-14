const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  // 직책 이름 (예: "당 대표", "최고위원", "정책위의장")
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // 분류 (독립 직책일 때 탭 구분용)
  category: {
    type: String,
    enum: ['central', 'committee', 'seoul', 'busan', 'daegu', 'incheon', 'gwangju', 'daejeon', 'ulsan', 'sejong', 'gyeonggi', 'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnam', 'gyeongbuk', 'gyeongnam', 'jeju'],
    default: 'central'
  },
  
  // 소속 조직 (null이면 독립 직책)
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  
  // 연결된 회원 (null이면 공석)
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null
  },
  
  // 표시 순서
  order: {
    type: Number,
    default: 0
  },
  
  // 직책 레벨 (스타일링용: 1=대표급, 2=위원급, 3=일반)
  level: {
    type: Number,
    enum: [1, 2, 3],
    default: 2
  },
  
  // 뱃지 색상
  badgeColor: {
    type: String,
    enum: ['red', 'blue', 'green', 'purple', 'orange', 'gray'],
    default: 'red'
  },
  
  // 약력 (모달 팝업에 표시)
  biography: {
    type: String,
    trim: true,
    default: null
  },
  
  // 프로필 이미지 URL (회원 연결 안 됐을 때 사용)
  profileImage: {
    type: String,
    trim: true,
    default: null
  },
  
  // 표시용 이름 (회원 연결 안 됐을 때 사용)
  displayName: {
    type: String,
    trim: true,
    default: null
  },
  
  // 부가 직함 (예: "제44대 국무총리")
  subtitle: {
    type: String,
    trim: true,
    default: null
  },
  
  // 활성화 여부
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 공석 여부 virtual
positionSchema.virtual('isVacant').get(function() {
  return !this.memberId && !this.displayName;
});

// JSON 변환시 virtual 포함
positionSchema.set('toJSON', { virtuals: true });
positionSchema.set('toObject', { virtuals: true });

// 인덱스
positionSchema.index({ organizationId: 1, order: 1 });
positionSchema.index({ memberId: 1 });

module.exports = mongoose.model('Position', positionSchema);
