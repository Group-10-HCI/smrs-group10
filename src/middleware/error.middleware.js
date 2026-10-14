const env = require('../config/env');

module.exports = (err, req, res, next) => {
    // Force status to be a number
    const status = Number(err.statusCode) || 500;

    const payload = {
        success: false,
        code: err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR'),
        message: err.message || 'Something went wrong'
    };

    if (err.details) payload.details = err.details;

    // Safely check env
    if (env && env.NODE_ENV !== 'production' && status === 500) {
        payload.stack = err.stack;
    }

    if (status >= 500) {
        console.error('[ERROR]', err);
    }

    // Final safety net
    try {
        res.status(status).json(payload);
    } catch (jsonError) {
        console.error('Failed to send error response:', jsonError);
        // If we can't send the original error, send a generic one
        res.status(500).json({
            success: false,
            code: 'FATAL_ERROR',
            message: 'Something went wrong on the server'
        });
    }
};