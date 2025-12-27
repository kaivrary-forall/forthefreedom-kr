const express = require('express');
const router = express.Router();
const SideCardSettings = require('../models/SideCardSettings');
const Notice = require('../models/Notice');
const Spokesperson = require('../models/Spokesperson');
const Events = require('../models/Events');
const Activity = require('../models/Activity');
const MediaCoverage = require('../models/MediaCoverage');
const Personnel = require('../models/Personnel');
const Congratulation = require('../models/Congratulation');
const { authMember, requirePermission } = require('../middleware/authMember');

const triggerRevalidate = async () => {
  if (!process.env.NEXT_REVALIDATE_URL || !process.env.REVALIDATE_SECRET) return;
  try {
    const fetch = require('node-fetch');
    await fetch(process.env.NEXT_REVALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags: ['sidecards'] })
    });
  } catch (e) { console.error('Revalidate 실패:', e.message); }
};

// ==========================================
// 공개 API
// ==========================================
router.get('/settings', async (req, res) => {
  try {
    let settings = await SideCardSettings.findOne();
    if (!settings) {
      settings = await SideCardSettings.create({
        displayMode: 'latest', cardCount: 4, pinnedItems: [],
        showCategories: { notice: true, press: true, event: true, activity: false, media: false, personnel: true, congratulations: true }
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/', async (req, res) => {
  try {
    let settings = await SideCardSettings.findOne();
    if (!settings) {
      settings = { displayMode: 'latest', cardCount: 4, pinnedItems: [],
        showCategories: { notice: true, press: true, event: true, activity: false, media: false, personnel: true, congratulations: true }
      };
    }
    const { displayMode, cardCount, pinnedItems, showCategories } = settings;
    let items = [];
    
    if (displayMode === 'pinned' && pinnedItems.length > 0) {
      items = await getPinnedItems(pinnedItems);
    } else if (displayMode === 'mixed') {
      const pinned = await getPinnedItems(pinnedItems);
      const remaining = cardCount - pinned.length;
      if (remaining > 0) {
        const pinnedIds = pinnedItems.map(p => p.contentId.toString());
        const latest = await getLatestItems(showCategories, remaining, pinnedIds);
        items = [...pinned, ...latest];
      } else { items = pinned.slice(0, cardCount); }
    } else if (displayMode === 'random') {
      items = await getRandomItems(showCategories, cardCount);
    } else {
      items = await getLatestItems(showCategories, cardCount);
    }
    
    res.json({ success: true, data: items.slice(0, cardCount), settings: { displayMode, cardCount } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ==========================================
// 관리자 API (sidecards:write 권한 필요)
// ==========================================
router.put('/settings', authMember, requirePermission('sidecards:write'), async (req, res) => {
  try {
    const { displayMode, cardCount, pinnedItems, showCategories } = req.body;
    let settings = await SideCardSettings.findOne();
    if (!settings) settings = new SideCardSettings();
    if (displayMode !== undefined) settings.displayMode = displayMode;
    if (cardCount !== undefined) settings.cardCount = cardCount;
    if (pinnedItems !== undefined) settings.pinnedItems = pinnedItems;
    if (showCategories !== undefined) settings.showCategories = showCategories;
    await settings.save();
    await triggerRevalidate();
    res.json({ success: true, data: settings, message: '설정이 업데이트되었습니다' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ==========================================
// 헬퍼 함수들
// ==========================================
async function getPinnedItems(pinnedItems) {
  const items = [];
  for (const pinned of pinnedItems.sort((a, b) => a.order - b.order)) {
    try {
      let item = null;
      switch (pinned.contentType) {
        case 'notice':
          item = await Notice.findById(pinned.contentId);
          if (item) items.push({ category: '공지사항', title: item.title, content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '', link: `/news/notice-detail.html?id=${item._id}`, date: item.createdAt, isPinned: true });
          break;
        case 'press':
          item = await Spokesperson.findById(pinned.contentId);
          if (item) items.push({ category: '보도자료', title: item.title, content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '', link: `/news/press-release-detail.html?id=${item._id}`, date: item.createdAt, isPinned: true });
          break;
        case 'event':
          item = await Events.findById(pinned.contentId);
          if (item) items.push({ category: '일정', title: item.title, content: item.location || '', link: `/news/event-detail.html?id=${item._id}`, date: item.startDate || item.createdAt, isPinned: true });
          break;
        case 'activity':
          item = await Activity.findById(pinned.contentId);
          if (item) items.push({ category: '활동', title: item.title, content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '', link: `/news/activity-detail.html?id=${item._id}`, date: item.createdAt, isPinned: true });
          break;
        case 'media':
          item = await MediaCoverage.findById(pinned.contentId);
          if (item) items.push({ category: '언론보도', title: item.title, content: item.source || '', link: `/news/media-detail.html?id=${item._id}`, date: item.publishedAt || item.createdAt, isPinned: true });
          break;
        case 'personnel':
          item = await Personnel.findById(pinned.contentId);
          if (item) items.push({ category: '인사공고', title: item.title, content: item.excerpt || '', link: `/news/personnel.html`, date: item.createdAt, isPinned: true });
          break;
        case 'congratulations':
          item = await Congratulation.findById(pinned.contentId);
          if (item) items.push({ category: '경조사', title: item.title, content: item.content ? item.content.substring(0, 60) : '', link: `/news/congratulations.html`, date: item.createdAt, isPinned: true });
          break;
      }
    } catch {}
  }
  return items;
}

async function getLatestItems(showCategories, limit, excludeIds = []) {
  const items = [];
  try {
    if (showCategories.notice) {
      const notices = await Notice.find({ _id: { $nin: excludeIds } }).sort({ createdAt: -1 }).limit(2);
      notices.forEach(item => items.push({ category: '공지사항', title: item.title, content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '', link: `/news/notice-detail.html?id=${item._id}`, date: item.createdAt }));
    }
    if (showCategories.press) {
      const press = await Spokesperson.find({ _id: { $nin: excludeIds } }).sort({ createdAt: -1 }).limit(2);
      press.forEach(item => items.push({ category: '보도자료', title: item.title, content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '', link: `/news/press-release-detail.html?id=${item._id}`, date: item.createdAt }));
    }
    if (showCategories.event) {
      const events = await Events.find({ _id: { $nin: excludeIds } }).sort({ startDate: -1 }).limit(2);
      events.forEach(item => items.push({ category: '일정', title: item.title, content: item.location || '', link: `/news/event-detail.html?id=${item._id}`, date: item.startDate || item.createdAt }));
    }
    if (showCategories.activity) {
      const activities = await Activity.find({ _id: { $nin: excludeIds } }).sort({ createdAt: -1 }).limit(2);
      activities.forEach(item => items.push({ category: '활동', title: item.title, content: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 60) : '', link: `/news/activity-detail.html?id=${item._id}`, date: item.createdAt }));
    }
    if (showCategories.media) {
      const media = await MediaCoverage.find({ _id: { $nin: excludeIds } }).sort({ publishedAt: -1 }).limit(2);
      media.forEach(item => items.push({ category: '언론보도', title: item.title, content: item.source || '', link: `/news/media-detail.html?id=${item._id}`, date: item.publishedAt || item.createdAt }));
    }
    if (showCategories.personnel) {
      const personnel = await Personnel.find({ _id: { $nin: excludeIds }, status: 'published', showOnSideCard: true }).sort({ createdAt: -1 }).limit(2);
      personnel.forEach(item => items.push({ category: '인사공고', title: item.title, content: item.excerpt || '', link: `/news/personnel.html`, date: item.createdAt }));
    }
    if (showCategories.congratulations) {
      const congrats = await Congratulation.find({ _id: { $nin: excludeIds }, isActive: true, showOnSideCard: true }).sort({ createdAt: -1 }).limit(2);
      congrats.forEach(item => items.push({ category: '경조사', title: item.title, content: item.content ? item.content.substring(0, 60) : '', link: `/news/congratulations.html`, date: item.createdAt }));
    }
  } catch {}
  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  return items.slice(0, limit);
}

async function getRandomItems(showCategories, limit) {
  const items = await getLatestItems(showCategories, limit * 3);
  for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
  return items.slice(0, limit);
}

module.exports = router;
