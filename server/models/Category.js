const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  iconClass: { type: String, default: '' },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Category', categorySchema);
