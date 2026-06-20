const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceListing',
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  package: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic',
  },
  requirements: {
    projectName: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    description: { type: String, required: true, minlength: 20 },
  },
  price: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  status: {
    type: String,
    enum: ['In Progress', 'Delivered', 'Completed', 'Cancelled'],
    default: 'In Progress',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
