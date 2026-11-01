const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    hashToken
} = require('../utils/tokens');

async function registerStudent(data) {
    // Prevent duplicates
    const existing = await User.findOne({
        $or: [{ email: data.email }, { username: data.username }]
    });
    if (existing) {
        const field = existing.email === data.email ? 'email' : 'username';
        throw new ApiError(
            409,
            `An account with this ${field} already exists`,
            'DUPLICATE_ACCOUNT',
            { field }
        );
    }

    const user = new User({
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: 'student'
    });
    await user.setPassword(data.password);
    await user.save();

    return { userId: user._id };
}

async function login({ identifier, password }, meta = {}) {
    // Allow login with email OR username
    const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
    });

    // Same error for "no user" and "wrong password" — don't leak which one
    if (!user) {
        throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    if (user.status === 'locked') {
        throw new ApiError(403, 'Account is locked. Contact an administrator.', 'ACCOUNT_LOCKED');
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

    // Cap to 5 active sessions per user
    if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
    }

    user.lastLoginAt = new Date();
    await user.save();

    return { user, accessToken, refreshToken };
}

async function refresh(oldToken, meta = {}) {
    if (!oldToken) {
        throw new ApiError(401, 'No refresh token', 'NO_REFRESH_TOKEN');
    }

    let payload;
    try {
        payload = verifyRefreshToken(oldToken);
    } catch (err) {
        throw new ApiError(401, 'Refresh token invalid or expired', 'REFRESH_INVALID');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
        throw new ApiError(401, 'User not found');
    }

    const oldHash = hashToken(oldToken);
    const matchIndex = user.refreshTokens.findIndex((t) => t.tokenHash === oldHash);

    if (matchIndex === -1) {
        // The token is valid but not in the DB → it was already used/revoked.
        // This could mean theft. Revoke everything as a precaution.
        user.refreshTokens = [];
        await user.save();
        throw new ApiError(401, 'Refresh token reuse detected. Please log in again.', 'REFRESH_REUSE');
    }

    // Rotate: remove old, add new
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