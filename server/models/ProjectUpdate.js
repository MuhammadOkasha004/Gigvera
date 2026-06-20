const mongoose = require('mongoose');

const projectUpdateSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  oldStatus: { type: String, default: '' },
  newStatus: { type: String, required: true },
  note: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProjectUpdate', projectUpdateSchema);
