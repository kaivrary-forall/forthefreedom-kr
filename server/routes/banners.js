const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const BannerSettings = require('../models/BannerSettings');

// 공통 업로드 유틸리티
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.notice; // notice 업로더 재사용

// 배너 설정 조회
router.get('/settings', async (req, res) => {
    try {
        let settings = await BannerSettings.findOne();
        
        // 설정이 없으면 기본값 생성
        if (!settings) {
            settings = await BannerSettings.create({
                randomOrder: false,
                autoPlayInterval: 5000
            });
        }
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('배너 설정 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 설정 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 설정 업데이트
router.put('/settings', async (req, res) => {
    try {
        const { randomOrder, autoPlayInterval } = req.body;
        
        let settings = await BannerSettings.findOne();
        
        if (!settings) {
            settings = new BannerSettings();
        }
        
        if (randomOrder !== undefined) settings.randomOrder = randomOrder;
        if (autoPlayInterval !== undefined) settings.autoPlayInterval = autoPlayInterval;
        
        await settings.save();
        
        res.json({
            success: true,
            data: settings,
            message: '배너 설정이 업데이트되었습니다'
        });
    } catch (error) {
        console.error('배너 설정 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 설정 업데이트 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 목록 조회 (활성화된 것만, 순서대로)
router.get('/', async (req, res) => {
    try {
        const { all } = req.query; // ?all=true 면 비활성 포함
        
        const filter = all === 'true' ? {} : { isActive: true };
        const banners = await Banner.find(filter).sort({ order: 1 });
        
        res.json({
            success: true,
            data: banners,
            count: banners.length
        });
    } catch (error) {
        console.error('배너 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 목록 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 단일 조회
router.get('/:id', async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: '배너를 찾을 수 없습니다'
            });
        }
        
        res.json({
            success: true,
            data: banner
        });
    } catch (error) {
        console.error('배너 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 생성 (PC/모바일 이미지 업로드 포함)
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), async (req, res) => {
    try {
        console.log('📸 배너 업로드 요청');
        console.log('📁 PC 파일:', req.files?.image ? req.files.image[0].filename : '없음');
        console.log('📁 모바일 파일:', req.files?.mobileImage ? req.files.mobileImage[0].filename : '없음');
        console.log('📝 데이터:', req.body);
        
        // PC 이미지와 모바일 이미지 둘 다 없으면 에러
        if (!req.files?.image && !req.files?.mobileImage) {
            return res.status(400).json({
                success: false,
                message: 'PC용 또는 모바일용 이미지 중 하나는 필요합니다'
            });
        }
        
        const { title, subtitle, linkUrl, linkText, source, sourceColor, order, isActive, imageActive, mobileImageActive } = req.body;
        
        // 이미지 URL 생성 (Railway 환경 대응)
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.BASE_URL || 'https://forthefreedom-kr-production.up.railway.app'
            : 'http://localhost:9000';
        
        const bannerData = {
            title: title || '',
            subtitle: subtitle || '',
            linkUrl: linkUrl || '',
            linkText: linkText || '자세히 보기',
            source: source || '',
            sourceColor: sourceColor || 'white',
            order: parseInt(order) || 0,
            isActive: isActive !== 'false',
            imageActive: imageActive !== 'false',
            mobileImageActive: mobileImageActive !== 'false'
        };
        
        // PC 이미지가 있으면 추가
        if (req.files?.image) {
            bannerData.imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
            bannerData.originalName = req.files.image[0].originalname;
        }
        
        // 모바일 이미지가 있으면 추가
        if (req.files?.mobileImage) {
            bannerData.mobileImageUrl = `${baseUrl}/uploads/${req.files.mobileImage[0].filename}`;
            bannerData.mobileOriginalName = req.files.mobileImage[0].originalname;
        }
        
        const banner = new Banner(bannerData);
        await banner.save();
        
        console.log('✅ 배너 생성 완료:', banner._id);
        
        res.status(201).json({
            success: true,
            data: banner,
            message: '배너가 생성되었습니다'
        });
    } catch (error) {
        console.error('배너 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 생성 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 수정
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, subtitle, linkUrl, linkText, source, sourceColor, order, isActive, imageActive, mobileImageActive, removeImage, removeMobileImage } = req.body;
        
        const existingBanner = await Banner.findById(req.params.id);
        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: '배너를 찾을 수 없습니다'
            });
        }
        
        const updateData = {
            title: title || existingBanner.title,
            subtitle: subtitle !== undefined ? subtitle : existingBanner.subtitle,
            linkUrl: linkUrl !== undefined ? linkUrl : existingBanner.linkUrl,
            linkText: linkText || existingBanner.linkText,
            source: source !== undefined ? source : existingBanner.source,
            sourceColor: sourceColor || existingBanner.sourceColor || 'white',
            order: order !== undefined ? parseInt(order) : existingBanner.order,
            isActive: isActive !== undefined ? isActive !== 'false' : existingBanner.isActive,
            imageActive: imageActive !== undefined ? imageActive !== 'false' : existingBanner.imageActive,
            mobileImageActive: mobileImageActive !== undefined ? mobileImageActive !== 'false' : existingBanner.mobileImageActive
        };
        
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.BASE_URL || 'https://forthefreedom-kr-production.up.railway.app'
            : 'http://localhost:9000';
        
        // PC 이미지 처리
        if (removeImage === 'true') {
            updateData.imageUrl = '';
            updateData.originalName = '';
        } else if (req.files?.image) {
            updateData.imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
            updateData.originalName = req.files.image[0].originalname;
        }
        
        // 모바일 이미지 처리
        if (removeMobileImage === 'true') {
            updateData.mobileImageUrl = '';
            updateData.mobileOriginalName = '';
        } else if (req.files?.mobileImage) {
            updateData.mobileImageUrl = `${baseUrl}/uploads/${req.files.mobileImage[0].filename}`;
            updateData.mobileOriginalName = req.files.mobileImage[0].originalname;
        }
        
        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            data: banner,
            message: '배너가 수정되었습니다'
        });
    } catch (error) {
        console.error('배너 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 수정 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 순서 일괄 업데이트
router.put('/reorder/bulk', async (req, res) => {
    try {
        const { orders } = req.body; // [{ id: '...', order: 0 }, { id: '...', order: 1 }]
        
        if (!Array.isArray(orders)) {
            return res.status(400).json({
                success: false,
                message: '순서 데이터가 필요합니다'
            });
        }
        
        const updatePromises = orders.map(item => 
            Banner.findByIdAndUpdate(item.id, { order: item.order })
        );
        
        await Promise.all(updatePromises);
        
        res.json({
            success: true,
            message: '배너 순서가 업데이트되었습니다'
        });
    } catch (error) {
        console.error('배너 순서 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 순서 업데이트 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 배너 삭제
router.delete('/:id', async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: '배너를 찾을 수 없습니다'
            });
        }
        
        res.json({
            success: true,
            message: '배너가 삭제되었습니다'
        });
    } catch (error) {
        console.error('배너 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '배너 삭제 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

module.exports = router;
