const express = require('express')
const router = express.Router()
const FainPost = require('../models/FainPost')
const Member = require('../models/Member')
const { auth, optionalAuth } = require('../middleware/auth')

// ========================================
// 피드 조회
// ========================================

// GET /api/fain - 메인 피드 (최신순)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'latest' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    let query = { isDeleted: false, replyTo: null }
    
    // 팔로잉 피드
    if (type === 'following' && req.member) {
      const currentMember = await Member.findById(req.member.id)
      const followingIds = currentMember?.following || []
      query.author = { $in: [...followingIds, req.member.id] }
    }
    
    const posts = await FainPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'nickname profileImage memberType')
      .populate({
        path: 'repostOf',
        populate: { path: 'author', select: 'nickname profileImage memberType' }
      })
      .lean()
    
    // 현재 사용자의 좋아요/리포스트 여부 추가
    const postsWithStatus = posts.map(post => ({
      ...post,
      isLiked: req.member ? post.likes?.some(id => id.toString() === req.member.id) : false,
      isReposted: req.member ? post.reposts?.some(id => id.toString() === req.member.id) : false,
      isBookmarked: req.member ? post.bookmarks?.some(id => id.toString() === req.member.id) : false,
      isOwner: req.member ? post.author?._id?.toString() === req.member.id : false
    }))
    
    const total = await FainPost.countDocuments(query)
    
    res.json({
      success: true,
      posts: postsWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('피드 조회 실패:', error)
    res.status(500).json({ success: false, message: '피드를 불러오는데 실패했습니다.' })
  }
})

// GET /api/fain/:id - 단일 포스트 조회
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await FainPost.findById(req.params.id)
      .populate('author', 'nickname profileImage memberType')
      .populate({
        path: 'repostOf',
        populate: { path: 'author', select: 'nickname profileImage memberType' }
      })
      .populate({
        path: 'replyTo',
        populate: { path: 'author', select: 'nickname profileImage memberType' }
      })
    
    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' })
    }
    
    // 조회수 증가
    post.viewCount += 1
    await post.save()
    
    // 답글들 조회
    const replies = await FainPost.find({ replyTo: post._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('author', 'nickname profileImage memberType')
      .lean()
    
    const repliesWithStatus = replies.map(reply => ({
      ...reply,
      isLiked: req.member ? reply.likes?.some(id => id.toString() === req.member.id) : false,
      isReposted: req.member ? reply.reposts?.some(id => id.toString() === req.member.id) : false,
      isOwner: req.member ? reply.author?._id?.toString() === req.member.id : false
    }))
    
    res.json({
      success: true,
      post: {
        ...post.toObject(),
        isLiked: req.member ? post.likes?.some(id => id.toString() === req.member.id) : false,
        isReposted: req.member ? post.reposts?.some(id => id.toString() === req.member.id) : false,
        isBookmarked: req.member ? post.bookmarks?.some(id => id.toString() === req.member.id) : false,
        isOwner: req.member ? post.author?._id?.toString() === req.member.id : false
      },
      replies: repliesWithStatus
    })
  } catch (error) {
    console.error('포스트 조회 실패:', error)
    res.status(500).json({ success: false, message: '포스트를 불러오는데 실패했습니다.' })
  }
})

// GET /api/fain/user/:nickname - 특정 사용자 포스트
router.get('/user/:nickname', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'posts' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const member = await Member.findOne({ nickname: req.params.nickname })
    if (!member) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' })
    }
    
    let query = { author: member._id, isDeleted: false }
    
    // 타입별 필터
    if (type === 'posts') {
      query.replyTo = null
      query.repostOf = null
    } else if (type === 'replies') {
      query.replyTo = { $ne: null }
    } else if (type === 'media') {
      query['images.0'] = { $exists: true }
    } else if (type === 'likes') {
      // 좋아요한 글 - 별도 쿼리
      const likedPosts = await FainPost.find({ likes: member._id, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'nickname profileImage memberType')
        .lean()
      
      const total = await FainPost.countDocuments({ likes: member._id, isDeleted: false })
      
      return res.json({
        success: true,
        posts: likedPosts,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) }
      })
    }
    
    const posts = await FainPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'nickname profileImage memberType')
      .populate({
        path: 'repostOf',
        populate: { path: 'author', select: 'nickname profileImage memberType' }
      })
      .lean()
    
    const total = await FainPost.countDocuments(query)
    
    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('사용자 포스트 조회 실패:', error)
    res.status(500).json({ success: false, message: '포스트를 불러오는데 실패했습니다.' })
  }
})

// ========================================
// 포스트 작성/수정/삭제
// ========================================

