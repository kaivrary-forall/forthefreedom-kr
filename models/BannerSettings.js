const mongoose = require('mongoose');

const bannerSettingsSchema = new mongoose.Schema({
  randomOrder: {
    type: Boolean,
    default: false
  },
  autoPlayInterval: {
    type: Number,
    default: 5000 // 5초
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BannerSettings', bannerSettingsSchema);
