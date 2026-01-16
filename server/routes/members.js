const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const Member = require('../models/Member');
const AdminSlot = require('../models/AdminSlot');
const { generateToken, authMember } = require('../middleware/authMember');
const { ADMIN_CREDENTIALS } = require('./auth');
const { sendVerificationCode } = require('../utils/email');
const { uploadProfileImage } = require('../utils/cloudinary');

// 프로필 이미지 업로드 설정 (메모리 저장, 10MB 제한)
const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'), false);
    }
  }
});

// 선택적 인증 미들웨어
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.memberId = decoded.memberId || decoded.id;
    }
  } catch (error) {
    // 토큰 에러 무시
  }
  next();
};
// 이메일 인증 코드 임시 저장소 (메모리)
const emailVerificationCodes = new Map(); // email -> { code, memberId, expiresAt }

// 이메일 인증 코드 발송 횟수 제한 (하루 5회)
const emailRequestCounts = new Map(); // memberId -> { count, resetAt }

// 발송 횟수 체크 함수
function checkEmailRequestLimit(memberId) {
  const now = Date.now();
  const record = emailRequestCounts.get(memberId);
  
  if (!record || now > record.resetAt) {
    return { allowed: true, remaining: 5 };
  }
  
  if (record.count >= 5) {
    return { allowed: false, remaining: 0 };
  }
  
  return { allowed: true, remaining: 5 - record.count };
}

// 발송 횟수 증가 함수
function incrementEmailRequestCount(memberId) {
  const now = Date.now();
  const record = emailRequestCounts.get(memberId);
  
  const kstNow = new Date(now + 9 * 60 * 60 * 1000);
  const tomorrow = new Date(kstNow);
  tomorrow.setHours(24, 0, 0, 0);
  const resetAt = tomorrow.getTime() - 9 * 60 * 60 * 1000;
  
  if (!record || now > record.resetAt) {
    emailRequestCounts.set(memberId, { count: 1, resetAt });
  } else {
    record.count += 1;
    emailRequestCounts.set(memberId, record);
  }
}

