const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Calendar 스키마 정의
const calendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  location: { type: String },
  type: { type: String, default: 'event' }, // event, meeting, deadline 등
  isAllDay: { type: Boolean, default: true },
  color: { type: String, default: '#C8102E' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Calendar = mongoose.models.Calendar || mongoose.model('Calendar', calendarSchema);

// GET /api/calendar - 일정 목록 조회
router.get('/', async (req, res) => {
  try {
    const { year, month, startDate, endDate } = req.query;
    
    let query = {};
    
    if (year && month) {
      // 특정 년월의 일정 조회
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      // 날짜 범위로 조회
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const events = await Calendar.find(query).sort({ date: 1 });
    
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('캘린더 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정을 불러오는데 실패했습니다',
      error: error.message
    });
  }
});

// GET /api/calendar/:id - 특정 일정 조회
router.get('/:id', async (req, res) => {
  try {
    const event = await Calendar.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '일정을 찾을 수 없습니다'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('일정 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정을 불러오는데 실패했습니다',
      error: error.message
    });
  }
});

// POST /api/calendar - 일정 추가
router.post('/', async (req, res) => {
  try {
    const { title, date, endDate, description, location, type, isAllDay, color } = req.body;
    
    const event = new Calendar({
      title,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : null,
      description,
      location,
      type,
      isAllDay,
      color
    });
    
    await event.save();
    
    res.status(201).json({
      success: true,
      message: '일정이 추가되었습니다',
      data: event
    });
  } catch (error) {
    console.error('일정 추가 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 추가에 실패했습니다',
      error: error.message
    });
  }
});

// PUT /api/calendar/:id - 일정 수정
router.put('/:id', async (req, res) => {
  try {
    const { title, date, endDate, description, location, type, isAllDay, color } = req.body;
    
    const event = await Calendar.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date: date ? new Date(date) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        description,
        location,
        type,
        isAllDay,
        color,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '일정을 찾을 수 없습니다'
      });
    }
    
    res.json({
      success: true,
      message: '일정이 수정되었습니다',
      data: event
    });
  } catch (error) {
    console.error('일정 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 수정에 실패했습니다',
      error: error.message
    });
  }
});

// DELETE /api/calendar/:id - 일정 삭제
router.delete('/:id', async (req, res) => {
  try {
    const event = await Calendar.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '일정을 찾을 수 없습니다'
      });
    }
    
    res.json({
      success: true,
      message: '일정이 삭제되었습니다'
    });
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 삭제에 실패했습니다',
      error: error.message
    });
  }
});

module.exports = router;
