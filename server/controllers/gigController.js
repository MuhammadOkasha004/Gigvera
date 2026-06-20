const ServiceListing = require('../models/ServiceListing');
const cloudinary = require('../config/cloudinary');

exports.getMyGigs = async (req, res, next) => {
  try {
    const gigs = await ServiceListing.find({ providerId: req.user._id })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(gigs);
  } catch (error) {
    next(error);
  }
};

exports.getGigById = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findById(req.params.id)
      .populate('providerId', 'fullName email profileImageUrl')
      .populate('categoryId', 'name iconClass');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.createGig = async (req, res, next) => {
  try {
    const { title, categoryId, tags } = req.body;

    if (!title || title.length < 10 || title.length > 80) {
      return res.status(400).json({ message: 'Title must be between 10 and 80 characters' });
    }

    if (!categoryId) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const tagsArray = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];
    if (tagsArray.length < 3 || tagsArray.length > 5) {
      return res.status(400).json({ message: 'Tags must be between 3 and 5' });
    }

    const gig = await ServiceListing.create({
      providerId: req.user._id,
      title,
      categoryId,
      tags: tagsArray,
      price: 1,
      deliveryDays: 1,
      description: "This is a long boilerplate temporary placeholder description generated automatically by the server backend to pass structural schema validation parameters during creation.",
      requirements: "Placeholder requirements text for structural validation setup."
    });

    res.status(201).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.updateStep1 = async (req, res, next) => {
  try {
    const { title, categoryId, tags } = req.body;
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (title && (title.length < 10 || title.length > 80)) {
      return res.status(400).json({ message: 'Title must be between 10 and 80 characters' });
    }

    if (title) gig.title = title;
    if (categoryId) gig.categoryId = categoryId;
    if (tags) {
      const tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      if (tagsArray.length < 3 || tagsArray.length > 5) {
        return res.status(400).json({ message: 'Tags must be between 3 and 5' });
      }
      gig.tags = tagsArray;
    }

    await gig.save();
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.updateStep2 = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const {
      price, deliveryDays, revisions,
      packageBasicName, packageBasicPrice, packageBasicDelivery, packageBasicDesc,
      packageStandardName, packageStandardPrice, packageStandardDelivery, packageStandardDesc,
      packagePremiumName, packagePremiumPrice, packagePremiumDelivery, packagePremiumDesc,
    } = req.body;

    if (price !== undefined) gig.price = price;
    if (deliveryDays !== undefined) gig.deliveryDays = deliveryDays;
    if (revisions !== undefined) gig.revisions = revisions;
    if (packageBasicName !== undefined) gig.packageBasicName = packageBasicName;
    if (packageBasicPrice !== undefined) gig.packageBasicPrice = packageBasicPrice;
    if (packageBasicDelivery !== undefined) gig.packageBasicDelivery = packageBasicDelivery;
    if (packageBasicDesc !== undefined) gig.packageBasicDesc = packageBasicDesc;
    if (packageStandardName !== undefined) gig.packageStandardName = packageStandardName;
    if (packageStandardPrice !== undefined) gig.packageStandardPrice = packageStandardPrice;
    if (packageStandardDelivery !== undefined) gig.packageStandardDelivery = packageStandardDelivery;
    if (packageStandardDesc !== undefined) gig.packageStandardDesc = packageStandardDesc;
    if (packagePremiumName !== undefined) gig.packagePremiumName = packagePremiumName;
    if (packagePremiumPrice !== undefined) gig.packagePremiumPrice = packagePremiumPrice;
    if (packagePremiumDelivery !== undefined) gig.packagePremiumDelivery = packagePremiumDelivery;
    if (packagePremiumDesc !== undefined) gig.packagePremiumDesc = packagePremiumDesc;

    await gig.save();
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.updateStep3 = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const { description, faqs, whatYouWillProvide } = req.body;

    if (description !== undefined) {
      if (description.length < 100) {
        return res.status(400).json({ message: 'Description must be at least 100 characters' });
      }
      gig.description = description;
    }
    if (faqs !== undefined) gig.faqs = faqs;
    if (whatYouWillProvide !== undefined) gig.whatYouWillProvide = whatYouWillProvide;

    await gig.save();
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.updateStep4 = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const { requirements } = req.body;
    if (requirements !== undefined) gig.requirements = requirements;

    await gig.save();
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

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

exports.updateStep5 = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'gigvera/gigs');
      gig.thumbnailUrl = result.secure_url;
    }

    if (req.files && req.files.length > 0) {
      const galleryUrls = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'gigvera/gigs');
        galleryUrls.push(result.secure_url);
      }
      gig.galleryImages = [...(gig.galleryImages || []), ...galleryUrls].slice(0, 4);
    }

    await gig.save();
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.publishGig = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    gig.status = 'Published';
    gig.isActive = true;
    await gig.save();

    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.toggleGig = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    gig.status = gig.status === 'Published' ? 'Paused' : 'Published';
    await gig.save();

    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

exports.deleteGig = async (req, res, next) => {
  try {
    const gig = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    gig.isActive = false;
    await gig.save();

    res.status(200).json({ message: 'Gig deleted successfully' });
  } catch (error) {
    next(error);
  }
};