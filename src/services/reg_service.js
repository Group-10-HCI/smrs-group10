const Registration = require('../models/Registration');
const Course = require('../models/Course');
const RegistrationPeriod = require('../models/RegistrationPeriod');
const ApiError = require('../utils/ApiError');

const MIN_CREDITS = 12;
const MAX_CREDITS = 21;

// Reusable check to make sure we are still within the registration window
async function checkRegistrationWindow(academicYear, semester) {
    const now = new Date();
    const period = await RegistrationPeriod.findOne({
        academicYear,
        semester,
        openDate: { $lte: now },
        closeDate: { $gte: now }
    });

    if (!period) {
        throw new ApiError(
            403,
            'Registration is currently closed. You cannot modify your courses.',
            'REGISTRATION_CLOSED'
        );
    }
    return period;
}

async function submitRegistration(studentId, { courseIds, academicYear, semester }) {
    await checkRegistrationWindow(academicYear, semester);

    const existingReg = await Registration.findOne({ student: studentId, academicYear, semester });

    if (existingReg && existingReg.status !== 'rejected') {
        throw new ApiError(
            409,
            'You have already submitted a registration for this semester that is pending or approved.',
            'DUPLICATE_REGISTRATION'
        );
    }

    const uniqueCourseIds = new Set(courseIds);
    if (uniqueCourseIds.size !== courseIds.length) {
        throw new ApiError(400, 'You have selected the same course more than once.', 'DUPLICATE_COURSES_IN_REQUEST');
    }

    const courses = await Course.find({ _id: { $in: courseIds }, status: 'active' });
    if (courses.length !== courseIds.length) {
        throw new ApiError(400, 'One or more courses are unavailable.', 'UNAVAILABLE_COURSES');
    }

    let totalCredits = 0;
    const courseDocs = courses.map(c => {
        totalCredits += c.creditHours;
        return { course: c._id, status: 'registered' };
    });

    if (totalCredits < MIN_CREDITS || totalCredits > MAX_CREDITS) {
        throw new ApiError(400, `You must register for between ${MIN_CREDITS} and ${MAX_CREDITS} credits. You selected ${totalCredits}.`, 'INVALID_CREDIT_LIMIT');
    }

    // Save (Update if rejected, Create if new)
    let registration;

    if (existingReg && existingReg.status === 'rejected') {
        // Overwrite the rejected registration
        existingReg.courses = courseDocs;
        existingReg.totalCredits = totalCredits;
        existingReg.status = 'submitted';

        // Clear out the old rejection data
        existingReg.rejectionReason = undefined;
        existingReg.reviewedBy = undefined;
        existingReg.reviewedAt = undefined;

        registration = await existingReg.save();
    } else {
        // Create a brand new registration
        registration = await Registration.create({
            student: studentId,
            academicYear,
            semester,
            courses: courseDocs,
            totalCredits,
            status: 'submitted'
        });
    }

    return registration.populate('courses.course', 'code name creditHours');
}

async function addCourse(user, { registrationId, courseId }) {
    const registration = await Registration.findById(registrationId);
    if (!registration) {
        throw new ApiError(404, 'Registration record not found.', 'NOT_FOUND');
    }

    const isAdmin = user.role === 'admin' || user.role === 'registration_officer';

    if (!isAdmin && registration.student.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You can only modify your own registration.', 'FORBIDDEN');
    }

    // Only check the window if it's a student
    if (!isAdmin) {
        await checkRegistrationWindow(registration.academicYear, registration.semester);

        if (registration.status === 'submitted' || registration.status === 'pending_approval') {
            throw new ApiError(
                400,
                'You cannot modify courses while your registration is pending review. Please wait for approval or rejection.',
                'REGISTRATION_PENDING'
            );
        }

        if (registration.status === 'approved') {
            throw new ApiError(
                400,
                'Your registration is already approved. To make changes, please visit the Academic Registrar\'s office.',
                'REGISTRATION_APPROVED'
            );
        }
    }

    // Check if the course is already in the registration
    const alreadyHasCourse = registration.courses.some(c => c.course.toString() === courseId);
    if (alreadyHasCourse) {
        throw new ApiError(400, 'You are already registered for this course.', 'DUPLICATE_COURSE');
    }

    // Check if whethes the new course exists and if it is active?
    const newCourse = await Course.findOne({ _id: courseId, status: 'active' });
    if (!newCourse) {
        throw new ApiError(404, 'Course not found or inactive.', 'COURSE_UNAVAILABLE');
    }

    // Check if it will 2exceed max credits?
    if (registration.totalCredits + newCourse.creditHours > MAX_CREDITS) {
        throw new ApiError(400, `Adding this course will exceed the maximum of ${MAX_CREDITS} credits.`, 'CREDIT_LIMIT_EXCEEDED');
    }

    // Add the course
    registration.courses.push({ course: newCourse._id, status: 'registered' });
    registration.totalCredits += newCourse.creditHours;
    await registration.save();

    return registration.populate('courses.course', 'code name creditHours');
}

