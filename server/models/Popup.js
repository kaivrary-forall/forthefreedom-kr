const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 500
    },
    titleHtml: {
        type: String,
        maxlength: 2000
    },
    subtitle: {
        type: String,
        maxlength: 500
    },
    subtitleHtml: {
        type: String,
        maxlength: 2000
    },
    defaultTextColor: {
        type: String,
        default: '#ffffff'
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
        type: String
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
