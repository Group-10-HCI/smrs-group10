const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth_service');
const { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } = require('../utils/cookies');

const register = asyncHandler(async (req, res) => {
    const result = await authService.registerStudent(req.body);
    res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: result
    });
});

const login = asyncHandler(async (req, res) => {
    const meta = { userAgent: req.headers['user-agent'] };
    const { user, accessToken, refreshToken } = await authService.login(req.body, meta);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({
        success: true,
        message: 'Logged in successfully.',
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});

const refresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    const meta = { userAgent: req.headers['user-agent'] };
    const { user, accessToken, refreshToken } = await authService.refresh(token, meta);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({
        success: true,
        data: { id: user._id, role: user.role }
    });
});

const logout = asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    await authService.logout(req.user?._id, token);
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out.' });
});

const me = asyncHandler(async (req, res) => {
    const u = req.user;
    res.json({
        success: true,
        data: {
            id: u._id,
            username: u.username,
            firstname: u.firstName,
            email: u.email,
            role: u.role,
            status: u.status,
            emailVerified: u.emailVerified,
            locale: u.locale,
            accessibilityPrefs: u.accessibilityPrefs
        }
    });
});

module.exports = { register, login, refresh, logout, me };