const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  clientIP: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7 // 7일 후 자동 삭제
  }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
