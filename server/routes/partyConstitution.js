const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { PartyConstitution } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.partyConstitution;

// 당헌당규 목록 조회
router.get('/', getAll(PartyConstitution, '당헌당규'));

// 당헌당규 단일 조회
router.get('/:id', getById(PartyConstitution, '당헌당규'));

// 당헌당규 생성 (파일 업로드 포함)
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        const constitutionData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '당무위원회',
            status: req.body.status || 'published',
            version: req.body.version || '1.0',
            effectiveDate: req.body.effectiveDate || new Date()
        };

        // 첨부파일 정보 처리 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            constitutionData.attachments = createAttachmentsInfo(req.files);
        }

        const constitution = new PartyConstitution(constitutionData);
        await constitution.save();

        res.status(201).json({
            success: true,
            data: constitution,
            message: '새로운 당헌당규가 생성되었습니다'
        });
    } catch (error) {
        console.error('당헌당규 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '당헌당규 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 당헌당규 수정 (파일 업로드 포함)
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '당무위원회',
            status: req.body.status || 'published',
            version: req.body.version || '1.0',
            effectiveDate: req.body.effectiveDate || new Date()
        };

        // 기존 첨부파일 유지하고 새 파일만 추가
        const existingConstitution = await PartyConstitution.findById(id);
        const existingAttachments = existingConstitution.attachments || [];
        
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);

            updateData.attachments = [...existingAttachments, ...newAttachments];
        } else {
            updateData.attachments = existingAttachments;
        }

        const constitution = await PartyConstitution.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!constitution) {
            return res.status(404).json({
                success: false,
                message: '당헌당규를 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: constitution,
            message: '당헌당규가 수정되었습니다'
        });
    } catch (error) {
        console.error('당헌당규 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '당헌당규 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 첨부파일 다운로드
router.get('/:id/attachments/:filename', async (req, res) => {
    try {
        const { id, filename } = req.params;
        
        const constitution = await PartyConstitution.findById(id);
        if (!constitution) {
            return res.status(404).json({
                success: false,
                message: '당헌당규를 찾을 수 없습니다'
            });
        }

        const attachment = constitution.attachments.find(file => file.filename === filename);
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: '첨부파일을 찾을 수 없습니다'
            });
        }

        const filePath = path.join(uploadDir, filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: '파일이 존재하지 않습니다'
            });
        }

        // 한글 파일명을 위한 적절한 헤더 설정
        const encodedFilename = encodeURIComponent(attachment.originalName);
        const fallbackFilename = attachment.originalName.replace(/[^\x00-\x7F]/g, ""); // ASCII만 남김
        
        res.setHeader('Content-Disposition', 
            `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
        
        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('파일 다운로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '파일 다운로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 전체 자료 다운로드
router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        
        const constitution = await PartyConstitution.findById(id);
        if (!constitution) {
            return res.status(404).json({
                success: false,
                message: '당헌당규를 찾을 수 없습니다'
            });
        }

        if (!constitution.attachments || constitution.attachments.length === 0) {
            return res.status(404).json({
                success: false,
                message: '다운로드할 첨부파일이 없습니다'
            });
        }

        // 첫 번째 첨부파일 다운로드
        const attachment = constitution.attachments[0];
        const filePath = path.join(uploadDir, attachment.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: '파일이 존재하지 않습니다'
            });
        }

        // 한글 파일명을 위한 적절한 헤더 설정
        const encodedFilename = encodeURIComponent(attachment.originalName);
        const fallbackFilename = attachment.originalName.replace(/[^\x00-\x7F]/g, ""); // ASCII만 남김
        
        res.setHeader('Content-Disposition', 
            `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
        
        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('전체 다운로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '다운로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 첨부파일 ID 기반 다운로드 (party-constitution-detail.html용)
router.get('/:id/download/:attachmentId', async (req, res) => {
    try {
        const { id, attachmentId } = req.params;
        
        const constitution = await PartyConstitution.findById(id);
        if (!constitution) {
            return res.status(404).json({
                success: false,
                message: '당헌당규를 찾을 수 없습니다'
            });
        }

        // attachmentId로 첨부파일 찾기 (MongoDB ObjectId 또는 filename)
        const attachment = constitution.attachments.find(file => 
            file._id.toString() === attachmentId || file.filename === attachmentId
        );
        
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: '첨부파일을 찾을 수 없습니다'
            });
        }

        const filePath = path.join(uploadDir, attachment.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: '파일이 존재하지 않습니다'
            });
        }

        // 한글 파일명을 위한 적절한 헤더 설정
        const encodedFilename = encodeURIComponent(attachment.originalName);
        const fallbackFilename = attachment.originalName.replace(/[^\x00-\x7F]/g, ""); // ASCII만 남김
        
        res.setHeader('Content-Disposition', 
            `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
        
        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('첨부파일 다운로드 오류:', error);
        res.status(500).json({
            success: false,
            message: '파일 다운로드 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 조회수 증가
router.post('/:id/views', async (req, res) => {
    try {
        const { id } = req.params;
        
        await PartyConstitution.findByIdAndUpdate(id, { 
            $inc: { views: 1 } 
        });

        res.json({
            success: true,
            message: '조회수가 업데이트되었습니다'
        });
    } catch (error) {
        console.error('조회수 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '조회수 업데이트 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 다운로드 카운트 업데이트
router.post('/:id/download-count', async (req, res) => {
    try {
        const { id } = req.params;
        
        await PartyConstitution.findByIdAndUpdate(id, { 
            $inc: { downloadCount: 1 } 
        });

        res.json({
            success: true,
            message: '다운로드 카운트가 업데이트되었습니다'
        });
    } catch (error) {
        console.error('다운로드 카운트 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '다운로드 카운트 업데이트 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 첨부파일 삭제
router.delete('/:id/attachments/:fileId', async (req, res) => {
    try {
        const { id, fileId } = req.params;
        
        const constitution = await PartyConstitution.findById(id);
        if (!constitution) {
            return res.status(404).json({
                success: false,
                message: '당헌당규를 찾을 수 없습니다'
            });
        }

        const fileIndex = constitution.attachments.findIndex(file => 
            file._id.toString() === fileId || file.filename === fileId
        );

        if (fileIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '첨부파일을 찾을 수 없습니다'
            });
        }

        const fileToDelete = constitution.attachments[fileIndex];
        
        // 실제 파일 삭제
        if (fileToDelete.path && fs.existsSync(fileToDelete.path)) {
            fs.unlinkSync(fileToDelete.path);
        }

        // DB에서 첨부파일 정보 삭제
        constitution.attachments.splice(fileIndex, 1);
        await constitution.save();

        res.json({
            success: true,
            message: '첨부파일이 삭제되었습니다'
        });
    } catch (error) {
        console.error('첨부파일 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '첨부파일 삭제 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 당헌당규 삭제
router.delete('/:id', deleteById(PartyConstitution, '당헌당규'));

module.exports = router; 