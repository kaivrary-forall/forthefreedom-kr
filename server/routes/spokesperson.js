const express = require('express');
const router = express.Router();
const { Spokesperson } = require('../models');
const { getAll, getById } = require('../controllers/baseController');
const { authMember, requirePermission } = require('../middleware/authMember');
const { uploads, createAttachmentsInfo } = require('../utils/upload');
const upload = uploads.spokesperson;

const triggerRevalidate = async () => {
  if (!process.env.NEXT_REVALIDATE_URL || !process.env.REVALIDATE_SECRET) return;
  try {
    const fetch = require('node-fetch');
    await fetch(process.env.NEXT_REVALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags: ['spokesperson', 'news'] })
    });
  } catch (e) { console.error('⚠️ Revalidate 실패:', e.message); }
};

// 공개 API
router.get('/', getAll(Spokesperson));
router.get('/:id', getById(Spokesperson));
router.post('/:id/view', async (req, res) => {
  try { await Spokesperson.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 관리자 API (spokesperson:write 권한 필요)
router.post('/upload-image', authMember, requirePermission('spokesperson:write'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '이미지 파일이 필요합니다' });
    const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL || 'https://forthefreedom-kr-production.up.railway.app' : 'http://localhost:9000';
    res.json({ success: true, data: { filename: req.file.filename, originalName: req.file.originalname, imageUrl: `${baseUrl}/uploads/${req.file.filename}`, size: req.file.size, mimeType: req.file.mimetype } });
  } catch (error) { res.status(500).json({ success: false, message: '이미지 업로드 중 오류가 발생했습니다' }); }
});

router.post('/', authMember, requirePermission('spokesperson:write'), upload.array('attachments'), async (req, res) => {
  try {
    const attachments = createAttachmentsInfo(req.files);
    let parsedTags = [];
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) parsedTags = req.body.tags;
      else { try { const p = JSON.parse(req.body.tags); parsedTags = Array.isArray(p) ? p : [req.body.tags]; } catch { parsedTags = req.body.tags.split(',').map(t => t.trim()).filter(t => t); } }
    }
    const spokesperson = new Spokesperson({
      title: req.body.title, content: req.body.content, category: req.body.category || 'statement',
      author: req.body.author || req.member?.nickname || '대변인', excerpt: req.body.excerpt || '',
      tags: parsedTags, isImportant: req.body.isImportant === 'true', attachments, status: 'published', publishDate: new Date()
    });
    await spokesperson.save();
    await triggerRevalidate();
    res.status(201).json({ success: true, data: spokesperson, message: '새로운 보도자료가 생성되었습니다' });
  } catch (error) { console.error('보도자료 생성 오류:', error); res.status(500).json({ success: false, message: '보도자료 생성 중 오류가 발생했습니다' }); }
});

router.put('/:id', authMember, requirePermission('spokesperson:write'), upload.array('attachments'), async (req, res) => {
  try {
    const existing = await Spokesperson.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: '보도자료를 찾을 수 없습니다' });
    let parsedTags = [];
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) parsedTags = req.body.tags;
      else { try { const p = JSON.parse(req.body.tags); parsedTags = Array.isArray(p) ? p : [req.body.tags]; } catch { parsedTags = req.body.tags.split(',').map(t => t.trim()).filter(t => t); } }
    }
    let finalAttachments = [];
    if (req.body.existingAttachments) {
      try { const keep = typeof req.body.existingAttachments === 'string' ? JSON.parse(req.body.existingAttachments) : req.body.existingAttachments; if (Array.isArray(keep)) finalAttachments = keep; }
      catch { finalAttachments = existing.attachments || []; }
    } else { finalAttachments = existing.attachments || []; }
    if (req.files && req.files.length > 0) finalAttachments = [...finalAttachments, ...createAttachmentsInfo(req.files)];
    const spokesperson = await Spokesperson.findByIdAndUpdate(req.params.id, {
      title: req.body.title, content: req.body.content, category: req.body.category || existing.category,
      author: req.body.author || req.member?.nickname || '대변인', excerpt: req.body.excerpt || '',
      tags: parsedTags, isImportant: req.body.isImportant === 'true', attachments: finalAttachments, updatedAt: new Date()
    }, { new: true, runValidators: true });
    await triggerRevalidate();
    res.json({ success: true, data: spokesperson, message: '보도자료가 수정되었습니다' });
  } catch (error) { console.error('보도자료 수정 오류:', error); res.status(500).json({ success: false, message: '보도자료 수정 중 오류가 발생했습니다' }); }
});

router.delete('/:id', authMember, requirePermission('spokesperson:write'), async (req, res) => {
  try {
    const spokesperson = await Spokesperson.findByIdAndDelete(req.params.id);
    if (!spokesperson) return res.status(404).json({ success: false, message: '보도자료를 찾을 수 없습니다' });
    await triggerRevalidate();
    res.json({ success: true, message: '보도자료가 삭제되었습니다' });
  } catch (error) { console.error('보도자료 삭제 오류:', error); res.status(500).json({ success: false, message: '보도자료 삭제 중 오류가 발생했습니다' }); }
});

module.exports = router;
