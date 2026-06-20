const express = require('express');
const router = express.Router();
const {
  getMyGigs, getGigById, createGig,
  updateStep1, updateStep2, updateStep3, updateStep4, updateStep5,
  publishGig, toggleGig, deleteGig,
} = require('../controllers/gigController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');

router.use(verifyToken, requireRole('ServiceProvider'));

router.get('/my', getMyGigs);
router.post('/', createGig);
router.get('/:id', getGigById);
router.put('/:id/step1', updateStep1);
router.put('/:id/step2', updateStep2);
router.put('/:id/step3', updateStep3);
router.put('/:id/step4', updateStep4);
router.put('/:id/step5', uploadSingle, updateStep5);
router.put('/:id/publish', publishGig);
router.put('/:id/toggle', toggleGig);
router.delete('/:id', deleteGig);

module.exports = router;