// ===== 회원가입 =====
router.post('/register', async (req, res) => {
  try {
    const { 
      userId,
      password, 
      passwordConfirm,
      nickname,
      name, 
      email,
      phone, 
      address,
      addressDetail,
      zipCode,
      birthDate,
      agreements 
    } = req.body;
    // 필수 필드 검증
    if (!userId || !password || !nickname || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: '필수 정보를 모두 입력해주세요'
      });
    }
    // 비밀번호 확인
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호가 일치하지 않습니다'
      });
    }
    // 비밀번호 길이 검증
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 8자 이상이어야 합니다'
      });
    }
    // 아이디 형식 검증
    const userIdRegex = /^[a-z0-9_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      return res.status(400).json({
        success: false,
        message: '아이디는 4~20자의 영문 소문자, 숫자, 밑줄(_)만 사용 가능합니다'
      });
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다'
      });
    }
    // 닉네임 길이 검증
    if (nickname.length < 2 || nickname.length > 20) {
      return res.status(400).json({
        success: false,
        message: '닉네임은 2~20자여야 합니다'
      });
    }
    // 아이디 중복 확인
    const existingUserId = await Member.findOne({ userId: userId.toLowerCase() });
    if (existingUserId) {
      return res.status(400).json({
        success: false,
        message: '이미 사용 중인 아이디입니다'
      });
    }
    // 닉네임 중복 확인
    const existingNickname = await Member.findOne({ nickname });
    if (existingNickname) {
      return res.status(400).json({
        success: false,
        message: '이미 사용 중인 닉네임입니다'
      });
    }
    // 필수 동의 확인
    if (!agreements?.terms || !agreements?.privacy) {
      return res.status(400).json({
        success: false,
        message: '필수 약관에 동의해주세요'
      });
    }
    // 회원 생성
    const member = new Member({
      userId: userId.toLowerCase(),
      password,
      nickname,
      name,
      email: email.toLowerCase(),
      phone,
      address: address || '',
      addressDetail: addressDetail || '',
      zipCode: zipCode || '',
      birthDate: birthDate || null,
      agreements: {
        terms: agreements.terms,
        privacy: agreements.privacy,
        marketing: agreements.marketing || false
      },
      status: 'active', // 바로 활성화
      memberType: 'member', // 일반 회원
      approvedAt: new Date()
    });
    await member.save();
    console.log('✅ 회원가입 완료:', member.userId, member.nickname);
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: {
        userId: member.userId,
        nickname: member.nickname,
        name: member.name,
        status: member.status,
        memberType: member.memberType
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    
    // MongoDB 중복 키 에러
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const messages = {
        userId: '이미 사용 중인 아이디입니다',
        nickname: '이미 사용 중인 닉네임입니다',
        email: '이미 사용 중인 이메일입니다'
      };
      return res.status(400).json({
        success: false,
        message: messages[field] || '중복된 정보가 있습니다'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '회원가입 처리 중 오류가 발생했습니다',
      error: error.message
    });
  }
});
// ===== 아이디 중복 확인 =====
router.get('/check-userid', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '아이디를 입력해주세요'
      });
    }
    // 형식 검증
    const userIdRegex = /^[a-z0-9_]{4,20}$/;
    if (!userIdRegex.test(userId.toLowerCase())) {
      return res.json({
        success: true,
        available: false,
        message: '아이디는 4~20자의 영문 소문자, 숫자, 밑줄(_)만 사용 가능합니다'
      });
    }
    const existingMember = await Member.findOne({ userId: userId.toLowerCase() });
    
    res.json({
      success: true,
      available: !existingMember,
      message: existingMember ? '이미 사용 중인 아이디입니다' : '사용 가능한 아이디입니다'
    });
  } catch (error) {
    console.error('아이디 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '아이디 확인 중 오류가 발생했습니다'
    });
  }
});
// ===== 닉네임 중복 확인 =====
router.get('/check-nickname', async (req, res) => {
  try {
    const { nickname } = req.query;
    
    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: '닉네임을 입력해주세요'
      });
    }
    if (nickname.length < 2 || nickname.length > 20) {
      return res.json({
        success: true,
        available: false,
        message: '닉네임은 2~20자여야 합니다'
      });
    }
    const existingMember = await Member.findOne({ nickname });
    
    res.json({
      success: true,
      available: !existingMember,
      message: existingMember ? '이미 사용 중인 닉네임입니다' : '사용 가능한 닉네임입니다'
    });
  } catch (error) {
    console.error('닉네임 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '닉네임 확인 중 오류가 발생했습니다'
    });
  }
});
// ===== 로그인 =====
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요'
      });
    }
    // 🔐 관리자 계정 체크 (슈퍼관리자는 일반 로그인도 가능)
    if (userId.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()) {
      // 관리자 비밀번호 확인
      const isAdminMatch = ADMIN_CREDENTIALS.passwordHash 
        ? await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash)
        : password === ADMIN_CREDENTIALS.password;
      
      if (isAdminMatch) {
        // 관리자용 토큰 생성 (7일)
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'forthefreedom-secret-key-2025';
        const token = jwt.sign(
          { id: ADMIN_CREDENTIALS.id, role: ADMIN_CREDENTIALS.role, isAdmin: true },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        console.log('✅ 관리자 일반 로그인:', userId);
        return res.json({
          success: true,
          message: '로그인 성공',
          data: {
            token,
            member: {
              id: ADMIN_CREDENTIALS.id,
              userId: ADMIN_CREDENTIALS.username,
              nickname: ADMIN_CREDENTIALS.nickname,
              name: ADMIN_CREDENTIALS.name,
              memberType: 'admin',
              status: 'active',
              isAdmin: true
            }
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: '아이디 또는 비밀번호가 올바르지 않습니다'
        });
      }
    }
    // 일반 회원 조회 (비밀번호 포함)
    const member = await Member.findOne({ userId: userId.toLowerCase() }).select('+password');
    
    if (!member) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다'
      });
    }
    // 비밀번호 확인
    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다'
      });
    }
    // 계정 상태 확인
    if (member.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: '승인 대기 중인 계정입니다. 관리자 승인 후 로그인하실 수 있습니다.',
        status: 'pending'
      });
    }
    if (member.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: '정지된 계정입니다. 관리자에게 문의해주세요.',
        status: 'suspended'
      });
    }
    if (member.status === 'withdrawn') {
      return res.status(403).json({
        success: false,
        message: '탈퇴한 계정입니다.',
        status: 'withdrawn'
      });
    }
    // 로그인 정보 업데이트
    member.lastLoginAt = new Date();
    member.loginCount = (member.loginCount || 0) + 1;
    await member.save();
    // 슬롯 조회 (의자에 앉아있는지 확인)
    let adminSlot = null;
    let permissions = [];
    let isAdmin = member.isAdmin === true || member.role === 'admin';
    try {
      const slot = await AdminSlot.findOne({ 
        assignedMemberId: member._id,
        isActive: true 
      });
      if (slot) {
        adminSlot = slot.slotId;
        permissions = slot.permissions || [];
        isAdmin = true; // 슬롯에 앉아있으면 admin
      }
    } catch (slotErr) {
      console.log('슬롯 조회 스킵 (컬렉션 없을 수 있음):', slotErr.message);
    }
    // 토큰 생성 (슬롯 정보 포함)
    const token = generateToken(member._id, isAdmin, adminSlot, permissions);
    console.log('✅ 로그인:', member.userId, adminSlot ? `(${adminSlot})` : '');
    res.json({
      success: true,
      message: '로그인 성공',
      data: {
        token,
        member: {
          id: member._id,
          userId: member.userId,
          nickname: member.nickname,
          name: member.name,
          email: member.email,
          phone: member.phone,
          memberType: member.memberType,
          status: member.status,
          appliedAt: member.appliedAt,
          isAdmin,
          adminSlot,
          permissions
        }
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다'
    });
  }
});
// ===== 내 정보 조회 =====
router.get('/me', authMember, async (req, res) => {
  try {
    // 관리자인 경우 DB 조회 없이 반환
    if (req.member.isAdmin) {
      return res.json({
        success: true,
        data: req.member
      });
    }
    
    const member = await Member.findById(req.member._id);
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '정보 조회 중 오류가 발생했습니다'
    });
  }
});
// ===== 내 정보 수정 =====
router.put('/me', authMember, async (req, res) => {
  try {
    const { name, email, phone, address, addressDetail, zipCode, birthDate } = req.body;
    // 수정 가능한 필드만 업데이트
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (addressDetail !== undefined) updateData.addressDetail = addressDetail;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    const member = await Member.findByIdAndUpdate(
      req.member._id,
      updateData,
      { new: true, runValidators: true }
    );
    console.log('✅ 정보 수정:', member.userId);
    res.json({
      success: true,
      message: '정보가 수정되었습니다',
      data: member
    });
  } catch (error) {
    console.error('정보 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '정보 수정 중 오류가 발생했습니다'
    });
  }
});
// ===== 비밀번호 변경 =====
router.put('/me/password', authMember, async (req, res) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({
        success: false,
        message: '모든 필드를 입력해주세요'
      });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({
        success: false,
        message: '새 비밀번호가 일치하지 않습니다'
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 8자 이상이어야 합니다'
      });
    }
    // 현재 비밀번호 확인
    const member = await Member.findById(req.member._id).select('+password');
    const isMatch = await member.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '현재 비밀번호가 올바르지 않습니다'
      });
    }
    // 비밀번호 변경
    member.password = newPassword;
    await member.save();
    console.log('✅ 비밀번호 변경:', member.email);
    res.json({
      success: true,
      message: '비밀번호가 변경되었습니다'
    });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '비밀번호 변경 중 오류가 발생했습니다'
    });
  }
});
// ===== 탈퇴 신청 =====
router.post('/me/withdraw', authMember, async (req, res) => {
  try {
    const { reason, password } = req.body;
    if (!password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호를 입력해주세요'
      });
    }
    // 비밀번호 확인
    const member = await Member.findById(req.member._id).select('+password');
    const isMatch = await member.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '비밀번호가 올바르지 않습니다'
      });
    }
    // 탈퇴 신청 (실제 탈퇴는 관리자가 처리)
    member.withdrawal = {
      requestedAt: new Date(),
      reason: reason || ''
    };
    member.status = 'withdrawn';
    await member.save();
    console.log('✅ 탈퇴 신청:', member.email);
    res.json({
      success: true,
      message: '탈퇴 처리가 완료되었습니다'
    });
  } catch (error) {
    console.error('탈퇴 처리 오류:', error);
    res.status(500).json({
      success: false,
      message: '탈퇴 처리 중 오류가 발생했습니다'
    });
  }
});
// ===== 마케팅 동의 변경 =====
router.put('/me/marketing', authMember, async (req, res) => {
  try {
    const { marketing } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.member._id,
      { 'agreements.marketing': !!marketing },
      { new: true }
    );
    res.json({
      success: true,
      message: marketing ? '마케팅 수신에 동의하셨습니다' : '마케팅 수신 동의를 철회하셨습니다',
      data: { marketing: member.agreements.marketing }
    });
  } catch (error) {
    console.error('마케팅 동의 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '처리 중 오류가 발생했습니다'
    });
  }
});
// ===== 닉네임 변경 =====
router.put('/me/nickname', authMember, async (req, res) => {
  try {
    const { nickname } = req.body;
    const member = await Member.findById(req.member._id);
    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: '닉네임을 입력해주세요'
      });
    }
    if (nickname.length < 2 || nickname.length > 20) {
      return res.status(400).json({
        success: false,
        message: '닉네임은 2~20자여야 합니다'
      });
    }
    // 현재 닉네임과 같으면 변경 불필요
    if (member.nickname === nickname) {
      return res.status(400).json({
        success: false,
        message: '현재 닉네임과 동일합니다'
      });
    }
    // 중복 확인
    const existingMember = await Member.findOne({ nickname, _id: { $ne: member._id } });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: '이미 사용 중인 닉네임입니다'
      });
    }
    // 무료 변경 횟수 확인 (1회까지 무료)
    const isFreeChange = member.nicknameChangeCount < 1;
    // 닉네임 변경
    member.nickname = nickname;
    member.nicknameChangeCount = (member.nicknameChangeCount || 0) + 1;
    member.nicknameChangedAt = new Date();
    await member.save();
    console.log('✅ 닉네임 변경:', member.userId, '→', nickname, isFreeChange ? '(무료)' : '(유료)');
    res.json({
      success: true,
      message: isFreeChange 
        ? '닉네임이 변경되었습니다 (무료 변경 사용)' 
        : '닉네임이 변경되었습니다',
      data: {
        nickname: member.nickname,
        changeCount: member.nicknameChangeCount,
        remainingFreeChanges: Math.max(0, 1 - member.nicknameChangeCount)
      }
    });
  } catch (error) {
    console.error('닉네임 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '닉네임 변경 중 오류가 발생했습니다'
    });
  }
});
// ===== 닉네임 변경 가능 여부 확인 =====
router.get('/me/nickname-status', authMember, async (req, res) => {
  try {
    const member = await Member.findById(req.member._id);
    res.json({
      success: true,
      data: {
        currentNickname: member.nickname,
        changeCount: member.nicknameChangeCount || 0,
        lastChangedAt: member.nicknameChangedAt,
        canChangeFree: (member.nicknameChangeCount || 0) < 1,
        remainingFreeChanges: Math.max(0, 1 - (member.nicknameChangeCount || 0))
      }
    });
  } catch (error) {
    console.error('닉네임 상태 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '조회 중 오류가 발생했습니다'
    });
  }
});
// ===== 이메일 변경 - 인증 코드 요청 =====
router.post('/me/email/request', authMember, async (req, res) => {
  try {
    const { newEmail } = req.body;
    const memberId = req.member._id;
    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: '새 이메일 주소를 입력해주세요.'
      });
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }
    // 현재 회원 정보 조회
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원 정보를 찾을 수 없습니다.'
      });
    }
    // 현재 이메일과 같은지 확인
    if (member.email === newEmail) {
      return res.status(400).json({
        success: false,
        message: '현재 사용 중인 이메일과 동일합니다.'
      });
    }
    // 다른 회원이 사용 중인지 확인
    const existingMember = await Member.findOne({ email: newEmail, _id: { $ne: memberId } });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      });
    }
    // 발송 횟수 제한 체크 (하루 5회)
    const limitCheck = checkEmailRequestLimit(memberId.toString());
    if (!limitCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: '오늘 인증 코드 발송 횟수(5회)를 초과했습니다. 내일 다시 시도해주세요.'
      });
    }
    // 6자리 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10분 후 만료
    // 인증 코드 저장
    emailVerificationCodes.set(newEmail, {
      code,
      memberId: memberId.toString(),
      expiresAt
    });
    // 이메일 발송
     const result = await sendVerificationCode({
      toEmail: email,
      code,
      name: '회원'
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: '인증 코드 발송에 실패했습니다.'
      });
    }
    // 발송 횟수 증가
    incrementEmailRequestCount(memberId.toString());

    res.json({
      success: true,
      message: `인증 코드 발송 완료.\n(오늘 남은 횟수: ${limitCheck.remaining - 1}회)`
    });
  } catch (error) {
    console.error('이메일 인증 요청 오류:', error);
    res.status(500).json({
      success: false,
      message: '인증 코드 발송 중 오류가 발생했습니다.'
    });
  }
});
// ===== 이메일 변경 - 인증 코드 확인 =====
router.post('/me/email/verify', authMember, async (req, res) => {
  try {
    const { newEmail, code } = req.body;
    const memberId = req.member._id;
    if (!newEmail || !code) {
      return res.status(400).json({
        success: false,
        message: '이메일과 인증 코드를 입력해주세요.'
      });
    }
    // 저장된 인증 코드 확인
    const stored = emailVerificationCodes.get(newEmail);
    
    if (!stored) {
      return res.status(400).json({
        success: false,
        message: '인증 코드가 존재하지 않습니다. 다시 요청해주세요.'
      });
    }
    // 만료 확인
    if (Date.now() > stored.expiresAt) {
      emailVerificationCodes.delete(newEmail);
      return res.status(400).json({
        success: false,
        message: '인증 코드가 만료되었습니다. 다시 요청해주세요.'
      });
    }
    // 회원 ID 일치 확인
    if (stored.memberId !== memberId.toString()) {
      return res.status(400).json({
        success: false,
        message: '잘못된 인증 요청입니다.'
      });
    }
    // 코드 일치 확인
    if (stored.code !== code) {
      return res.status(400).json({
        success: false,
        message: '인증 코드가 일치하지 않습니다.'
      });
    }
    // 이메일 업데이트
    const member = await Member.findByIdAndUpdate(
      memberId,
      { email: newEmail },
      { new: true }
    );
    // 인증 코드 삭제
    emailVerificationCodes.delete(newEmail);
    res.json({
      success: true,
      message: '이메일이 변경되었습니다.',
      email: member.email
    });
  } catch (error) {
    console.error('이메일 인증 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '이메일 변경 중 오류가 발생했습니다.'
    });
  }
});
// ===== 프로필 조회 (memberId로) =====
router.get('/profile/:memberId', optionalAuth, async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const member = await Member.findById(memberId)
      .select('nickname userId profileImage memberType bio createdAt followers following')
      .lean();
    
    if (!member) {
      return res.status(404).json({ success: false, message: '회원을 찾을 수 없습니다' });
    }
    
    // 게시글/댓글 수 조회
    const Post = require('../models/Post');
    const Comment = require('../models/Comment');
    
    const [postCount, commentCount] = await Promise.all([
      Post.countDocuments({ author: memberId, isDeleted: false }),
      Comment.countDocuments({ author: memberId, isDeleted: false })
    ]);
    
    // 팔로워/팔로잉 수
    const followerCount = member.followers?.length || 0;
    const followingCount = member.following?.length || 0;
    
    // 내 프로필인지, 팔로우 중인지 확인
    let isMyProfile = false;
    let isFollowing = false;
    
    if (req.memberId) {
      isMyProfile = req.memberId.toString() === memberId;
      if (!isMyProfile) {
        isFollowing = member.followers?.some(f => f.toString() === req.memberId.toString()) || false;
      }
    }
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          userId: member.userId,
          profileImage: member.profileImage,
          memberType: member.memberType,
          bio: member.bio,
          createdAt: member.createdAt
        },
        postCount,
        commentCount,
        followerCount,
        followingCount,
        isMyProfile,
        isFollowing
      }
    });
    
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ success: false, message: '프로필을 불러올 수 없습니다' });
  }
});
// ===== 팔로우/언팔로우 =====
router.post('/:memberId/follow', authMember, async (req, res) => {
  try {
    const { memberId } = req.params;
    const myId = req.memberId;
    
    if (myId.toString() === memberId) {
      return res.status(400).json({ success: false, message: '자기 자신을 팔로우할 수 없습니다' });
    }
    
    const targetMember = await Member.findById(memberId);
    if (!targetMember) {
      return res.status(404).json({ success: false, message: '회원을 찾을 수 없습니다' });
    }
    
    const me = await Member.findById(myId);
    
    const isFollowing = me.following?.some(f => f.toString() === memberId) || false;
    
    if (isFollowing) {
      // 언팔로우
      await Member.findByIdAndUpdate(myId, { $pull: { following: memberId } });
      await Member.findByIdAndUpdate(memberId, { $pull: { followers: myId } });
    } else {
      // 팔로우
      await Member.findByIdAndUpdate(myId, { $addToSet: { following: memberId } });
      await Member.findByIdAndUpdate(memberId, { $addToSet: { followers: myId } });
    }
    
    // 업데이트된 팔로워 수
    const updatedTarget = await Member.findById(memberId);
    
    res.json({
      success: true,
      data: {
        isFollowing: !isFollowing,
        followerCount: updatedTarget.followers?.length || 0
      }
    });
    
  } catch (error) {
    console.error('팔로우 오류:', error);
    res.status(500).json({ success: false, message: '팔로우 처리에 실패했습니다' });
  }
});
// ===== 자기소개 업데이트 =====
router.put('/profile/bio', authMember, async (req, res) => {
  try {
    const { bio } = req.body;
    
    if (bio && bio.length > 200) {
      return res.status(400).json({ success: false, message: '자기소개는 200자 이내로 작성해주세요' });
    }
    
    await Member.findByIdAndUpdate(req.memberId, { bio: bio || '' });
    
    res.json({ success: true, message: '자기소개가 업데이트되었습니다' });
    
  } catch (error) {
    console.error('자기소개 업데이트 오류:', error);
    res.status(500).json({ success: false, message: '자기소개 업데이트에 실패했습니다' });
  }
});

