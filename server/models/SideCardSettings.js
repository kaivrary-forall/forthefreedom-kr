const mongoose = require('mongoose');

const sideCardSettingsSchema = new mongoose.Schema({
  // 표시 모드: 'latest' | 'pinned' | 'random' | 'mixed'
  displayMode: {
    type: String,
    enum: ['latest', 'pinned', 'random', 'mixed'],
    default: 'latest'
  },
  // 표시할 카드 개수
  cardCount: {
    type: Number,
    default: 4,
    min: 1,
    max: 6
  },
  // 고정된 콘텐츠 (pinned 또는 mixed 모드에서 사용)
  pinnedItems: [{
    contentType: {
      type: String,
      enum: ['notice', 'press', 'event', 'activity', 'media'],
      required: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  // 카테고리별 표시 여부
  showCategories: {
    notice: { type: Boolean, default: true },
    press: { type: Boolean, default: true },
    event: { type: Boolean, default: true },
    activity: { type: Boolean, default: false },
    media: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SideCardSettings', sideCardSettingsSchema);
