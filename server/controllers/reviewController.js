const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const sendNotification = require('../utils/sendNotification');

exports.createReview = async (req, res, next) => {
  try {
    const { requestId, rating, comment } = req.body;

    if (!requestId || !rating) {
      return res.status(400).json({ message: 'Request ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (comment && comment.length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters' });
    }

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the customer can submit a review' });
    }

    if (request.status !== 'Delivered') {
      return res.status(400).json({ message: 'You can only review delivered requests' });
    }

    const existingReview = await Review.findOne({ requestId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this request' });
    }

    const review = await Review.create({
      requestId,
      customerId: req.user._id,
      providerId: request.providerId,
      rating,
      comment: comment || '',
    });

    await sendNotification(
      request.providerId,
      'New Review Received',
      `You received a ${rating}-star review from a customer`,
      'General'
    );

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    next(error);
  }
};
