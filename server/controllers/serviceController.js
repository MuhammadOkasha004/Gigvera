const ServiceListing = require('../models/ServiceListing');
const Category = require('../models/Category');
const Review = require('../models/Review');

const DEFAULT_CATEGORIES = [
  { name: 'Website Development', iconClass: 'FaCode', description: 'Build modern websites and web applications' },
  { name: 'Mobile Development', iconClass: 'FaMobileAlt', description: 'Create iOS and Android mobile apps' },
  { name: 'Logo Design', iconClass: 'FaPalette', description: 'Professional logo and branding design' },
  { name: 'Social Media Management', iconClass: 'FaBullhorn', description: 'Manage and grow your social media presence' },
  { name: 'Content Writing', iconClass: 'FaPen', description: 'SEO-optimized content and copywriting' },
  { name: 'Design and Creative', iconClass: 'FaPalette', description: 'Graphic design, UI/UX, and creative services' },
  { name: 'Marketing and SEO', iconClass: 'FaBullhorn', description: 'Digital marketing, SEO, and social media' },
  { name: 'Data and Analytics', iconClass: 'FaChartBar', description: 'Data analysis, visualization, and reporting' },
];

const seedCategoriesIfEmpty = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log('Default categories seeded successfully');
  }
};

exports.getAllServices = async (req, res, next) => {
  try {
    const { keyword, categoryId, minPrice, maxPrice, deliveryDays, sort } = req.query;

    const query = { status: 'Published', isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
      ];
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (deliveryDays) {
      query.deliveryDays = { $lte: Number(deliveryDays) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { totalOrders: -1 };

    const services = await ServiceListing.find(query)
      .populate('providerId', 'fullName profileImageUrl')
      .populate('categoryId', 'name iconClass')
      .sort(sortOption);

    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    await seedCategoriesIfEmpty();

    const categories = await Category.find({ isActive: true });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await ServiceListing.countDocuments({
          categoryId: cat._id,
          status: 'Published',
          isActive: true,
        });
        return { ...cat.toObject(), serviceCount: count };
      })
    );

    res.status(200).json(categoriesWithCount);
  } catch (error) {
    next(error);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const service = await ServiceListing.findById(req.params.id)
      .populate('providerId', 'fullName email profileImageUrl')
      .populate('categoryId', 'name iconClass');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const reviews = await Review.find({ providerId: service.providerId._id })
      .populate('customerId', 'fullName profileImageUrl')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      service,
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    next(error);
  }
};
