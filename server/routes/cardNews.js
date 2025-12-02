const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { CardNews } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.cardNews;

// 카드뉴스 목록 조회
router.get('/', getAll(CardNews, '카드뉴스'));

// 카드뉴스 단일 조회
router.get('/:id', getById(CardNews));

// 카드뉴스 생성
router.post('/', upload.array('attachments', 20), async (req, res) => {
    try {
        const cardNewsData = { ...req.body };
        
        // 이미지 개수 처리
        if (cardNewsData.imageCount) {
            cardNewsData.imageCount = parseInt(cardNewsData.imageCount);
        }
        
        // 태그 처리
        if (cardNewsData.tags && typeof cardNewsData.tags === 'string') {
            cardNewsData.tags = cardNewsData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // 첨부파일 처리 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            cardNewsData.attachments = createAttachmentsInfo(req.files);
        }
        
        const cardNews = new CardNews(cardNewsData);
        await cardNews.save();
        
        res.status(201).json({
            success: true,
            message: '카드뉴스가 생성되었습니다.',
            data: cardNews
        });
    } catch (error) {
        console.error('카드뉴스 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '카드뉴스 생성 중 오류가 발생했습니다'
        });
    }
});

// 카드뉴스 수정
router.put('/:id', upload.array('attachments', 20), async (req, res) => {
    try {
        console.log('🔄 카드뉴스 수정 요청:', req.params.id);
        console.log('📋 요청 body:', req.body);
        console.log('📁 새 파일들:', req.files ? req.files.length : 0);
        
        const cardNewsData = { ...req.body };
        
        // 이미지 개수 처리
        if (cardNewsData.imageCount) {
            cardNewsData.imageCount = parseInt(cardNewsData.imageCount);
        }
        
        // 태그 처리
        if (cardNewsData.tags && typeof cardNewsData.tags === 'string') {
            cardNewsData.tags = cardNewsData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // 기존 카드뉴스 조회
        const existingCardNews = await CardNews.findById(req.params.id);
        if (!existingCardNews) {
            return res.status(404).json({
                success: false,
                message: '카드뉴스를 찾을 수 없습니다.'
            });
        }

        console.log('📂 기존 첨부파일들 (DB):', existingCardNews.attachments?.map(att => att.filename) || []);

        // 기존 첨부파일 처리
        let existingAttachments = existingCardNews.attachments || [];
        
        // existingAttachments 파라미터가 있으면 처리 (관리자가 삭제한 파일들 제외)
        if (req.body.existingAttachments) {
            try {
                console.log('📤 전송받은 existingAttachments:', req.body.existingAttachments);
                const keepAttachments = JSON.parse(req.body.existingAttachments);
                console.log('📂 유지할 첨부파일들:', keepAttachments.map(att => att.filename));
                
                // 삭제된 파일들의 실제 파일 삭제
                const deletedAttachments = existingAttachments.filter(existing => 
                    !keepAttachments.some(keep => keep.filename === existing.filename)
                );
                
                console.log('🗑️ 삭제될 파일들:', deletedAttachments.map(att => att.filename));
                
                for (const deleted of deletedAttachments) {
                    const filePath = path.join(uploadDir, deleted.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log('🗑️ 파일 삭제됨:', deleted.filename);
                    } else {
                        console.log('⚠️ 파일이 이미 없음:', deleted.filename);
                    }
                }
                
                existingAttachments = keepAttachments;
                console.log('✅ 첨부파일 업데이트 완료:', existingAttachments.map(att => att.filename));
            } catch (e) {
                console.error('❌ 기존 첨부파일 파싱 오류:', e);
            }
        } else {
            console.log('📤 existingAttachments 파라미터가 없음 - 기존 파일 모두 유지');
        }
        
        // 새로운 첨부파일 추가 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);
            console.log('📁 새로 추가할 파일들:', newAttachments.map(att => att.filename));
            cardNewsData.attachments = [...existingAttachments, ...newAttachments];
        } else {
            cardNewsData.attachments = existingAttachments;
        }
        
        console.log('💾 최종 저장할 첨부파일들:', cardNewsData.attachments?.map(att => att.filename) || []);
        
        const cardNews = await CardNews.findByIdAndUpdate(req.params.id, cardNewsData, { new: true });
        
        console.log('✅ 카드뉴스 수정 완료:', cardNews._id);
        console.log('📂 저장된 첨부파일들:', cardNews.attachments?.map(att => att.filename) || []);
        
        res.json({
            success: true,
            message: '카드뉴스가 수정되었습니다.',
            data: cardNews
        });
    } catch (error) {
        console.error('❌ 카드뉴스 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '카드뉴스 수정 중 오류가 발생했습니다'
        });
    }
});

// 카드뉴스 삭제
router.delete('/:id', deleteById(CardNews, '카드뉴스'));

// 조회수 증가
router.patch('/:id/view', async (req, res) => {
    try {
        const cardNews = await CardNews.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!cardNews) {
            return res.status(404).json({
                success: false,
                message: '카드뉴스를 찾을 수 없습니다.'
            });
        }
        
        res.json({
            success: true,
            data: { views: cardNews.views }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 