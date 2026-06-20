const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getRequestById, updateStatus, cancelRequest } = require('../controllers/requestController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', requireRole('Customer'), createRequest);
router.get('/my', getMyRequests);
router.get('/:id', getRequestById);
router.put('/:id/status', requireRole('ServiceProvider'), updateStatus);
router.put('/:id/cancel', requireRole('Customer'), cancelRequest);

module.exports = router;
