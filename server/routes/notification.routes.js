const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, notificationController.getNotifications);
router.patch('/:id/read', protect, notificationController.markRead);
router.post('/broadcast', protect, authorize('ADMIN'), notificationController.broadcastNotification);

module.exports = router;
