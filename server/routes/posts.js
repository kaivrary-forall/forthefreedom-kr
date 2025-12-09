const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'forthefreedom-secret-key-2025';

// 관리자 정보
const ADMIN_ID = 'admin_super';

// ===== 인증 미들웨어 =====
const authMember = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.memberId = decoded.id;
    req.isAdmin = decoded.isAdmin || false;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: '인증이 만료되었습니다' });
  }
};

// 선택적 인증 (로그인 안해도 접근 가능, 하지만 로그인 정보는 가져옴)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.memberId = decoded.id;
      req.isAdmin = decoded.isAdmin || false;
    }
  } catch (error) {
    // 토큰 없거나 유효하지 않아도 통과
  }
  next();
};

// ===== 게시글 목록 조회 =====
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      boardType = 'member', 
      page = 1, 
      limit = 20,
      sort = 'latest' // latest, popular, recommended
    } = req.query;
    
    const query = { 
      boardType, 
      isDeleted: false 
    };
    
    // 정렬 옵션
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { viewCount: -1, createdAt: -1 };
    } else if (sort === 'recommended') {
      sortOption = { recommendCount: -1, createdAt: -1 };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'nickname profileImage')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Post.countDocuments(query)
    ]);
    
    // 좋아요/추천 수 추가
    const postsWithCounts = posts.map(post => ({
      ...post,
      likeCount: post.likes ? post.likes.length : 0,
      recommendCount: post.recommends ? post.recommends.length : 0,
      isLiked: req.memberId ? post.likes?.some(id => id.toString() === req.memberId) : false,
      isRecommended: req.memberId ? post.recommends?.some(id => id.toString() === req.memberId) : false
    }));
    
    res.json({
      success: true,
      data: {
        posts: postsWithCounts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '게시글 목록을 불러올 수 없습니다' });
  }
});

// ===== 게시글 상세 조회 =====
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    // 먼저 게시글 조회
    let post = await Post.findOne({ _id: req.params.id, isDeleted: false })
      .populate('author', 'nickname profileImage userId');
    
    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    // 로그인한 사용자이고, 아직 이 글을 본 적 없으면 조회수 증가
    if (req.memberId) {
      const alreadyViewed = post.viewedBy?.some(id => id.toString() === req.memberId);
      if (!alreadyViewed) {
        post.viewCount += 1;
        post.viewedBy.push(req.memberId);
        await post.save();
      }
    }
    
    // 댓글 조회
    const comments = await Comment.find({ post: post._id, isDeleted: false })
      .populate('author', 'nickname profileImage')
      .sort({ createdAt: 1 })
      .lean();
    
    // 댓글에 좋아요 여부 추가
    const commentsWithLikes = comments.map(comment => ({
      ...comment,
      likeCount: comment.likes ? comment.likes.length : 0,
      isLiked: req.memberId ? comment.likes?.some(id => id.toString() === req.memberId) : false
    }));
    
    res.json({
      success: true,
      data: {
        post: {
          ...post.toObject(),
          likeCount: post.likes ? post.likes.length : 0,
          recommendCount: post.recommends ? post.recommends.length : 0,
          isLiked: req.memberId ? post.likes?.some(id => id.toString() === req.memberId) : false,
          isRecommended: req.memberId ? post.recommends?.some(id => id.toString() === req.memberId) : false,
          isAuthor: req.memberId === post.author._id.toString(),
          canEdit: req.isAdmin || req.memberId === post.author._id.toString(),
          canDelete: req.isAdmin || req.memberId === post.author._id.toString()
        },
        comments: commentsWithLikes
      }
    });
    
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '게시글을 불러올 수 없습니다' });
  }
});

// ===== 게시글 작성 =====
router.post('/', authMember, async (req, res) => {
  try {
    const { boardType = 'member', title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: '제목과 내용을 입력해주세요' });
    }
    
    if (title.length > 200) {
      return res.status(400).json({ success: false, message: '제목은 200자 이내로 입력해주세요' });
    }
    
    const post = new Post({
      boardType,
      author: req.memberId,
      title: title.trim(),
      content
    });
    
    await post.save();
    
    // 작성자 정보 포함해서 반환
    await post.populate('author', 'nickname profileImage');
    
    console.log('✅ 게시글 작성:', post.title);
    
    res.status(201).json({
      success: true,
      message: '게시글이 작성되었습니다',
      data: { post }
    });
    
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({ success: false, message: '게시글 작성에 실패했습니다' });
  }
});

