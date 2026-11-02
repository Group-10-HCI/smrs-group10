const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard_service');

const getStudentDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getStudentDashboard(req.user);
    res.json({
        success: true,
        data
    });
});

const getAdminDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getAdminDashboard();
    res.json({
        success: true,
        data
    });
});

module.exports = { getStudentDashboard, getAdminDashboard };