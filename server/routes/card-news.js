const express = require('express');
const multer = require('multer');
const router = express.Router();
const { CardNews } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// Cloudinary 업로드 유틸리티
const { uploadGalleryImages } = require('../utils/cloudinary');

// multer 메모리 스토리지
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 이미지 형식입니다.'), false);
        }
    }
});

// 카드뉴스 목록 조회
router.get('/', getAll(CardNews, '카드뉴스'));

// 카드뉴스 단일 조회
router.get('/:id', getById(CardNews, '카드뉴스'));

// 카드뉴스 생성
router.post('/', upload.array('attachments', 20), async (req, res) => {
    try {
        console.log('🔍 카드뉴스 생성 요청');
        console.log('📁 첨부파일:', req.files ? req.files.length : 0);
        
        const data = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '뉴미디어',
            status: req.body.status || 'published'
        };

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                data.tags = req.body.tags;
            } else {
                data.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        // Cloudinary 업로드
        if (req.files && req.files.length > 0) {
            console.log(`📤 ${req.files.length}개 이미지 Cloudinary 업로드 시작...`);
            data.attachments = await uploadGalleryImages(req.files, 'freeinno/card-news');
            data.imageCount = data.attachments.length;
            console.log(`✅ ${data.attachments.length}개 이미지 업로드 완료`);
        }

        const cardNews = new CardNews(data);
        await cardNews.save();

        console.log('✅ 카드뉴스 저장 성공:', cardNews._id);

        res.status(201).json({
            success: true,
            data: cardNews,
            message: '카드뉴스가 생성되었습니다'
        });
    } catch (error) {
        console.error('❌ 카드뉴스 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '카드뉴스 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 카드뉴스 수정
router.put('/:id', upload.array('attachments', 20), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔄 카드뉴스 수정 요청:', id);
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category,
            author: req.body.author || '뉴미디어',
            status: req.body.status || 'published'
        };

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                updateData.tags = req.body.tags;
            } else {
                updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        const existing = await CardNews.findById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: '카드뉴스를 찾을 수 없습니다'
            });
        }

        // 새 이미지 업로드
        if (req.files && req.files.length > 0) {
            console.log(`📤 ${req.files.length}개 이미지 Cloudinary 업로드 시작...`);
            updateData.attachments = await uploadGalleryImages(req.files, 'freeinno/card-news');
            updateData.imageCount = updateData.attachments.length;
            console.log(`✅ ${updateData.attachments.length}개 이미지 업로드 완료`);
        } else if (req.body.existingAttachments) {
            try {
                updateData.attachments = JSON.parse(req.body.existingAttachments);
                updateData.imageCount = updateData.attachments.length;
            } catch (e) {
                console.warn('기존 첨부파일 파싱 오류:', e);
            }
        }

        const cardNews = await CardNews.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('✅ 카드뉴스 수정 성공:', cardNews._id);

        res.json({
            success: true,
            data: cardNews,
            message: '카드뉴스가 수정되었습니다'
        });
    } catch (error) {
        console.error('❌ 카드뉴스 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '카드뉴스 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 카드뉴스 삭제
router.delete('/:id', deleteById(CardNews, '카드뉴스'));

module.exports = router;
