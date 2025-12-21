const mongoose = require('mongoose');

const congratulationSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['경사', '조사'],
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    targetPerson: {
        type: String,
        maxlength: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    showOnSideCard: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Congratulation', congratulationSchema);
