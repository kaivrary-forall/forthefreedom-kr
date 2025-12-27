const express = require('express');
const router = express.Router();
const AdminSlot = require('../models/AdminSlot');
const Member = require('../models/Member');
const { authMember } = require('../middleware/authMember');

// 전체 권한 목록 (시스템에서 사용 가능한 모든 권한)
const ALL_PERMISSIONS = [
  { key: 'notices:write', label: '공지사항 관리', category: '콘텐츠' },
  { key: 'spokesperson:write', label: '보도자료 관리', category: '콘텐츠' },
  { key: 'agora:write', label: '아고라 관리', category: '콘텐츠' },
  { key: 'banners:write', label: '배너 관리', category: '사이트' },
  { key: 'sidecards:write', label: '사이드카드 관리', category: '사이트' },
  { key: 'footer:write', label: '푸터 관리', category: '사이트' },
  { key: 'popup:write', label: '팝업 관리', category: '사이트' },
  { key: 'members:read', label: '회원 조회', category: '회원' },
  { key: 'members:write', label: '회원 관리', category: '회원' },
];

// ✅ 라우터 진입 로그
router.use((req, res, next) => {
  console.log('🟣 ADMIN-SLOTS ROUTER HIT:', req.method, req.originalUrl);
  next();
});

// ==========================================
// 슈퍼관리자(canManageSlots) 전용 미들웨어
// ==========================================
const checkSlotManager = async (req, res, next) => {
  try {
    if (!req.member) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
    }

    // 현재 사용자의 슬롯 조회
    const mySlot = await AdminSlot.findOne({ 
      assignedMemberId: req.member._id,
      isActive: true
    });

    if (!mySlot || !mySlot.canManageSlots) {
      return res.status(403).json({
        success: false,
        message: '의자 관리 권한이 없습니다 (admin_00 전용)'
      });
    }

    req.adminSlot = mySlot;
    next();
  } catch (error) {
    console.error('슬롯 관리자 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '권한 확인 중 오류가 발생했습니다'
    });
  }
};

// ==========================================
// 초기 슬롯 생성 (1회용 seed) - SETUP KEY 필요
// ==========================================
router.post('/seed', async (req, res) => {
  console.log('🔥 seed hit', new Date().toISOString(), req.originalUrl);
  
  try {
    // 셋업 키 확인
    const key = req.headers['x-setup-key'];
    const setupKey = process.env.ADMIN_SETUP_KEY || 'freeinno-setup-2025';
    
    if (key !== setupKey) {
      console.log('❌ seed: 셋업 키 불일치');
      return res.status(401).json({
        success: false,
        message: '셋업 키가 필요합니다 (x-setup-key 헤더)'
      });
    }

    // 이미 슬롯이 있으면 스킵
    const existing = await AdminSlot.countDocuments();
    if (existing > 0) {
      return res.json({
        success: false,
        message: '이미 슬롯이 존재합니다'
      });
    }

    const defaultSlots = [
      {
        slotId: 'admin_00',
        slotName: '슈퍼관리자',
        description: '전체 시스템 관리 권한 + 의자 배치 권한',
        permissions: ['*'],
        canManageSlots: true,
        isActive: true
      },
      {
        slotId: 'admin_01',
        slotName: '콘텐츠 관리자',
        description: '공지사항, 보도자료, 아고라 관리',
        permissions: ['notices:write', 'spokesperson:write', 'agora:write'],
        canManageSlots: false,
        isActive: true
      },
      {
        slotId: 'admin_02',
        slotName: '사이트 관리자',
        description: '배너, 사이드카드, 푸터 관리',
        permissions: ['banners:write', 'sidecards:write', 'footer:write'],
        canManageSlots: false,
        isActive: true
      },
      {
        slotId: 'admin_03',
        slotName: '회원 관리자',
        description: '회원 승인, 관리',
        permissions: ['members:read', 'members:write'],
        canManageSlots: false,
        isActive: true
      }
    ];

    await AdminSlot.insertMany(defaultSlots);

    console.log('✅ 기본 관리자 슬롯 생성 완료');

    res.json({
      success: true,
      message: '기본 슬롯이 생성되었습니다',
      data: defaultSlots
    });
  } catch (error) {
    console.error('슬롯 seed 오류:', error);
    res.status(500).json({
      success: false,
      message: '슬롯 생성 중 오류가 발생했습니다'
    });
  }
});

