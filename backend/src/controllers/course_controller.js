const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');

// Admin only (FR-010)
const createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
});

// Anyone can search and filter (FR-013, FR-014)
const getCourses = asyncHandler(async (req, res) => {
    const { search, programme, level, semester } = req.query;

    // Build query object
    let query = { status: 'active' };

    if (search) {
        // Search by code or name (case-insensitive)
        query.$or = [
            { code: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } }
        ];
    }
    if (programme) query.programme = programme;
    if (level) query.level = Number(level);
    if (semester) query.semester = Number(semester);

    const courses = await Course.find(query).populate('programme', 'name code');

    res.json({ success: true, count: courses.length, data: courses });
});

module.exports = { createCourse, getCourses };