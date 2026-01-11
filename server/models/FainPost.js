const mongoose = require('mongoose')

const fainPostSchema = new mongoose.Schema({
  // 작성자
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  
  // 글 내용 (280자 제한)
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  
  // 이미지 (최대 4장)
  images: [{
    type: String  // Cloudinary URL
  }],
  
  // 답글인 경우 원본 글
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FainPost',
    default: null
  },
  
  // 리포스트인 경우 원본 글
  repostOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FainPost',
    default: null
  },
  
  // 인용 리포스트인 경우 코멘트
  quoteComment: {
    type: String,
    maxlength: 280,
    default: null
  },
  
  // 좋아요 한 사람들
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 리포스트 한 사람들
  reposts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 북마크 한 사람들
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 카운트 (성능용 - 별도 저장)
  likeCount: {
    type: Number,
    default: 0
  },
  repostCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // 해시태그 (자동 추출)
  hashtags: [{
    type: String,
    lowercase: true
  }],
  
  // 멘션된 사용자
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 공개 범위
  visibility: {
    type: String,
    enum: ['public', 'followers', 'mentioned'],
    default: 'public'
  },
  
  // 삭제 여부 (soft delete)
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// 인덱스
fainPostSchema.index({ author: 1, createdAt: -1 })
fainPostSchema.index({ createdAt: -1 })
fainPostSchema.index({ hashtags: 1 })
fainPostSchema.index({ replyTo: 1 })
fainPostSchema.index({ isDeleted: 1 })

// 해시태그 자동 추출
fainPostSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const hashtagRegex = /#[\wㄱ-ㅎㅏ-ㅣ가-힣]+/g
    const matches = this.content.match(hashtagRegex)
    this.hashtags = matches ? matches.map(tag => tag.slice(1).toLowerCase()) : []
    
    // 멘션 추출은 별도 처리 필요 (@닉네임 -> Member 조회)
  }
  next()
})

// 가상 필드: 원본 글 정보 (리포스트/답글용)
fainPostSchema.virtual('originalPost', {
  ref: 'FainPost',
  localField: 'repostOf',
  foreignField: '_id',
  justOne: true
})

fainPostSchema.virtual('parentPost', {
  ref: 'FainPost',
  localField: 'replyTo',
  foreignField: '_id',
  justOne: true
})

// JSON 변환 시 가상 필드 포함
fainPostSchema.set('toJSON', { virtuals: true })
fainPostSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('FainPost', fainPostSchema)
