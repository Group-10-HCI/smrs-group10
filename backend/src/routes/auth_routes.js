const router = require('express').Router();
const { register, login, refresh, logout, me } = require('../controllers/auth_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { validate } = require('../middleware/validate_middleware');
const { registerSchema, loginSchema } = require('../validators/auth_validator');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;