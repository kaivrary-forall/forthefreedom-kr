const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const Position = require('../models/Position');
const Member = require('../models/Member');

// ============================================
// 조직도 전체 조회 (트리 구조)
// GET /api/orgchart
// GET /api/orgchart?category=central
// ============================================
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    // 카테고리 필터 (없으면 전체)
    const categoryFilter = category ? { category } : {};
    
    // 독립 직책들 (조직에 속하지 않은)
    const independentPositions = await Position.find({ 
      organizationId: null,
      isActive: true,
      ...categoryFilter
    })
    .populate('memberId', 'name username profileImage')
    .sort({ order: 1 });
    
    // 최상위 조직들
    const topOrganizations = await Organization.find({ 
      parentId: null,
      isActive: true,
      ...categoryFilter
    }).sort({ order: 1 });
    
    // 재귀적으로 하위 조직과 직책 가져오기
    const buildTree = async (org) => {
      const children = await Organization.find({ 
        parentId: org._id,
        isActive: true 
      }).sort({ order: 1 });
      
      const positions = await Position.find({ 
        organizationId: org._id,
        isActive: true 
      })
      .populate('memberId', 'name username profileImage')
      .sort({ order: 1 });
      
      const childTrees = await Promise.all(children.map(buildTree));
      
      return {
        ...org.toObject(),
        positions,
        children: childTrees
      };
    };
    
    const organizationTrees = await Promise.all(topOrganizations.map(buildTree));
    
    res.json({
      success: true,
      data: {
        independentPositions,
        organizations: organizationTrees
      }
    });
  } catch (error) {
    console.error('조직도 조회 오류:', error);
    res.status(500).json({ success: false, error: '조직도 조회에 실패했습니다.' });
  }
});

// ============================================
// 조직 CRUD
// ============================================

// 조직 목록 조회
router.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.find({ isActive: true })
      .sort({ order: 1 });
    res.json({ success: true, data: organizations });
  } catch (error) {
    res.status(500).json({ success: false, error: '조직 목록 조회 실패' });
  }
});

// 조직 생성
router.post('/organizations', async (req, res) => {
  try {
    const lastOrg = await Organization.findOne().sort({ order: -1 });
    const newOrder = lastOrg ? lastOrg.order + 1 : 0;
    
    const organization = new Organization({
      ...req.body,
      order: req.body.order ?? newOrder
    });
    
    await organization.save();
    res.status(201).json({ success: true, data: organization });
  } catch (error) {
    console.error('조직 생성 오류:', error);
    res.status(500).json({ success: false, error: '조직 생성에 실패했습니다.' });
  }
});

// 조직 수정
router.put('/organizations/:id', async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!organization) {
      return res.status(404).json({ success: false, error: '조직을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, error: '조직 수정에 실패했습니다.' });
  }
});

// 조직 삭제 (소프트 삭제)
router.delete('/organizations/:id', async (req, res) => {
  try {
    // 하위 조직이 있는지 확인
    const hasChildren = await Organization.exists({ parentId: req.params.id, isActive: true });
    if (hasChildren) {
      return res.status(400).json({ 
        success: false, 
        error: '하위 조직이 있어 삭제할 수 없습니다. 먼저 하위 조직을 삭제해주세요.' 
      });
    }
    
    // 소속 직책이 있는지 확인
    const hasPositions = await Position.exists({ organizationId: req.params.id, isActive: true });
    if (hasPositions) {
      return res.status(400).json({ 
        success: false, 
        error: '소속 직책이 있어 삭제할 수 없습니다. 먼저 직책을 삭제해주세요.' 
      });
    }
    
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!organization) {
      return res.status(404).json({ success: false, error: '조직을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, message: '조직이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: '조직 삭제에 실패했습니다.' });
  }
});

// ============================================
// 직책 CRUD
// ============================================

// 직책 목록 조회
router.get('/positions', async (req, res) => {
  try {
    const { organizationId } = req.query;
    const query = { isActive: true };
    
    if (organizationId === 'null' || organizationId === 'independent') {
      query.organizationId = null;
    } else if (organizationId) {
      query.organizationId = organizationId;
    }
    
    const positions = await Position.find(query)
      .populate('memberId', 'name username profileImage')
      .populate('organizationId', 'name')
      .sort({ order: 1 });
      
    res.json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, error: '직책 목록 조회 실패' });
  }
});