// ===== 게시글 수정 (관리자만) =====
router.put('/:id', authMember, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    // 관리자만 수정 가능
    if (!req.isAdmin) {
      return res.status(403).json({ success: false, message: '수정 권한이 없습니다' });
    }
    
    const { title, content } = req.body;
    
    if (title) post.title = title.trim();
    if (content) post.content = content;
    
    await post.save();
    
    console.log('✅ 게시글 수정 (관리자):', post.title);
    
    res.json({
      success: true,
      message: '게시글이 수정되었습니다',
      data: { post }
    });
    
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({ success: false, message: '게시글 수정에 실패했습니다' });
  }
});

// ===== 게시글 삭제 (관리자만) =====
router.delete('/:id', authMember, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    // 관리자만 삭제 가능
    if (!req.isAdmin) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다' });
    }
    
    // Soft delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    post.deletedBy = req.memberId;
    await post.save();
    
    console.log('✅ 게시글 삭제 (관리자):', post.title);
    
    res.json({
      success: true,
      message: '게시글이 삭제되었습니다'
    });
    
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({ success: false, message: '게시글 삭제에 실패했습니다' });
  }
});

// ===== 좋아요 토글 =====
router.post('/:id/like', authMember, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    const memberIdStr = req.memberId.toString();
    const likeIndex = post.likes.findIndex(id => id.toString() === memberIdStr);
    
    if (likeIndex > -1) {
      // 이미 좋아요 → 취소
      post.likes.splice(likeIndex, 1);
    } else {
      // 좋아요 추가
      post.likes.push(req.memberId);
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: {
        isLiked: likeIndex === -1,
        likeCount: post.likes.length
      }
    });
    
  } catch (error) {
    console.error('좋아요 오류:', error);
    res.status(500).json({ success: false, message: '좋아요 처리에 실패했습니다' });
  }
});

// ===== 추천 토글 =====
router.post('/:id/recommend', authMember, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    const memberIdStr = req.memberId.toString();
    const recommendIndex = post.recommends.findIndex(id => id.toString() === memberIdStr);
    
    if (recommendIndex > -1) {
      // 이미 추천 → 취소
      post.recommends.splice(recommendIndex, 1);
    } else {
      // 추천 추가
      post.recommends.push(req.memberId);
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: {
        isRecommended: recommendIndex === -1,
        recommendCount: post.recommends.length
      }
    });
    
  } catch (error) {
    console.error('추천 오류:', error);
    res.status(500).json({ success: false, message: '추천 처리에 실패했습니다' });
  }
});

// ===== 댓글 작성 =====
router.post('/:id/comments', authMember, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다' });
    }
    
    const { content, parentCommentId } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: '댓글 내용을 입력해주세요' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ success: false, message: '댓글은 1000자 이내로 입력해주세요' });
    }
    
    const comment = new Comment({
      post: post._id,
      author: req.memberId,
      content: content.trim(),
      parentComment: parentCommentId || null
    });
    
    await comment.save();
    
    // 게시글 댓글 수 업데이트
    post.commentCount = await Comment.countDocuments({ post: post._id, isDeleted: false });
    await post.save();
    
    // 작성자 정보 포함
    await comment.populate('author', 'nickname profileImage');
    
    console.log('✅ 댓글 작성:', comment.content.substring(0, 30));
    
    res.status(201).json({
      success: true,
      message: '댓글이 작성되었습니다',
      data: { 
        comment: {
          ...comment.toObject(),
          likeCount: 0,
          isLiked: false
        }
      }
    });
    
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    res.status(500).json({ success: false, message: '댓글 작성에 실패했습니다' });
  }
});

// ===== 댓글 삭제 (관리자만) =====
router.delete('/:postId/comments/:commentId', authMember, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다' });
    }
    
    // 관리자만 삭제 가능
    if (!req.isAdmin) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다' });
    }
    
    // Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.deletedBy = req.memberId;
    await comment.save();
    
    // 게시글 댓글 수 업데이트
    const post = await Post.findById(req.params.postId);
    if (post) {
      post.commentCount = await Comment.countDocuments({ post: post._id, isDeleted: false });
      await post.save();
    }
    
    console.log('✅ 댓글 삭제 (관리자)');
    
    res.json({
      success: true,
      message: '댓글이 삭제되었습니다'
    });
    
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ success: false, message: '댓글 삭제에 실패했습니다' });
  }
});

// ===== 댓글 좋아요 토글 =====
router.post('/:postId/comments/:commentId/like', authMember, async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, isDeleted: false });
    
    if (!comment) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다' });
    }
    
    const memberIdStr = req.memberId.toString();
    const likeIndex = comment.likes.findIndex(id => id.toString() === memberIdStr);
    
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.memberId);
    }
    
    await comment.save();
    
    res.json({
      success: true,
      data: {
        isLiked: likeIndex === -1,
        likeCount: comment.likes.length
      }
    });
    
  } catch (error) {
    console.error('댓글 좋아요 오류:', error);
    res.status(500).json({ success: false, message: '좋아요 처리에 실패했습니다' });
  }
});

module.exports = router;
