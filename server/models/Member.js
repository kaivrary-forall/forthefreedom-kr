const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  // === 로그인 정보 ===
  userId: {
    type: String,
    required: [true, '아이디는 필수입니다'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [4, '아이디는 최소 4자 이상이어야 합니다'],
    maxlength: [20, '아이디는 최대 20자까지 가능합니다'],
    match: [/^[a-z0-9_]+$/, '아이디는 영문 소문자, 숫자, 밑줄(_)만 사용 가능합니다']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다']
  },

  // === 표시 정보 ===
  nickname: {
    type: String,
    required: [true, '닉네임은 필수입니다'],
    unique: true,
    trim: true,
    minlength: [2, '닉네임은 최소 2자 이상이어야 합니다'],
    maxlength: [20, '닉네임은 최대 20자까지 가능합니다']
  },
  profileImage: {
    type: String,
    default: ''  // Cloudinary URL
  },
  nicknameChangeCount: {
    type: Number,
    default: 0  // 0이면 무료 변경 가능, 1 이상이면 유료
  },
  nicknameChangedAt: {
    type: Date
  },

  // === 기본 정보 ===
  name: {
    type: String,
    required: [true, '이름은 필수입니다'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, '연락처는 필수입니다'],
    trim: true
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  addressDong: {
    type: String,
    trim: true,
    default: ''  // 행정동 (예: 역삼1동)
  },
  addressDetail: {
    type: String,
    trim: true,
    default: ''
  },
  zipCode: {
    type: String,
    trim: true,
    default: ''
  },
  birthDate: {
    type: Date
  },

  // === 계정 상태 ===
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'withdrawn'],
    default: 'pending'
    // pending: 승인대기, active: 정상, suspended: 정지, withdrawn: 탈퇴
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: String  // 관리자 ID (문자열)
  },
  rejectedAt: {
    type: Date
  },
  rejectedBy: {
    type: String  // 관리자 ID (문자열)
  },
  rejectReason: {
    type: String
  },

  // === 회원 유형 ===
  memberType: {
    type: String,
    enum: ['general', 'party_member', 'innovation_member'],
    default: 'general'
    // general: 일반회원, party_member: 당원, innovation_member: 혁신당원
  },
  
  // === 탈퇴 유형 ===
  withdrawalType: {
    type: String,
    enum: ['self', 'forced'],
    default: null
    // self: 자진탈퇴, forced: 강제탈퇴
  },
  withdrawnAt: {
    type: Date
  },
  withdrawnBy: {
    type: String  // 강제탈퇴 시 관리자 ID
  },
  withdrawalReason: {
    type: String
  },

  // === 해피나눔 연동 (혁신 당원용) ===
  happyNanum: {
    memberId: { type: String, default: '' },
    isLinked: { type: Boolean, default: false },
    linkedAt: { type: Date },
    
    // 당비 정보 (해피나눔에서 동기화)
    partyFee: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      monthlyAmount: { type: Number, default: 0 },
      totalPaid: { type: Number, default: 0 },
      lastPaymentDate: { type: Date },
      paymentMethod: { type: String, default: '' }
    },
    
    lastSyncAt: { type: Date }
  },

  // === 후원 내역 (확장용) ===
  donation: {
    totalAmount: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  // === 구매 내역 (확장용) ===
  purchase: {
    totalAmount: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  // === 탈퇴 관련 ===
  withdrawal: {
    requestedAt: { type: Date },
    reason: { type: String },
    processedAt: { type: Date },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },

  // === 동의 항목 ===
  agreements: {
    terms: { type: Boolean, required: true },       // 이용약관 (필수)
    privacy: { type: Boolean, required: true },     // 개인정보 (필수)
    marketing: { type: Boolean, default: false }    // 마케팅 (선택)
  },

  // === 로그인 관련 ===
  lastLoginAt: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },

  // === 비밀번호 재설정 ===
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }

}, {
  timestamps: true
});

// 인덱스 설정
memberSchema.index({ userId: 1 });
memberSchema.index({ nickname: 1 });
memberSchema.index({ email: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ memberType: 1 });
memberSchema.index({ 'happyNanum.isLinked': 1 });
memberSchema.index({ appliedAt: -1 });

// 비밀번호 해싱 (저장 전)
memberSchema.pre('save', async function(next) {
  // 비밀번호가 수정된 경우에만 해싱
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 검증 메서드
memberSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// JSON 변환 시 비밀번호 제외
memberSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

// 가상 필드: 전체 주소
memberSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  return this.addressDetail 
    ? `${this.address} ${this.addressDetail}`
    : this.address;
});

// 가상 필드: 혁신당원 여부
memberSchema.virtual('isPartyMember').get(function() {
  return this.memberType === 'party_member' && 
         this.happyNanum?.partyFee?.isActive === true;
});

module.exports = mongoose.model('Member', memberSchema);
