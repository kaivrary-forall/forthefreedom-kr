const express = require('express');
const router = express.Router();
const Congratulation = require('../models/Congratulation');
const { authMember, requirePermission } = require('../middleware/authMember');

// 경조사 목록 조회 (공개)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (type) query.type = type;

    const [items, total] = await Promise.all([
      Congratulation.find(query)
        .sort({ eventDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'nickname'),
      Congratulation.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('경조사 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 경조사 상세 조회 (공개)
router.get('/:id', async (req, res) => {
  try {
    const item = await Congratulation.findById(req.params.id).populate('author', 'nickname');
    if (!item) {
      return res.status(404).json({ success: false, message: '경조사를 찾을 수 없습니다' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('경조사 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 경조사 등록 (관리자)
router.post('/', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const { type, title, content, targetName, eventDate, location } = req.body;

    if (!type || !title || !content || !targetName || !eventDate) {
      return res.status(400).json({ success: false, message: '필수 항목을 입력해주세요' });
    }

    const item = new Congratulation({
      type,
      title,
      content,
      targetName,
      eventDate: new Date(eventDate),
      location,
      author: req.member._id
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: '경조사가 등록되었습니다',
      data: item
    });
  } catch (error) {
    console.error('경조사 등록 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 경조사 수정 (관리자)
router.put('/:id', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const { type, title, content, targetName, eventDate, location, isActive } = req.body;

    const item = await Congratulation.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: '경조사를 찾을 수 없습니다' });
    }

    if (type) item.type = type;
    if (title) item.title = title;
    if (content) item.content = content;
    if (targetName) item.targetName = targetName;
    if (eventDate) item.eventDate = new Date(eventDate);
    if (location !== undefined) item.location = location;
    if (typeof isActive === 'boolean') item.isActive = isActive;

    await item.save();

    res.json({
      success: true,
      message: '경조사가 수정되었습니다',
      data: item
    });
  } catch (error) {
    console.error('경조사 수정 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 경조사 삭제 (관리자)
router.delete('/:id', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const item = await Congratulation.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: '경조사를 찾을 수 없습니다' });
    }

    res.json({
      success: true,
      message: '경조사가 삭제되었습니다'
    });
  } catch (error) {
    console.error('경조사 삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
