const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { success: false, code: 'TOO_MANY_REQUESTS', message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, code: 'TOO_MANY_LOGIN_ATTEMPTS', message: 'Too many login attempts, please try again in 15 minutes.' },
});

module.exports = { globalLimiter, authLimiter };