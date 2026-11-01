const router = require('express').Router();
const {
    submitRegistration, addCourse, dropCourse, getMyRegistration, getPending, approveRegistration, rejectRegistration
} = require('../controllers/reg_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');

router.use(requireAuth);

// Student routes
router.post('/submit', submitRegistration);
router.post('/addCourse', addCourse);
router.post('/dropCourse', dropCourse);
router.get('/myRegistration', getMyRegistration);

// Admin / Officer routes
router.get('/pending', requireRole('admin', 'registration_officer'), getPending);
router.patch('/:id/approve', requireRole('admin', 'registration_officer'), approveRegistration);
router.patch('/:id/reject', requireRole('admin', 'registration_officer'), rejectRegistration);

module.exports = router;