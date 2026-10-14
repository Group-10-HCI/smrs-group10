const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const register = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, 'Email is required', 'EMAIL_REQUIRED');
    }
    res.status(201).json({
        succcess: true,
        message: 'Register endpoint hit',
        data: { email }
    });
});

const login = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'Login endpoint hit'
    });
});

module.exports = { login, register };