// ===== 프로필 이미지 업로드 =====
router.post('/me/profile-image', authMember, profileUpload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '이미지 파일을 선택해주세요'
      });
    }

    const memberId = req.member._id;

    // Cloudinary에 업로드
    const result = await uploadProfileImage(req.file.buffer, memberId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || '이미지 업로드에 실패했습니다'
      });
    }

    // DB 업데이트
    const member = await Member.findByIdAndUpdate(
      memberId,
      { profileImage: result.url },
      { new: true }
    );

    console.log('✅ 프로필 이미지 업로드:', member.userId, result.url);

    res.json({
      success: true,
      message: '프로필 이미지가 변경되었습니다',
      data: {
        profileImage: result.url
      }
    });

  } catch (error) {
    console.error('프로필 이미지 업로드 오류:', error);
    res.status(500).json({
      success: false,
      message: '이미지 업로드 중 오류가 발생했습니다'
    });
  }
});

// ===== 닉네임 검색 (자동완성용) =====
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 1) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // 닉네임으로 검색 (대소문자 무시, 부분 일치)
    const members = await Member.find({
      nickname: { $regex: q, $options: 'i' },
      status: 'active'
    })
      .select('_id nickname profileImage memberType')
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      data: members
    });
    
  } catch (error) {
    console.error('회원 검색 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 검색에 실패했습니다'
    });
  }
});

