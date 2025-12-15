const express = require('express');
const router = express.Router();
const SideCardSettings = require('../models/SideCardSettings');
const Notice = require('../models/Notice');
const Spokesperson = require('../models/Spokesperson');
const Events = require('../models/Events');
const Activity = require('../models/Activity');
const MediaCoverage = require('../models/MediaCoverage');
const Personnel = require('../models/Personnel');

// 설정 조회
router.get('/settings', async (req, res) => {
    try {
        let settings = await SideCardSettings.findOne();
        
        // 설정이 없으면 기본값 생성
        if (!settings) {
            settings = await SideCardSettings.create({
                displayMode: 'latest',
                cardCount: 4,
                pinnedItems: [],
                showCategories: {
                    notice: true,
                    press: true,
                    event: true,
                    activity: false,
                    media: false,
                    personnel: true
                }
            });
        }
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('사이드카드 설정 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '설정 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 설정 업데이트
router.put('/settings', async (req, res) => {
    try {
        const { displayMode, cardCount, pinnedItems, showCategories } = req.body;
        
        let settings = await SideCardSettings.findOne();
        
        if (!settings) {
            settings = new SideCardSettings();
        }
        
        if (displayMode !== undefined) settings.displayMode = displayMode;
        if (cardCount !== undefined) settings.cardCount = cardCount;
        if (pinnedItems !== undefined) settings.pinnedItems = pinnedItems;
        if (showCategories !== undefined) settings.showCategories = showCategories;
        
        await settings.save();
        
        res.json({
            success: true,
            data: settings,
            message: '설정이 업데이트되었습니다'
        });
    } catch (error) {
        console.error('사이드카드 설정 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '설정 업데이트 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 사이드카드 데이터 조회 (설정에 따라 다양한 콘텐츠 반환)
router.get('/', async (req, res) => {
    try {
        let settings = await SideCardSettings.findOne();
        
        if (!settings) {
            settings = {
                displayMode: 'latest',
                cardCount: 4,
                pinnedItems: [],
                showCategories: {
                    notice: true,
                    press: true,
                    event: true,
                    activity: false,
                    media: false,
                    personnel: true
                }
            };
        }
        
        const { displayMode, cardCount, pinnedItems, showCategories } = settings;
        let items = [];
        
        // 1. pinned 모드: 고정된 아이템만 반환
        if (displayMode === 'pinned' && pinnedItems.length > 0) {
            items = await getPinnedItems(pinnedItems);
        }
        // 2. mixed 모드: 고정 아이템 + 최신 아이템
        else if (displayMode === 'mixed') {
            const pinned = await getPinnedItems(pinnedItems);
            const remaining = cardCount - pinned.length;
            if (remaining > 0) {
                const pinnedIds = pinnedItems.map(p => p.contentId.toString());
                const latest = await getLatestItems(showCategories, remaining, pinnedIds);
                items = [...pinned, ...latest];
            } else {
                items = pinned.slice(0, cardCount);
            }
        }
        // 3. random 모드: 랜덤 아이템
        else if (displayMode === 'random') {
            items = await getRandomItems(showCategories, cardCount);
        }
        // 4. latest 모드 (기본): 최신 아이템
        else {
            items = await getLatestItems(showCategories, cardCount);
        }
        
        res.json({
            success: true,
            data: items.slice(0, cardCount),
            settings: {
                displayMode,
                cardCount
            }
        });
    } catch (error) {
        console.error('사이드카드 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '사이드카드 조회 중 오류가 발생했습니다',
            error: error.message
        });
    }
});

// 고정된 아이템 가져오기
async function getPinnedItems(pinnedItems) {
    const items = [];
    
    for (const pinned of pinnedItems.sort((a, b) => a.order - b.order)) {
        let item = null;
        
        try {
            switch (pinned.contentType) {
                case 'notice':
                    item = await Notice.findById(pinned.contentId);
                    if (item) {
                        items.push({
                            category: '공지사항',
                            title: item.title,
                            content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '',
                            link: `/news/notice-detail.html?id=${item._id}`,
                            date: item.createdAt,
                            isPinned: true
                        });
                    }
                    break;
                case 'press':
                    item = await Spokesperson.findById(pinned.contentId);
                    if (item) {
                        items.push({
                            category: '보도자료',
                            title: item.title,
                            content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '',
                            link: `/news/press-release-detail.html?id=${item._id}`,
                            date: item.createdAt,
                            isPinned: true
                        });
                    }
                    break;
                case 'event':
                    item = await Events.findById(pinned.contentId);
                    if (item) {
                        items.push({
                            category: '일정',
                            title: item.title,
                            content: item.location || '',
                            link: `/news/event-detail.html?id=${item._id}`,
                            date: item.startDate || item.createdAt,
                            isPinned: true
                        });
                    }
                    break;
                case 'activity':
                    item = await Activity.findById(pinned.contentId);
                    if (item) {
                        items.push({
                            category: '활동',
                            title: item.title,
                            content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '',
                            link: `/news/activity-detail.html?id=${item._id}`,
                            date: item.createdAt,
                            isPinned: true
                        });
                    }
                    break;
                case 'media':
                    item = await MediaCoverage.findById(pinned.contentId);
                    if (item) {
                        items.push({
                            category: '언론보도',
                            title: item.title,
                            content: item.source || '',
                            link: `/news/media-detail.html?id=${item._id}`,
                            date: item.publishedAt || item.createdAt,
                            isPinned: true
                        });
                    }
                    break;
                case 'personnel':
                    item = await Personnel.findById(pinned.contentId);
                    if (item) {
                        items.push({
                            category: '인사공고',
                            title: item.title,
                            content: item.excerpt || '',
                            link: `/news/personnel.html`,
                            date: item.createdAt,
                            isPinned: true
                        });
                    }
                    break;
            }
        } catch (e) {
            console.log('고정 아이템 조회 실패:', pinned.contentId);
        }
    }
    
    return items;
}

// 최신 아이템 가져오기
async function getLatestItems(showCategories, limit, excludeIds = []) {
    const items = [];
    
    try {
        // 각 카테고리에서 데이터 가져오기
        if (showCategories.notice) {
            const notices = await Notice.find({ _id: { $nin: excludeIds } })
                .sort({ createdAt: -1 })
                .limit(2);
            notices.forEach(item => {
                items.push({
                    category: '공지사항',
                    title: item.title,
                    content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '',
                    link: `/news/notice-detail.html?id=${item._id}`,
                    date: item.createdAt
                });
            });
        }
        
        if (showCategories.press) {
            const press = await Spokesperson.find({ _id: { $nin: excludeIds } })
                .sort({ createdAt: -1 })
                .limit(2);
            press.forEach(item => {
                items.push({
                    category: '보도자료',
                    title: item.title,
                    content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '',
                    link: `/news/press-release-detail.html?id=${item._id}`,
                    date: item.createdAt
                });
            });
        }
        
        if (showCategories.event) {
            const events = await Events.find({ _id: { $nin: excludeIds } })
                .sort({ startDate: -1 })
                .limit(2);
            events.forEach(item => {
                items.push({
                    category: '일정',
                    title: item.title,
                    content: item.location || '',
                    link: `/news/event-detail.html?id=${item._id}`,
                    date: item.startDate || item.createdAt
                });
            });
        }
        
        if (showCategories.activity) {
            const activities = await Activity.find({ _id: { $nin: excludeIds } })
                .sort({ createdAt: -1 })
                .limit(2);
            activities.forEach(item => {
                items.push({
                    category: '활동',
                    title: item.title,
                    content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '',
                    link: `/news/activity-detail.html?id=${item._id}`,
                    date: item.createdAt
                });
            });
        }
        
        if (showCategories.media) {
            const media = await MediaCoverage.find({ _id: { $nin: excludeIds } })
                .sort({ publishedAt: -1 })
                .limit(2);
            media.forEach(item => {
                items.push({
                    category: '언론보도',
                    title: item.title,
                    content: item.source || '',
                    link: `/news/media-detail.html?id=${item._id}`,
                    date: item.publishedAt || item.createdAt
                });
            });
        }
        
        if (showCategories.personnel) {
            const personnel = await Personnel.find({ _id: { $nin: excludeIds }, status: 'published' })
                .sort({ createdAt: -1 })
                .limit(2);
            personnel.forEach(item => {
                items.push({
                    category: '인사공고',
                    title: item.title,
                    content: item.excerpt || '',
                    link: `/news/personnel.html`,
                    date: item.createdAt
                });
            });
        }
    } catch (e) {
        console.error('최신 아이템 조회 오류:', e);
    }
    
    // 최신순 정렬
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return items.slice(0, limit);
}

// 랜덤 아이템 가져오기
async function getRandomItems(showCategories, limit) {
    const items = await getLatestItems(showCategories, limit * 3); // 많이 가져와서 섞기
    
    // Fisher-Yates 셔플
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    
    return items.slice(0, limit);
}

module.exports = router;