// POST /api/fain - 새 포스트 작성
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, images, replyTo, visibility } = req.body
    
    // 내용 검증
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: '내용을 입력해주세요.' })
    }
    
    if (content.length > 280) {
      return res.status(400).json({ success: false, message: '280자를 초과할 수 없습니다.' })
    }
    
    // 이미지 검증 (최대 4장)
    if (images && images.length > 4) {
      return res.status(400).json({ success: false, message: '이미지는 최대 4장까지 첨부할 수 있습니다.' })
    }
    
    const post = new FainPost({
      author: req.member.id,
      content: content.trim(),
      images: images || [],
      replyTo: replyTo || null,
      visibility: visibility || 'public'
    })
    
    await post.save()
    
    // 답글인 경우 원본 글의 replyCount 증가
    if (replyTo) {
      await FainPost.findByIdAndUpdate(replyTo, { $inc: { replyCount: 1 } })
    }
    
    // 작성자 정보 포함해서 반환
    await post.populate('author', 'nickname profileImage memberType')
    
    res.status(201).json({
      success: true,
      message: '포스트가 작성되었습니다.',
      post
    })
  } catch (error) {
    console.error('포스트 작성 실패:', error)
    res.status(500).json({ success: false, message: '포스트 작성에 실패했습니다.' })
  }
})

// DELETE /api/fain/:id - 포스트 삭제
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await FainPost.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' })
    }
    
    // 작성자 본인 또는 관리자만 삭제 가능
    if (post.author.toString() !== req.member.id && !req.member.isAdmin) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' })
    }
    
    // Soft delete
    post.isDeleted = true
    post.deletedAt = new Date()
    await post.save()
    
    // 답글이었다면 원본 글의 replyCount 감소
    if (post.replyTo) {
      await FainPost.findByIdAndUpdate(post.replyTo, { $inc: { replyCount: -1 } })
    }
    
    res.json({ success: true, message: '포스트가 삭제되었습니다.' })
  } catch (error) {
    console.error('포스트 삭제 실패:', error)
    res.status(500).json({ success: false, message: '포스트 삭제에 실패했습니다.' })
  }
})

// ========================================
// 좋아요/리포스트/북마크
// ========================================

// POST /api/fain/:id/like - 좋아요 토글
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await FainPost.findById(req.params.id)
    
    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' })
    }
    
    const memberId = req.member.id
    const isLiked = post.likes.some(id => id.toString() === memberId)
    
    if (isLiked) {
      // 좋아요 취소
      post.likes = post.likes.filter(id => id.toString() !== memberId)
      post.likeCount = Math.max(0, post.likeCount - 1)
    } else {
      // 좋아요
      post.likes.push(memberId)
      post.likeCount += 1
    }
    
    await post.save()
    
    res.json({
      success: true,
      isLiked: !isLiked,
      likeCount: post.likeCount
    })
  } catch (error) {
    console.error('좋아요 실패:', error)
    res.status(500).json({ success: false, message: '좋아요에 실패했습니다.' })
  }
})

// POST /api/fain/:id/repost - 리포스트
router.post('/:id/repost', authenticateToken, async (req, res) => {
  try {
    const originalPost = await FainPost.findById(req.params.id)
    
    if (!originalPost || originalPost.isDeleted) {
      return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' })
    }
    
    const memberId = req.member.id
    const isReposted = originalPost.reposts.some(id => id.toString() === memberId)
    
    if (isReposted) {
      // 리포스트 취소 - 리포스트 포스트 삭제
      await FainPost.deleteOne({ repostOf: originalPost._id, author: memberId })
      originalPost.reposts = originalPost.reposts.filter(id => id.toString() !== memberId)
      originalPost.repostCount = Math.max(0, originalPost.repostCount - 1)
    } else {
      // 리포스트 생성
      const repost = new FainPost({
        author: memberId,
        content: '',
        repostOf: originalPost._id
      })
      await repost.save()
      
      originalPost.reposts.push(memberId)
      originalPost.repostCount += 1
    }
    
    await originalPost.save()
    
    res.json({
      success: true,
      isReposted: !isReposted,
      repostCount: originalPost.repostCount
    })
  } catch (error) {
    console.error('리포스트 실패:', error)
    res.status(500).json({ success: false, message: '리포스트에 실패했습니다.' })
  }
})

// POST /api/fain/:id/bookmark - 북마크 토글
router.post('/:id/bookmark', authenticateToken, async (req, res) => {
  try {
    const post = await FainPost.findById(req.params.id)
    
    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' })
    }
    
    const memberId = req.member.id
    const isBookmarked = post.bookmarks.some(id => id.toString() === memberId)
    
    if (isBookmarked) {
      post.bookmarks = post.bookmarks.filter(id => id.toString() !== memberId)
    } else {
      post.bookmarks.push(memberId)
    }
    
    await post.save()
    
    res.json({
      success: true,
      isBookmarked: !isBookmarked
    })
  } catch (error) {
    console.error('북마크 실패:', error)
    res.status(500).json({ success: false, message: '북마크에 실패했습니다.' })
  }
})

// ========================================
// 검색
// ========================================

// GET /api/fain/search - 검색
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ success: false, message: '검색어를 입력해주세요.' })
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const searchRegex = new RegExp(q.trim(), 'i')
    
    const query = {
      isDeleted: false,
      $or: [
        { content: searchRegex },
        { hashtags: q.trim().toLowerCase().replace('#', '') }
      ]
    }
    
    const posts = await FainPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'nickname profileImage memberType')
      .lean()
    
    const total = await FainPost.countDocuments(query)
    
    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('검색 실패:', error)
    res.status(500).json({ success: false, message: '검색에 실패했습니다.' })
  }
})

module.exports = router