async function dropCourse(user, { registrationId, courseId }) {
    const registration = await Registration.findById(registrationId);
    if (!registration) {
        throw new ApiError(404, 'Registration record not found.', 'NOT_FOUND');
    }

    const isAdmin = user.role === 'admin' || user.role === 'registration_officer';

    if (!isAdmin && registration.student.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You can only modify your own registration.', 'FORBIDDEN');
    }

    // Only check the window if it's a student
    if (!isAdmin) {
        await checkRegistrationWindow(registration.academicYear, registration.semester);

        if (registration.status === 'submitted' || registration.status === 'pending_approval') {
            throw new ApiError(
                400,
                'You cannot modify courses while your registration is pending review. Please wait for approval or rejection.',
                'REGISTRATION_PENDING'
            );
        }

        if (registration.status === 'approved') {
            throw new ApiError(
                400,
                'Your registration is already approved. To make changes, please visit the Academic Registrar\'s office.',
                'REGISTRATION_APPROVED'
            );
        }
    }

    // Find the course in the array
    const courseIndex = registration.courses.findIndex(c => c.course.toString() === courseId);
    if (courseIndex === -1) {
        throw new ApiError(404, 'This course is not in your registration.', 'COURSE_NOT_FOUND');
    }

    // Get the course details to know how many credits to subtract
    const courseToDrop = await Course.findById(courseId);
    if (!courseToDrop) {
        throw new ApiError(404, 'Course not found.', 'NOT_FOUND');
    }

    // check if whether dropping it put them below min credits?
    if (registration.totalCredits - courseToDrop.creditHours < MIN_CREDITS) {
        throw new ApiError(400, `Dropping this course will put you below the minimum of ${MIN_CREDITS} credits.`, 'CREDIT_LIMIT_BELOW_MIN');
    }

    // Remove course
    registration.courses.splice(courseIndex, 1);
    registration.totalCredits -= courseToDrop.creditHours;
    await registration.save();

    return registration.populate('courses.course', 'code name creditHours');
}

// View all pending registrations
async function getPendingRegistrations() {
    // Find registrations that are 'submitted' or 'pending_approval'
    const registrations = await Registration.find({
        status: { $in: ['submitted', 'pending_approval'] }
    })
        .populate('student', 'firstName lastName email') // Show student details
        .populate('courses.course', 'code name creditHours')
        .sort({ createdAt: 1 }); // Oldest first

    return registrations;
}

// Approve Registration
async function approveRegistration(officerId, registrationId) {
    const registration = await Registration.findById(registrationId);

    if (!registration) throw new ApiError(404, 'Registration not found', 'NOT_FOUND');

    // Can only approve if it's pending
    if (registration.status !== 'submitted' && registration.status !== 'pending_approval') {
        throw new ApiError(400, `Cannot approve a registration with status: ${registration.status}`, 'INVALID_STATUS_TRANSITION');
    }

    registration.status = 'approved';
    registration.reviewedBy = officerId;
    registration.reviewedAt = new Date();
    await registration.save();

    return registration;
}

// Reject Registration
async function rejectRegistration(officerId, registrationId, reason) {
    if (!reason || reason.trim() === '') {
        throw new ApiError(400, 'A reason must be provided when rejecting a registration.', 'REASON_REQUIRED');
    }

    const registration = await Registration.findById(registrationId);

    if (!registration) throw new ApiError(404, 'Registration not found', 'NOT_FOUND');

    if (registration.status !== 'submitted' && registration.status !== 'pending_approval') {
        throw new ApiError(400, `Cannot reject a registration with status: ${registration.status}`, 'INVALID_STATUS_TRANSITION');
    }

    registration.status = 'rejected';
    registration.rejectionReason = reason;
    registration.reviewedBy = officerId;
    registration.reviewedAt = new Date();
    await registration.save();

    return registration;
}

module.exports = {
    submitRegistration,
    addCourse,
    dropCourse,
    getPendingRegistrations,
    approveRegistration,
    rejectRegistration
};