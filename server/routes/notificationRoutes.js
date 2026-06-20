const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllRead, getUnreadCount } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllRead);
router.get('/unread-count', getUnreadCount);

module.exports = router;
