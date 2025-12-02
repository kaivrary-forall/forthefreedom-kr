const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { NewMedia } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.newMedia;

// 뉴미디어 콘텐츠 목록 조회
router.get('/', getAll(NewMedia));

// 뉴미디어 콘텐츠 단일 조회
router.get('/:id', getById(NewMedia));

// 이미지 업로드 엔드포인트
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '이미지 파일이 필요합니다'
            });
        }

        const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                imageUrl: imageUrl,
                size: req.file.size,
                mimeType: req.file.mimetype
            },
            message: '이미지 업로드 완료'
        });
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '이미지 업로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 뉴미디어 콘텐츠 생성
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const newMediaData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            mediaType: req.body.mediaType,
            platform: req.body.platform,
            dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : {},
            youtubeUrl: req.body.youtubeUrl || '',
            socialMediaLinks: req.body.socialMediaLinks ? JSON.parse(req.body.socialMediaLinks) : [],
            hashtags: req.body.hashtags ? JSON.parse(req.body.hashtags) : [],
            targetAudience: req.body.targetAudience || '일반',
            publishSchedule: req.body.publishSchedule ? new Date(req.body.publishSchedule) : null,
            engagement: req.body.engagement ? JSON.parse(req.body.engagement) : {},
            priority: parseInt(req.body.priority) || 0,
            author: req.body.author || '뉴미디어',
            designer: req.body.designer || '',
            status: req.body.status || 'published',
            isPromoted: req.body.isPromoted === 'true',
            analytics: req.body.analytics ? JSON.parse(req.body.analytics) : {}
        };

        // 첨부파일 처리 (미디어 파일 포함, 한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            newMediaData.attachments = createAttachmentsInfo(req.files);
        }

        const newMedia = new NewMedia(newMediaData);
        await newMedia.save();

        res.status(201).json({
            success: true,
            data: newMedia,
            message: '뉴미디어 콘텐츠가 성공적으로 생성되었습니다'
        });
    } catch (error) {
        console.error('뉴미디어 콘텐츠 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '뉴미디어 콘텐츠 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 뉴미디어 콘텐츠 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            mediaType: req.body.mediaType,
            platform: req.body.platform,
            dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : undefined,
            youtubeUrl: req.body.youtubeUrl,
            socialMediaLinks: req.body.socialMediaLinks ? JSON.parse(req.body.socialMediaLinks) : undefined,
            hashtags: req.body.hashtags ? JSON.parse(req.body.hashtags) : undefined,
            targetAudience: req.body.targetAudience,
            publishSchedule: req.body.publishSchedule ? new Date(req.body.publishSchedule) : undefined,
            engagement: req.body.engagement ? JSON.parse(req.body.engagement) : undefined,
            priority: req.body.priority ? parseInt(req.body.priority) : undefined,
            author: req.body.author,
            designer: req.body.designer,
            status: req.body.status,
            isPromoted: req.body.isPromoted === 'true',
            analytics: req.body.analytics ? JSON.parse(req.body.analytics) : undefined
        };

        // undefined 값 제거
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // 새 첨부파일이 있으면 추가 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);

            if (req.body.replaceAttachments === 'true') {
                updateData.attachments = newAttachments;
            } else {
                const newMedia = await NewMedia.findById(req.params.id);
                updateData.attachments = [...(newMedia.attachments || []), ...newAttachments];
            }
        }

        const newMedia = await NewMedia.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!newMedia) {
            return res.status(404).json({
                success: false,
                message: '뉴미디어 콘텐츠를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: newMedia,
            message: '뉴미디어 콘텐츠가 성공적으로 수정되었습니다'
        });
    } catch (error) {
        console.error('뉴미디어 콘텐츠 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '뉴미디어 콘텐츠 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 뉴미디어 콘텐츠 삭제
router.delete('/:id', deleteById(NewMedia));

// 조회수 증가
router.post('/:id/view', async (req, res) => {
    try {
        await NewMedia.findByIdAndUpdate(req.params.id, { 
            $inc: { 'engagement.views': 1 } 
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 분석 데이터 업데이트
router.put('/:id/analytics', async (req, res) => {
    try {
        const { impressions, clicks, reach, likes, shares, comments } = req.body;
        
        const updateData = {};
        if (impressions !== undefined) updateData['analytics.impressions'] = impressions;
        if (clicks !== undefined) updateData['analytics.clicks'] = clicks;
        if (reach !== undefined) updateData['analytics.reach'] = reach;
        if (likes !== undefined) updateData['engagement.likes'] = likes;
        if (shares !== undefined) updateData['engagement.shares'] = shares;
        if (comments !== undefined) updateData['engagement.comments'] = comments;

        const newMedia = await NewMedia.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!newMedia) {
            return res.status(404).json({
                success: false,
                message: '뉴미디어 콘텐츠를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: newMedia,
            message: '분석 데이터가 업데이트되었습니다'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: '분석 데이터 업데이트 중 오류가 발생했습니다',
            error: error.message 
        });
    }
});

module.exports = router; 