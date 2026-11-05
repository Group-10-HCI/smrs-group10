const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { globalLimiter } = require('./src/middleware/rate_limit_middleware');

const routes = require('./index');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/api', globalLimiter, routes)

module.exports = app;