// ===== 닉네임으로 회원의 배지 목록 조회 =====
router.get('/nickname/:nickname/badges', async (req, res) => {
  try {
    const { nickname } = req.params;
    
    // 닉네임으로 회원 조회
    const member = await Member.findOne({ nickname })
      .select('_id nickname profileImage memberType badges')
      .lean();
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }
    
    // 배지 목록 (member.badges가 없으면 빈 배열)
    const badges = member.badges || [];
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          profileImage: member.profileImage,
          memberType: member.memberType
        },
        badges
      }
    });
    
  } catch (error) {
    console.error('회원 배지 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '배지 목록을 불러올 수 없습니다'
    });
  }
});

// ===== 닉네임으로 회원의 게시글 목록 조회 =====
router.get('/nickname/:nickname/posts', async (req, res) => {
  try {
    const { nickname } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // 닉네임으로 회원 조회
    const member = await Member.findOne({ nickname })
      .select('_id nickname profileImage memberType')
      .lean();
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }
    
    const Post = require('../models/Post');
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [posts, total] = await Promise.all([
      Post.find({ author: member._id, isDeleted: false })
        .select('_id title content boardType viewCount likeCount commentCount createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Post.countDocuments({ author: member._id, isDeleted: false })
    ]);
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          profileImage: member.profileImage,
          memberType: member.memberType
        },
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('회원 게시글 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 목록을 불러올 수 없습니다'
    });
  }
});

