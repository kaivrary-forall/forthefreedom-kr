const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Event } = require('../models');
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

// 행사 목록 조회 (thumbnailUrl 가공)
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

        // 예정된 행사만 필터링
        if (req.query.upcoming === 'true') {
            query.eventDate = { $gte: new Date() };
        }

        const total = await Event.countDocuments(query);
        
        // 정렬 파라미터 (관리자: createdAt desc, 사용자: eventDate asc)
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = (req.query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;
        const sortOptions = { [sortField]: sortOrder };
        if (sortField !== 'createdAt') sortOptions.createdAt = -1;
        
        const data = await Event.find(query)
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
        console.error('행사 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '행사 목록 조회 중 오류가 발생했습니다'
        });
    }
});

// 행사 단일 조회 (thumbnailUrl 가공)
router.get('/:id', async (req, res) => {
    try {
        const item = await Event.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: '행사를 찾을 수 없습니다'
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
        console.error('행사 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '행사 조회 중 오류가 발생했습니다'
        });
    }
});

// 행사 생성
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('🔍 행사 생성 요청');
        console.log('📁 첨부파일:', req.files ? req.files.length : 0);
        
        const data = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category || '당 행사',
            author: req.body.author || '기획조정실',
            eventDate: req.body.eventDate ? new Date(req.body.eventDate) : new Date(),
            eventLocation: req.body.eventLocation,
            organizer: req.body.organizer || '자유와혁신당',
            contact: req.body.contact || '',
            status: req.body.status || 'published'
        };

        // 종료일 처리
        if (req.body.endDate) {
            data.endDate = new Date(req.body.endDate);
        }

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
            data.attachments = await uploadGalleryImages(req.files, 'freeinno/events');
            console.log('✅ ' + data.attachments.length + '개 이미지 업로드 완료');
        }

        const event = new Event(data);
        await event.save();

        // 응답에 thumbnailUrl 포함
        const thumbnailUrl = data.attachments?.[0]?.url || null;

        console.log('✅ 행사 저장 성공:', event._id);

        res.status(201).json({
            success: true,
            data: {
                ...event.toObject(),
                thumbnailUrl,
                imageUrl: thumbnailUrl
            },
            message: '행사가 생성되었습니다'
        });
    } catch (error) {
        console.error('❌ 행사 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: '행사 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 행사 수정
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔄 행사 수정 요청:', id);
        
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            category: req.body.category || '당 행사',
            author: req.body.author || '기획조정실',
            eventLocation: req.body.eventLocation,
            organizer: req.body.organizer || '자유와혁신당',
            contact: req.body.contact || '',
            status: req.body.status || 'published'
        };

        if (req.body.eventDate) {
            updateData.eventDate = new Date(req.body.eventDate);
        }

        if (req.body.endDate) {
            updateData.endDate = new Date(req.body.endDate);
        }

        // 태그 처리
        if (req.body.tags) {
            if (Array.isArray(req.body.tags)) {
                updateData.tags = req.body.tags;
            } else {
                updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        const existing = await Event.findById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: '행사를 찾을 수 없습니다'
            });
        }

        // 새 이미지 업로드
        if (req.files && req.files.length > 0) {
            console.log('📤 ' + req.files.length + '개 이미지 Cloudinary 업로드 시작...');
            updateData.attachments = await uploadGalleryImages(req.files, 'freeinno/events');
            console.log('✅ ' + updateData.attachments.length + '개 이미지 업로드 완료');
        } else if (req.body.existingAttachments) {
            try {
                updateData.attachments = JSON.parse(req.body.existingAttachments);
            } catch (e) {
                console.warn('기존 첨부파일 파싱 오류:', e);
            }
        }

        const event = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // 응답에 thumbnailUrl 포함
        const thumbnailUrl = event.attachments?.[0]?.url || event.attachments?.[0]?.path || null;

        console.log('✅ 행사 수정 성공:', event._id);

        res.json({
            success: true,
            data: {
                ...event.toObject(),
                thumbnailUrl,
                imageUrl: thumbnailUrl
            },
            message: '행사가 수정되었습니다'
        });
    } catch (error) {
        console.error('❌ 행사 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: '행사 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 행사 삭제
router.delete('/:id', deleteById(Event, '행사'));

module.exports = router;
