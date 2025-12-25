const express = require('express');
const router = express.Router();
const { SiteSettings, SettingsVersion } = require('../models/SiteSettings');
const { authMember } = require('../middleware/authMember');

// 기본 푸터 데이터 (초기값)
const defaultFooterData = {
  ko: {
    slogan: '새로운 정치, 새로운 미래를 함께 만들어갑니다.',
    address: '서울 용산구 청파로45길 19, 복조빌딩 3층',
    addressSub: '(지번: 서울 용산구 청파동3가 29-14, 우편번호: 04307)',
    phones: ['02-2634-2023', '02-2634-2024'],
    fax: '02-2634-2026',
    emails: [{ label: '대표', email: 'info@freeinno.kr' }],
    socials: [
      { type: 'facebook', url: 'https://www.facebook.com/freeinnoparty', enabled: true, order: 1 },
      { type: 'x', url: 'https://x.com/freeinnoparty', enabled: true, order: 2 },
      { type: 'instagram', url: 'https://www.instagram.com/freeinnoparty', enabled: true, order: 3 },
      { type: 'youtube', url: 'https://youtube.com/@freeinnoparty', enabled: true, order: 4 }
    ],
    quickLinks: [
      { label: '당 소개', href: '/about', enabled: true, order: 1 },
      { label: '정책', href: '/about/policy', enabled: true, order: 2 },
      { label: '소식/활동', href: '/news', enabled: true, order: 3 },
      { label: '당원가입', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3', enabled: true, order: 4 },
      { label: '후원', href: '/support', enabled: true, order: 5 },
      { label: '자료실', href: '/resources', enabled: true, order: 6 }
    ],
    bottomLinks: [
      { label: '개인정보처리방침', href: '/privacy', enabled: true, order: 1 },
      { label: '이용약관', href: '/terms', enabled: true, order: 2 },
      { label: '정보공개', href: '/disclosure', enabled: true, order: 3 }
    ]
  },
  en: {
    slogan: 'Building a new politics and a new future together.',
    address: '3F Bokjo Bldg, 19 Cheongpa-ro 45-gil, Yongsan-gu, Seoul',
    addressSub: '(Lot: 29-14 Cheongpa-dong 3-ga, Postal: 04307)',
    phones: ['02-2634-2023', '02-2634-2024'],
    fax: '02-2634-2026',
    emails: [{ label: 'General', email: 'info@freeinno.kr' }],
    socials: [
      { type: 'facebook', url: 'https://www.facebook.com/freeinnoparty', enabled: true, order: 1 },
      { type: 'x', url: 'https://x.com/freeinnoparty', enabled: true, order: 2 },
      { type: 'instagram', url: 'https://www.instagram.com/freeinnoparty', enabled: true, order: 3 },
      { type: 'youtube', url: 'https://youtube.com/@freeinnoparty', enabled: true, order: 4 }
    ],
    quickLinks: [
      { label: 'About Us', href: '/en/about', enabled: true, order: 1 },
      { label: 'Policy', href: '/en/about/policy', enabled: true, order: 2 },
      { label: 'News', href: '/en/news', enabled: true, order: 3 },
      { label: 'Join Party', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3', enabled: true, order: 4 },
      { label: 'Support', href: '/en/support', enabled: true, order: 5 },
      { label: 'Resources', href: '/en/resources', enabled: true, order: 6 }
    ],
    bottomLinks: [
      { label: 'Privacy Policy', href: '/en/privacy', enabled: true, order: 1 },
      { label: 'Terms of Service', href: '/en/terms', enabled: true, order: 2 },
      { label: 'Disclosure', href: '/en/disclosure', enabled: true, order: 3 }
    ]
  }
};

// ==========================================
// 공개 API (인증 불필요)
// ==========================================

// 푸터 설정 조회 (공개)
router.get('/footer', async (req, res) => {
  try {
    const lang = req.query.lang || 'ko';
    
    let settings = await SiteSettings.findOne({ key: 'footer' });
    
    // 설정이 없으면 기본값 생성
    if (!settings) {
      settings = await SiteSettings.create({
        key: 'footer',
        value: defaultFooterData,
        updatedBy: 'system'
      });
    }
    
    // 언어별 데이터 반환
    const langData = settings.value[lang] || settings.value.ko;
    
    // enabled가 true인 항목만 필터링하고 order로 정렬
    const filterAndSort = (items) => {
      if (!Array.isArray(items)) return items;
      return items
        .filter(item => item.enabled !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    };
    
    const responseData = {
      ...langData,
      socials: filterAndSort(langData.socials),
      quickLinks: filterAndSort(langData.quickLinks),
      bottomLinks: filterAndSort(langData.bottomLinks)
    };
    
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('푸터 설정 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '푸터 설정 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// ==========================================
// 관리자 API (인증 필요)
// ==========================================

// 관리자 권한 체크 미들웨어
const checkAdmin = async (req, res, next) => {
  try {
    // authMember 미들웨어에서 설정한 member 정보 확인
    if (!req.member) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      });
    }
    
    // admin 권한 체크
    const isAdmin = 
      req.member.role === 'admin' || 
      req.member.isAdmin === true ||
      req.member.memberType === 'admin' ||
      req.member.memberType === '관리자';
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '권한 확인 중 오류가 발생했습니다'
    });
  }
};

// 푸터 설정 조회 (관리자용 - 전체 데이터)
router.get('/admin/footer', authMember, checkAdmin, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'footer' });
    
    if (!settings) {
      settings = await SiteSettings.create({
        key: 'footer',
        value: defaultFooterData,
        updatedBy: 'system'
      });
    }
    
    res.json({
      success: true,
      data: settings.value,
      updatedAt: settings.updatedAt,
      updatedBy: settings.updatedBy
    });
  } catch (error) {
    console.error('관리자 푸터 설정 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '푸터 설정 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 푸터 설정 업데이트 (관리자)
router.put('/admin/footer', authMember, checkAdmin, async (req, res) => {
  try {
    const newValue = req.body;
    
    // 유효성 검사
    if (!newValue || (!newValue.ko && !newValue.en)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 데이터입니다. ko 또는 en 필드가 필요합니다.'
      });
    }
    
    let settings = await SiteSettings.findOne({ key: 'footer' });
    
    if (!settings) {
      settings = new SiteSettings({
        key: 'footer',
        value: newValue,
        updatedBy: req.member?.nickname || req.member?.userId || 'admin'
      });
    } else {
      // 이전 버전 저장
      await SettingsVersion.create({
        key: 'footer',
        value: settings.value,
        updatedBy: settings.updatedBy,
        note: '업데이트 전 백업'
      });
      
      settings.value = newValue;
      settings.updatedBy = req.member?.nickname || req.member?.userId || 'admin';
    }
    
    await settings.save();
    
    // Next.js revalidate 트리거 (환경변수 설정 시)
    if (process.env.NEXT_REVALIDATE_URL && process.env.REVALIDATE_SECRET) {
      try {
        const fetch = require('node-fetch');
        await fetch(process.env.NEXT_REVALIDATE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-secret': process.env.REVALIDATE_SECRET
          },
          body: JSON.stringify({ tags: ['footer'] })
        });
        console.log('Next.js revalidate 트리거 성공');
      } catch (revalidateError) {
        console.error('Next.js revalidate 트리거 실패:', revalidateError.message);
        // revalidate 실패해도 저장은 성공으로 처리
      }
    }
    
    res.json({
      success: true,
      message: '푸터 설정이 업데이트되었습니다',
      data: settings.value,
      updatedAt: settings.updatedAt
    });
  } catch (error) {
    console.error('푸터 설정 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '푸터 설정 업데이트 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 푸터 설정 버전 목록 조회 (관리자)
router.get('/admin/footer/versions', authMember, checkAdmin, async (req, res) => {
  try {
    const versions = await SettingsVersion.find({ key: 'footer' })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: versions.map(v => ({
        id: v._id,
        updatedBy: v.updatedBy,
        createdAt: v.createdAt,
        note: v.note
      }))
    });
  } catch (error) {
    console.error('푸터 버전 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '버전 목록 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 특정 버전 상세 조회 (관리자)
router.get('/admin/footer/versions/:versionId', authMember, checkAdmin, async (req, res) => {
  try {
    const version = await SettingsVersion.findById(req.params.versionId);
    
    if (!version) {
      return res.status(404).json({
        success: false,
        message: '해당 버전을 찾을 수 없습니다'
      });
    }
    
    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    console.error('푸터 버전 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '버전 상세 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 특정 버전으로 롤백 (관리자)
router.post('/admin/footer/rollback/:versionId', authMember, checkAdmin, async (req, res) => {
  try {
    const version = await SettingsVersion.findById(req.params.versionId);
    
    if (!version) {
      return res.status(404).json({
        success: false,
        message: '해당 버전을 찾을 수 없습니다'
      });
    }
    
    let settings = await SiteSettings.findOne({ key: 'footer' });
    
    if (!settings) {
      settings = new SiteSettings({ key: 'footer' });
    }
    
    // 현재 버전 백업
    await SettingsVersion.create({
      key: 'footer',
      value: settings.value,
      updatedBy: settings.updatedBy,
      note: `롤백 전 백업 (→ ${version._id})`
    });
    
    // 롤백 적용
    settings.value = version.value;
    settings.updatedBy = req.member?.nickname || req.member?.userId || 'admin';
    await settings.save();
    
    // Next.js revalidate 트리거
    if (process.env.NEXT_REVALIDATE_URL && process.env.REVALIDATE_SECRET) {
      try {
        const fetch = require('node-fetch');
        await fetch(process.env.NEXT_REVALIDATE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-secret': process.env.REVALIDATE_SECRET
          },
          body: JSON.stringify({ tags: ['footer'] })
        });
      } catch (revalidateError) {
        console.error('Next.js revalidate 트리거 실패:', revalidateError.message);
      }
    }
    
    res.json({
      success: true,
      message: '롤백이 완료되었습니다',
      data: settings.value,
      rolledBackTo: version._id
    });
  } catch (error) {
    console.error('푸터 롤백 오류:', error);
    res.status(500).json({
      success: false,
      message: '롤백 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

module.exports = router;
