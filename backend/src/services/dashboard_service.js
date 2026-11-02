const StudentProfile = require('../models/StudentProfile');
const Registration = require('../models/Registration');
const RegistrationPeriod = require('../models/RegistrationPeriod');
const User = require('../models/User');
const Course = require('../models/Course');


async function getStudentDashboard(user) {
    const profile = await StudentProfile.findOne({ user: user._id }).populate('programme', 'name code');

    // Finding the active registration period (so we can show deadlines)
    const now = new Date();
    const activePeriod = await RegistrationPeriod.findOne({
        openDate: { $lte: now },
        closeDate: { $gte: now }
    });

    const registration = await Registration.findOne({ student: user._id })
        .sort({ createdAt: -1 })
        .populate('courses.course', 'code name creditHours');

    // Formatting the response for the frontend to easily consume
    return {
        studentName: `${user.firstName} ${user.lastName}`,
        programme: profile?.programme ? profile.programme.name : 'Not Assigned',
        activeRegistrationPeriod: activePeriod ? {
            academicYear: activePeriod.academicYear,
            semester: activePeriod.semester,
            deadline: activePeriod.closeDate
        } : null,
        registration: registration ? {
            status: registration.status,
            totalCredits: registration.totalCredits,
            courses: registration.courses,
            rejectionReason: registration.rejectionReason
        } : null
    };
}

async function getAdminDashboard() {
    // Running all queries in parallel for speed
    const [
        totalStudents,
        pendingRegistrations,
        totalCourses,
        activePeriod
    ] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        Registration.countDocuments({ status: 'submitted' }),
        Course.countDocuments({ status: 'active' }),
        RegistrationPeriod.findOne({ status: 'active' })
    ]);

    return {
        totalStudents,
        pendingRegistrations,
        totalCourses,
        activePeriod: activePeriod ? {
            academicYear: activePeriod.academicYear,
            semester: activePeriod.semester,
            closes: activePeriod.closeDate
        } : null
    };
}

module.exports = { getStudentDashboard, getAdminDashboard };