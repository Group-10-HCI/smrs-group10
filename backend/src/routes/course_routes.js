const router = require('express').Router();
const { createCourse, getCourses } = require('../controllers/course_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');
const { validate } = require('../middleware/validate_middleware');
const { createCourseSchema } = require('../validators/academic_validator');

router.use(requireAuth);

// Admins can create
router.post('/createCourse', requireRole('admin'), validate(createCourseSchema), createCourse);

// Anyone logged in can search/view
router.get('/viewCourses', getCourses);

module.exports = router;