// ==========================================
// 초기 admin_00 배정 (1회용 bootstrap) - SETUP KEY 필요
// ==========================================
router.post('/bootstrap', async (req, res) => {
  console.log('🔥 bootstrap hit', new Date().toISOString(), req.originalUrl);
  
  try {
    // 셋업 키 확인
    const key = req.headers['x-setup-key'];
    const setupKey = process.env.ADMIN_SETUP_KEY || 'freeinno-setup-2025';
    
    if (key !== setupKey) {
      console.log('❌ bootstrap: 셋업 키 불일치');
      return res.status(401).json({
        success: false,
        message: '셋업 키가 필요합니다 (x-setup-key 헤더)'
      });
    }

    const { memberId } = req.body;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'memberId가 필요합니다'
      });
    }

    // admin_00 슬롯 조회
    const slot = await AdminSlot.findOne({ slotId: 'admin_00' });
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'admin_00 슬롯이 없습니다. 먼저 /seed를 실행하세요.'
      });
    }

    // 이미 배정되어 있으면
    if (slot.assignedMemberId) {
      return res.status(400).json({
        success: false,
        message: 'admin_00에 이미 회원이 배정되어 있습니다'
      });
    }

    // 회원 조회
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    // 배정
    slot.assignedMemberId = memberId;
    slot.assignedAt = new Date();
    slot.assignedBy = 'bootstrap';
    slot.note = '초기 설정';
    await slot.save();

    // 회원의 role/isAdmin 업데이트
    member.role = 'admin';
    member.isAdmin = true;
    await member.save();

    console.log(`✅ Bootstrap 완료: admin_00 ← ${member.userId}`);

    res.json({
      success: true,
      message: `${member.nickname}님을 슈퍼관리자(admin_00)에 배정했습니다`,
      data: {
        slotId: slot.slotId,
        memberId: member._id,
        userId: member.userId,
        nickname: member.nickname
      }
    });
  } catch (error) {
    console.error('Bootstrap 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Bootstrap 중 오류가 발생했습니다'
    });
  }
});

// ==========================================
// 전체 권한 목록 조회
// ==========================================
router.get('/permissions', authMember, checkSlotManager, async (req, res) => {
  try {
    res.json({
      success: true,
      data: ALL_PERMISSIONS
    });
  } catch (error) {
    console.error('권한 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '권한 목록을 불러올 수 없습니다'
    });
  }
});

// ==========================================
// 회원 검색 (배정용) - /:slotId 보다 먼저
// ==========================================
router.get('/search/members', authMember, checkSlotManager, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const members = await Member.find({
      $or: [
        { userId: new RegExp(q, 'i') },
        { nickname: new RegExp(q, 'i') },
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') }
      ],
      status: 'active'
    })
    .select('_id userId nickname name email')
    .limit(10);

    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('회원 검색 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 검색 중 오류가 발생했습니다'
    });
  }
});

// ==========================================
// 슬롯 목록 조회 (슈퍼관리자만)
// ==========================================
router.get('/', authMember, checkSlotManager, async (req, res) => {
  try {
    const slots = await AdminSlot.find()
      .populate('assignedMemberId', 'userId nickname name email')
      .sort({ slotId: 1 });

    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('슬롯 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '슬롯 목록을 불러올 수 없습니다'
    });
  }
});

// ==========================================
// 슬롯 상세 조회
// ==========================================
router.get('/:slotId', authMember, checkSlotManager, async (req, res) => {
  try {
    const slot = await AdminSlot.findOne({ slotId: req.params.slotId })
      .populate('assignedMemberId', 'userId nickname name email phone');

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: '슬롯을 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: slot
    });
  } catch (error) {
    console.error('슬롯 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '슬롯 정보를 불러올 수 없습니다'
    });
  }
});