// ===== 닉네임으로 회원의 댓글 목록 조회 =====
router.get('/nickname/:nickname/comments', async (req, res) => {
  try {
    const { nickname } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // 닉네임으로 회원 조회
    const member = await Member.findOne({ nickname })
      .select('_id nickname profileImage memberType')
      .lean();
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }
    
    const Comment = require('../models/Comment');
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [comments, total] = await Promise.all([
      Comment.find({ author: member._id, isDeleted: false })
        .populate('post', '_id title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Comment.countDocuments({ author: member._id, isDeleted: false })
    ]);
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          profileImage: member.profileImage,
          memberType: member.memberType
        },
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('회원 댓글 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '댓글 목록을 불러올 수 없습니다'
    });
  }
});

// ===== 닉네임으로 언급된 글/댓글 조회 =====
router.get('/nickname/:nickname/mentions', async (req, res) => {
  try {
    const { nickname } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // 닉네임으로 회원 조회
    const member = await Member.findOne({ nickname })
      .select('_id nickname profileImage memberType')
      .lean();
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }
    
    const Post = require('../models/Post');
    const Comment = require('../models/Comment');
    
    // @닉네임 패턴 (정규식)
    const mentionPattern = new RegExp(`@${nickname}(?:\\s|$|[^\\w가-힣])`, 'i');
    
    // 게시글에서 @닉네임이 언급된 것 조회
    const mentionedPosts = await Post.find({ 
      content: mentionPattern,
      isDeleted: false,
      author: { $ne: member._id } // 본인 글 제외
    })
      .populate('author', 'nickname profileImage memberType')
      .select('_id title content boardType viewCount likeCount commentCount createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    // 댓글에서 @닉네임이 언급된 것 조회
    const mentionedComments = await Comment.find({ 
      content: mentionPattern,
      isDeleted: false,
      author: { $ne: member._id } // 본인 댓글 제외
    })
      .populate('author', 'nickname profileImage memberType')
      .populate('post', '_id title')
      .select('_id content post author createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    // 통합 결과 (게시글 + 댓글)
    const allMentions = [
      ...mentionedPosts.map(post => ({
        type: 'post',
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        boardType: post.boardType,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt
      })),
      ...mentionedComments.map(comment => ({
        type: 'comment',
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        post: comment.post,
        createdAt: comment.createdAt
      }))
    ];
    
    // 최신순 정렬
    allMentions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 페이지네이션
    const total = allMentions.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMentions = allMentions.slice(skip, skip + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          profileImage: member.profileImage,
          memberType: member.memberType
        },
        mentions: paginatedMentions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('언급된 글 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '언급된 글을 불러올 수 없습니다'
    });
  }
});

