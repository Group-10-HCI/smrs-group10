const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/ApiError');

// Calculate profile completion
function calculateCompletion(profile) {
    // Fields we care about for completion
    const fields = [
        'dateOfBirth', 'gender', 'nationality', 'phone', 'physicalAddress',
        'nextOfKin.name', 'nextOfKin.relationship', 'nextOfKin.phone'
    ];

    let filled = 0;
    fields.forEach(field => {
        // Navigate nested objects (e.g., nextOfKin.name)
        const value = field.split('.').reduce((obj, key) => obj?.[key], profile);
        if (value) filled++;
    });

    return Math.round((filled / fields.length) * 100);
}

async function getMyProfile(userId) {
    let profile = await StudentProfile.findOne({ user: userId }).populate('programme', 'name code');

    if (!profile) {
        // If they don't have one, create a blank one
        profile = await StudentProfile.create({ user: userId });
    }

    return {
        ...profile.toObject(),
        completionPercentage: calculateCompletion(profile)
    };
}

async function updateMyProfile(userId, updateData) {
    const profile = await StudentProfile.findOne({ user: userId });
    if (!profile) throw new ApiError(404, 'Profile not found', 'NOT_FOUND');

    const allowedUpdates = [
        'dateOfBirth', 'gender', 'nationality', 'phone', 'physicalAddress', 'nextOfKin', 'accessibilityPrefs'
    ];

    allowedUpdates.forEach((field) => {
        if (updateData[field] !== undefined) {
            profile[field] = updateData[field];
        }
    });

    await profile.save();

    return {
        ...profile.toObject(),
        completionPercentage: calculateCompletion(profile)
    };
}

module.exports = { getMyProfile, updateMyProfile };