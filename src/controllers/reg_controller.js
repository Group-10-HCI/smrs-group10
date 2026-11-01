const asyncHandler = require('../utils/asyncHandler');
const regService = require('../services/reg_service');
const Registration = require('../models/Registration');
const ApiError = require('../utils/ApiError');


const submitRegistration = asyncHandler(async (req, res) => {
    const registration = await regService.submitRegistration(req.user.id, req.body);
    res.status(201).json({
        success: true,
        message: 'Course registration successfully submitted.',
        data: registration
    });
});

// View my registration (Student)
const getMyRegistration = asyncHandler(async (req, res) => {
    const { academicYear, semester } = req.query;

    if (!academicYear || !semester) {
        throw new ApiError(400, 'Please provide academicYear and semester query parameters.', 'MISSING_PARAMS');
    }

    const registration = await Registration.findOne({
        student: req.user.id,
        academicYear,
        semester
    }).populate('courses.course', 'code name creditHours');

    if (!registration) {
        throw new ApiError(404, 'No registration found for this semester.', 'NOT_FOUND');
    }

    res.json({ success: true, data: registration });
});

module.exports = { submitRegistration, getMyRegistration }