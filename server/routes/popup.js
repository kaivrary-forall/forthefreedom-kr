const express = require('express');
const router = express.Router();
const Popup = require('../models/Popup');

// 활성화된 팝업 조회 (공개) / 관리자는 모든 팝업 조회
router.get('/', async (req, res) => {
    try {
        console.log('📢 팝업 조회 API 호출됨, admin:', req.query.admin);
        
        // admin=true 파라미터가 있으면 모든 팝업 조회 (관리자용)
        let popup;
        if (req.query.admin === 'true') {
            popup = await Popup.findOne().sort({ updatedAt: -1 });
        } else {
            popup = await Popup.findOne({ isActive: true }).sort({ updatedAt: -1 });
        }
        
        if (popup) {
            console.log('📢 팝업 조회 결과:', popup.title);
            console.log('📢 titleHtml 조회:', popup.titleHtml);
            console.log('📢 subtitleHtml 조회:', popup.subtitleHtml);
            console.log('📢 전체 팝업 데이터:', JSON.stringify(popup, null, 2));
        } else {
            console.log('📢 팝업 없음');
        }
        
        res.json({
            success: true,
            data: popup
        });
    } catch (error) {
        console.error('팝업 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '팝업을 불러오는데 실패했습니다.'
        });
    }
});

// 팝업 생성/수정 (관리자)
router.post('/', async (req, res) => {
    try {
        const { title, titleHtml, subtitle, subtitleHtml, defaultTextColor, titleLineHeight, subtitleLineHeight, link, linkText, isActive, christmasMode } = req.body;
        
        console.log('📢 팝업 저장 요청:', { title, titleHtml: titleHtml ? '있음' : '없음', subtitleHtml: subtitleHtml ? '있음' : '없음', christmasMode });
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: '제목은 필수입니다.'
            });
        }
        
        // 기존 팝업이 있으면 수정, 없으면 생성 (최근 수정된 것 기준)
        let popup = await Popup.findOne().sort({ updatedAt: -1 });
        
        if (popup) {
            console.log('📢 기존 팝업 수정:', popup._id);
            popup.title = title;
            popup.titleHtml = titleHtml || title;
            popup.subtitle = subtitle || '';
            popup.subtitleHtml = subtitleHtml || subtitle || '';
            popup.defaultTextColor = defaultTextColor || '#ffffff';
            popup.titleLineHeight = titleLineHeight || 1.2;
            popup.subtitleLineHeight = subtitleLineHeight || 1.6;
            popup.link = link || '';
            popup.linkText = linkText || '자세히 보기';
            popup.isActive = isActive !== undefined ? isActive : true;
            popup.christmasMode = christmasMode !== undefined ? christmasMode : false;
            await popup.save();
        } else {
            console.log('📢 새 팝업 생성');
            popup = await Popup.create({
                title,
                titleHtml: titleHtml || title,
                subtitle: subtitle || '',
                subtitleHtml: subtitleHtml || subtitle || '',
                defaultTextColor: defaultTextColor || '#ffffff',
                titleLineHeight: titleLineHeight || 1.2,
                subtitleLineHeight: subtitleLineHeight || 1.6,
                link: link || '',
                linkText: linkText || '자세히 보기',
                isActive: isActive !== undefined ? isActive : true,
                christmasMode: christmasMode !== undefined ? christmasMode : false
            });
        }
        
        console.log('📢 팝업 저장됨:', popup.title);
        console.log('📢 titleHtml 저장됨:', popup.titleHtml);
        console.log('📢 subtitleHtml 저장됨:', popup.subtitleHtml);
        
        res.json({
            success: true,
            data: popup,
            message: '팝업이 저장되었습니다.'
        });
    } catch (error) {
        console.error('팝업 저장 오류:', error);
        res.status(500).json({
            success: false,
            message: '팝업 저장에 실패했습니다.'
        });
    }
});

// 모든 팝업 완전 삭제 (관리자) - DB 정리용
router.delete('/all/clear', async (req, res) => {
    try {
        const result = await Popup.deleteMany({});
        console.log('📢 모든 팝업 삭제됨:', result.deletedCount, '개');
        
        res.json({
            success: true,
            message: `${result.deletedCount}개의 팝업이 삭제되었습니다.`
        });
    } catch (error) {
        console.error('팝업 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '팝업 삭제에 실패했습니다.'
        });
    }
});

// 팝업 비활성화 (관리자)
router.delete('/:id', async (req, res) => {
    try {
        const popup = await Popup.findById(req.params.id);
        
        if (!popup) {
            return res.status(404).json({
                success: false,
                message: '팝업을 찾을 수 없습니다.'
            });
        }
        
        popup.isActive = false;
        await popup.save();
        
        console.log('📢 팝업 비활성화됨:', popup.title);
        
        res.json({
            success: true,
            message: '팝업이 비활성화되었습니다.'
        });
    } catch (error) {
        console.error('팝업 비활성화 오류:', error);
        res.status(500).json({
            success: false,
            message: '팝업 비활성화에 실패했습니다.'
        });
    }
});

module.exports = router;