// ===== 닉네임으로 프로필 조회 =====
router.get('/nickname/:nickname', optionalAuth, async (req, res) => {
  try {
    const { nickname } = req.params;
    
    const member = await Member.findOne({ nickname })
      .select('_id nickname userId profileImage memberType bio createdAt followers following')
      .lean();
    
    if (!member) {
      return res.status(404).json({ success: false, message: '회원을 찾을 수 없습니다' });
    }
    
    // 게시글/댓글 수 조회
    const Post = require('../models/Post');
    const Comment = require('../models/Comment');
    
    const [postCount, commentCount] = await Promise.all([
      Post.countDocuments({ author: member._id, isDeleted: false }),
      Comment.countDocuments({ author: member._id, isDeleted: false })
    ]);
    
    // 팔로워/팔로잉 수
    const followerCount = member.followers?.length || 0;
    const followingCount = member.following?.length || 0;
    
    // 내 프로필인지, 팔로우 중인지 확인
    let isMyProfile = false;
    let isFollowing = false;
    
    if (req.memberId) {
      isMyProfile = req.memberId.toString() === member._id.toString();
      if (!isMyProfile) {
        isFollowing = member.followers?.some(f => f.toString() === req.memberId.toString()) || false;
      }
    }
    
    res.json({
      success: true,
      data: {
        member: {
          _id: member._id,
          nickname: member.nickname,
          userId: member.userId,
          profileImage: member.profileImage,
          memberType: member.memberType,
          bio: member.bio,
          createdAt: member.createdAt
        },
        postCount,
        commentCount,
        followerCount,
        followingCount,
        isMyProfile,
        isFollowing
      }
    });
    
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ success: false, message: '프로필을 불러올 수 없습니다' });
  }
});

