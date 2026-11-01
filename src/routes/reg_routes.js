const router = require('express').Router();
const { submitRegistration, getMyRegistration, dropCourse, addCourse } = require('../controllers/reg_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.use(requireAuth);

router.post('/submit', submitRegistration);
router.post('/dropCourse', dropCourse);
router.post('/addCourse', addCourse);
router.get('/myRegistration', getMyRegistration);

module.exports = router;