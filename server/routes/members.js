const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { generateToken, authMember } = require('../middleware/authMember');

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

    // 회원 조회 (비밀번호 포함)
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
    const { name, phone, address, addressDetail, zipCode, birthDate } = req.body;

    // 수정 가능한 필드만 업데이트
    const updateData = {};
    if (name) updateData.name = name;
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

    console.log('✅ 정보 수정:', member.email);

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

module.exports = router;
