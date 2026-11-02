const router = require('express').Router();
const { getMyNotifications, markAsRead, deleteNotification } = require('../controllers/notification_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.use(requireAuth);

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;