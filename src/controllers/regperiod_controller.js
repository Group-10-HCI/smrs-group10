const asyncHandler = require('../utils/asyncHandler');
const RegistrationPeriod = require('../models/RegistrationPeriod');
const ApiError = require('../utils/ApiError');

// Admin only (FR-015)
exports.createPeriod = asyncHandler(async (req, res) => {
    const period = await RegistrationPeriod.create(req.body);
    res.status(201).json({ success: true, data: period });
});

// View all periods (Admins see all, students only need to see the active one)
exports.viewPeriods = asyncHandler(async (req, res) => {
    const periods = await RegistrationPeriod.find().sort({ openDate: -1 });
    res.json({ success: true, count: periods.length, data: periods });
});

// Get the CURRENT active period (Useful for the frontend to show a countdown timer)
exports.getActivePeriod = asyncHandler(async (req, res) => {
    const now = new Date();

    // Find a period where today's date is between openDate and closeDate
    const activePeriod = await RegistrationPeriod.findOne({
        openDate: { $lte: now },
        closeDate: { $gte: now },
        status: 'active'
    });

    if (!activePeriod) {
        throw new ApiError(404, 'There is no active registration period right now.', 'NO_ACTIVE_PERIOD');
    }

    res.json({ success: true, data: activePeriod });
});