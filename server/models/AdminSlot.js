const mongoose = require('mongoose');

const adminSlotSchema = new mongoose.Schema({
  slotId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slotName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  permissions: {
    type: [String],
    default: []
    // ["*"] = 전체 권한 (슈퍼관리자)
    // ["content:read", "content:write"] = 부분 권한
    // ["banners:write", "notices:write", "spokesperson:write"] 등
  },
  canManageSlots: {
    type: Boolean,
    default: false
    // true = 다른 의자 배치 가능 (admin_00만)
  },
  assignedMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  assignedBy: {
    type: String,
    default: null
  },
  note: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 인덱스
adminSlotSchema.index({ assignedMemberId: 1 });
adminSlotSchema.index({ isActive: 1 });

module.exports = mongoose.model('AdminSlot', adminSlotSchema);
