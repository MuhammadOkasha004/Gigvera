const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  from: { type: Date },
  to: { type: Date },
  description: { type: String, default: '' },
}, { _id: false });

const providerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  experience: [experienceSchema],
  hourlyRate: { type: Number, default: 0 },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  website: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  totalEarnings: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
