const express = require('express');
const router = express.Router();
const Congratulation = require('../models/Congratulation');

// 경조사 목록 조회 (공개)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        
        const query = { isActive: true };
        if (category) {
            query.category = category;
        }
        
        // 검색 기능
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { targetPerson: { $regex: search, $options: 'i' } }
            ];
        }
        
        const total = await Congratulation.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        
        const data = await Congratulation.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            data,
            total,
            totalPages,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('경조사 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '경조사 목록을 불러오는 중 오류가 발생했습니다'
        });
    }
});

// 경조사 단일 조회
router.get('/:id', async (req, res) => {
    try {
        const item = await Congratulation.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: '경조사를 찾을 수 없습니다'
            });
        }
        
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('경조사 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '경조사를 불러오는 중 오류가 발생했습니다'
        });
    }
});

// 경조사 생성 (관리자)
router.post('/', async (req, res) => {
    try {
        const { category, title, content, targetPerson, createdAt, showOnSideCard } = req.body;
        
        if (!category || !title || !content) {
            return res.status(400).json({
                success: false,
                message: '카테고리, 제목, 내용은 필수입니다'
            });
        }
        
        const congratulationData = {
            category,
            title,
            content,
            targetPerson: targetPerson || '',
            isActive: true,
            showOnSideCard: showOnSideCard !== false
        };
        
        // createdAt이 전달되면 사용 (과거 날짜 입력용)
        if (createdAt) {
            congratulationData.createdAt = new Date(createdAt);
        }
        
        const congratulation = new Congratulation(congratulationData);
        await congratulation.save();
        
        res.status(201).json({
            success: true,
            data: congratulation,
            message: '경조사가 등록되었습니다'
        });
    } catch (error) {
        console.error('경조사 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '경조사 등록 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 경조사 수정 (관리자)
router.put('/:id', async (req, res) => {
    try {
        const { category, title, content, targetPerson, isActive, showOnSideCard } = req.body;
        
        const updateData = {
            category,
            title,
            content,
            targetPerson: targetPerson || '',
            isActive: isActive !== undefined ? isActive : true,
            showOnSideCard: showOnSideCard !== undefined ? showOnSideCard : true
        };
        
        const congratulation = await Congratulation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!congratulation) {
            return res.status(404).json({
                success: false,
                message: '경조사를 찾을 수 없습니다'
            });
        }
        
        res.json({
            success: true,
            data: congratulation,
            message: '경조사가 수정되었습니다'
        });
    } catch (error) {
        console.error('경조사 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '경조사 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 경조사 삭제 (관리자)
router.delete('/:id', async (req, res) => {
    try {
        const congratulation = await Congratulation.findByIdAndDelete(req.params.id);
        
        if (!congratulation) {
            return res.status(404).json({
                success: false,
                message: '경조사를 찾을 수 없습니다'
            });
        }
        
        res.json({
            success: true,
            message: '경조사가 삭제되었습니다'
        });
    } catch (error) {
        console.error('경조사 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '경조사 삭제 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

module.exports = router;
