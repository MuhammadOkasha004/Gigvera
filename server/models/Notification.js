const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
  },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['General', 'Order', 'System'],
    default: 'General',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
