const router = require('express').Router();
const { register, login, refresh, logout, me } = require('../controllers/auth_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;