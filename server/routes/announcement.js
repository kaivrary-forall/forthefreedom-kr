const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// ===== 공지 조회 (공개) =====
router.get('/', async (req, res) => {
  try {
    console.log('📢 공지 조회 API 호출됨');
    const announcement = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
    console.log('📢 조회 결과:', announcement ? announcement.text : 'null');
    
    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('공지 조회 오류:', error);
    res.status(500).json({ success: false, message: '공지 조회 실패' });
  }
});

// ===== 공지 등록/수정 (관리자) =====
router.post('/', async (req, res) => {
  try {
    // 간단한 관리자 인증 (Authorization 헤더 확인)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '인증 필요' });
    }
    
    const { text, link, linkText, bgColor, textColor, isActive } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: '공지 내용을 입력해주세요' });
    }
    
    if (text.length > 100) {
      return res.status(400).json({ success: false, message: '100자 이내로 작성해주세요' });
    }
    
    // 기존 공지 비활성화
    await Announcement.updateMany({}, { isActive: false });
    
    // 새 공지 생성
    const announcement = new Announcement({
      text: text.trim(),
      link: link || '',
      linkText: linkText || '자세히 알아보기',
      bgColor: bgColor || '#000000',
      textColor: textColor || '#ffffff',
      isActive: isActive !== false
    });
    
    await announcement.save();
    
    res.json({
      success: true,
      message: '공지가 등록되었습니다',
      data: announcement
    });
  } catch (error) {
    console.error('공지 등록 오류:', error);
    res.status(500).json({ success: false, message: '공지 등록 실패' });
  }
});

// ===== 공지 수정 =====
router.put('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '인증 필요' });
    }
    
    const { text, link, linkText, bgColor, textColor, isActive } = req.body;
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { text, link, linkText, bgColor, textColor, isActive },
      { new: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ success: false, message: '공지를 찾을 수 없습니다' });
    }
    
    res.json({
      success: true,
      message: '공지가 수정되었습니다',
      data: announcement
    });
  } catch (error) {
    console.error('공지 수정 오류:', error);
    res.status(500).json({ success: false, message: '공지 수정 실패' });
  }
});

// ===== 공지 삭제 (비활성화) =====
router.delete('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '인증 필요' });
    }
    
    await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
    
    res.json({
      success: true,
      message: '공지가 삭제되었습니다'
    });
  } catch (error) {
    console.error('공지 삭제 오류:', error);
    res.status(500).json({ success: false, message: '공지 삭제 실패' });
  }
});

// ===== 모든 공지 목록 (관리자) =====
router.get('/all', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('공지 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '공지 목록 조회 실패' });
  }
});

module.exports = router;
