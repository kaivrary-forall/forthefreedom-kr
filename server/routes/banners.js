const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const BannerSettings = require('../models/BannerSettings');
const { authMember, requirePermission } = require('../middleware/authMember');
const { uploads } = require('../utils/upload');
const upload = uploads.notice;

const triggerRevalidate = async () => {
  if (!process.env.NEXT_REVALIDATE_URL || !process.env.REVALIDATE_SECRET) return;
  try {
    const fetch = require('node-fetch');
    await fetch(process.env.NEXT_REVALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags: ['banners'] })
    });
  } catch (e) { console.error('⚠️ Revalidate 실패:', e.message); }
};

// ==========================================
// 공개 API
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { position, isActive } = req.query;
    const filter = {};
    if (position) filter.position = position;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      $or: [{ startDate: { $lte: now } }, { startDate: null }],
      $or: [{ endDate: { $gte: now } }, { endDate: null }]
    }).sort({ order: 1 });
    res.json({ success: true, data: banners });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/settings', async (req, res) => {
  try {
    let settings = await BannerSettings.findOne();
    if (!settings) settings = await BannerSettings.create({ autoPlay: true, interval: 5000 });
    res.json({ success: true, data: settings });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: '배너를 찾을 수 없습니다' });
    res.json({ success: true, data: banner });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ==========================================
// 관리자 API (banners:write 권한 필요)
// ==========================================
router.post('/upload-image', authMember, requirePermission('banners:write'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '이미지 파일이 필요합니다' });
    const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL || 'https://forthefreedom-kr-production.up.railway.app' : 'http://localhost:9000';
    res.json({ success: true, data: { filename: req.file.filename, imageUrl: `${baseUrl}/uploads/${req.file.filename}` } });
  } catch (error) { res.status(500).json({ success: false, message: '이미지 업로드 중 오류가 발생했습니다' }); }
});

router.post('/', authMember, requirePermission('banners:write'), async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    await triggerRevalidate();
    res.status(201).json({ success: true, data: banner, message: '배너가 생성되었습니다' });
  } catch (error) { res.status(500).json({ success: false, message: '배너 생성 중 오류가 발생했습니다' }); }
});

router.put('/:id', authMember, requirePermission('banners:write'), async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, message: '배너를 찾을 수 없습니다' });
    await triggerRevalidate();
    res.json({ success: true, data: banner, message: '배너가 수정되었습니다' });
  } catch (error) { res.status(500).json({ success: false, message: '배너 수정 중 오류가 발생했습니다' }); }
});

router.delete('/:id', authMember, requirePermission('banners:write'), async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: '배너를 찾을 수 없습니다' });
    await triggerRevalidate();
    res.json({ success: true, message: '배너가 삭제되었습니다' });
  } catch (error) { res.status(500).json({ success: false, message: '배너 삭제 중 오류가 발생했습니다' }); }
});

router.patch('/:id/toggle', authMember, requirePermission('banners:write'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: '배너를 찾을 수 없습니다' });
    banner.isActive = !banner.isActive;
    await banner.save();
    await triggerRevalidate();
    res.json({ success: true, data: banner, message: `배너가 ${banner.isActive ? '활성화' : '비활성화'}되었습니다` });
  } catch (error) { res.status(500).json({ success: false, message: '상태 변경 중 오류가 발생했습니다' }); }
});

router.put('/settings/update', authMember, requirePermission('banners:write'), async (req, res) => {
  try {
    let settings = await BannerSettings.findOne();
    if (!settings) settings = new BannerSettings();
    Object.assign(settings, req.body);
    await settings.save();
    await triggerRevalidate();
    res.json({ success: true, data: settings, message: '배너 설정이 저장되었습니다' });
  } catch (error) { res.status(500).json({ success: false, message: '설정 저장 중 오류가 발생했습니다' }); }
});

router.post('/reorder', authMember, requirePermission('banners:write'), async (req, res) => {
  try {
    const { bannerIds } = req.body;
    for (let i = 0; i < bannerIds.length; i++) {
      await Banner.findByIdAndUpdate(bannerIds[i], { order: i });
    }
    await triggerRevalidate();
    res.json({ success: true, message: '배너 순서가 변경되었습니다' });
  } catch (error) { res.status(500).json({ success: false, message: '순서 변경 중 오류가 발생했습니다' }); }
});

module.exports = router;
