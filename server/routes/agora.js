const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Member = require('../models/Member');
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
      
      // 회원 정보 조회
      const member = await Member.findById(req.memberId).select('memberType');
      req.memberType = member?.memberType || 'member';
    }
  } catch (error) {
    // 토큰 에러 무시
  }
  next();
};

// 권한 체크 함수
function canWriteToBoard(memberType, boardType) {
  switch (boardType) {
    case 'member':
      // 모든 회원 가능
      return true;
    case 'party':
    case 'anonymous':
      // 당원, 혁신당원, 관리자만 (익명도 당원 이상)
      return ['party_member', 'innovation_member', 'admin'].includes(memberType);
    case 'innovation':
      // 혁신당원, 관리자만
      return ['innovation_member', 'admin'].includes(memberType);
    default:
      return false;
  }
}

// 클라이언트 IP 가져오기
function getClientIp(req) {
  // Cloudflare, nginx 등 프록시 뒤에 있을 경우
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Cloudflare 헤더
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  }
  
  // 직접 연결
  return req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.ip || 
         'unknown';
}

// IP 마스킹 함수
function maskIp(ip) {
  if (!ip || ip === 'unknown') return '알 수 없음';
  
  // IPv4: 123.456.*.* 형식
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
  }
  
  // IPv6 또는 기타: 앞 10자 + ***
  return ip.substring(0, Math.min(10, ip.length)) + '***';
}

// ===== 게시글 목록 조회 =====
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      boardType = 'member',
      page = 1, 
      limit = 20,
      search = '',
      sort = 'latest'
    } = req.query;
    
    // 유효한 boardType 체크
    const validBoardTypes = ['member', 'party', 'innovation', 'anonymous'];
    if (!validBoardTypes.includes(boardType)) {
      return res.status(400).json({
        success: false,
        message: '잘못된 게시판 타입입니다.'
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // 쿼리 조건
    const query = {
      boardType,
      isDeleted: false
    };
    
    // 검색어가 있으면 제목/내용 검색
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 정렬 옵션
    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sort === 'views') {
      sortOption = { isPinned: -1, views: -1, createdAt: -1 };
    } else if (sort === 'likes') {
      sortOption = { isPinned: -1, likeCount: -1, createdAt: -1 };
    } else if (sort === 'comments') {
      sortOption = { isPinned: -1, commentCount: -1, createdAt: -1 };
    }
    
    // 게시글 조회
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'nickname profileImage memberType')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Post.countDocuments(query)
    ]);
    
    // 익명 게시판이면 작성자 정보 제거, IP만 표시
    const processedPosts = posts.map(post => {
      if (boardType === 'anonymous') {
        return {
          ...post,
          author: null,
          authorIp: null, // 원본 IP는 숨김
          displayIp: post.maskedIp || maskIp(post.authorIp) // 마스킹된 IP만 표시
        };
      }
      return post;
    });
    
    res.json({
      success: true,
      data: {
        posts: processedPosts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        },
        boardType
      }
    });
    
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 목록을 불러올 수 없습니다.'
    });
  }
});

// ===== 게시글 상세 조회 =====
router.get('/:postId', optionalAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId)
      .populate('author', 'nickname profileImage memberType bio')
      .populate('mentions', 'nickname profileImage')
      .lean();
    
    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
    
    // 조회수 증가
    await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
    
    // 좋아요/싫어요 여부 체크
    let isLiked = false;
    let isDisliked = false;
    
    if (req.memberId) {
      isLiked = post.likes?.some(id => id.toString() === req.memberId.toString()) || false;
      isDisliked = post.dislikes?.some(id => id.toString() === req.memberId.toString()) || false;
    }
    
    // 익명 게시판이면 작성자 정보 제거
    let responsePost = { ...post, views: post.views + 1 };
    
    if (post.boardType === 'anonymous') {
      responsePost.author = null;
      responsePost.authorIp = null;
      responsePost.displayIp = post.maskedIp || maskIp(post.authorIp);
    }
    
    res.json({
      success: true,
      data: {
        post: responsePost,
        isLiked,
        isDisliked
      }
    });
    
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글을 불러올 수 없습니다.'
    });
  }
});

