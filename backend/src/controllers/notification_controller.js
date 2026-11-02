const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification_service');
const ApiError = require('../utils/ApiError');

const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getMyNotifications(req.user._id);

    // Count unread
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
        success: true,
        unreadCount,
        count: notifications.length,
        data: notifications
    });
});

const markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.user._id, req.params.id);

    if (!notification) {
        throw new ApiError(404, 'Notification not found.', 'NOT_FOUND');
    }

    res.json({ success: true, message: 'Notification marked as read.' });
});

const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await notificationService.deleteNotification(req.user._id, req.params.id);

    if (!notification) {
        // If it returns null, either it doesn't exist OR it belongs to someone else
        throw new ApiError(404, 'Notification not found.', 'NOT_FOUND');
    }

    res.json({ success: true, message: 'Notification deleted successfully.' });
});

module.exports = { getMyNotifications, markAsRead, deleteNotification };