const env = require('../config/env');

const isProd = env.NODE_ENV === 'production';

const baseOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    domain: isProd ? env.COOKIE_DOMAIN : undefined,
    path: '/'
};

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie(ACCESS_COOKIE, accessToken, {
        ...baseOptions,
        maxAge: 15 * 60 * 1000 // 15 mins
    });
    res.cookie(REFRESH_COOKIE, refreshToken, {
        ...baseOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

function clearAuthCookies(res) {
    res.clearCookie(ACCESS_COOKIE, baseOptions);
    res.clearCookie(REFRESH_COOKIE, baseOptions);
}

module.exports = { setAuthCookies, clearAuthCookies, ACCESS_COOKIE, REFRESH_COOKIE }