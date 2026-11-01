const router = require('express').Router();
const { createProgramme, getProgrammes } = require('../controllers/programme_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');

router.use(requireAuth); // Must be logged in

// Admins can create
router.post('/createProgramme', requireRole('admin'), createProgramme);

// Anyone logged in can view
router.get('/viewProgrammes', getProgrammes);

module.exports = router;