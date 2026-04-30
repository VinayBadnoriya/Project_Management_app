const notificationService = require('../services/notification.service');
const sendResponse = require('../utils/responseHandler');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getNotificationsByUser(req.user._id);
        sendResponse(res, 200, notifications);
    } catch (err) {
        next(err);
    }
};

exports.markRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id);
        sendResponse(res, 200, notification, 'Notification marked as read');
    } catch (err) {
        next(err);
    }
};

exports.broadcastNotification = async (req, res, next) => {
    try {
        const { message, type = 'BROADCAST' } = req.body;
        await notificationService.broadcastNotification(message, req.user._id, type);
        sendResponse(res, 201, null, 'Broadcast sent successfully to your team');
    } catch (err) {
        next(err);
    }
};
