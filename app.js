const express = require('express');
const authRoutes = require('./src/routes/auth_routes');
const errorHandler = require('./src/middleware/error.middleware');
const ApiError = require('./src/utils/ApiError');
const asyncHandler = require('./src/utils/asyncHandler');

// Schemas
const User = require('./src/models/User');

const app = express();

app.use(express.json());

//logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// routes
app.get('/', (req, res) => {
    res.json({
        message: 'smrs backend is alive'
    });
});

app.get('/boom', asyncHandler(async (req, res) => {
    throw new ApiError(418, 'I am a teapot', 'TEAPOT');
}));

app.use('/auth', authRoutes);

// 404 - runs if no route is matched
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// error handler
app.use(errorHandler);

module.exports = app;