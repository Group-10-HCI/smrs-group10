const asyncHandler = require('../utils/asyncHandler');
const RegistrationPeriod = require('../models/RegistrationPeriod');
const ApiError = require('../utils/ApiError');

const createPeriod = asyncHandler(async (req, res) => {
    const { openDate, closeDate, lateOpenDate, lateCloseDate, lateRegistrationAllowed } = req.body;

    // 1. Convert strings to actual Date objects for comparison
    const open = new Date(openDate);
    const close = new Date(closeDate);

    // 2. Check if dates are valid
    if (isNaN(open.getTime()) || isNaN(close.getTime())) {
        throw new ApiError(400, 'Invalid date format provided.', 'INVALID_DATE');
    }

    // 3. Error Prevention: Open date cannot be in the past (if you want to be strict)
    // Or at least, Open date MUST be before Close date.
    if (open >= close) {
        throw new ApiError(
            400,
            'The opening date must be before the closing date.',
            'INVALID_DATE_RANGE'
        );
    }

    // 4. Check Late Registration dates if allowed
    if (lateRegistrationAllowed) {
        const lateOpen = new Date(lateOpenDate);
        const lateClose = new Date(lateCloseDate);

        if (isNaN(lateOpen.getTime()) || isNaN(lateClose.getTime())) {
            throw new ApiError(400, 'Invalid late registration dates provided.', 'INVALID_DATE');
        }
        if (lateOpen >= lateClose) {
            throw new ApiError(400, 'Late opening date must be before late closing date.', 'INVALID_DATE_RANGE');
        }
        if (lateOpen < close) {
            throw new ApiError(400, 'Late registration cannot start before normal registration closes.', 'INVALID_DATE_RANGE');
        }
    }

    // 5. Optional: Prevent creating a period for a year that has completely passed.
    // Let's assume the year string is "2023/2024". We check the first year.
    const startYear = parseInt(req.body.academicYear.split('/')[0], 10);
    const currentYear = new Date().getFullYear();

    if (startYear < currentYear - 1) { // allowing last year just in case of late entries
        throw new ApiError(
            400,
            `You cannot create a registration period for the past academic year (${req.body.academicYear}).`,
            'PAST_ACADEMIC_YEAR'
        );
    }

    // Prevent Duplicate Registration Periods
    const existingPeriod = await RegistrationPeriod.findOne({
        academicYear: req.body.academicYear,
        semester: req.body.semester
    });

    if (existingPeriod) {
        throw new ApiError(
            409,
            `A registration period for ${req.body.academicYear} Semester ${req.body.semester} already exists.`,
            'DUPLICATE_PERIOD'
        );
    }

    const period = await RegistrationPeriod.create(req.body);
    res.status(201).json({ success: true, data: period });
});

// View all periods (Admins see all, students only need to see the active one)
const viewPeriods = asyncHandler(async (req, res) => {
    const periods = await RegistrationPeriod.find().sort({ openDate: -1 });
    res.json({ success: true, count: periods.length, data: periods });
});

// Get the CURRENT active period (Useful for the frontend to show a countdown timer)
const getActivePeriod = asyncHandler(async (req, res) => {
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

module.exports = { createPeriod, viewPeriods, getActivePeriod };