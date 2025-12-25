const mongoose = require('mongoose');

// 버전 히스토리 스키마 (변경 이력)
const settingsVersionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedBy: {
    type: String,
    default: 'admin'
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// 메인 설정 스키마
const siteSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// 저장 전 버전 스냅샷 생성
siteSettingsSchema.pre('save', async function(next) {
  if (this.isModified('value')) {
    // 이전 값이 있으면 버전 히스토리에 저장
    const SettingsVersion = mongoose.model('SettingsVersion');
    
    if (!this.isNew) {
      const original = await mongoose.model('SiteSettings').findById(this._id);
      if (original) {
        await SettingsVersion.create({
          key: this.key,
          value: original.value,
          updatedBy: original.updatedBy,
          note: `버전 백업 - ${new Date().toISOString()}`
        });
      }
    }
  }
  next();
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
const SettingsVersion = mongoose.model('SettingsVersion', settingsVersionSchema);

module.exports = { SiteSettings, SettingsVersion };
