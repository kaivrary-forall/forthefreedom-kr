const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // 게시글
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  // 작성자
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  
  // 내용
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // 대댓글인 경우 부모 댓글
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  
  // 좋아요 (회원 ID 배열)
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  
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
commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// 가상 필드: 좋아요 수
commentSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// JSON 변환 시 가상 필드 포함
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', commentSchema);