// 직책 상세 조회
router.get('/positions/:id', async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('memberId', 'name username profileImage bio')
      .populate('organizationId', 'name');
      
    if (!position) {
      return res.status(404).json({ success: false, error: '직책을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: position });
  } catch (error) {
    res.status(500).json({ success: false, error: '직책 조회 실패' });
  }
});

// 직책 생성
router.post('/positions', async (req, res) => {
  try {
    const lastPos = await Position.findOne({ organizationId: req.body.organizationId || null })
      .sort({ order: -1 });
    const newOrder = lastPos ? lastPos.order + 1 : 0;
    
    const position = new Position({
      ...req.body,
      order: req.body.order ?? newOrder
    });
    
    await position.save();
    
    // populate 해서 반환
    const populated = await Position.findById(position._id)
      .populate('memberId', 'name username profileImage')
      .populate('organizationId', 'name');
    
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('직책 생성 오류:', error);
    res.status(500).json({ success: false, error: '직책 생성에 실패했습니다.' });
  }
});

// 직책 수정
router.put('/positions/:id', async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('memberId', 'name username profileImage')
    .populate('organizationId', 'name');
    
    if (!position) {
      return res.status(404).json({ success: false, error: '직책을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: position });
  } catch (error) {
    res.status(500).json({ success: false, error: '직책 수정에 실패했습니다.' });
  }
});

// 직책에 회원 연결
router.put('/positions/:id/assign', async (req, res) => {
  try {
    const { memberId } = req.body;
    
    // memberId가 null이면 연결 해제
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { memberId: memberId || null },
      { new: true }
    )
    .populate('memberId', 'name username profileImage')
    .populate('organizationId', 'name');
    
    if (!position) {
      return res.status(404).json({ success: false, error: '직책을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: position });
  } catch (error) {
    res.status(500).json({ success: false, error: '회원 연결에 실패했습니다.' });
  }
});

// 직책 삭제 (소프트 삭제)
router.delete('/positions/:id', async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!position) {
      return res.status(404).json({ success: false, error: '직책을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, message: '직책이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: '직책 삭제에 실패했습니다.' });
  }
});

// ============================================
// 순서 변경
// ============================================

// 조직 순서 변경
router.post('/organizations/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // [{ id: '...', order: 0 }, ...]
    
    await Promise.all(orders.map(item => 
      Organization.findByIdAndUpdate(item.id, { order: item.order })
    ));
    
    res.json({ success: true, message: '순서가 변경되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: '순서 변경에 실패했습니다.' });
  }
});

// 직책 순서 변경
router.post('/positions/reorder', async (req, res) => {
  try {
    const { orders } = req.body;
    
    await Promise.all(orders.map(item => 
      Position.findByIdAndUpdate(item.id, { order: item.order })
    ));
    
    res.json({ success: true, message: '순서가 변경되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: '순서 변경에 실패했습니다.' });
  }
});

// ============================================
// 시드 데이터 (초기 데이터 생성)
// ============================================
router.post('/seed', async (req, res) => {
  try {
    // 이미 데이터가 있는지 확인
    const existingOrg = await Organization.findOne();
    if (existingOrg) {
      return res.status(400).json({ 
        success: false, 
        error: '이미 조직도 데이터가 존재합니다.' 
      });
    }
    
    // 최고위원회 생성 (중앙당)
    const supreme = await Organization.create({
      name: '최고위원회',
      category: 'central',
      order: 0,
      color: 'red'
    });
    
    // 부정선거척결위원회 생성 (중앙당)
    const election = await Organization.create({
      name: '부정선거척결위원회',
      category: 'central',
      order: 1,
      color: 'purple'
    });
    
    // 직능위원회들 생성
    const committees = await Organization.create([
      { name: '국제위원회', category: 'committee', order: 0, color: 'blue' },
      { name: '홍보위원회', category: 'committee', order: 1, color: 'orange' },
      { name: '정책위원회', category: 'committee', order: 2, color: 'green' },
      { name: '교육위원회', category: 'committee', order: 3, color: 'purple' },
      { name: '장애인위원회', category: 'committee', order: 4, color: 'blue' }
    ]);
    
    // 직책들 생성
    await Position.create([
      // 독립 직책 (중앙당)
      { name: '당 대표', category: 'central', organizationId: null, order: 0, level: 1, badgeColor: 'red', displayName: '황교안', subtitle: '제44대 국무총리' },
      
      // 최고위원회
      { name: '최고위원', organizationId: supreme._id, order: 0, level: 2, badgeColor: 'red', displayName: '김상현' },
      { name: '최고위원', organizationId: supreme._id, order: 1, level: 2, badgeColor: 'red', displayName: '김진일' },
      { name: '정책위의장', organizationId: supreme._id, order: 2, level: 2, badgeColor: 'blue', displayName: '강익현' },
      { name: '사무총장', organizationId: supreme._id, order: 3, level: 2, badgeColor: 'green', displayName: '허진경' },
      
      // 부정선거척결위원회
      { name: '위원장', organizationId: election._id, order: 0, level: 2, badgeColor: 'purple', displayName: '위금숙' },
      
      // 직능위원회 위원장들
      { name: '위원장', organizationId: committees[0]._id, order: 0, level: 2, badgeColor: 'blue' }, // 국제위원회 - 공석
      { name: '위원장', organizationId: committees[1]._id, order: 0, level: 2, badgeColor: 'orange' }, // 홍보위원회 - 공석
      { name: '위원장', organizationId: committees[2]._id, order: 0, level: 2, badgeColor: 'green' }, // 정책위원회 - 공석
      { name: '위원장', organizationId: committees[3]._id, order: 0, level: 2, badgeColor: 'purple' }, // 교육위원회 - 공석
      { name: '위원장', organizationId: committees[4]._id, order: 0, level: 2, badgeColor: 'blue' } // 장애인위원회 - 공석
    ]);
    
    res.json({ success: true, message: '시드 데이터가 생성되었습니다.' });
  } catch (error) {
    console.error('시드 생성 오류:', error);
    res.status(500).json({ success: false, error: '시드 생성에 실패했습니다.' });
  }
});

// 시드 데이터 리셋 (기존 데이터 삭제 후 재생성)
router.post('/seed/reset', async (req, res) => {
  try {
    await Organization.deleteMany({});
    await Position.deleteMany({});
    
    // 최고위원회 생성 (중앙당)
    const supreme = await Organization.create({
      name: '최고위원회',
      category: 'central',
      order: 0,
      color: 'red'
    });
    
    // 부정선거척결위원회 생성 (중앙당)
    const election = await Organization.create({
      name: '부정선거척결위원회',
      category: 'central',
      order: 1,
      color: 'purple'
    });
    
    // 직능위원회들 생성
    const committees = await Organization.create([
      { name: '국제위원회', category: 'committee', order: 0, color: 'blue' },
      { name: '홍보위원회', category: 'committee', order: 1, color: 'orange' },
      { name: '정책위원회', category: 'committee', order: 2, color: 'green' },
      { name: '교육위원회', category: 'committee', order: 3, color: 'purple' },
      { name: '장애인위원회', category: 'committee', order: 4, color: 'blue' }
    ]);
    
    // 직책들 생성
    await Position.create([
      // 독립 직책 (중앙당)
      { name: '당 대표', category: 'central', organizationId: null, order: 0, level: 1, badgeColor: 'red', displayName: '황교안', subtitle: '제44대 국무총리' },
      
      // 최고위원회
      { name: '최고위원', organizationId: supreme._id, order: 0, level: 2, badgeColor: 'red', displayName: '김상현' },
      { name: '최고위원', organizationId: supreme._id, order: 1, level: 2, badgeColor: 'red', displayName: '김진일' },
      { name: '정책위의장', organizationId: supreme._id, order: 2, level: 2, badgeColor: 'blue', displayName: '강익현' },
      { name: '사무총장', organizationId: supreme._id, order: 3, level: 2, badgeColor: 'green', displayName: '허진경' },
      
      // 부정선거척결위원회
      { name: '위원장', organizationId: election._id, order: 0, level: 2, badgeColor: 'purple', displayName: '위금숙' },
      
      // 직능위원회 위원장들
      { name: '위원장', organizationId: committees[0]._id, order: 0, level: 2, badgeColor: 'blue' },
      { name: '위원장', organizationId: committees[1]._id, order: 0, level: 2, badgeColor: 'orange' },
      { name: '위원장', organizationId: committees[2]._id, order: 0, level: 2, badgeColor: 'green' },
      { name: '위원장', organizationId: committees[3]._id, order: 0, level: 2, badgeColor: 'purple' },
      { name: '위원장', organizationId: committees[4]._id, order: 0, level: 2, badgeColor: 'blue' }
    ]);
    
    res.json({ success: true, message: '시드 데이터가 리셋되었습니다.' });
  } catch (error) {
    console.error('시드 리셋 오류:', error);
    res.status(500).json({ success: false, error: '시드 리셋에 실패했습니다.' });
  }
});

module.exports = router;
