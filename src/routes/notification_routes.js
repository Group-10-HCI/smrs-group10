const router = require('express').Router();
const { getMyNotifications, markAsRead } = require('../controllers/notification_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.use(requireAuth);

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;