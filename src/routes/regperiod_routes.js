const router = require('express').Router();
const { createPeriod, getActivePeriod, viewPeriods } = require('../controllers/regperiod_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');
const { validate } = require('../middleware/validate_middleware');
const { createPeriodSchema } = require('../validators/period_validator');

router.use(requireAuth);


// Admin only
router.post('/createPeriod', requireRole('admin'), validate(createPeriodSchema), createPeriod);
router.get('/viewPeriods', requireRole('admin', 'registration_officer'), viewPeriods);

// Anyone logged in can see the active period
router.get('/active', getActivePeriod);

module.exports = router;