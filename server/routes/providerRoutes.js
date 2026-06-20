const express = require('express');
const router = express.Router();
const {
  getMyProfile, updateProfile, uploadProfileImage,
  addPortfolioItem, deletePortfolioItem, getPublicProfile,
} = require('../controllers/providerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.get('/profile', verifyToken, requireRole('ServiceProvider'), getMyProfile);
router.put('/profile', verifyToken, requireRole('ServiceProvider'), updateProfile);
router.post('/profile/image', verifyToken, requireRole('ServiceProvider'), uploadSingle, uploadProfileImage);
router.post('/portfolio', verifyToken, requireRole('ServiceProvider'), uploadSingle, addPortfolioItem);
router.delete('/portfolio/:id', verifyToken, requireRole('ServiceProvider'), deletePortfolioItem);
router.get('/profile/:userId', getPublicProfile);

module.exports = router;
