const Notification = require('../models/Notification');
const User = require('../models/User');

async function sendNotification(userId, { title, message, type = 'info', relatedEntity = null }) {
    // Check if the user has in-app notifications enabled
    const user = await User.findById(userId);
    if (!user || !user.notificationPrefs.inApp) {
        return; // User disabled them or user doesn't exist
    }

    // Create the notification
    const notification = await Notification.create({
        recipient: userId,
        title,
        message,
        type,
        relatedEntity
    });
    return notification;
}

async function getMyNotifications(userId) {
    return await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
}

async function markAsRead(userId, notificationId) {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    );
    return notification;
}

async function deleteNotification(userId, notificationId) {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
    });

    return notification;
}

module.exports = { sendNotification, getMyNotifications, markAsRead, deleteNotification };