const express = require('express');
const router = express.Router();
const Feed = require('../models/Feed');
const Member = require('../models/Member');

// 인증 미들웨어
const { authMember } = require('../middleware/authMember');

// 선택적 인증 미들웨어
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.memberId = decoded.memberId || decoded.id;
    }
  } catch (error) {
    // 토큰 에러 무시
  }
  next();
};

// ===== 특정 유저 피드 목록 =====
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [feeds, total] = await Promise.all([
      Feed.find({ author: userId, isDeleted: false })
        .populate('author', 'nickname profileImage memberType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Feed.countDocuments({ author: userId, isDeleted: false })
    ]);
    
    // 좋아요 상태 추가
    const feedsWithLikeStatus = feeds.map(feed => ({
      ...feed,
      likeCount: feed.likes?.length || 0,
      isLiked: req.memberId ? feed.likes?.some(l => l.toString() === req.memberId.toString()) : false
    }));
    
    res.json({
      success: true,
      data: {
        feeds: feedsWithLikeStatus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('피드 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '피드를 불러올 수 없습니다' });
  }
});

// ===== 타임라인 (팔로잉 피드) =====
router.get('/timeline', authMember, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // 내가 팔로우하는 사람들 + 나
    const me = await Member.findById(req.member._id).select('following');
    const userIds = [...(me.following || []), req.member._id];
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [feeds, total] = await Promise.all([
      Feed.find({ author: { $in: userIds }, isDeleted: false })
        .populate('author', 'nickname profileImage memberType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Feed.countDocuments({ author: { $in: userIds }, isDeleted: false })
    ]);
    
    // 좋아요 상태 추가
    const feedsWithLikeStatus = feeds.map(feed => ({
      ...feed,
      likeCount: feed.likes?.length || 0,
      isLiked: feed.likes?.some(l => l.toString() === req.member._id.toString())
    }));
    
    res.json({
      success: true,
      data: {
        feeds: feedsWithLikeStatus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('타임라인 조회 오류:', error);
    res.status(500).json({ success: false, message: '타임라인을 불러올 수 없습니다' });
  }
});

// ===== 피드 작성 =====
router.post('/', authMember, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: '내용을 입력해주세요' });
    }
    
    if (content.length > 500) {
      return res.status(400).json({ success: false, message: '500자 이내로 작성해주세요' });
    }
    
    const feed = new Feed({
      author: req.member._id,
      content: content.trim()
    });
    
    await feed.save();
    await feed.populate('author', 'nickname profileImage memberType');
    
    res.status(201).json({
      success: true,
      data: {
        feed: {
          ...feed.toObject(),
          likeCount: 0,
          isLiked: false
        }
      }
    });
    
  } catch (error) {
    console.error('피드 작성 오류:', error);
    res.status(500).json({ success: false, message: '피드 작성에 실패했습니다' });
  }
});

// ===== 피드 삭제 =====
router.delete('/:id', authMember, async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    
    if (!feed) {
      return res.status(404).json({ success: false, message: '피드를 찾을 수 없습니다' });
    }
    
    if (feed.author.toString() !== req.member._id.toString()) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다' });
    }
    
    feed.isDeleted = true;
    await feed.save();
    
    res.json({ success: true, message: '피드가 삭제되었습니다' });
    
  } catch (error) {
    console.error('피드 삭제 오류:', error);
    res.status(500).json({ success: false, message: '피드 삭제에 실패했습니다' });
  }
});

// ===== 피드 좋아요 =====
router.post('/:id/like', authMember, async (req, res) => {
  try {
    const feed = await Feed.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!feed) {
      return res.status(404).json({ success: false, message: '피드를 찾을 수 없습니다' });
    }
    
    const memberIdStr = req.member._id.toString();
    const likeIndex = feed.likes.findIndex(id => id.toString() === memberIdStr);
    
    if (likeIndex > -1) {
      feed.likes.splice(likeIndex, 1);
    } else {
      feed.likes.push(req.member._id);
    }
    
    await feed.save();
    
    res.json({
      success: true,
      data: {
        isLiked: likeIndex === -1,
        likeCount: feed.likes.length
      }
    });
    
  } catch (error) {
    console.error('좋아요 오류:', error);
    res.status(500).json({ success: false, message: '좋아요 처리에 실패했습니다' });
  }
});

module.exports = router;
