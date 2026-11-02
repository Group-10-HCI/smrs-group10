const router = require('express').Router();
const { getAllStudents, assignProgramme } = require('../controllers/admin_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');

// All routes here are strictly for Admins and Officers
router.use(requireAuth);
router.use(requireRole('admin', 'registration_officer'));

router.get('/students', getAllStudents);
router.post('/assignProgramme', assignProgramme);

module.exports = router;