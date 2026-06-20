const express = require('express');
const router = express.Router();
const { createReview, getProviderReviews } = require('../controllers/reviewController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('Customer'), createReview);
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;
