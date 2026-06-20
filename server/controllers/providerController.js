const ProviderProfile = require('../models/ProviderProfile');
const PortfolioItem = require('../models/PortfolioItem');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

exports.getMyProfile = async (req, res, next) => {
  try {
    let profile = await ProviderProfile.findOne({ userId: req.user._id })
      .populate('userId', 'fullName email phone profileImageUrl');

    if (!profile) {
      profile = await ProviderProfile.create({ userId: req.user._id });
      profile = await ProviderProfile.findOne({ userId: req.user._id })
        .populate('userId', 'fullName email phone profileImageUrl');
    }

    const portfolio = await PortfolioItem.find({ profileId: profile._id });

    res.status(200).json({ profile, portfolio });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { bio, skills, experience, hourlyRate, city, country, website } = req.body;

    let profile = await ProviderProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await ProviderProfile.create({ userId: req.user._id });
    }

    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (hourlyRate !== undefined) profile.hourlyRate = hourlyRate;
    if (city !== undefined) profile.city = city;
    if (country !== undefined) profile.country = country;
    if (website !== undefined) profile.website = website;

    await profile.save();

    const updated = await ProviderProfile.findOne({ userId: req.user._id })
      .populate('userId', 'fullName email phone profileImageUrl');

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'gigvera/profiles');

    await User.findByIdAndUpdate(req.user._id, {
      profileImageUrl: result.secure_url,
    });

    const updatedUser = await User.findById(req.user._id).select('-passwordHash');

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, projectUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'gigvera/portfolio');
      imageUrl = result.secure_url;
    }

    const item = await PortfolioItem.create({
      profileId: profile._id,
      title,
      description: description || '',
      imageUrl,
      projectUrl: projectUrl || '',
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

exports.deletePortfolioItem = async (req, res, next) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const item = await PortfolioItem.findOne({
      _id: req.params.id,
      profileId: profile._id,
    });

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await PortfolioItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Portfolio item deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.params.userId })
      .populate('userId', 'fullName email profileImageUrl createdAt');

    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const portfolio = await PortfolioItem.find({ profileId: profile._id });

    res.status(200).json({ profile, portfolio });
  } catch (error) {
    next(error);
  }
};
