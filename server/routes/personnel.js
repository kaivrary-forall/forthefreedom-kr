const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Personnel = require('../models/Personnel');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.notice; // 공지사항과 같은 업로드 설정 사용

// 인사 발령 목록 조회
router.get('/', getAll(Personnel));

// 인사 발령 단일 조회
router.get('/:id', getById(Personnel));

// 🖼️ 이미지 전용 업로드 엔드포인트 (에디터용)
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        console.log('📸 인사발령 이미지 업로드 요청 받음');
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

// 인사 발령 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments'), async (req, res) => {
    try {
        const { title, content, category, author, excerpt, tags, isImportant, showOnSideCard } = req.body;

        // 첨부파일 정보 처리 (한글 파일명 자동 복원)
        const attachments = createAttachmentsInfo(req.files);

        const personnelData = {
            title,
            content,
            category: category || '임명',
            author: author || '관리자',
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isImportant: isImportant === 'true' || isImportant === true,
            showOnSideCard: showOnSideCard === 'true' || showOnSideCard === true,
            attachments,
            status: 'published',
            publishDate: new Date()
        };

        const personnel = new Personnel(personnelData);
        await personnel.save();

        res.status(201).json({
            success: true,
            data: personnel,
            message: '새로운 인사 발령이 생성되었습니다'
        });
    } catch (error) {
        console.error('인사 발령 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '인사 발령 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 인사 발령 수정
router.put('/:id', upload.array('attachments'), async (req, res) => {
    try {
        const { title, content, category, author, excerpt, tags, isImportant, showOnSideCard, createdAt, existingAttachments } = req.body;

        const updateData = {
            title,
            content,
            category: category || '임명',
            author: author || '관리자',
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isImportant: isImportant === 'true' || isImportant === true,
            showOnSideCard: showOnSideCard === 'true' || showOnSideCard === true,
            updatedAt: new Date()
        };
        
        // createdAt 업데이트 (날짜 수정 허용)
        if (createdAt) {
            updateData.createdAt = new Date(createdAt);
        }

        // 기존 인사 발령 조회
        const existingPersonnel = await Personnel.findById(req.params.id);
        if (!existingPersonnel) {
            return res.status(404).json({
                success: false,
                message: '인사 발령을 찾을 수 없습니다'
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
                finalAttachments = existingPersonnel.attachments || [];
            }
        } else {
            // existingAttachments가 없으면 기존 첨부파일 유지 (새 파일만 추가하는 경우)
            finalAttachments = existingPersonnel.attachments || [];
        }

        // 2. 새로 업로드된 첨부파일 추가
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);
            finalAttachments = [...finalAttachments, ...newAttachments];
        }

        updateData.attachments = finalAttachments;

        const personnel = await Personnel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: personnel,
            message: '인사 발령이 수정되었습니다'
        });
    } catch (error) {
        console.error('인사 발령 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '인사 발령 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 인사 발령 삭제
router.delete('/:id', deleteById(Personnel));

module.exports = router;
