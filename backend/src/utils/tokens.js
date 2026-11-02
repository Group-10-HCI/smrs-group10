const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function signAccessToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            username: user.username,
        },
        env.JWT.ACCESS_SECRET,
        {
            expiresIn: env.JWT.ACCESS_EXPIRES
        }
    );
}

function signRefreshToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            jti: crypto.randomBytes(16).toString('hex')
        },
        env.JWT.REFRESH_SECRET,
        {
            expiresIn: env.JWT.REFRESH_EXPIRES
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT.ACCESS_SECRET);
}

function verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT.REFRESH_SECRET);
}

// one way hash of the token (whats stored in the database)
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken };