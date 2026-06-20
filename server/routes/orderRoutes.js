const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', requireRole('Customer'), createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', requireRole('ServiceProvider'), updateOrderStatus);

module.exports = router;
