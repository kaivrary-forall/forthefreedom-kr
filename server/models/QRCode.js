const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  code: { 
    type: String, 
    unique: true, 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['url', 'landing', 'vcard'], 
    default: 'url' 
  },
  targetUrl: String,
  landingSlug: String,
  vcardData: {
    name: String,
    organization: String,
    title: String,
    phone: String,
    email: String,
    website: String,
    address: String,
    note: String
  },
  scans: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
