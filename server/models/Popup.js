const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    subtitle: {
        type: String,
        maxlength: 200
    },
    textColor: {
        type: String,
        default: '#ffffff'
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Popup', popupSchema);
