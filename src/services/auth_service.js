const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    hashToken
} = require('../utils/tokens');

async function registerStudent(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
        throw new ApiError(409, 'An account with this email already exists', 'DUPLICATE_ACCOUNT');
    }

    const user = new User({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'student'
    });

    await user.setPassword(data.password);
    await user.save();

    return { userId: user._id };
}

async function login({ email, password }, meta = {}) {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    if (user.status !== 'active') {
        throw new ApiError(403, 'Account is not active', 'ACCOUNT_INACTIVE');
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
        throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshTokens.push({
        tokenHash: hashToken(refreshToken),
        userAgent: meta.userAgent
    });

    if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    return { user, accessToken, refreshToken };
}

async function refresh(oldToken, meta = {}) {
    if (!oldToken) throw new ApiError(401, 'No refresh token', 'NO_REFRESH_TOKEN');

    let payload;
    try {
        payload = verifyRefreshToken(oldToken);
    } catch (err) {
        throw new ApiError(401, 'Refresh token invalid or expired', 'REFRESH_INVALID');
    }

    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'User not found');

    const oldHash = hashToken(oldToken);
    const matchIndex = user.refreshTokens.findIndex((t) => t.tokenHash === oldHash);

    if (matchIndex === -1) {
        user.refreshTokens = [];
        await user.save();
        throw new ApiError(401, 'Refresh token reuse detected. Please log in again.', 'REFRESH_REUSE');
    }

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);

    user.refreshTokens.splice(matchIndex, 1);
    user.refreshTokens.push({
        tokenHash: hashToken(newRefresh),
        userAgent: meta.userAgent
    });
    await user.save();

    return { user, accessToken: newAccess, refreshToken: newRefresh };
}

async function logout(userId, refreshToken) {
    if (!userId || !refreshToken) return;
    const user = await User.findById(userId);
    if (!user) return;

    const h = hashToken(refreshToken);
    user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== h);
    await user.save();
}

module.exports = { registerStudent, login, refresh, logout };