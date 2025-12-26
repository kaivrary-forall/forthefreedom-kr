// ===== 게시글 복구 (관리자만) =====
// DELETE 라우터 바로 다음에 추가
router.patch('/:id/restore', authMember, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    if (!post.isDeleted) {
      return res.status(400).json({ success: false, message: '삭제된 게시글이 아닙니다' });
    }
    
    // 관리자만 복구 가능
    if (!req.isAdmin) {
      return res.status(403).json({ success: false, message: '복구 권한이 없습니다' });
    }
    
    // 복구
    post.isDeleted = false;
    post.deletedAt = null;
    post.deletedBy = null;
    post.restoredAt = new Date();
    post.restoredBy = req.memberId;
    await post.save();
    
    console.log('✅ 게시글 복구 (관리자):', post.title);
    
    res.json({
      success: true,
      message: '게시글이 복구되었습니다'
    });
    
  } catch (error) {
    console.error('게시글 복구 오류:', error);
    res.status(500).json({ success: false, message: '게시글 복구에 실패했습니다' });
  }
});

// ===== 댓글 복구 (관리자만) =====
// 댓글 삭제 라우터 바로 다음에 추가
router.patch('/:postId/comments/:commentId/restore', authMember, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다' });
    }
    
    if (!comment.isDeleted) {
      return res.status(400).json({ success: false, message: '삭제된 댓글이 아닙니다' });
    }
    
    // 관리자만 복구 가능
    if (!req.isAdmin) {
      return res.status(403).json({ success: false, message: '복구 권한이 없습니다' });
    }
    
    // 복구
    comment.isDeleted = false;
    comment.deletedAt = null;
    comment.deletedBy = null;
    await comment.save();
    
    // 게시글 댓글 수 업데이트
    const post = await Post.findById(req.params.postId);
    if (post) {
      post.commentCount = await Comment.countDocuments({ post: post._id, isDeleted: false });
      await post.save();
    }
    
    console.log('✅ 댓글 복구 (관리자)');
    
    res.json({
      success: true,
      message: '댓글이 복구되었습니다'
    });
    
  } catch (error) {
    console.error('댓글 복구 오류:', error);
    res.status(500).json({ success: false, message: '댓글 복구에 실패했습니다' });
  }
});
