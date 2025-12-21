const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // 게시판 종류
  boardType: {
    type: String,
    enum: ['member', 'party_public', 'party_anonymous'],
    required: true,
    default: 'member'
  },
  
  // 작성자
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  
  // 제목
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // 내용
  content: {
    type: String,
    required: true
  },
  
  // 조회수
  viewCount: {
    type: Number,
    default: 0
  },
  
  // 조회한 회원 목록 (중복 카운트 방지)
  viewedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 좋아요 (회원 ID 배열)
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 싫어요 (회원 ID 배열)
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
  // 댓글 수 (캐시)
  commentCount: {
    type: Number,
    default: 0
  },
  
  // 삭제 여부 (soft delete)
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // 삭제 정보
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }
  
}, {
  timestamps: true
});

// 인덱스
postSchema.index({ boardType: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ isDeleted: 1 });

// 가상 필드: 좋아요 수
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// 가상 필드: 싫어요 수
postSchema.virtual('dislikeCount').get(function() {
  return this.dislikes ? this.dislikes.length : 0;
});

// JSON 변환 시 가상 필드 포함
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
