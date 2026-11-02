const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Show all errors at once, not just the first one
        stripUnknown: true // Remove any extra fields the user tried to sneak in!
    });

    if (error) {
        // Format the Joi errors into a clean array for the frontend
        const details = error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message
        }));

        return next(new ApiError(400, 'Validation failed. Please check your inputs.', 'VALIDATION_ERROR', details));
    }

    // Replace req.body with the validated and sanitized value
    req.body = value;
    next();
};

module.exports = { validate };