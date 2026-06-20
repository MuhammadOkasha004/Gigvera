const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' },
}, { _id: false });

const serviceListingSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [80, 'Title cannot exceed 80 characters'],
  },
  description: {
    type: String,
    default: '',
    minlength: [100, 'Description must be at least 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least 1'],
  },
  deliveryDays: {
    type: Number,
    required: [true, 'Delivery days are required'],
    min: [1, 'Minimum 1 day'],
    max: [90, 'Maximum 90 days'],
  },
  thumbnailUrl: { type: String, default: '' },
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 5;
      },
      message: 'Tags must be between 3 and 5',
    },
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Paused'],
    default: 'Draft',
  },
  requirements: { type: String, default: '' },
  whatYouWillProvide: { type: String, default: '' },
  faqs: [faqSchema],
  galleryImages: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 4;
      },
      message: 'Maximum 4 gallery images allowed',
    },
  },
  revisions: { type: Number, default: 1 },
  packageBasicName: { type: String, default: 'Basic' },
  packageBasicPrice: { type: Number, default: 0 },
  packageBasicDelivery: { type: Number, default: 0 },
  packageBasicDesc: { type: String, default: '' },
  packageStandardName: { type: String, default: 'Standard' },
  packageStandardPrice: { type: Number, default: 0 },
  packageStandardDelivery: { type: Number, default: 0 },
  packageStandardDesc: { type: String, default: '' },
  packagePremiumName: { type: String, default: 'Premium' },
  packagePremiumPrice: { type: Number, default: 0 },
  packagePremiumDelivery: { type: Number, default: 0 },
  packagePremiumDesc: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  totalOrders: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ServiceListing', serviceListingSchema);
