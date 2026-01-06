// ===== 닉네임으로 회원의 댓글 목록 조회 =====
router.get('/nickname/:nickname/comments', async (req, res) => {
  try {
    const { nickname } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // 닉네임으로 회원 조회
    const member = await Member.findOne({ nickname })
      .select('_id nickname profileImage memberType')
      .lean();
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }
    
    const Comment = require('../models/Comment');
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [comments, total] = await Promise.all([
      Comment.find({ author: member._id, isDeleted: false })
        .populate('post', '_id title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Comment.countDocuments({ author: member._id, isDeleted: false })
    ]);
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          profileImage: member.profileImage,
          memberType: member.memberType
        },
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('회원 댓글 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '댓글 목록을 불러올 수 없습니다'
    });
  }
});

// ===== 닉네임으로 프로필 조회 =====
router.get('/nickname/:nickname', optionalAuth, async (req, res) => {
  try {
    const { nickname } = req.params;
    
    const member = await Member.findOne({ nickname })
      .select('_id nickname userId profileImage memberType bio createdAt followers following')
      .lean();
    
    if (!member) {
      return res.status(404).json({ success: false, message: '회원을 찾을 수 없습니다' });
    }
    
    // 게시글/댓글 수 조회
    const Post = require('../models/Post');
    const Comment = require('../models/Comment');
    
    const [postCount, commentCount] = await Promise.all([
      Post.countDocuments({ author: member._id, isDeleted: false }),
      Comment.countDocuments({ author: member._id, isDeleted: false })
    ]);
    
    // 팔로워/팔로잉 수
    const followerCount = member.followers?.length || 0;
    const followingCount = member.following?.length || 0;
    
    // 내 프로필인지, 팔로우 중인지 확인
    let isMyProfile = false;
    let isFollowing = false;
    
    if (req.memberId) {
      isMyProfile = req.memberId.toString() === member._id.toString();
      if (!isMyProfile) {
        isFollowing = member.followers?.some(f => f.toString() === req.memberId.toString()) || false;
      }
    }
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          userId: member.userId,
          profileImage: member.profileImage,
          memberType: member.memberType,
          bio: member.bio,
          createdAt: member.createdAt
        },
        postCount,
        commentCount,
        followerCount,
        followingCount,
        isMyProfile,
        isFollowing
      }
    });
    
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ success: false, message: '프로필을 불러올 수 없습니다' });
  }
});
