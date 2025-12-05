const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { auth } = require('../middleware/auth');

// 모든 라우트에 관리자 인증 적용
router.use(auth);

// ===== 회원 목록 조회 =====
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      memberType,
      withdrawalType,
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'appliedAt',
      sortOrder = 'desc'
    } = req.query;

    // 필터 조건
    const filter = {};
    if (status) filter.status = status;
    if (memberType) filter.memberType = memberType;
    if (withdrawalType) filter.withdrawalType = withdrawalType;
    if (search) {
      filter.$or = [
        { userId: { $regex: search, $options: 'i' } },
        { nickname: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // 정렬
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // 페이지네이션
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [members, total] = await Promise.all([
      Member.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password -passwordResetToken -passwordResetExpires'),
      Member.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        members,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('회원 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 목록 조회 중 오류가 발생했습니다'
    });
  }
});

// ===== 승인 대기 목록 =====
router.get('/pending', async (req, res) => {
  try {
    const members = await Member.find({ status: 'pending' })
      .sort({ appliedAt: -1 })
      .select('-password -passwordResetToken -passwordResetExpires');

    res.json({
      success: true,
      data: members,
      count: members.length
    });

  } catch (error) {
    console.error('승인 대기 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '승인 대기 목록 조회 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 통계 =====
router.get('/stats', async (req, res) => {
  try {
    const [
      // 전체
      totalCount,
      // 회원 유형별 (memberType이 없거나 null인 경우 general로 간주)
      generalCount,
      partyMemberCount,
      innovationMemberCount,
      // 상태별
      pendingCount,
      activeCount,
      suspendedCount,
      // 탈퇴 유형별 (withdrawalType이 없거나 null인 경우 self로 간주)
      withdrawnSelfCount,
      withdrawnForcedCount
    ] = await Promise.all([
      // 전체
      Member.countDocuments(),
      // 회원 유형별 - general은 명시적 general 또는 필드가 없는/null인 경우
      Member.countDocuments({ $or: [
        { memberType: 'general' },
        { memberType: { $exists: false } },
        { memberType: null }
      ]}),
      Member.countDocuments({ memberType: 'party_member' }),
      Member.countDocuments({ memberType: 'innovation_member' }),
      // 상태별
      Member.countDocuments({ status: 'pending' }),
      Member.countDocuments({ status: 'active' }),
      Member.countDocuments({ status: 'suspended' }),
      // 탈퇴 유형별 - self는 명시적 self 또는 필드가 없는/null인 경우
      Member.countDocuments({ 
        status: 'withdrawn', 
        $or: [
          { withdrawalType: 'self' },
          { withdrawalType: { $exists: false } },
          { withdrawalType: null }
        ]
      }),
      Member.countDocuments({ status: 'withdrawn', withdrawalType: 'forced' })
    ]);

    res.json({
      success: true,
      data: {
        // 전체
        total: totalCount,
        // 회원 유형별
        general: generalCount,
        partyMember: partyMemberCount,
        innovationMember: innovationMemberCount,
        // 상태별
        pending: pendingCount,
        active: activeCount,
        suspended: suspendedCount,
        // 탈퇴 유형별
        withdrawnSelf: withdrawnSelfCount,
        withdrawnForced: withdrawnForcedCount
      }
    });

  } catch (error) {
    console.error('회원 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 통계 조회 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 상세 조회 =====
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .select('-password -passwordResetToken -passwordResetExpires');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      data: member
    });

  } catch (error) {
    console.error('회원 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 조회 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 가입 승인 =====
router.put('/:id/approve', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    if (member.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '승인 대기 상태의 회원만 승인할 수 있습니다'
      });
    }

    member.status = 'active';
    member.approvedAt = new Date();
    member.approvedBy = req.user.id; // 관리자 ID
    await member.save();

    console.log('✅ 회원 승인:', member.email, 'by', req.user.username);

    // TODO: 승인 완료 이메일 발송

    res.json({
      success: true,
      message: '회원 가입이 승인되었습니다',
      data: member
    });

  } catch (error) {
    console.error('회원 승인 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 승인 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 가입 반려 =====
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    if (member.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '승인 대기 상태의 회원만 반려할 수 있습니다'
      });
    }

    member.status = 'withdrawn'; // 또는 별도의 'rejected' 상태
    member.rejectedAt = new Date();
    member.rejectedBy = req.user.id;
    member.rejectReason = reason || '';
    await member.save();

    console.log('❌ 회원 반려:', member.email, 'by', req.user.username);

    // TODO: 반려 안내 이메일 발송

    res.json({
      success: true,
      message: '회원 가입이 반려되었습니다',
      data: member
    });

  } catch (error) {
    console.error('회원 반려 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 반려 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 상태 변경 =====
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'active', 'suspended', 'withdrawn'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 상태입니다'
      });
    }

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    const oldStatus = member.status;
    member.status = status;
    await member.save();

    console.log(`✅ 회원 상태 변경: ${member.email} (${oldStatus} → ${status}) by ${req.user.username}`);

    res.json({
      success: true,
      message: '회원 상태가 변경되었습니다',
      data: member
    });

  } catch (error) {
    console.error('회원 상태 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '상태 변경 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 유형 변경 (일반/당원/혁신당원) =====
router.put('/:id/member-type', async (req, res) => {
  try {
    const { memberType } = req.body;

    if (!['general', 'party_member', 'innovation_member'].includes(memberType)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 회원 유형입니다'
      });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { memberType },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    console.log(`✅ 회원 유형 변경: ${member.email} → ${memberType} by ${req.user.username}`);

    res.json({
      success: true,
      message: '회원 유형이 변경되었습니다',
      data: member
    });

  } catch (error) {
    console.error('회원 유형 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '유형 변경 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 정보 수정 (관리자) =====
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, address, addressDetail, zipCode, birthDate } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (addressDetail !== undefined) updateData.addressDetail = addressDetail;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (birthDate !== undefined) updateData.birthDate = birthDate;

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    console.log('✅ 회원 정보 수정:', member.email, 'by', req.user.username);

    res.json({
      success: true,
      message: '회원 정보가 수정되었습니다',
      data: member
    });

  } catch (error) {
    console.error('회원 정보 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '정보 수정 중 오류가 발생했습니다'
    });
  }
});

// ===== 회원 삭제 (완전 삭제) =====
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다'
      });
    }

    console.log('🗑️ 회원 삭제:', member.email, 'by', req.user.username);

    res.json({
      success: true,
      message: '회원이 삭제되었습니다'
    });

  } catch (error) {
    console.error('회원 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원 삭제 중 오류가 발생했습니다'
    });
  }
});

// ===== 일괄 승인 =====
router.post('/bulk-approve', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '승인할 회원을 선택해주세요'
      });
    }

    const result = await Member.updateMany(
      { _id: { $in: ids }, status: 'pending' },
      { 
        status: 'active',
        approvedAt: new Date(),
        approvedBy: req.user.id
      }
    );

    console.log(`✅ 일괄 승인: ${result.modifiedCount}명 by ${req.user.username}`);

    res.json({
      success: true,
      message: `${result.modifiedCount}명의 회원이 승인되었습니다`,
      count: result.modifiedCount
    });

  } catch (error) {
    console.error('일괄 승인 오류:', error);
    res.status(500).json({
      success: false,
      message: '일괄 승인 중 오류가 발생했습니다'
    });
  }
});

module.exports = router;
