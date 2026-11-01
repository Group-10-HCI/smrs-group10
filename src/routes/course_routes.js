const router = require('express').Router();
const ctrl = require('../controllers/course_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');

router.use(requireAuth);

// Admins can create
router.post('/createCourse', requireRole('admin'), ctrl.createCourse);

// Anyone logged in can search/view
router.get('/viewCourses', ctrl.getCourses);

module.exports = router;