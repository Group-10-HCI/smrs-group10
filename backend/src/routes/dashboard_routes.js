const router = require('express').Router();
const { getAdminDashboard, getStudentDashboard } = require('../controllers/dashboard_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');

router.use(requireAuth);

// Students only
router.get('/student', requireRole('student'), getStudentDashboard);

// Admins and Officers only
router.get('/admin', requireRole('admin', 'registration_officer'), getAdminDashboard);

module.exports = router;