// ===== 회원가입 - 이메일 인증 코드 발송 =====
const registerEmailCodes = new Map(); // email -> { code, expiresAt }

router.post('/register/send-email-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일을 입력해주세요.'
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }

    // 이미 사용 중인 이메일인지 확인
    const existingMember = await Member.findOne({ email: email.toLowerCase() });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      });
    }

    // 6자리 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 인증 코드 저장 (5분 유효)
    registerEmailCodes.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // 이메일 발송
    const sent = await sendVerificationCode(email, code);
    if (!sent) {
      return res.status(500).json({
        success: false,
        message: '인증 코드 발송에 실패했습니다.'
      });
    }

    console.log('✅ 회원가입 이메일 인증코드 발송:', email);
    
    res.json({
      success: true,
      message: '인증 코드가 발송되었습니다. (5분 유효)'
    });

  } catch (error) {
    console.error('회원가입 이메일 인증 오류:', error);
    res.status(500).json({
      success: false,
      message: '인증 코드 발송 중 오류가 발생했습니다.'
    });
  }
});

// ===== 회원가입 - 이메일 인증 코드 확인 =====
router.post('/register/verify-email-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '이메일과 인증 코드를 입력해주세요.'
      });
    }

    const stored = registerEmailCodes.get(email.toLowerCase());

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: '인증 코드가 존재하지 않습니다. 다시 요청해주세요.'
      });
    }

    // 만료 확인
    if (Date.now() > stored.expiresAt) {
      registerEmailCodes.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: '인증 코드가 만료되었습니다. 다시 요청해주세요.'
      });
    }

    // 코드 일치 확인
    if (stored.code !== code) {
      return res.status(400).json({
        success: false,
        message: '인증 코드가 일치하지 않습니다.'
      });
    }

    // 인증 성공 - 코드는 삭제하지 않고 유지 (회원가입 완료 시 재검증용)
    // 대신 verified 플래그 추가
    registerEmailCodes.set(email.toLowerCase(), {
      ...stored,
      verified: true
    });

    console.log('✅ 회원가입 이메일 인증 완료:', email);

    res.json({
      success: true,
      message: '이메일 인증이 완료되었습니다.'
    });

  } catch (error) {
    console.error('회원가입 이메일 인증 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '인증 확인 중 오류가 발생했습니다.'
    });
  }
});

