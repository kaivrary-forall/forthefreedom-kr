const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const JWT_SECRET = process.env.JWT_SECRET || 'forthefreedom-secret-key-2025';
const JWT_EXPIRES_IN = '7d';

// 토큰 생성 (슬롯 정보 포함)
const generateToken = (memberId, isAdmin = false, adminSlot = null, permissions = []) => {
  const payload = { id: memberId, isAdmin, adminSlot, permissions };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 회원 인증 미들웨어
const authMember = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.isAdmin) {
      const member = await Member.findById(decoded.id);
      if (member) {
        req.member = member;
        req.member.isAdmin = true;
        req.adminSlot = decoded.adminSlot;
        req.permissions = decoded.permissions || [];
      } else {
        req.member = { _id: decoded.id, userId: 'admin_00', nickname: '슈퍼관리자', name: '슈퍼관리자', status: 'active', memberType: 'admin', isAdmin: true };
        req.adminSlot = decoded.adminSlot || 'admin_00';
        req.permissions = decoded.permissions || ['*'];
      }
      return next();
    }

    const member = await Member.findById(decoded.id);
    if (!member) {
      return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다' });
    }

    if (member.status !== 'active') {
      const statusMessages = {
        pending: { message: '승인 대기 중인 계정입니다', code: 'ACCOUNT_PENDING' },
        suspended: { message: '정지된 계정입니다', code: 'ACCOUNT_SUSPENDED' },
        withdrawn: { message: '탈퇴한 계정입니다', code: 'ACCOUNT_WITHDRAWN' }
      };
      const info = statusMessages[member.status] || { message: '계정에 문제가 있습니다', code: 'ACCOUNT_INACTIVE' };
      return res.status(403).json({ success: false, code: info.code, message: info.message });
    }

    req.member = member;
    req.permissions = [];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: '토큰이 만료되었습니다. 다시 로그인해주세요' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다' });
    }
    console.error('인증 오류:', error);
    res.status(500).json({ success: false, message: '인증 처리 중 오류가 발생했습니다' });
  }
};

// 선택적 인증
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.member = null;
      req.permissions = [];
      return next();
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const member = await Member.findById(decoded.id);
    req.member = member && member.status === 'active' ? member : null;
    req.permissions = decoded.permissions || [];
    next();
  } catch (error) {
    req.member = null;
    req.permissions = [];
    next();
  }
};

// ==========================================
// 권한 체크 미들웨어 (부분 권한 enforcement)
// ==========================================
const requirePermission = (...requiredPerms) => {
  return (req, res, next) => {
    if (!req.member) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
    }

    const userPerms = req.permissions || [];

    // 전체 권한(*) 있으면 통과
    if (userPerms.includes('*')) {
      return next();
    }

    // 필요한 권한 중 하나라도 있으면 통과
    const hasPermission = requiredPerms.some(perm => userPerms.includes(perm));

    if (!hasPermission) {
      console.log(`❌ 권한 부족: ${req.member.userId} 필요=[${requiredPerms}] 보유=[${userPerms}]`);
      return res.status(403).json({
        success: false,
        message: `권한이 없습니다 (필요: ${requiredPerms.join(' 또는 ')})`
      });
    }

    next();
  };
};

// 관리자 여부만 체크 (기존 호환성)
const requireAdmin = (req, res, next) => {
  if (!req.member) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
  }
  if (!req.member.isAdmin) {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다' });
  }
  next();
};

module.exports = {
  generateToken,
  authMember,
  optionalAuth,
  requirePermission,
  requireAdmin,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
