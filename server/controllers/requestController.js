const ServiceRequest = require('../models/ServiceRequest');
const ProjectUpdate = require('../models/ProjectUpdate');
const ServiceListing = require('../models/ServiceListing');
const sendNotification = require('../utils/sendNotification');

exports.createRequest = async (req, res, next) => {
  try {
    const { listingId, requirements, budget, deadline } = req.body;

    if (!listingId || !requirements || !budget || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (requirements.length < 20) {
      return res.status(400).json({ message: 'Requirements must be at least 20 characters' });
    }

    if (budget < 1) {
      return res.status(400).json({ message: 'Budget must be at least 1' });
    }

    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ message: 'Deadline must be a future date' });
    }

    const listing = await ServiceListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Service listing not found' });
    }

    if (listing.providerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own service' });
    }

    const request = await ServiceRequest.create({
      customerId: req.user._id,
      listingId,
      providerId: listing.providerId,
      requirements,
      budget,
      deadline,
    });

    await sendNotification(
      listing.providerId,
      'New Service Request',
      `You have received a new service request for "${listing.title}"`,
      'Order'
    );

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Customer') {
      query.customerId = req.user._id;
    } else {
      query.providerId = req.user._id;
    }

    const requests = await ServiceRequest.find(query)
      .populate('customerId', 'fullName profileImageUrl')
      .populate('providerId', 'fullName profileImageUrl')
      .populate('listingId', 'title thumbnailUrl price')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customerId', 'fullName profileImageUrl email')
      .populate('providerId', 'fullName profileImageUrl email')
      .populate('listingId', 'title thumbnailUrl price deliveryDays');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updates = await ProjectUpdate.find({ requestId: request._id })
      .populate('updatedBy', 'fullName')
      .sort({ createdAt: 1 });

    res.status(200).json({ request, updates });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the provider can update status' });
    }

    const validStatuses = ['Accepted', 'InProgress', 'Completed', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const oldStatus = request.status;
    request.status = status;
    await request.save();

    await ProjectUpdate.create({
      requestId: request._id,
      updatedBy: req.user._id,
      oldStatus,
      newStatus: status,
      note: note || '',
    });

    await sendNotification(
      request.customerId,
      'Request Status Updated',
      `Your request status has been updated to "${status}"`,
      'Order'
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the customer can cancel' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    request.status = 'Cancelled';
    await request.save();

    await sendNotification(
      request.providerId,
      'Request Cancelled',
      'A service request has been cancelled by the customer',
      'Order'
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};
