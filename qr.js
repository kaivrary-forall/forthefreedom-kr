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

// QR 목록 조회
router.get('/admin/qr', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const qrcodes = await db.collection('qrcodes')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, qrcodes });
  } catch (error) {
    console.error('QR list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 생성
router.post('/admin/qr', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { code, name, type, targetUrl, landingSlug, vcardData, isActive } = req.body;

    // 코드 중복 체크
    const existing = await db.collection('qrcodes').findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: '이미 사용 중인 코드입니다.' });
    }

    const qr = {
      code,
      name,
      type,
      targetUrl: type === 'url' ? targetUrl : null,
      landingSlug: type === 'landing' ? landingSlug : null,
      vcardData: type === 'vcard' ? vcardData : null,
      scans: 0,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('qrcodes').insertOne(qr);
    qr._id = result.insertedId;

    res.status(201).json({ success: true, qr });
  } catch (error) {
    console.error('QR create error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 상세 조회
router.get('/admin/qr/:id', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const qr = await db.collection('qrcodes').findOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });

    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }

    res.json({ success: true, qr });
  } catch (error) {
    console.error('QR detail error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 수정
router.put('/admin/qr/:id', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { code, name, type, targetUrl, landingSlug, vcardData, isActive } = req.body;

    // 코드 중복 체크 (자기 자신 제외)
    if (code) {
      const existing = await db.collection('qrcodes').findOne({ 
        code, 
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: '이미 사용 중인 코드입니다.' });
      }
    }

    const updateData = {
      ...(code && { code }),
      ...(name && { name }),
      ...(type && { type }),
      ...(type === 'url' && { targetUrl, landingSlug: null, vcardData: null }),
      ...(type === 'landing' && { landingSlug, targetUrl: null, vcardData: null }),
      ...(type === 'vcard' && { vcardData, targetUrl: null, landingSlug: null }),
      ...(typeof isActive === 'boolean' && { isActive }),
      updatedAt: new Date()
    };

    await db.collection('qrcodes').updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: updateData }
    );

    const qr = await db.collection('qrcodes').findOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });

    res.json({ success: true, qr });
  } catch (error) {
    console.error('QR update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 삭제
router.delete('/admin/qr/:id', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    await db.collection('qrcodes').deleteOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });
    
    await db.collection('qrscans').deleteMany({ 
      qrId: new mongoose.Types.ObjectId(req.params.id) 
    });

    res.json({ success: true });
  } catch (error) {
    console.error('QR delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// QR 통계 조회
router.get('/admin/qr/:id/stats', authMember, checkAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { period = '30d' } = req.query;
    const qrId = new mongoose.Types.ObjectId(req.params.id);

    let startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);
    else startDate = new Date(0);

    const dateFilter = period === 'all' ? {} : { timestamp: { $gte: startDate } };

    const total = await db.collection('qrscans').countDocuments({ qrId, ...dateFilter });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const today = await db.collection('qrscans').countDocuments({ 
      qrId, 
      timestamp: { $gte: todayStart }
    });

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const thisWeek = await db.collection('qrscans').countDocuments({ 
      qrId, 
      timestamp: { $gte: weekStart }
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const thisMonth = await db.collection('qrscans').countDocuments({ 
      qrId, 
      timestamp: { $gte: monthStart }
    });

    const byDate = await db.collection('qrscans').aggregate([
      { $match: { qrId, ...dateFilter } },
      { 
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } }
    ]).toArray();

    const byDevice = await db.collection('qrscans').aggregate([
      { $match: { qrId, ...dateFilter } },
      { 
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: '$userAgent', regex: /Mobile/i } },
              'Mobile',
              'Desktop'
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $project: { device: '$_id', count: 1, _id: 0 } }
    ]).toArray();

    const byCountry = await db.collection('qrscans').aggregate([
      { $match: { qrId, country: { $exists: true, $ne: null }, ...dateFilter } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { country: '$_id', count: 1, _id: 0 } }
    ]).toArray();

    const recentScans = await db.collection('qrscans')
      .find({ qrId })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    res.json({
      success: true,
      stats: {
        total,
        today,
        thisWeek,
        thisMonth,
        byDate,
        byDevice,
        byCountry,
        recentScans
      }
    });
  } catch (error) {
    console.error('QR stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==========================================
// 공개 API - QR 스캔
// ==========================================
router.post('/qr/:code/scan', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { code } = req.params;
    const { userAgent, ip, referer } = req.body;

    const qr = await db.collection('qrcodes').findOne({ code, isActive: true });
    
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }

    await db.collection('qrscans').insertOne({
      qrId: qr._id,
      timestamp: new Date(),
      userAgent,
      ip,
      referer
    });

    await db.collection('qrcodes').updateOne(
      { _id: qr._id },
      { $inc: { scans: 1 } }
    );

    res.json({
      success: true,
      type: qr.type,
      targetUrl: qr.targetUrl,
      landingSlug: qr.landingSlug,
      vcardData: qr.vcardData
    });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
