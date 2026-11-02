const router = require('express').Router();
const { createProgramme, getProgrammes } = require('../controllers/programme_controller');
const { requireAuth } = require('../middleware/auth_middleware');
const { requireRole } = require('../middleware/role_middleware');
const { validate } = require('../middleware/validate_middleware');
const { createProgrammeSchema } = require('../validators/academic_validator');

router.use(requireAuth); // Must be logged in

// Admins can create
router.post('/createProgramme', requireRole('admin'), validate(createProgrammeSchema), createProgramme);

// Anyone logged in can view
router.get('/viewProgrammes', getProgrammes);

module.exports = router;