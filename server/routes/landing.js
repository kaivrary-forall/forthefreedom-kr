const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMember } = require('../middleware/authMember');

// ==========================================
// 관리자 권한 체크 미들웨어
// ==========================================
const checkAdmin = async (req, res, next) => {
  try {
    if (!req.member) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
    }
    
    const isAdmin = 
      req.member.role === 'admin' || 
      req.member.isAdmin === true;
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다'
      });
    }
    
    next();
  } catch (error) {
    console.error('권한 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '권한 확인 중 오류가 발생했습니다'
    });
  }
};

// ==========================================
// 관리자 API
// ==========================================

// 랜딩페이지 목록 조회
router.get('/admin/landing', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const pages = await db.collection('landingpages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, pages });
  } catch (error) {
    console.error('Landing list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 랜딩페이지 생성
router.post('/admin/landing', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { title, slug, blocks, settings, isActive } = req.body;

    // 슬러그 중복 체크
    const existing = await db.collection('landingpages').findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: '이미 사용 중인 슬러그입니다.' });
    }

    const page = {
      title,
      slug,
      blocks: blocks || [],
      settings: settings || { backgroundColor: '#ffffff' },
      isActive: isActive || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('landingpages').insertOne(page);
    page._id = result.insertedId;

    res.status(201).json({ success: true, page });
  } catch (error) {
    console.error('Landing create error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 랜딩페이지 상세 조회 (관리자)
router.get('/admin/landing/:id', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const page = await db.collection('landingpages').findOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, page });
  } catch (error) {
    console.error('Landing detail error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 랜딩페이지 수정
router.put('/admin/landing/:id', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { title, slug, blocks, settings, isActive } = req.body;

    // 슬러그 중복 체크 (자기 자신 제외)
    if (slug) {
      const existing = await db.collection('landingpages').findOne({ 
        slug, 
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: '이미 사용 중인 슬러그입니다.' });
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(blocks !== undefined && { blocks }),
      ...(settings && { settings }),
      ...(typeof isActive === 'boolean' && { isActive }),
      updatedAt: new Date()
    };

    await db.collection('landingpages').updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: updateData }
    );

    const page = await db.collection('landingpages').findOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });

    res.json({ success: true, page });
  } catch (error) {
    console.error('Landing update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 랜딩페이지 삭제
router.delete('/admin/landing/:id', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    await db.collection('landingpages').deleteOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Landing delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// 공개 API - 랜딩페이지 조회
// ==========================================
router.get('/landing/:slug', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const page = await db.collection('landingpages').findOne({ 
      slug: req.params.slug,
      isActive: true
    });

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Landing public error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
