const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Notice } = require('../models');
const { deleteById } = require('../controllers/baseController');

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

// 공지사항 목록 조회 (thumbnailUrl 가공)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (req.query.status && req.query.status !== 'all') {
            query.status = req.query.status;
        } else if (!req.query.status) {
            query.status = 'published';
        }
        
        if (req.query.category) {
            query.category = req.query.category;
        }

        const total = await Notice.countDocuments(query);
        
        // 정렬 파라미터
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = (req.query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;
        const sortOptions = { [sortField]: sortOrder };
        
        // 중요 공지 우선 정렬
        if (sortField === 'createdAt') {
            sortOptions.isImportant = -1;
            sortOptions.priority = -1;
        }
        
        const data = await Notice.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        // thumbnailUrl 가공
        const processedData = data.map(item => {
            const thumbnailUrl = item.attachments?.[0]?.url || item.attachments?.[0]?.path || null;
            return {
                ...item,
                thumbnailUrl,
                imageUrl: thumbnailUrl
            };
        });

        res.json({
            success: true,
            data: processedData,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('공지사항 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지사항 목록 조회 중 오류가 발생했습니다'
        });
    }
});

// 공지사항 단일 조회 (thumbnailUrl 가공)
router.get('/:id', async (req, res) => {
    try {
        const item = await Notice.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: '공지사항을 찾을 수 없습니다'
            });
        }

        const thumbnailUrl = item.attachments?.[0]?.url || item.attachments?.[0]?.path || null;
        
        res.json({
            success: true,
            data: {
                ...item,
                thumbnailUrl,
                imageUrl: thumbnailUrl
            }
        });
    } catch (error) {
        console.error('공지사항 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '공지사항 조회 중 오류가 발생했습니다'
        });
    }
});

// 공지사항 생성
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('🔍 공지사항 생성 요청');
        console.log('📁 첨부파일:', req.files ? req.files.length : 0);
        
        const data = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt || '',
            category: req.body.category || '일반',
            priority: parseInt(req.body.priority) || 0,
            author: req.body.author || '관리자',
            isImportant: req.body.isImportant === 'true',
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
            console.log('📤 ' + req.files.length + '개 이미지 Cloudinary 업로드 시작...');
            data.attachments = await uploadGalleryImages(req.files, 'freeinno/notices');
            console.log('✅ ' + data.attachments.length + '개 이미지 업로드 완료');
        }

        const notice = new Notice(data);
        await notice.save();

        // 응답에 thumbnailUrl 포함
        const thumbnailUrl = data.attachments?.[0]?.url || null;

        console.log('✅ 공지사항 저장 성공:', notice._id);

        res.status(201).json({
            success: true,
            data: {
                ...notice.toObject(),
                thumbnailUrl,
                imageUrl: thumbnailUrl
            },
            message: '공지사항이 생성되었습니다'
        });
    } catch (error) {
        console.error('❌ 공지사항 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '공지사항 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 공지사항 수정
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔄 공지사항 수정 요청:', id);
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt || '',
            category: req.body.category || '일반',
            priority: parseInt(req.body.priority) || 0,
            author: req.body.author || '관리자',
            isImportant: req.body.isImportant === 'true',
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

        const existing = await Notice.findById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: '공지사항을 찾을 수 없습니다'
            });
        }

        // 새 이미지 업로드
        if (req.files && req.files.length > 0) {
            console.log('📤 ' + req.files.length + '개 이미지 Cloudinary 업로드 시작...');
            updateData.attachments = await uploadGalleryImages(req.files, 'freeinno/notices');
            console.log('✅ ' + updateData.attachments.length + '개 이미지 업로드 완료');
        } else if (req.body.existingAttachments) {
            try {
                updateData.attachments = JSON.parse(req.body.existingAttachments);
            } catch (e) {
                console.warn('기존 첨부파일 파싱 오류:', e);
            }
        }

        const notice = await Notice.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // 응답에 thumbnailUrl 포함
        const thumbnailUrl = notice.attachments?.[0]?.url || notice.attachments?.[0]?.path || null;

        console.log('✅ 공지사항 수정 성공:', notice._id);

        res.json({
            success: true,
            data: {
                ...notice.toObject(),
                thumbnailUrl,
                imageUrl: thumbnailUrl
            },
            message: '공지사항이 수정되었습니다'
        });
    } catch (error) {
        console.error('❌ 공지사항 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '공지사항 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 공지사항 삭제
router.delete('/:id', deleteById(Notice, '공지사항'));

module.exports = router;
