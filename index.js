const router = require('express').Router();

const authRoutes = require('./src/routes/auth_routes');
const programmeRoutes = require('./src/routes/programme_routes');
const courseRoutes = require('./src/routes/course_routes');
const regPeriodRoutes = require('./src/routes/regperiod_routes');

const errorHandler = require('./src/middleware/error_middleware');

//logger
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


router.get('/', (req, res) => {
    res.json({
        message: 'smrs backend is alive'
    });
});

router.use('/auth', authRoutes);
router.use('/programmes', programmeRoutes);
router.use('/courses', courseRoutes);
router.use('/period', regPeriodRoutes);


// 404 - runs if no route is matched
router.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// error handler
router.use(errorHandler);



module.exports = router;