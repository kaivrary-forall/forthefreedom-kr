const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 100
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: '자세히 알아보기'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bgColor: {
    type: String,
    default: '#000000'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
