const asyncHandler = require('../utils/asyncHandler');
const Programme = require('../models/Programme');

exports.createProgramme = asyncHandler(async (req, res) => {
    const programme = await Programme.create(req.body);
    res.status(201).json({ success: true, data: programme });
});

exports.getProgrammes = asyncHandler(async (req, res) => {
    const programmes = await Programme.find({ status: 'active' });
    res.json({ success: true, count: programmes.length, data: programmes });
});