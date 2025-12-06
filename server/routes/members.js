const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const Member = require('../models/Member');
const { generateToken, authMember } = require('../middleware/authMember');
const { ADMIN_CREDENTIALS } = require('./auth');
const { sendVerificationCode, generateVerificationCode } = require('../utils/email');
const { uploadProfileImage } = require('../utils/cloudinary');

// 프로필 이미지 업로드 설정 (메모리 저장, 2MB 제한)
const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'), false);
    }
  }
});

// 이메일 인증 코드 임시 저장소 (메모리, 5분 만료)
const emailVerificationCodes = new Map();

// 만료된 인증 코드 정리 (5분마다)
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of emailVerificationCodes.entries()) {
    if (now > data.expiresAt) {
      emailVerificationCodes.delete(key);
    }
  }
}, 5 * 60 * 1000);

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
      status: 'pending', // 승인 대기 상태
      appliedAt: new Date()
    });

    await member.save();

    console.log('✅ 회원가입 신청:', member.userId, member.nickname);

    res.status(201).json({
      success: true,
      message: '회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인하실 수 있습니다.',
      data: {
        userId: member.userId,
        nickname: member.nickname,
        name: member.name,
        status: member.status,
        appliedAt: member.appliedAt
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

    // 토큰 생성
    const token = generateToken(member._id);

    console.log('✅ 로그인:', member.userId);

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
          memberType: member.memberType,
          status: member.status
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
    const { phone, address, addressDetail, zipCode, birthDate } = req.body;

    // 수정 가능한 필드만 업데이트 (이름, 이메일은 별도 인증 필요)
    const updateData = {};
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

// ===== 이메일 인증 코드 요청 =====
router.post('/me/email/request', authMember, async (req, res) => {
  try {
    const { newEmail } = req.body;
    const memberId = req.member._id.toString();

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: '새 이메일 주소를 입력해주세요'
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다'
      });
    }

    // 현재 이메일과 동일한지 확인
    if (newEmail.toLowerCase() === req.member.email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: '현재 사용 중인 이메일과 동일합니다'
      });
    }

    // 다른 회원이 사용 중인 이메일인지 확인
    const existingMember = await Member.findOne({ 
      email: newEmail.toLowerCase(),
      _id: { $ne: req.member._id }
    });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: '이미 사용 중인 이메일입니다'
      });
    }

    // 인증 코드 생성 (6자리)
    const code = generateVerificationCode();
    
    // 저장 (5분 만료)
    emailVerificationCodes.set(memberId, {
      email: newEmail.toLowerCase(),
      code: code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5분
      attempts: 0
    });

    // 이메일 발송
    const sent = await sendVerificationCode(newEmail, code);
    
    if (!sent) {
      emailVerificationCodes.delete(memberId);
      return res.status(500).json({
        success: false,
        message: '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'
      });
    }

    console.log('✅ 이메일 인증 코드 발송:', req.member.userId, '→', newEmail);

    res.json({
      success: true,
      message: '인증 코드가 발송되었습니다. 이메일을 확인해주세요.',
      data: {
        email: newEmail,
        expiresIn: 300 // 5분 (초)
      }
    });

  } catch (error) {
    console.error('이메일 인증 요청 오류:', error);
    res.status(500).json({
      success: false,
      message: '인증 요청 중 오류가 발생했습니다'
    });
  }
});

// ===== 이메일 인증 코드 확인 및 변경 =====
router.post('/me/email/verify', authMember, async (req, res) => {
  try {
    const { code } = req.body;
    const memberId = req.member._id.toString();

    if (!code) {
      return res.status(400).json({
        success: false,
        message: '인증 코드를 입력해주세요'
      });
    }

    // 저장된 인증 정보 확인
    const verificationData = emailVerificationCodes.get(memberId);
    
    if (!verificationData) {
      return res.status(400).json({
        success: false,
        message: '인증 요청 내역이 없습니다. 다시 인증 코드를 요청해주세요.'
      });
    }

    // 만료 확인
    if (Date.now() > verificationData.expiresAt) {
      emailVerificationCodes.delete(memberId);
      return res.status(400).json({
        success: false,
        message: '인증 코드가 만료되었습니다. 다시 요청해주세요.'
      });
    }

    // 시도 횟수 제한 (5회)
    if (verificationData.attempts >= 5) {
      emailVerificationCodes.delete(memberId);
      return res.status(400).json({
        success: false,
        message: '인증 시도 횟수를 초과했습니다. 다시 요청해주세요.'
      });
    }

    // 코드 확인
    if (code !== verificationData.code) {
      verificationData.attempts++;
      return res.status(400).json({
        success: false,
        message: `인증 코드가 일치하지 않습니다. (${5 - verificationData.attempts}회 남음)`
      });
    }

    // 이메일 변경
    const oldEmail = req.member.email;
    const newEmail = verificationData.email;

    await Member.findByIdAndUpdate(req.member._id, {
      email: newEmail
    });

    // 인증 정보 삭제
    emailVerificationCodes.delete(memberId);

    console.log('✅ 이메일 변경 완료:', req.member.userId, oldEmail, '→', newEmail);

    res.json({
      success: true,
      message: '이메일이 성공적으로 변경되었습니다.',
      data: {
        email: newEmail
      }
    });

  } catch (error) {
    console.error('이메일 인증 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '이메일 변경 중 오류가 발생했습니다'
    });
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

    const memberId = req.member._id.toString();

    // Cloudinary에 업로드
    const result = await uploadProfileImage(req.file.buffer, memberId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: '이미지 업로드에 실패했습니다'
      });
    }

    // DB에 이미지 URL 저장
    await Member.findByIdAndUpdate(req.member._id, {
      profileImage: result.url
    });

    console.log('✅ 프로필 이미지 변경:', req.member.userId, result.url);

    res.json({
      success: true,
      message: '프로필 이미지가 변경되었습니다',
      data: {
        profileImage: result.url
      }
    });

  } catch (error) {
    console.error('프로필 이미지 업로드 오류:', error);
    
    // Multer 에러 처리
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '이미지 크기는 2MB 이하만 가능합니다'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '프로필 이미지 업로드 중 오류가 발생했습니다'
    });
  }
});

// ===== 프로필 이미지 삭제 =====
router.delete('/me/profile-image', authMember, async (req, res) => {
  try {
    await Member.findByIdAndUpdate(req.member._id, {
      profileImage: ''
    });

    console.log('✅ 프로필 이미지 삭제:', req.member.userId);

    res.json({
      success: true,
      message: '프로필 이미지가 삭제되었습니다'
    });

  } catch (error) {
    console.error('프로필 이미지 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로필 이미지 삭제 중 오류가 발생했습니다'
    });
  }
});

module.exports = router;
