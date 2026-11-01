const router = require('express').Router();
const ctrl = require('../controllers/auth_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', requireAuth, ctrl.logout);
router.get('/me', requireAuth, ctrl.me);

module.exports = router;