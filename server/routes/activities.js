const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Activity } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// Cloudinary 업로드 유틸리티
const { uploadGalleryImages } = require('../utils/cloudinary');

// multer 메모리 스토리지 (Cloudinary로 바로 업로드)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 이미지 형식입니다.'), false);
        }
    }
});

// 활동자료 목록 조회 (thumbnailUrl 가공)
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

        const total = await Activity.countDocuments(query);
        const data = await Activity.find(query)
            .sort({ createdAt: -1 })
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
        console.error('활동자료 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '활동자료 목록 조회 중 오류가 발생했습니다'
        });
    }
});

// 활동자료 단일 조회 (thumbnailUrl 가공)
router.get('/:id', async (req, res) => {
    try {
        const item = await Activity.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: '활동자료를 찾을 수 없습니다'
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
        console.error('활동자료 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '활동자료 조회 중 오류가 발생했습니다'
        });
    }
});

// 활동자료 생성 (Cloudinary 업로드)
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        console.log('🔍 활동자료 생성 요청 받음');
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

        // Cloudinary로 이미지 업로드
        if (req.files && req.files.length > 0) {
            console.log(`📤 ${req.files.length}개 이미지 Cloudinary 업로드 시작...`);
            activityData.attachments = await uploadGalleryImages(req.files, 'freeinno/activities');
            console.log(`✅ ${activityData.attachments.length}개 이미지 업로드 완료`);
        }

        const activity = new Activity(activityData);
        await activity.save();

        // 응답에 thumbnailUrl 포함
        const thumbnailUrl = activityData.attachments?.[0]?.url || null;

        console.log('✅ 활동자료 저장 성공:', activity._id);

        res.status(201).json({
            success: true,
            data: {
                ...activity.toObject(),
                thumbnailUrl,
                imageUrl: thumbnailUrl
            },
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

// 활동자료 수정 (Cloudinary 업로드)
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔄 활동자료 수정 요청:', id);
        
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

        // 기존 활동자료 확인
        const existingActivity = await Activity.findById(id);
        if (!existingActivity) {
            return res.status(404).json({
                success: false,
                message: '활동자료를 찾을 수 없습니다'
            });
        }

        // 새 이미지가 있으면 Cloudinary로 업로드
        if (req.files && req.files.length > 0) {
            console.log(`📤 ${req.files.length}개 이미지 Cloudinary 업로드 시작...`);
            updateData.attachments = await uploadGalleryImages(req.files, 'freeinno/activities');
            console.log(`✅ ${updateData.attachments.length}개 이미지 업로드 완료`);
        }
        // 새 이미지가 없고 기존 첨부파일 유지 요청이 있으면
        else if (req.body.existingAttachments) {
            try {
                updateData.attachments = JSON.parse(req.body.existingAttachments);
            } catch (e) {
                console.warn('기존 첨부파일 파싱 오류:', e);
                updateData.attachments = existingActivity.attachments || [];
            }
        }

        const activity = await Activity.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // 응답에 thumbnailUrl 포함
        const thumbnailUrl = activity.attachments?.[0]?.url || activity.attachments?.[0]?.path || null;

        console.log('✅ 활동자료 수정 성공:', activity._id);

        res.json({
            success: true,
            data: {
                ...activity.toObject(),
                thumbnailUrl,
                imageUrl: thumbnailUrl
            },
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
