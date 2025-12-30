const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMember, requirePermission } = require('../middleware/authMember');

// QRCode 모델 정의 (models/index.js에 없으면 여기서 직접 정의)
let QRCode;
try {
  QRCode = require('../models').QRCode;
} catch (e) {
  // 모델이 없으면 직접 정의
  const QRCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['url', 'landing', 'vcard'], default: 'url' },
    targetUrl: String,
    landingSlug: String,
    vcardData: {
      name: String,
      organization: String,
      title: String,
      phone: String,
      email: String,
      website: String,
      address: String,
      note: String
    },
    scans: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });
  
  QRCode = mongoose.models.QRCode || mongoose.model('QRCode', QRCodeSchema);
}

// ==========================================
// 공개 API (인증 불필요)
// ==========================================

// QR 스캔 - 공개 엔드포인트
// GET /api/qr/scan/:code
router.get('/scan/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const qr = await QRCode.findOne({ code, isActive: true });
    
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }

    // 스캔 카운트 증가
    qr.scans = (qr.scans || 0) + 1;
    await qr.save();

    // type에 따라 targetUrl 결정
    let targetUrl = '';
    if (qr.type === 'url') {
      targetUrl = qr.targetUrl;
    } else if (qr.type === 'landing') {
      targetUrl = `https://www.forthefreedom.kr/l/${qr.landingSlug}`;
    } else if (qr.type === 'vcard') {
      targetUrl = `https://forthefreedom-kr-production.up.railway.app/api/qr/vcard/${code}`;
    }

    return res.json({ success: true, targetUrl, scans: qr.scans });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// vCard 다운로드 - 공개 엔드포인트
// GET /api/qr/vcard/:code
router.get('/vcard/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const qr = await QRCode.findOne({ code, type: 'vcard', isActive: true });

    if (!qr || !qr.vcardData) {
      return res.status(404).json({ success: false, message: 'vCard not found' });
    }

    const v = qr.vcardData;
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${v.name || ''}
FN:${v.name || ''}
ORG:${v.organization || ''}
TITLE:${v.title || ''}
TEL:${v.phone || ''}
EMAIL:${v.email || ''}
URL:${v.website || ''}
ADR:;;${v.address || ''}
NOTE:${v.note || ''}
END:VCARD`;

    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', `attachment; filename="${code}.vcf"`);
    res.send(vcard);
  } catch (error) {
    console.error('vCard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// 관리자 API (qr:write 권한 필요)
// ==========================================

// QR 목록 조회
router.get('/', authMember, requirePermission('qr:write'), async (req, res) => {
  try {
    const qrcodes = await QRCode.find().sort({ createdAt: -1 });
    res.json({ success: true, qrcodes });
  } catch (error) {
    console.error('QR list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 상세 조회
router.get('/:id', authMember, requirePermission('qr:write'), async (req, res) => {
  try {
    const qr = await QRCode.findById(req.params.id);
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }
    res.json({ success: true, qrcode: qr });
  } catch (error) {
    console.error('QR detail error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 생성
router.post('/', authMember, requirePermission('qr:write'), async (req, res) => {
  try {
    const { code, name, type, targetUrl, landingSlug, vcardData, isActive } = req.body;

    // 중복 코드 체크
    const existing = await QRCode.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: '이미 존재하는 코드입니다' });
    }

    const qr = new QRCode({
      code,
      name,
      type: type || 'url',
      targetUrl,
      landingSlug,
      vcardData,
      isActive: isActive !== false,
      scans: 0
    });

    await qr.save();
    res.status(201).json({ success: true, qrcode: qr, message: 'QR 코드가 생성되었습니다' });
  } catch (error) {
    console.error('QR create error:', error);
    res.status(500).json({ success: false, message: 'QR 생성 중 오류가 발생했습니다' });
  }
});

// QR 수정
router.put('/:id', authMember, requirePermission('qr:write'), async (req, res) => {
  try {
    const { code, name, type, targetUrl, landingSlug, vcardData, isActive } = req.body;

    // 코드 변경 시 중복 체크
    if (code) {
      const existing = await QRCode.findOne({ code, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: '이미 존재하는 코드입니다' });
      }
    }

    const qr = await QRCode.findByIdAndUpdate(
      req.params.id,
      { code, name, type, targetUrl, landingSlug, vcardData, isActive, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }

    res.json({ success: true, qrcode: qr, message: 'QR 코드가 수정되었습니다' });
  } catch (error) {
    console.error('QR update error:', error);
    res.status(500).json({ success: false, message: 'QR 수정 중 오류가 발생했습니다' });
  }
});

// QR 삭제
router.delete('/:id', authMember, requirePermission('qr:write'), async (req, res) => {
  try {
    const qr = await QRCode.findByIdAndDelete(req.params.id);
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }
    res.json({ success: true, message: 'QR 코드가 삭제되었습니다' });
  } catch (error) {
    console.error('QR delete error:', error);
    res.status(500).json({ success: false, message: 'QR 삭제 중 오류가 발생했습니다' });
  }
});

// QR 통계
router.get('/:id/stats', authMember, requirePermission('qr:write'), async (req, res) => {
  try {
    const qr = await QRCode.findById(req.params.id);
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }
    res.json({ success: true, stats: { scans: qr.scans || 0, createdAt: qr.createdAt, updatedAt: qr.updatedAt } });
  } catch (error) {
    console.error('QR stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
