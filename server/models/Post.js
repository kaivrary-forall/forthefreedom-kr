const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // 게시판 타입 (4개 게시판)
  boardType: {
    type: String,
    enum: ['member', 'party', 'innovation', 'anonymous'],
    default: 'member',
    index: true
  },
  
  // 작성자 (익명 게시판 제외)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: function() {
      return this.boardType !== 'anonymous';
    }
  },
  
  // 익명 게시판용 IP (마스킹 전 원본)
  authorIp: {
    type: String,
    default: null
  },
  
  // 익명 게시판용 마스킹된 IP (표시용)
  maskedIp: {
    type: String,
    default: null
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  content: {
    type: String,
    required: true
  },
  
  // HTML 컨텐츠 (에디터 사용 시)
  contentHtml: {
    type: String,
    default: ''
  },
  
  // 조회수
  views: {
    type: Number,
    default: 0
  },
  
  // 좋아요/싫어요
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  dislikeCount: {
    type: Number,
    default: 0
  },
  
  // 댓글 수
  commentCount: {
    type: Number,
    default: 0
  },
  
  // 첨부파일
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  
  // 이미지 (본문 내 이미지)
  images: [{
    url: String,
    caption: String
  }],
  
  // 공지 여부
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // 삭제 여부 (soft delete)
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: {
    type: Date,
    default: null
  },
  
  // 멘션된 회원들
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 태그
  tags: [{
    type: String,
    trim: true
  }]
  
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 인덱스
postSchema.index({ boardType: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1 });
postSchema.index({ isPinned: -1, createdAt: -1 });

// IP 마스킹 함수
postSchema.statics.maskIp = function(ip) {
  if (!ip) return null;
  
  // IPv4: 123.456.*.* 형식
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
  }
  
  // IPv6 또는 기타: 앞 10자 + ***
  return ip.substring(0, 10) + '***';
};

// 저장 전 마스킹된 IP 설정
postSchema.pre('save', function(next) {
  if (this.boardType === 'anonymous' && this.authorIp && !this.maskedIp) {
    this.maskedIp = this.constructor.maskIp(this.authorIp);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
