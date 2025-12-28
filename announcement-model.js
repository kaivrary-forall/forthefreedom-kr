const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        default: ''
    },
    linkText: {
        type: String,
        default: '자세히 보기'
    },
    bgColor: {
        type: String,
        default: '#c8102e'
    },
    textColor: {
        type: String,
        default: '#ffffff'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hideHours: {
        type: Number,
        default: 6
    },
    forceShowVersion: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
