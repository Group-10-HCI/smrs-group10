const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const { verifyAccessToken } = require('../utils/tokens');
const { ACCESS_COOKIE } = require('../utils/cookies');
const asyncHandler = require('../utils/asyncHandler');

const requireAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) {
        throw new ApiError(401, 'Authentication required', 'UNAUTHENTICATED');
    }

    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch (err) {
        throw new ApiError(401, 'Session expired or invalid', 'TOKEN_INVALID');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
        throw new ApiError(401, 'User no longer exists', 'USER_NOT_FOUND');
    }
    if (user.status !== 'active') {
        throw new ApiError(403, 'Account is not active', 'ACCOUNT_INACTIVE');
    }

    req.user = user; // attached for downstream handlers
    next();
});

module.exports = { requireAuth };