// ===== 당원번호 생성 함수 =====
async function generatePartyMemberNumber() {
  const year = new Date().getFullYear();
  const prefix = `FAIN-${year}-`;
  
  // 해당 연도의 마지막 당원번호 찾기
  const lastMember = await Member.findOne({
    partyMemberNumber: { $regex: `^${prefix}` }
  }).sort({ partyMemberNumber: -1 });
  
  let nextNumber = 1;
  if (lastMember && lastMember.partyMemberNumber) {
    const lastNumber = parseInt(lastMember.partyMemberNumber.split('-')[2]);
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${String(nextNumber).padStart(5, '0')}`;
}

// ===== 당원증 정보 조회 =====
router.get('/party-card', authMember, async (req, res) => {
  try {
    const memberId = req.member._id || req.memberId;
    const member = await Member.findById(memberId).select(
      'name nickname profileImage memberType partyMemberNumber createdAt approvedAt partyJoinedAt'
    );
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원 정보를 찾을 수 없습니다.'
      });
    }
    
    // 당원 이상만 당원증 발급 가능
    if (!['party_member', 'innovation_member', 'admin'].includes(member.memberType)) {
      return res.status(403).json({
        success: false,
        message: '당원 등급 이상만 당원증을 발급받을 수 있습니다.',
        data: {
          memberType: member.memberType,
          isEligible: false
        }
      });
    }
    
    // 당원번호가 없으면 생성
    if (!member.partyMemberNumber) {
      member.partyMemberNumber = await generatePartyMemberNumber();
      if (!member.partyJoinedAt) {
        member.partyJoinedAt = new Date();
      }
      await member.save();
    }
    
    res.json({
      success: true,
      data: {
        name: member.name,
        nickname: member.nickname,
        profileImage: member.profileImage,
        memberType: member.memberType,
        partyMemberNumber: member.partyMemberNumber,
        partyJoinedAt: member.partyJoinedAt || member.approvedAt || member.createdAt,
        isEligible: true
      }
    });
    
  } catch (error) {
    console.error('당원증 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '당원증 정보를 불러올 수 없습니다.'
    });
  }
});

// ===== 관리자: 당원 등급 변경 (당원번호 자동 부여) =====
router.put('/admin/upgrade-to-party/:memberId', authMember, async (req, res) => {
  try {
    // 관리자 권한 확인
    const admin = await Member.findById(req.member._id || req.memberId);
    if (!admin || admin.memberType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다.'
      });
    }
    
    const { memberId } = req.params;
    const { memberType } = req.body; // 'party_member' 또는 'innovation_member'
    
    if (!['party_member', 'innovation_member'].includes(memberType)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 등급입니다.'
      });
    }
    
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다.'
      });
    }
    
    // 당원번호 없으면 생성
    if (!member.partyMemberNumber) {
      member.partyMemberNumber = await generatePartyMemberNumber();
      member.partyJoinedAt = new Date();
    }
    
    member.memberType = memberType;
    await member.save();
    
    console.log(`✅ 당원 등급 변경: ${member.nickname} -> ${memberType} (${member.partyMemberNumber})`);
    
    res.json({
      success: true,
      message: `${member.nickname}님의 등급이 ${memberType === 'party_member' ? '당원' : '혁신당원'}으로 변경되었습니다.`,
      data: {
        memberId: member._id,
        nickname: member.nickname,
        memberType: member.memberType,
        partyMemberNumber: member.partyMemberNumber,
        partyJoinedAt: member.partyJoinedAt
      }
    });
    
  } catch (error) {
    console.error('당원 등급 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '등급 변경 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