// ==========================================
// 슬롯 권한 수정
// ==========================================
router.put('/:slotId/permissions', authMember, checkSlotManager, async (req, res) => {
  try {
    const { permissions, slotName, description } = req.body;

    // 슬롯 조회
    const slot = await AdminSlot.findOne({ slotId: req.params.slotId });
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: '슬롯을 찾을 수 없습니다'
      });
    }

    // admin_00의 권한은 수정 불가 (항상 전체 권한)
    if (slot.slotId === 'admin_00') {
      return res.status(400).json({
        success: false,
        message: '슈퍼관리자(admin_00)의 권한은 수정할 수 없습니다'
      });
    }

    // 권한 유효성 검사
    const validPermissions = ALL_PERMISSIONS.map(p => p.key);
    const invalidPerms = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPerms.length > 0) {
      return res.status(400).json({
        success: false,
        message: `잘못된 권한이 포함되어 있습니다: ${invalidPerms.join(', ')}`
      });
    }

    // 업데이트
    slot.permissions = permissions;
    if (slotName) slot.slotName = slotName;
    if (description) slot.description = description;
    await slot.save();

    console.log(`✅ 슬롯 권한 수정: ${slot.slotId} → [${permissions.join(', ')}]`);

    res.json({
      success: true,
      message: `${slot.slotName}(${slot.slotId})의 권한이 수정되었습니다`,
      data: slot
    });
  } catch (error) {
    console.error('슬롯 권한 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '슬롯 권한 수정 중 오류가 발생했습니다'
    });
  }
});

// ==========================================
// 회원을 슬롯에 배정
// ==========================================
router.put('/:slotId/assign', authMember, checkSlotManager, async (req, res) => {
  try {
    const { memberId, note } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: '배정할 회원 ID가 필요합니다'
      });
    }

    // 슬롯 조회
    const slot = await AdminSlot.findOne({ slotId: req.params.slotId });
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: '슬롯을 찾을 수 없습니다'
      });
    }

    // 회원 조회
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    // 이미 다른 슬롯에 배정된 회원인지 확인
    const existingSlot = await AdminSlot.findOne({ 
      assignedMemberId: memberId,
      slotId: { $ne: req.params.slotId }
    });
    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: `이 회원은 이미 ${existingSlot.slotId}에 배정되어 있습니다`
      });
    }

    // 배정
    slot.assignedMemberId = memberId;
    slot.assignedAt = new Date();
    slot.assignedBy = req.member.userId || req.member.nickname;
    slot.note = note || '';
    await slot.save();

    // 회원의 role/isAdmin도 업데이트 (호환성)
    member.role = 'admin';
    member.isAdmin = true;
    await member.save();

    console.log(`✅ 슬롯 배정: ${slot.slotId} ← ${member.userId} (by ${slot.assignedBy})`);

    res.json({
      success: true,
      message: `${member.nickname}님을 ${slot.slotName}(${slot.slotId})에 배정했습니다`,
      data: slot
    });
  } catch (error) {
    console.error('슬롯 배정 오류:', error);
    res.status(500).json({
      success: false,
      message: '슬롯 배정 중 오류가 발생했습니다'
    });
  }
});

// ==========================================
// 슬롯에서 회원 해제
// ==========================================
router.put('/:slotId/unassign', authMember, checkSlotManager, async (req, res) => {
  try {
    const slot = await AdminSlot.findOne({ slotId: req.params.slotId });
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: '슬롯을 찾을 수 없습니다'
      });
    }

    if (!slot.assignedMemberId) {
      return res.status(400).json({
        success: false,
        message: '이 슬롯에 배정된 회원이 없습니다'
      });
    }

    // 본인 슬롯은 해제 불가 (잠금 방지)
    if (slot.assignedMemberId.toString() === req.member._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '본인의 슬롯은 해제할 수 없습니다'
      });
    }

    // 회원의 role/isAdmin 원복 (다른 슬롯이 없으면)
    const member = await Member.findById(slot.assignedMemberId);
    if (member) {
      const otherSlot = await AdminSlot.findOne({
        assignedMemberId: member._id,
        slotId: { $ne: slot.slotId }
      });
      if (!otherSlot) {
        member.role = 'member';
        member.isAdmin = false;
        await member.save();
      }
    }

    const previousMember = member ? member.nickname : '(알수없음)';

    // 해제
    slot.assignedMemberId = null;
    slot.assignedAt = null;
    slot.assignedBy = null;
    slot.note = '';
    await slot.save();

    console.log(`✅ 슬롯 해제: ${slot.slotId} (${previousMember})`);

    res.json({
      success: true,
      message: `${slot.slotName}(${slot.slotId})에서 회원을 해제했습니다`,
      data: slot
    });
  } catch (error) {
    console.error('슬롯 해제 오류:', error);
    res.status(500).json({
      success: false,
      message: '슬롯 해제 중 오류가 발생했습니다'
    });
  }
});

module.exports = router;
