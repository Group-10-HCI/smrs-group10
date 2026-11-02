const dotenv = require('dotenv');
dotenv.config();

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
required.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT: {
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
        REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d'
    },
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN
};
