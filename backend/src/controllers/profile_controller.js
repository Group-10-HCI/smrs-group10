const asyncHandler = require('../utils/asyncHandler');
const profileService = require('../services/profile_service');

const getMyProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.getMyProfile(req.user.id);
    res.json({
        success: true,
        data: profile
    });
});

const updateMyProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.updateMyProfile(req.user.id, req.body);
    res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: profile
    });
});

module.exports = { getMyProfile, updateMyProfile };