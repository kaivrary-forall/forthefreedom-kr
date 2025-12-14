const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  // 조직 이름 (예: "최고위원회", "청년위원회")
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // 상위 조직 (없으면 최상위 조직)
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  
  // 표시 순서
  order: {
    type: Number,
    default: 0
  },
  
  // 테두리/강조 색상
  color: {
    type: String,
    enum: ['red', 'blue', 'green', 'purple', 'orange', 'gray'],
    default: 'red'
  },
  
  // 설명
  description: {
    type: String,
    trim: true,
    default: null
  },
  
  // 활성화 여부
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 하위 조직 가져오기 virtual
organizationSchema.virtual('children', {
  ref: 'Organization',
  localField: '_id',
  foreignField: 'parentId'
});

// 소속 직책들 가져오기 virtual
organizationSchema.virtual('positions', {
  ref: 'Position',
  localField: '_id',
  foreignField: 'organizationId'
});

// JSON 변환시 virtual 포함
organizationSchema.set('toJSON', { virtuals: true });
organizationSchema.set('toObject', { virtuals: true });

// 인덱스
organizationSchema.index({ parentId: 1, order: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
