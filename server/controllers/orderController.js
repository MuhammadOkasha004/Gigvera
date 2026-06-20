const Order = require('../models/Order');
const ServiceListing = require('../models/ServiceListing');
const sendNotification = require('../utils/sendNotification');

exports.createOrder = async (req, res, next) => {
  try {
    const { gigId, package: pkg, requirements } = req.body;

    if (!gigId || !requirements?.projectName || !requirements?.description) {
      return res.status(400).json({ message: 'Project name and description are required' });
    }

    if (requirements.description.length < 20) {
      return res.status(400).json({ message: 'Description must be at least 20 characters' });
    }

    const gig = await ServiceListing.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.providerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot order your own gig' });
    }

    const selectedPackage = pkg || 'basic';
    let price = gig.price;
    let deliveryDays = gig.deliveryDays;

    if (selectedPackage === 'basic') {
      price = gig.packageBasicPrice || gig.price;
      deliveryDays = gig.packageBasicDelivery || gig.deliveryDays;
    } else if (selectedPackage === 'standard') {
      price = gig.packageStandardPrice || gig.price * 2;
      deliveryDays = gig.packageStandardDelivery || gig.deliveryDays * 2;
    } else if (selectedPackage === 'premium') {
      price = gig.packagePremiumPrice || gig.price * 3;
      deliveryDays = gig.packagePremiumDelivery || gig.deliveryDays * 3;
    }

    const order = await Order.create({
      gigId,
      buyerId: req.user._id,
      sellerId: gig.providerId,
      package: selectedPackage,
      requirements,
      price,
      deliveryDays,
      status: 'In Progress',
    });

    gig.totalOrders = (gig.totalOrders || 0) + 1;
    await gig.save();

    await sendNotification(
      gig.providerId,
      'New Order Received',
      `You have received a new order for "${gig.title}"`,
      'Order'
    );

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'Customer') {
      filter.buyerId = req.user._id;
    } else {
      filter.sellerId = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate('gigId', 'title thumbnailUrl')
      .populate('buyerId', 'fullName profileImageUrl')
      .populate('sellerId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('gigId', 'title thumbnailUrl price deliveryDays')
      .populate('buyerId', 'fullName profileImageUrl email')
      .populate('sellerId', 'fullName profileImageUrl email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyerId._id.toString() !== req.user._id.toString() &&
        order.sellerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the seller can update order status' });
    }

    const validTransitions = ['In Progress', 'Delivered', 'Completed'];
    if (!validTransitions.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    await sendNotification(
      order.buyerId,
      'Order Status Updated',
      `Your order status has been updated to "${status}"`,
      'Order'
    );

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
