const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const Category = require('../models/Category');
const ServiceListing = require('../models/ServiceListing');

const categories = [
  { name: 'Web Development', iconClass: 'FaCode', description: 'Build modern websites and web applications' },
  { name: 'Mobile Development', iconClass: 'FaMobileAlt', description: 'Create iOS and Android mobile apps' },
  { name: 'Design and Creative', iconClass: 'FaPalette', description: 'Graphic design, UI/UX, and creative services' },
  { name: 'Writing and Content', iconClass: 'FaPen', description: 'Content writing, copywriting, and editing' },
  { name: 'Marketing and SEO', iconClass: 'FaBullhorn', description: 'Digital marketing, SEO, and social media' },
  { name: 'Data and Analytics', iconClass: 'FaChartBar', description: 'Data analysis, visualization, and reporting' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await ProviderProfile.deleteMany({});
    await ServiceListing.deleteMany({});

    const salt = await bcrypt.genSalt(12);

    const provider = await User.create({
      fullName: 'Demo Provider',
      email: 'provider@gigvera.com',
      passwordHash: await bcrypt.hash('Provider@123', salt),
      role: 'ServiceProvider',
      phone: '+923001234567',
    });

    const customer = await User.create({
      fullName: 'Demo Customer',
      email: 'customer@gigvera.com',
      passwordHash: await bcrypt.hash('Customer@123', salt),
      role: 'Customer',
      phone: '+923007654321',
    });

    console.log('Demo users created');

    const profile = await ProviderProfile.create({
      userId: provider._id,
      bio: 'Full-stack developer with 5+ years of experience in building scalable web applications using the MERN stack. Passionate about clean code and user-centric design.',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS', 'TypeScript'],
      experience: [
        {
          company: 'Tech Solutions Inc.',
          role: 'Senior Developer',
          from: new Date('2021-01-01'),
          to: new Date('2024-01-01'),
          description: 'Led development of multiple client projects using React and Node.js',
        },
      ],
      hourlyRate: 35,
      city: 'Lahore',
      country: 'Pakistan',
      website: 'https://demoprovider.dev',
    });

    console.log('Provider profile created');

    const createdCategories = await Category.insertMany(categories);

    const sampleGigs = [
      {
        categoryId: createdCategories[0]._id,
        title: 'I will build a full-stack MERN application for your business',
        description: 'Looking for a professional full-stack web application? I will build a complete MERN stack application tailored to your business needs. This includes frontend development with React, backend API with Node.js and Express, MongoDB database design, user authentication, and deployment. I ensure clean code, responsive design, and timely delivery. Let me help you bring your idea to life with a modern, scalable web application.',
        price: 150,
        deliveryDays: 7,
        tags: ['mern', 'fullstack', 'react', 'nodejs', 'mongodb'],
        status: 'Published',
        revisions: 3,
        packageBasicPrice: 150,
        packageBasicDelivery: 7,
        packageBasicDesc: 'Basic full-stack app with authentication',
        packageStandardPrice: 300,
        packageStandardDelivery: 14,
        packageStandardDesc: 'Advanced features with admin dashboard',
        packagePremiumPrice: 500,
        packagePremiumDelivery: 21,
        packagePremiumDesc: 'Enterprise solution with all features',
      },
      {
        categoryId: createdCategories[1]._id,
        title: 'I will develop a cross-platform mobile app using React Native',
        description: 'Get a professional cross-platform mobile application built with React Native. I develop apps for both iOS and Android from a single codebase, ensuring native-like performance and beautiful UI. Features include push notifications, offline support, API integration, and app store submission. Perfect for startups and businesses looking to reach mobile users on both platforms.',
        price: 200,
        deliveryDays: 14,
        tags: ['react-native', 'mobile', 'ios', 'android', 'app'],
        status: 'Published',
        revisions: 2,
        packageBasicPrice: 200,
        packageBasicDelivery: 14,
        packageBasicDesc: 'Basic mobile app with core features',
        packageStandardPrice: 400,
        packageStandardDelivery: 21,
        packageStandardDesc: 'Full-featured app with push notifications',
        packagePremiumPrice: 700,
        packagePremiumDelivery: 30,
        packagePremiumDesc: 'Complete app with backend and admin panel',
      },
      {
        categoryId: createdCategories[2]._id,
        title: 'I will design a stunning UI/UX for your website or app',
        description: 'Transform your digital presence with professional UI/UX design. I create visually appealing, user-friendly interfaces that engage your audience and drive conversions. My design process includes user research, wireframing, prototyping, and final design delivery. I use Figma and Adobe XD to create pixel-perfect designs that look great on all devices.',
        price: 100,
        deliveryDays: 5,
        tags: ['ui-ux', 'design', 'figma', 'prototype', 'web-design'],
        status: 'Published',
        revisions: 5,
        packageBasicPrice: 100,
        packageBasicDelivery: 5,
        packageBasicDesc: '5-page UI design with wireframes',
        packageStandardPrice: 250,
        packageStandardDelivery: 10,
        packageStandardDesc: '10-page design with interactive prototype',
        packagePremiumPrice: 500,
        packagePremiumDelivery: 15,
        packagePremiumDesc: 'Complete design system with documentation',
      },
      {
        categoryId: createdCategories[3]._id,
        title: 'I will write SEO-optimized blog posts and website content',
        description: 'Boost your online presence with high-quality, SEO-optimized content. I write engaging blog posts, website copy, product descriptions, and articles that rank on search engines. Each piece is thoroughly researched, well-structured, and tailored to your target audience. I focus on readability, keyword optimization, and conversion-driven copywriting.',
        price: 50,
        deliveryDays: 3,
        tags: ['content-writing', 'seo', 'blog', 'copywriting', 'articles'],
        status: 'Published',
        revisions: 3,
        packageBasicPrice: 50,
        packageBasicDelivery: 3,
        packageBasicDesc: '1 SEO blog post (800-1000 words)',
        packageStandardPrice: 120,
        packageStandardDelivery: 7,
        packageStandardDesc: '3 SEO blog posts with keyword research',
        packagePremiumPrice: 250,
        packagePremiumDelivery: 14,
        packagePremiumDesc: 'Content calendar with 8 posts + strategy',
      },
      {
        categoryId: createdCategories[4]._id,
        title: 'I will create and manage your social media marketing campaigns',
        description: 'Grow your brand with strategic social media marketing. I create and manage campaigns across Instagram, Facebook, LinkedIn, and Twitter. Services include content creation, audience targeting, ad management, analytics reporting, and community engagement. I help businesses build a strong social presence and achieve measurable results.',
        price: 120,
        deliveryDays: 7,
        tags: ['social-media', 'marketing', 'ads', 'instagram', 'facebook'],
        status: 'Published',
        revisions: 2,
        packageBasicPrice: 120,
        packageBasicDelivery: 7,
        packageBasicDesc: '1 platform setup + 2 weeks management',
        packageStandardPrice: 300,
        packageStandardDelivery: 14,
        packageStandardDesc: '3 platforms + monthly content plan',
        packagePremiumPrice: 600,
        packagePremiumDelivery: 30,
        packagePremiumDesc: 'Full social media management for 1 month',
      },
      {
        categoryId: createdCategories[5]._id,
        title: 'I will analyze your data and create interactive dashboards',
        description: 'Unlock insights from your data with professional analysis and visualization. I create interactive dashboards using tools like Tableau, Power BI, and custom solutions. Services include data cleaning, statistical analysis, trend identification, and presentation-ready visualizations. Make data-driven decisions with confidence.',
        price: 80,
        deliveryDays: 5,
        tags: ['data-analysis', 'dashboard', 'analytics', 'tableau', 'visualization'],
        status: 'Published',
        revisions: 3,
        packageBasicPrice: 80,
        packageBasicDelivery: 5,
        packageBasicDesc: 'Basic data analysis report',
        packageStandardPrice: 200,
        packageStandardDelivery: 10,
        packageStandardDesc: 'Interactive dashboard with 5 visuals',
        packagePremiumPrice: 400,
        packagePremiumDelivery: 15,
        packagePremiumDesc: 'Complete analytics solution with automation',
      },
    ];

    for (const gigData of sampleGigs) {
      await ServiceListing.create({
        providerId: provider._id,
        ...gigData,
      });
    }

    console.log('Sample gigs created');
    console.log('Seed completed successfully!');
    console.log('---');
    console.log('Demo Provider: provider@gigvera.com / Provider@123');
    console.log('Demo Customer: customer@gigvera.com / Customer@123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