// ===== 게시글 작성 =====
router.post('/write', authMember, async (req, res) => {
  try {
    const { 
      boardType = 'member',
      title, 
      content,
      contentHtml,
      mentions = [],
      tags = []
    } = req.body;
    
    const memberId = req.member._id || req.memberId;
    const memberType = req.member.memberType || 'member';
    
    // 필수 필드 검증
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '제목과 내용을 입력해주세요.'
      });
    }
    
    // 유효한 boardType 체크
    const validBoardTypes = ['member', 'party', 'innovation', 'anonymous'];
    if (!validBoardTypes.includes(boardType)) {
      return res.status(400).json({
        success: false,
        message: '잘못된 게시판 타입입니다.'
      });
    }
    
    // 권한 체크
    if (!canWriteToBoard(memberType, boardType)) {
      const boardNames = {
        party: '당원 게시판',
        innovation: '혁신당원 게시판'
      };
      return res.status(403).json({
        success: false,
        message: `${boardNames[boardType] || '이 게시판'}에 글을 작성할 권한이 없습니다.`
      });
    }
    
    // 게시글 데이터 준비
    const postData = {
      boardType,
      title: title.trim(),
      content,
      contentHtml: contentHtml || content,
      mentions,
      tags
    };
    
    // 익명 게시판이면 IP 저장, author는 null
    if (boardType === 'anonymous') {
      const clientIp = getClientIp(req);
      postData.authorIp = clientIp;
      postData.maskedIp = maskIp(clientIp);
      // author는 설정하지 않음 (익명)
    } else {
      // 일반 게시판이면 author 설정
      postData.author = memberId;
    }
    
    const post = new Post(postData);
    await post.save();
    
    console.log(`✅ 게시글 작성: ${boardType} - ${title.substring(0, 20)}...`);
    
    // 응답 데이터 준비
    let responsePost = post.toObject();
    if (boardType === 'anonymous') {
      responsePost.authorIp = null; // 원본 IP는 숨김
      responsePost.displayIp = responsePost.maskedIp;
    }
    
    res.status(201).json({
      success: true,
      message: '게시글이 작성되었습니다.',
      data: {
        post: responsePost
      }
    });
    
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 작성 중 오류가 발생했습니다.'
    });
  }
});

// ===== 게시글 수정 =====
router.put('/:postId', authMember, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, contentHtml, tags } = req.body;
    const memberId = req.member._id || req.memberId;
    
    const post = await Post.findById(postId);
    
    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
    
    // 익명 게시판은 수정 불가
    if (post.boardType === 'anonymous') {
      return res.status(403).json({
        success: false,
        message: '익명 게시글은 수정할 수 없습니다.'
      });
    }
    
    // 작성자 본인 또는 관리자만 수정 가능
    const isAdmin = req.member.isAdmin || req.member.memberType === 'admin';
    if (post.author.toString() !== memberId.toString() && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '게시글을 수정할 권한이 없습니다.'
      });
    }
    
    // 업데이트
    post.title = title || post.title;
    post.content = content || post.content;
    post.contentHtml = contentHtml || post.contentHtml;
    if (tags) post.tags = tags;
    
    await post.save();
    
    res.json({
      success: true,
      message: '게시글이 수정되었습니다.',
      data: { post }
    });
    
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 수정 중 오류가 발생했습니다.'
    });
  }
});

