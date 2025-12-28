const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// 활성화된 공지 조회 (공개)
router.get('/', async (req, res) => {
    try {
        const announcement = await Announcement.findOne({ isActive: true }).sort({ updatedAt: -1 });
        res.json({
            success: true,
            data: announcement
        });
    } catch (error) {
        console.error('공지 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지를 불러오는데 실패했습니다.'
        });
    }
});

// 모든 공지 조회 (관리자)
router.get('/all', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ updatedAt: -1 });
        res.json({
            success: true,
            data: announcements
        });
    } catch (error) {
        console.error('공지 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지 목록을 불러오는데 실패했습니다.'
        });
    }
});

// 공지 생성 (관리자)
router.post('/', async (req, res) => {
    try {
        const { text, link, linkText, bgColor, textColor, isActive, hideHours, forceShowVersion } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                message: '공지 내용은 필수입니다.'
            });
        }
        
        const announcement = await Announcement.create({
            text,
            link: link || '',
            linkText: linkText || '자세히 보기',
            bgColor: bgColor || '#c8102e',
            textColor: textColor || '#ffffff',
            isActive: isActive !== undefined ? isActive : true,
            hideHours: hideHours !== undefined ? hideHours : 6,
            forceShowVersion: forceShowVersion !== undefined ? forceShowVersion : 1
        });
        
        res.json({
            success: true,
            data: announcement,
            message: '공지가 등록되었습니다.'
        });
    } catch (error) {
        console.error('공지 등록 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지 등록에 실패했습니다.'
        });
    }
});

// 공지 수정 (관리자)
router.put('/:id', async (req, res) => {
    try {
        const { text, link, linkText, bgColor, textColor, isActive, hideHours, forceShowVersion } = req.body;
        
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: '공지를 찾을 수 없습니다.'
            });
        }
        
        if (text !== undefined) announcement.text = text;
        if (link !== undefined) announcement.link = link;
        if (linkText !== undefined) announcement.linkText = linkText;
        if (bgColor !== undefined) announcement.bgColor = bgColor;
        if (textColor !== undefined) announcement.textColor = textColor;
        if (isActive !== undefined) announcement.isActive = isActive;
        if (hideHours !== undefined) announcement.hideHours = hideHours;
        if (forceShowVersion !== undefined) announcement.forceShowVersion = forceShowVersion;
        
        await announcement.save();
        
        res.json({
            success: true,
            data: announcement,
            message: '공지가 수정되었습니다.'
        });
    } catch (error) {
        console.error('공지 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지 수정에 실패했습니다.'
        });
    }
});

// 공지 삭제 (관리자)
router.delete('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: '공지를 찾을 수 없습니다.'
            });
        }
        
        res.json({
            success: true,
            message: '공지가 삭제되었습니다.'
        });
    } catch (error) {
        console.error('공지 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지 삭제에 실패했습니다.'
        });
    }
});

module.exports = router;
