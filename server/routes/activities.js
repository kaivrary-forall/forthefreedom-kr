const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Activity } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.activity;

// 활동자료 목록 조회
router.get('/', getAll(Activity, '활동자료'));

// 활동자료 단일 조회
router.get('/:id', getById(Activity, '활동자료'));

// 활동자료 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('🔍 활동자료 생성 요청 받음');
        console.log('📋 요청 데이터:', req.body);
        console.log('📁 첨부파일:', req.files ? req.files.length : 0);
        
        const activityData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '활동팀',
            status: req.body.status || 'published',
            activityType: req.body.activityType || 'photo',
            youtubeUrl: req.body.youtubeUrl || '',
            eventDate: req.body.eventDate ? new Date(req.body.eventDate) : new Date(),
            location: req.body.location || ''
        };

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                activityData.tags = req.body.tags;
            } else {
                activityData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        // 첨부파일 정보 처리 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            activityData.attachments = createAttachmentsInfo(req.files);
        }

        const activity = new Activity(activityData);
        await activity.save();

        console.log('✅ 활동자료 저장 성공:', activity._id);

        res.status(201).json({
            success: true,
            data: activity,
            message: '새로운 활동자료가 생성되었습니다'
        });
    } catch (error) {
        console.error('❌ 활동자료 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '활동자료 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 활동자료 수정 (파일 업로드 포함)
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔄 활동자료 수정 요청:', id);
        console.log('📋 수정 데이터:', req.body);
        console.log('📁 새 첨부파일:', req.files ? req.files.length : 0);
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '활동팀',
            status: req.body.status || 'published',
            activityType: req.body.activityType || 'photo',
            youtubeUrl: req.body.youtubeUrl || '',
            location: req.body.location || ''
        };

        // 활동 일자 처리
        if (req.body.eventDate) {
            updateData.eventDate = new Date(req.body.eventDate);
        }

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                updateData.tags = req.body.tags;
            } else {
                updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        // 기존 첨부파일 처리
        const existingActivity = await Activity.findById(id);
        if (!existingActivity) {
            return res.status(404).json({
                success: false,
                message: '활동자료를 찾을 수 없습니다'
            });
        }

        // 기존 첨부파일 유지 (삭제된 것 제외)
        let existingAttachments = existingActivity.attachments || [];
        
        // existingAttachments 파라미터가 있으면 처리
        if (req.body.existingAttachments) {
            try {
                const keepAttachments = JSON.parse(req.body.existingAttachments);
                existingAttachments = keepAttachments;
            } catch (e) {
                console.warn('기존 첨부파일 파싱 오류:', e);
            }
        }
        
        // 새로운 첨부파일 추가 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);

            updateData.attachments = [...existingAttachments, ...newAttachments];
        } else {
            updateData.attachments = existingAttachments;
        }

        const activity = await Activity.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('✅ 활동자료 수정 성공:', activity._id);

        res.json({
            success: true,
            data: activity,
            message: '활동자료가 수정되었습니다'
        });
    } catch (error) {
        console.error('❌ 활동자료 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '활동자료 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 활동자료 삭제
router.delete('/:id', deleteById(Activity, '활동자료'));

module.exports = router; 