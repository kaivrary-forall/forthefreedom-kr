const express = require('express');
const router = express.Router();
const { Chapter } = require('../models');

// URL 정규화 함수
const normalizeUrl = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return 'https://' + trimmed;
};

// ==================== 공개 API ====================

// 지역구 목록 조회 (프론트엔드용)
router.get('/', async (req, res) => {
    try {
        const { province = 'seoul' } = req.query;
        
        const chapters = await Chapter.find({ province })
            .sort({ order: 1, name: 1 })
            .select('-__v');
        
        res.json({
            success: true,
            data: chapters,
            count: chapters.length
        });
    } catch (error) {
        console.error('지역구 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '지역구 목록 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 지역구 단일 조회
router.get('/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).select('-__v');
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
        res.json({
            success: true,
            data: chapter
        });
    } catch (error) {
        console.error('지역구 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '지역구 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// ==================== 관리자 API ====================

// 관리자용 지역구 목록 조회 (모든 필드 포함)
router.get('/admin/list', async (req, res) => {
    try {
        const { province = 'seoul' } = req.query;
        
        const chapters = await Chapter.find({ province })
            .sort({ order: 1, name: 1 });
        
        res.json({
            success: true,
            data: chapters,
            count: chapters.length
        });
    } catch (error) {
        console.error('관리자 지역구 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '지역구 목록 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 지역구 카드 생성 (관리자용)
router.post('/admin', async (req, res) => {
    try {
        const { 
            province = 'seoul',
            districtName,
            districtSuffix,
            dongsRaw,
            kakaoLink,
            note,
            chairmanSurname,
            chairmanGivenName,
            chairmanWebsite,
            chairmanInstagram,
            chairmanFacebook,
            chairmanThreads,
            chairmanX,
            chairmanNaverBlog,
            chairmanYoutube
        } = req.body;
        
        if (!districtName) {
            return res.status(400).json({
                success: false,
                message: '지역구 이름은 필수입니다'
            });
        }
        
        // 현재 가장 큰 order 값 찾기
        const maxOrderChapter = await Chapter.findOne({ province }).sort({ order: -1 });
        const newOrder = maxOrderChapter ? maxOrderChapter.order + 1 : 0;
        
        const chapter = new Chapter({
            province,
            districtName: districtName.trim(),
            districtSuffix: districtSuffix?.trim() || null,
            dongsRaw: dongsRaw?.trim() || '',
            kakaoLink: kakaoLink?.trim() || null,
            note: note?.trim() || null,
            chairmanSurname: chairmanSurname?.trim() || null,
            chairmanGivenName: chairmanGivenName?.trim() || null,
            chairmanWebsite: normalizeUrl(chairmanWebsite),
            chairmanInstagram: normalizeUrl(chairmanInstagram),
            chairmanFacebook: normalizeUrl(chairmanFacebook),
            chairmanThreads: normalizeUrl(chairmanThreads),
            chairmanX: normalizeUrl(chairmanX),
            chairmanNaverBlog: normalizeUrl(chairmanNaverBlog),
            chairmanYoutube: normalizeUrl(chairmanYoutube),
            order: newOrder
        });
        
        await chapter.save();
        
        res.status(201).json({
            success: true,
            data: chapter,
            message: '새로운 지역구가 생성되었습니다'
        });
    } catch (error) {
        console.error('지역구 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '지역구 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 지역구 카드 수정 (관리자용)
router.put('/admin/:id', async (req, res) => {
    try {
        const { 
            districtName,
            districtSuffix,
            dongsRaw,
            kakaoLink,
            note,
            chairmanSurname,
            chairmanGivenName,
            chairmanWebsite,
            chairmanInstagram,
            chairmanFacebook,
            chairmanThreads,
            chairmanX,
            chairmanNaverBlog,
            chairmanYoutube
        } = req.body;
        
        const chapter = await Chapter.findById(req.params.id);
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
        // 필드 업데이트
        if (districtName !== undefined) chapter.districtName = districtName.trim();
        if (districtSuffix !== undefined) chapter.districtSuffix = districtSuffix?.trim() || null;
        if (dongsRaw !== undefined) chapter.dongsRaw = dongsRaw?.trim() || '';
        if (kakaoLink !== undefined) chapter.kakaoLink = kakaoLink?.trim() || null;
        if (note !== undefined) chapter.note = note?.trim() || null;
        if (chairmanSurname !== undefined) chapter.chairmanSurname = chairmanSurname?.trim() || null;
        if (chairmanGivenName !== undefined) chapter.chairmanGivenName = chairmanGivenName?.trim() || null;
        if (chairmanWebsite !== undefined) chapter.chairmanWebsite = normalizeUrl(chairmanWebsite);
        if (chairmanInstagram !== undefined) chapter.chairmanInstagram = normalizeUrl(chairmanInstagram);
        if (chairmanFacebook !== undefined) chapter.chairmanFacebook = normalizeUrl(chairmanFacebook);
        if (chairmanThreads !== undefined) chapter.chairmanThreads = normalizeUrl(chairmanThreads);
        if (chairmanX !== undefined) chapter.chairmanX = normalizeUrl(chairmanX);
        if (chairmanNaverBlog !== undefined) chapter.chairmanNaverBlog = normalizeUrl(chairmanNaverBlog);
        if (chairmanYoutube !== undefined) chapter.chairmanYoutube = normalizeUrl(chairmanYoutube);
        
        await chapter.save();
        
        res.json({
            success: true,
            data: chapter,
            message: '지역구 정보가 수정되었습니다'
        });
    } catch (error) {
        console.error('지역구 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '지역구 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 지역구 삭제 (관리자용)
router.delete('/admin/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
        // 삭제된 지역구보다 뒤에 있는 지역구들의 order 재조정
        await Chapter.updateMany(
            { province: chapter.province, order: { $gt: chapter.order } },
            { $inc: { order: -1 } }
        );
        
        res.json({
            success: true,
            message: '지역구가 삭제되었습니다'
        });
    } catch (error) {
        console.error('지역구 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '지역구 삭제 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 당협위원장 정보 삭제 (공석으로 변경)
router.delete('/admin/:id/chairman', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
        chapter.chairmanSurname = null;
        chapter.chairmanGivenName = null;
        chapter.chairmanName = null;
        chapter.chairmanWebsite = null;
        chapter.chairmanInstagram = null;
        chapter.chairmanFacebook = null;
        chapter.chairmanThreads = null;
        chapter.chairmanX = null;
        chapter.chairmanNaverBlog = null;
        chapter.chairmanYoutube = null;
        chapter.chairmanMemberId = null;
        
        await chapter.save();
        
        res.json({
            success: true,
            data: chapter,
            message: '당협위원장 정보가 삭제되었습니다 (공석)'
        });
    } catch (error) {
        console.error('당협위원장 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '당협위원장 정보 삭제 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// ==================== 순서 변경 API ====================

// 순서 위로 이동
router.put('/admin/:id/move-up', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
        if (chapter.order === 0) {
            return res.json({
                success: true,
                message: '이미 최상단입니다'
            });
        }
        
        // 바로 위에 있는 지역구 찾기
        const aboveChapter = await Chapter.findOne({
            province: chapter.province,
            order: chapter.order - 1
        });
        
        if (aboveChapter) {
            // 순서 교환
            aboveChapter.order = chapter.order;
            chapter.order = chapter.order - 1;
            
            await aboveChapter.save();
            await chapter.save();
        }
        
        res.json({
            success: true,
            message: '위로 이동했습니다'
        });
    } catch (error) {
        console.error('순서 변경 오류:', error);
        res.status(500).json({
            success: false,
            message: '순서 변경 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 순서 아래로 이동
router.put('/admin/:id/move-down', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
        // 바로 아래에 있는 지역구 찾기
        const belowChapter = await Chapter.findOne({
            province: chapter.province,
            order: chapter.order + 1
        });
        
        if (!belowChapter) {
            return res.json({
                success: true,
                message: '이미 최하단입니다'
            });
        }
        
        // 순서 교환
        belowChapter.order = chapter.order;
        chapter.order = chapter.order + 1;
        
        await belowChapter.save();
        await chapter.save();
        
        res.json({
            success: true,
            message: '아래로 이동했습니다'
        });
    } catch (error) {
        console.error('순서 변경 오류:', error);
        res.status(500).json({
            success: false,
            message: '순서 변경 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 드래그앤드롭으로 순서 변경
router.put('/admin/reorder', async (req, res) => {
    try {
        const { orderedIds, province = 'seoul' } = req.body;
        
        if (!orderedIds || !Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: '순서 정보가 필요합니다'
            });
        }
        
        // 모든 지역구의 순서를 업데이트
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: index } }
            }
        }));
        
        await Chapter.bulkWrite(bulkOps);
        
        res.json({
            success: true,
            message: '순서가 변경되었습니다'
        });
    } catch (error) {
        console.error('순서 변경 오류:', error);
        res.status(500).json({
            success: false,
            message: '순서 변경 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// ==================== 마이그레이션 API ====================

// 기존 데이터 마이그레이션 (name -> districtName + districtSuffix, chairmanName -> surname + givenName)
router.post('/admin/migrate', async (req, res) => {
    try {
        const chapters = await Chapter.find({});
        let migratedCount = 0;
        
        for (const chapter of chapters) {
            let needsSave = false;
            
            // name에서 districtName, districtSuffix 분리
            if (chapter.name && !chapter.districtName) {
                const parts = chapter.name.split(' ');
                if (parts.length >= 2) {
                    const suffix = parts[parts.length - 1];
                    if (['갑', '을', '병', '정', '무'].includes(suffix)) {
                        chapter.districtName = parts.slice(0, -1).join(' ');
                        chapter.districtSuffix = suffix;
                    } else {
                        chapter.districtName = chapter.name;
                        chapter.districtSuffix = null;
                    }
                } else {
                    chapter.districtName = chapter.name;
                    chapter.districtSuffix = null;
                }
                needsSave = true;
            }
            
            // chairmanName에서 성/이름 분리 (첫 글자 = 성, 나머지 = 이름)
            if (chapter.chairmanName && !chapter.chairmanSurname) {
                const fullName = chapter.chairmanName.trim();
                if (fullName.length >= 2) {
                    chapter.chairmanSurname = fullName.charAt(0);
                    chapter.chairmanGivenName = fullName.substring(1);
                } else if (fullName.length === 1) {
                    chapter.chairmanSurname = fullName;
                    chapter.chairmanGivenName = null;
                }
                needsSave = true;
            }
            
            // dongs 배열을 dongsRaw로 변환
            if (chapter.dongs && chapter.dongs.length > 0 && !chapter.dongsRaw) {
                chapter.dongsRaw = '#' + chapter.dongs.join('#');
                needsSave = true;
            }
            
            if (needsSave) {
                await chapter.save();
                migratedCount++;
            }
        }
        
        res.json({
            success: true,
            message: migratedCount + '개 지역구 마이그레이션 완료',
            total: chapters.length,
            migrated: migratedCount
        });
    } catch (error) {
        console.error('마이그레이션 오류:', error);
        res.status(500).json({
            success: false,
            message: '마이그레이션 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

module.exports = router;
