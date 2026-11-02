const asyncHandler = require('../utils/asyncHandler');
const StudentProfile = require('../models/StudentProfile');
const Programme = require('../models/Programme');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');


const assignProgramme = asyncHandler(async (req, res) => {
    const { studentId, programmeId } = req.body;

    if (studentId === "" || programmeId === "") {
        throw new ApiError(400, 'Enter valid values', 'INVALID_VALUES')
    }

    // Verify the student exists
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
        throw new ApiError(404, 'Student not found.', 'STUDENT_NOT_FOUND');
    }

    // Verify the programme exists
    const programme = await Programme.findById(programmeId);
    if (!programme) {
        throw new ApiError(404, 'Programme not found.', 'PROGRAMME_NOT_FOUND');
    }

    // Find or create the student's profile
    let profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
        // If they haven't filled out a profile yet, create a blank one for them
        profile = new StudentProfile({ user: studentId });
    }

    // Assign the programme
    profile.programme = programmeId;
    await profile.save();

    res.json({
        success: true,
        message: `Successfully assigned ${student.firstName} to ${programme.name}.`,
        data: profile
    });
});

// A helper to let the admin see all students so they know who to assign
const getAllStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' }).select('firstName lastName email');

    // Get their profiles to see if they already have a programme
    const profiles = await StudentProfile.find({ user: { $in: students.map(s => s._id) } }).populate('programme', 'name code');

    // Merge them for the response
    const result = students.map(student => {
        const profile = profiles.find(p => p.user.toString() === student._id.toString());
        return {
            _id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            programme: profile?.programme ? profile.programme.name : 'Not Assigned'
        };
    });

    res.json({ success: true, count: result.length, data: result });
});

module.exports = { assignProgramme, getAllStudents };