const dotenv = require('dotenv');
dotenv.config();

const required = ['MONGO_URI'];
required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 5000,
    MONGO_URI: process.env.MONGO_URI
};