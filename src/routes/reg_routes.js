const router = require('express').Router();
const { submitRegistration, getMyRegistration } = require('../controllers/reg_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.use(requireAuth);

router.post('/submit', submitRegistration);
router.get('/myRegistration', getMyRegistration);

module.exports = router;