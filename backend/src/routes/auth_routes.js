const router = require('express').Router();
const { register, login, refresh, logout, me } = require('../controllers/auth_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { validate } = require('../middleware/validate_middleware');
const { registerSchema, loginSchema } = require('../validators/auth_validator');
const { authLimiter } = require('../middleware/rate_limit_middleware');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

router.post('/refresh', refresh);
router.post('/logout', authLimiter, requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;