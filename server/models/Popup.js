const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    titleHtml: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    subtitleHtml: {
        type: String,
        default: ''
    },
    defaultTextColor: {
        type: String,
        default: '#ffffff'
    },
    bgColor: {
        type: String,
        default: '#1f2937'
    },
    bgOpacity: {
        type: Number,
        default: 0.8,
        min: 0,
        max: 1
    },
    titleLineHeight: {
        type: Number,
        default: 1.2
    },
    subtitleLineHeight: {
        type: Number,
        default: 1.6
    },
    link: {
        type: String,
        default: ''
    },
    linkText: {
        type: String,
        default: '자세히 보기'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    christmasMode: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Popup', popupSchema);
