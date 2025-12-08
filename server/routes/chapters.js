const express = require('express');
const router = express.Router();
const { Chapter } = require('../models');

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

// 당협위원장 정보 수정 (관리자용)
router.put('/admin/:id/chairman', async (req, res) => {
    try {
        const { 
            chairmanName,
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
        
        // 빈 문자열은 null로 변환
        chapter.chairmanName = chairmanName?.trim() || null;
        chapter.chairmanWebsite = chairmanWebsite?.trim() || null;
        chapter.chairmanInstagram = chairmanInstagram?.trim() || null;
        chapter.chairmanFacebook = chairmanFacebook?.trim() || null;
        chapter.chairmanThreads = chairmanThreads?.trim() || null;
        chapter.chairmanX = chairmanX?.trim() || null;
        chapter.chairmanNaverBlog = chairmanNaverBlog?.trim() || null;
        chapter.chairmanYoutube = chairmanYoutube?.trim() || null;
        
        await chapter.save();
        
        res.json({
            success: true,
            data: chapter,
            message: '당협위원장 정보가 수정되었습니다'
        });
    } catch (error) {
        console.error('당협위원장 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '당협위원장 정보 수정 중 오류가 발생했습니다',
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

// 지역구 전체 정보 수정 (관리자용)
router.put('/admin/:id', async (req, res) => {
    try {
        const { name, dongs, kakaoLink, note, chairmanName, chairmanThreads, chairmanYoutube, order } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (dongs) updateData.dongs = dongs;
        if (kakaoLink !== undefined) updateData.kakaoLink = kakaoLink;
        if (note !== undefined) updateData.note = note || null;
        if (chairmanName !== undefined) updateData.chairmanName = chairmanName?.trim() || null;
        if (chairmanThreads !== undefined) updateData.chairmanThreads = chairmanThreads?.trim() || null;
        if (chairmanYoutube !== undefined) updateData.chairmanYoutube = chairmanYoutube?.trim() || null;
        if (order !== undefined) updateData.order = order;
        
        const chapter = await Chapter.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: '지역구를 찾을 수 없습니다'
            });
        }
        
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

// 지역구 생성 (관리자용)
router.post('/admin', async (req, res) => {
    try {
        const { province, name, dongs, kakaoLink, note, chairmanName, chairmanThreads, chairmanYoutube, order } = req.body;
        
        const chapter = new Chapter({
            province: province || 'seoul',
            name,
            dongs: dongs || [],
            kakaoLink,
            note: note || null,
            chairmanName: chairmanName?.trim() || null,
            chairmanThreads: chairmanThreads?.trim() || null,
            chairmanYoutube: chairmanYoutube?.trim() || null,
            order: order || 0
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

module.exports = router;
