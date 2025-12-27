const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Notice } = require('../models');
const { getAll, getById } = require('../controllers/baseController');
const { authMember, requirePermission } = require('../middleware/authMember');

const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.notice;

// Next.js revalidate 트리거
const triggerRevalidate = async () => {
  if (!process.env.NEXT_REVALIDATE_URL || !process.env.REVALIDATE_SECRET) return;
  try {
    const fetch = require('node-fetch');
    const response = await fetch(process.env.NEXT_REVALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags: ['notices', 'news'] })
    });
    if (response.ok) console.log('✅ Next.js revalidate 트리거 성공 [notices]');
  } catch (e) { console.error('⚠️ Next.js revalidate 트리거 실패:', e.message); }
};

// ==========================================
// 공개 API
// ==========================================
router.get('/', getAll(Notice));
router.get('/:id', getById(Notice));

// ==========================================
// 관리자 API (notices:write 권한 필요)
// ==========================================

// 이미지 업로드
router.post('/upload-image', authMember, requirePermission('notices:write'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '이미지 파일이 필요합니다' });
    const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL || 'https://forthefreedom-kr-production.up.railway.app' : 'http://localhost:9000';
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ success: true, data: { filename: req.file.filename, originalName: req.file.originalname, imageUrl, size: req.file.size, mimeType: req.file.mimetype }, message: '이미지 업로드 완료' });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    res.status(500).json({ success: false, message: '이미지 업로드 중 오류가 발생했습니다' });
  }
});

// 공지사항 생성
router.post('/', authMember, requirePermission('notices:write'), upload.array('attachments'), async (req, res) => {
  try {
    const { title, content, category, author, excerpt, tags, isImportant } = req.body;
    const attachments = createAttachmentsInfo(req.files);
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) parsedTags = tags;
      else if (typeof tags === 'string') {
        try { const p = JSON.parse(tags); parsedTags = Array.isArray(p) ? p : [tags]; }
        catch { parsedTags = tags.split(',').map(t => t.trim()).filter(t => t); }
      }
    }
    const notice = new Notice({
      title, content, category, author: author || req.member?.nickname || '관리자',
      excerpt: excerpt || '', tags: parsedTags, isImportant: isImportant === 'true' || isImportant === true,
      attachments, status: 'published', publishDate: new Date()
    });
    await notice.save();
    await triggerRevalidate();
    res.status(201).json({ success: true, data: notice, message: '새로운 공지사항이 생성되었습니다' });
  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 생성 중 오류가 발생했습니다' });
  }
});

// 공지사항 수정
router.put('/:id', authMember, requirePermission('notices:write'), upload.array('attachments'), async (req, res) => {
  try {
    const { title, content, category, author, excerpt, tags, isImportant, existingAttachments } = req.body;
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) parsedTags = tags;
      else if (typeof tags === 'string') {
        try { const p = JSON.parse(tags); parsedTags = Array.isArray(p) ? p : [tags]; }
        catch { parsedTags = tags.split(',').map(t => t.trim()).filter(t => t); }
      }
    }
    const existingNotice = await Notice.findById(req.params.id);
    if (!existingNotice) return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다' });

    let finalAttachments = [];
    if (existingAttachments) {
      try {
        const keep = typeof existingAttachments === 'string' ? JSON.parse(existingAttachments) : existingAttachments;
        if (Array.isArray(keep)) finalAttachments = keep;
      } catch { finalAttachments = existingNotice.attachments || []; }
    } else { finalAttachments = existingNotice.attachments || []; }
    if (req.files && req.files.length > 0) finalAttachments = [...finalAttachments, ...createAttachmentsInfo(req.files)];

    const notice = await Notice.findByIdAndUpdate(req.params.id, {
      title, content, category, author: author || req.member?.nickname || '관리자',
      excerpt: excerpt || '', tags: parsedTags, isImportant: isImportant === 'true' || isImportant === true,
      attachments: finalAttachments, updatedAt: new Date()
    }, { new: true, runValidators: true });
    await triggerRevalidate();
    res.json({ success: true, data: notice, message: '공지사항이 수정되었습니다' });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 수정 중 오류가 발생했습니다' });
  }
});

// 공지사항 삭제
router.delete('/:id', authMember, requirePermission('notices:write'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다' });
    await triggerRevalidate();
    res.json({ success: true, message: '공지사항이 삭제되었습니다' });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 삭제 중 오류가 발생했습니다' });
  }
});

module.exports = router;
