const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProviderProfile',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Portfolio title is required'],
  },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  projectUrl: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
