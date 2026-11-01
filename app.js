const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./src/routes/auth_routes');
const errorHandler = require('./src/middleware/error.middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

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