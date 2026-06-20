const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceListing',
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requirements: {
    type: String,
    required: [true, 'Requirements are required'],
    minlength: [20, 'Requirements must be at least 20 characters'],
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [1, 'Budget must be at least 1'],
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'InProgress', 'Completed', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
