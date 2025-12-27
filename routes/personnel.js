const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel');
const { authMember, requirePermission } = require('../middleware/authMember');

// 인사공고 목록 조회 (공개)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (type) query.type = type;

    const [items, total] = await Promise.all([
      Personnel.find(query)
        .sort({ effectiveDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'nickname'),
      Personnel.countDocuments(query)
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
    console.error('인사공고 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 인사공고 상세 조회 (공개)
router.get('/:id', async (req, res) => {
  try {
    const item = await Personnel.findById(req.params.id).populate('author', 'nickname');
    if (!item) {
      return res.status(404).json({ success: false, message: '인사공고를 찾을 수 없습니다' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('인사공고 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 인사공고 등록 (관리자)
router.post('/', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const { type, title, content, effectiveDate } = req.body;

    if (!type || !title || !content || !effectiveDate) {
      return res.status(400).json({ success: false, message: '필수 항목을 입력해주세요' });
    }

    const item = new Personnel({
      type,
      title,
      content,
      effectiveDate: new Date(effectiveDate),
      author: req.member._id
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: '인사공고가 등록되었습니다',
      data: item
    });
  } catch (error) {
    console.error('인사공고 등록 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 인사공고 수정 (관리자)
router.put('/:id', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const { type, title, content, effectiveDate, isActive } = req.body;

    const item = await Personnel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: '인사공고를 찾을 수 없습니다' });
    }

    if (type) item.type = type;
    if (title) item.title = title;
    if (content) item.content = content;
    if (effectiveDate) item.effectiveDate = new Date(effectiveDate);
    if (typeof isActive === 'boolean') item.isActive = isActive;

    await item.save();

    res.json({
      success: true,
      message: '인사공고가 수정되었습니다',
      data: item
    });
  } catch (error) {
    console.error('인사공고 수정 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

// 인사공고 삭제 (관리자)
router.delete('/:id', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const item = await Personnel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: '인사공고를 찾을 수 없습니다' });
    }

    res.json({
      success: true,
      message: '인사공고가 삭제되었습니다'
    });
  } catch (error) {
    console.error('인사공고 삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