// ===== 게시글 삭제 =====
router.delete('/:postId', authMember, async (req, res) => {
  try {
    const { postId } = req.params;
    const memberId = req.member._id || req.memberId;
    
    const post = await Post.findById(postId);
    
    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
    
    // 익명 게시판은 삭제 불가 (관리자만 가능)
    const isAdmin = req.member.isAdmin || req.member.memberType === 'admin';
    
    if (post.boardType === 'anonymous' && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '익명 게시글은 삭제할 수 없습니다.'
      });
    }
    
    // 작성자 본인 또는 관리자만 삭제 가능
    if (post.author && post.author.toString() !== memberId.toString() && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '게시글을 삭제할 권한이 없습니다.'
      });
    }
    
    // Soft delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();
    
    res.json({
      success: true,
      message: '게시글이 삭제되었습니다.'
    });
    
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 삭제 중 오류가 발생했습니다.'
    });
  }
});

// ===== 좋아요 =====
router.post('/:postId/like', authMember, async (req, res) => {
  try {
    const { postId } = req.params;
    const memberId = req.member._id || req.memberId;
    
    const post = await Post.findById(postId);
    
    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
    
    const alreadyLiked = post.likes.some(id => id.toString() === memberId.toString());
    const alreadyDisliked = post.dislikes.some(id => id.toString() === memberId.toString());
    
    if (alreadyLiked) {
      // 좋아요 취소
      post.likes = post.likes.filter(id => id.toString() !== memberId.toString());
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // 좋아요 추가
      post.likes.push(memberId);
      post.likeCount += 1;
      
      // 싫어요가 있었으면 제거
      if (alreadyDisliked) {
        post.dislikes = post.dislikes.filter(id => id.toString() !== memberId.toString());
        post.dislikeCount = Math.max(0, post.dislikeCount - 1);
      }
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: {
        isLiked: !alreadyLiked,
        isDisliked: false,
        likeCount: post.likeCount,
        dislikeCount: post.dislikeCount
      }
    });
    
  } catch (error) {
    console.error('좋아요 오류:', error);
    res.status(500).json({
      success: false,
      message: '좋아요 처리 중 오류가 발생했습니다.'
    });
  }
});

// ===== 싫어요 =====
router.post('/:postId/dislike', authMember, async (req, res) => {
  try {
    const { postId } = req.params;
    const memberId = req.member._id || req.memberId;
    
    const post = await Post.findById(postId);
    
    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
    
    const alreadyLiked = post.likes.some(id => id.toString() === memberId.toString());
    const alreadyDisliked = post.dislikes.some(id => id.toString() === memberId.toString());
    
    if (alreadyDisliked) {
      // 싫어요 취소
      post.dislikes = post.dislikes.filter(id => id.toString() !== memberId.toString());
      post.dislikeCount = Math.max(0, post.dislikeCount - 1);
    } else {
      // 싫어요 추가
      post.dislikes.push(memberId);
      post.dislikeCount += 1;
      
      // 좋아요가 있었으면 제거
      if (alreadyLiked) {
        post.likes = post.likes.filter(id => id.toString() !== memberId.toString());
        post.likeCount = Math.max(0, post.likeCount - 1);
      }
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: {
        isLiked: false,
        isDisliked: !alreadyDisliked,
        likeCount: post.likeCount,
        dislikeCount: post.dislikeCount
      }
    });
    
  } catch (error) {
    console.error('싫어요 오류:', error);
    res.status(500).json({
      success: false,
      message: '싫어요 처리 중 오류가 발생했습니다.'
    });
  }
});

// ===== 게시판별 통계 =====
router.get('/stats/boards', async (req, res) => {
  try {
    const stats = await Post.aggregate([
      { $match: { isDeleted: false } },
      { 
        $group: {
          _id: '$boardType',
          count: { $sum: 1 },
          todayCount: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    // 결과를 객체로 변환
    const result = {
      member: { count: 0, todayCount: 0 },
      party: { count: 0, todayCount: 0 },
      innovation: { count: 0, todayCount: 0 },
      anonymous: { count: 0, todayCount: 0 }
    };
    
    stats.forEach(stat => {
      if (result[stat._id]) {
        result[stat._id] = {
          count: stat.count,
          todayCount: stat.todayCount
        };
      }
    });
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '통계를 불러올 수 없습니다.'
    });
  }
});

module.exports = router;
