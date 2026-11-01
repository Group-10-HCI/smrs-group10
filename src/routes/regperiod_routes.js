const router = require('express').Router();
const ctrl = require('../controllers/regperiod_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');

router.use(requireAuth);

// Admin only
router.post('/createPeriod', requireRole('admin'), ctrl.createPeriod);
router.get('/viewPeriods', requireRole('admin', 'registration_officer'), ctrl.viewPeriods);

// Anyone logged in can see the active period
router.get('/active', ctrl.getActivePeriod);

module.exports = router;