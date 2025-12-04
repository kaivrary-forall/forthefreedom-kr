const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const JWT_SECRET = process.env.JWT_SECRET || 'forthefreedom-secret-key-2025';
const JWT_EXPIRES_IN = '7d'; // 7일

// 토큰 생성
const generateToken = (memberId) => {
  return jwt.sign({ id: memberId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 회원 인증 미들웨어
const authMember = async (req, res, next) => {
  try {
    // 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다'
      });
    }

    const token = authHeader.split(' ')[1];

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);

    // 회원 조회
    const member = await Member.findById(decoded.id);
    if (!member) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다'
      });
    }

    // 계정 상태 확인
    if (member.status !== 'active') {
      let message = '계정에 문제가 있습니다';
      let code = 'ACCOUNT_INACTIVE';
      
      if (member.status === 'pending') {
        message = '승인 대기 중인 계정입니다';
        code = 'ACCOUNT_PENDING';
      }
      if (member.status === 'suspended') {
        message = '정지된 계정입니다';
        code = 'ACCOUNT_SUSPENDED';
      }
      if (member.status === 'withdrawn') {
        message = '탈퇴한 계정입니다';
        code = 'ACCOUNT_WITHDRAWN';
      }
      
      return res.status(403).json({
        success: false,
        code,
        message
      });
    }

    // req에 회원 정보 추가
    req.member = member;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다. 다시 로그인해주세요'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다'
      });
    }
    
    console.error('인증 오류:', error);
    res.status(500).json({
      success: false,
      message: '인증 처리 중 오류가 발생했습니다'
    });
  }
};

// 선택적 인증 (로그인 안 해도 됨)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.member = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const member = await Member.findById(decoded.id);
    
    req.member = member && member.status === 'active' ? member : null;
    next();
  } catch (error) {
    req.member = null;
    next();
  }
};

module.exports = {
  generateToken,
  authMember,
  optionalAuth,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
