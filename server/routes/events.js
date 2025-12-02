const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Event } = require('../models');
const { getAll, getById, deleteById } = require('../controllers/baseController');

// 공통 업로드 유틸리티 (한글 파일명 지원)
const { uploads, createAttachmentsInfo, uploadDir } = require('../utils/upload');
const upload = uploads.event;

// 주요일정 목록 조회
router.get('/', async (req, res) => {
    try {
        const { year, month, page = 1, limit = 10 } = req.query;
        
        console.log('🔍 Events API 요청 파라미터:');
        console.log('year:', year, typeof year);
        console.log('month:', month, typeof month);
        console.log('page:', page, typeof page);
        console.log('limit:', limit, typeof limit);
        
        // 년도/월별 필터링이 요청된 경우 (캘린더용)
        if (year && month) {
            console.log('📅 캘린더용 요청 처리 시작');
            
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            
            console.log('📍 날짜 범위:', startDate, '~', endDate);
            
            const events = await Event.find({
                eventDate: {
                    $gte: startDate,
                    $lte: endDate
                },
                status: 'published'
            }).sort({ eventDate: 1 });
            
            console.log('📊 조회된 이벤트 수:', events.length);
            
            // 캘린더 형태로 데이터 변환
            const eventsData = {};
            events.forEach(event => {
                // 한국 시간대 기준으로 날짜 키 생성 (UTC+9)
                const koreaTime = new Date(event.eventDate.getTime() + (9 * 60 * 60 * 1000));
                const dateKey = koreaTime.toISOString().split('T')[0];
                
                if (!eventsData[dateKey]) {
                    eventsData[dateKey] = [];
                }
                
                // 시간 표시용 (한국 시간대)
                const timeString = event.eventDate.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Seoul'
                });
                
                console.log(`📅 이벤트 매핑: ${event.title} -> 원본날짜: ${event.eventDate} -> 키: ${dateKey} -> 시간: ${timeString}`);
                
                eventsData[dateKey].push({
                    id: event._id,
                    title: event.title,
                    time: timeString,
                    location: event.eventLocation,
                    category: event.category,
                    description: event.excerpt || '',
                    organizer: event.organizer,
                    originalDate: event.eventDate.toISOString()
                });
            });
            
            console.log('📦 변환된 eventsData:', eventsData);
            console.log('📈 eventsData 키 개수:', Object.keys(eventsData).length);
            
            return res.json({
                success: true,
                data: eventsData,
                message: `${year}년 ${month}월 일정을 불러왔습니다`
            });
        }
        
        console.log('📝 일반 목록 조회 처리');
        
        // 일반 목록 조회 (관리자용)
        const skip = (page - 1) * limit;
        const query = { status: 'published' };
        
        const events = await Event.find(query)
            .sort({ eventDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Event.countDocuments(query);
        
        res.json({
            success: true,
            data: events,
            pagination: {
                total,
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            },
            message: '주요일정 목록을 조회했습니다'
        });
        
    } catch (error) {
        console.error('주요일정 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: error.message || '주요일정 조회 중 오류가 발생했습니다'
        });
    }
});

// 주요일정 단일 조회
router.get('/:id', getById(Event));

// 주요일정 생성
router.post('/', upload.array('attachments', 10), async (req, res) => {
    try {
        const eventData = { ...req.body };
        
        // 태그 처리
        if (eventData.tags && typeof eventData.tags === 'string') {
            eventData.tags = eventData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // 첨부파일 처리 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            eventData.attachments = createAttachmentsInfo(req.files);
        }
        
        const event = new Event(eventData);
        await event.save();
        
        res.status(201).json({
            success: true,
            message: '주요일정이 생성되었습니다.',
            data: event
        });
    } catch (error) {
        console.error('주요일정 생성 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '주요일정 생성 중 오류가 발생했습니다'
        });
    }
});

// 주요일정 수정
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
    try {
        const eventData = { ...req.body };
        
        // 태그 처리
        if (eventData.tags && typeof eventData.tags === 'string') {
            eventData.tags = eventData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // 첨부파일 처리 (한글 파일명 자동 복원)
        if (req.files && req.files.length > 0) {
            const newAttachments = createAttachmentsInfo(req.files);
            eventData.attachments = newAttachments;
        }
        
        const event = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: '주요일정을 찾을 수 없습니다.'
            });
        }
        
        res.json({
            success: true,
            message: '주요일정이 수정되었습니다.',
            data: event
        });
    } catch (error) {
        console.error('주요일정 수정 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '주요일정 수정 중 오류가 발생했습니다'
        });
    }
});

// 주요일정 삭제
router.delete('/:id', deleteById(Event, '주요일정'));

// 조회수 증가
router.patch('/:id/view', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: '주요일정을 찾을 수 없습니다.'
            });
        }
        
        res.json({
            success: true,
            data: { views: event.views }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 