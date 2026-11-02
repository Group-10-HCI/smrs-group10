const router = require('express').Router();
const {
    submitRegistration, addCourse, dropCourse, getMyRegistration, getPending, approveRegistration, rejectRegistration
} = require('../controllers/reg_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');
const { validate } = require('../middleware/validate_middleware');
const { submitRegistrationSchema, addDropCourseSchema, rejectRegistrationSchema } = require('../validators/registration_validator');

router.use(requireAuth);

// Student routes
router.post('/submit', validate(submitRegistrationSchema), submitRegistration);
router.post('/addCourse', validate(addDropCourseSchema), addCourse);
router.post('/dropCourse', validate(addDropCourseSchema), dropCourse);
router.get('/myRegistration', getMyRegistration);

// Admin / Officer routes
router.get('/pending', requireRole('admin', 'registration_officer'), getPending);
router.patch('/:id/approve', requireRole('admin', 'registration_officer'), approveRegistration);
router.patch('/:id/reject', requireRole('admin', 'registration_officer'), validate(rejectRegistrationSchema), rejectRegistration);

module.exports = router;