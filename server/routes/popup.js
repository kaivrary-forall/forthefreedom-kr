const express = require('express');
const router = express.Router();
const Popup = require('../models/Popup');

// 활성화된 팝업 조회 (공개)
router.get('/', async (req, res) => {
    try {
        console.log('📢 팝업 조회 API 호출됨');
        const popup = await Popup.findOne({ isActive: true }).sort({ updatedAt: -1 });
        
        if (popup) {
            console.log('📢 팝업 조회 결과:', popup.title);
        } else {
            console.log('📢 활성화된 팝업 없음');
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
        const { title, subtitle, textColor, link, linkText, isActive } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: '제목은 필수입니다.'
            });
        }
        
        // 기존 팝업이 있으면 수정, 없으면 생성
        let popup = await Popup.findOne();
        
        if (popup) {
            popup.title = title;
            popup.subtitle = subtitle || '';
            popup.textColor = textColor || '#ffffff';
            popup.link = link || '';
            popup.linkText = linkText || '자세히 보기';
            popup.isActive = isActive !== undefined ? isActive : true;
            await popup.save();
        } else {
            popup = await Popup.create({
                title,
                subtitle: subtitle || '',
                textColor: textColor || '#ffffff',
                link: link || '',
                linkText: linkText || '자세히 보기',
                isActive: isActive !== undefined ? isActive : true
            });
        }
        
        console.log('📢 팝업 저장됨:', popup.title);
        
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
