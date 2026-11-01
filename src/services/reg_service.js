const Registration = require('../models/Registration');
const Course = require('../models/Course');
const RegistrationPeriod = require('../models/RegistrationPeriod');
const ApiError = require('../utils/ApiError');

async function submitRegistration(studentId, { courseIds, academicYear, semester }) {
    // Check if the registration period is active right now
    const now = new Date();
    const period = await RegistrationPeriod.findOne({
        academicYear,
        semester,
        openDate: { $lte: now },
        closeDate: { $gte: now }
    });

    if (!period) {
        throw new ApiError(400, 'Registration is currently closed for this semester.', 'REGISTRATION_CLOSED');
    }

    // Check if student already submitted for this semester
    const existingReg = await Registration.findOne({ student: studentId, academicYear, semester });
    if (existingReg) {
        throw new ApiError(409, 'You have already submitted a registration for this semester.', 'DUPLICATE_REGISTRATION');
    }

    const uniqueCourseIds = new Set(courseIds);
    if (uniqueCourseIds.size !== courseIds.length) {
        throw new ApiError(
            400,
            'You have selected the same course more than once. Please review your selection.',
            'DUPLICATE_COURSES_IN_REQUEST'
        );
    }

    // Fetch the selected courses to validate them
    const courses = await Course.find({ _id: { $in: courseIds }, status: 'active' });

    // Check only catches courses that don't exist or are inactive
    if (courses.length !== courseIds.length) {
        throw new ApiError(
            400,
            'One or more of the courses you selected do not exist or are currently unavailable.',
            'UNAVAILABLE_COURSES'
        );
    }

    // Calculate total credits & enforce credit limit 
    let totalCredits = 0;
    const courseDocs = courses.map(c => {
        totalCredits += c.creditHours;
        return { course: c._id, status: 'registered' };
    });

    if (totalCredits < 12 || totalCredits > 21) {
        throw new ApiError(400, `You must register for between 12 and 21 credits. You selected ${totalCredits}.`, 'INVALID_CREDIT_LIMIT');
    }

    // Create the registration
    const registration = await Registration.create({
        student: studentId,
        academicYear,
        semester,
        courses: courseDocs,
        totalCredits,
        status: 'submitted'
    });

    return registration.populate('courses.course', 'code name creditHours');
}

module.exports = { submitRegistration };