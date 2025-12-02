const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
// MongoDB 모델 활성화
const { Notice } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.notice;

// 공지사항 목록 조회
router.get('/', getAll(Notice));

// 공지사항 단일 조회
router.get('/:id', getById(Notice));

// 🖼️ 이미지 전용 업로드 엔드포인트 (에디터용)
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        console.log('📸 이미지 업로드 요청 받음');
        console.log('📁 파일 정보:', req.file ? req.file.filename : '파일 없음');
        
        if (!req.file) {
            console.log('❌ 파일이 없습니다');
            return res.status(400).json({
                success: false,
                message: '이미지 파일이 필요합니다'
            });
        }

        // 업로드된 파일 정보 반환
        const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        
        console.log('✅ 이미지 업로드 성공:', imageUrl);
        
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

// 공지사항 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const { title, content, category, author, excerpt, tags, isImportant } = req.body;

        // 첨부파일 정보 처리 (한글 파일명 자동 복원)
        const attachments = createAttachmentsInfo(req.files);

        const noticeData = {
            title,
            content,
            category,
            author: author || '관리자',
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isImportant: isImportant === 'true' || isImportant === true,
            attachments,
            status: 'published',
            publishDate: new Date()
        };

        const notice = new Notice(noticeData);
        await notice.save();

        res.status(201).json({
            success: true,
            data: notice,
            message: '새로운 공지사항이 생성되었습니다'
        });
    } catch (error) {
        console.error('공지사항 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지사항 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 공지사항 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const { title, content, category, author, excerpt, tags, isImportant, existingAttachments } = req.body;

        const updateData = {
            title,
            content,
            category,
            author: author || '관리자',
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isImportant: isImportant === 'true' || isImportant === true,
            updatedAt: new Date()
        };

        // 기존 공지사항 조회
        const existingNotice = await Notice.findById(req.params.id);
        if (!existingNotice) {
            return res.status(404).json({
                success: false,
                message: '공지사항을 찾을 수 없습니다'
            });
        }

        // 첨부파일 처리
        let finalAttachments = [];

        // 1. 유지할 기존 첨부파일 처리
        if (existingAttachments) {
            try {
                // JSON 문자열로 전달된 경우 파싱
                const keepAttachments = typeof existingAttachments === 'string' 
                    ? JSON.parse(existingAttachments) 
                    : existingAttachments;
                
                if (Array.isArray(keepAttachments)) {
                    finalAttachments = keepAttachments;
                }
            } catch (e) {
                console.log('기존 첨부파일 파싱 오류, 기존 파일 유지:', e.message);
                finalAttachments = existingNotice.attachments || [];
            }
        } else {
            // existingAttachments가 없으면 기존 첨부파일 유지 (새 파일만 추가하는 경우)
            finalAttachments = existingNotice.attachments || [];
        }

        // 2. 새로 업로드된 첨부파일 추가
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);
            finalAttachments = [...finalAttachments, ...newAttachments];
        }

        updateData.attachments = finalAttachments;

        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: notice,
            message: '공지사항이 수정되었습니다'
        });
    } catch (error) {
        console.error('공지사항 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지사항 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 공지사항 삭제
router.delete('/:id', deleteById(Notice));

module.exports = router; 