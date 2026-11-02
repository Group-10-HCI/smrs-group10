const router = require('express').Router();
const { getMyProfile, updateMyProfile } = require('../controllers/profile_controller');
const { requireAuth } = require('../middleware/auth_middleware');

router.use(requireAuth);

router.get('/getProfile', getMyProfile);
router.put('/updateProfile', updateMyProfile);

module.exports = router;