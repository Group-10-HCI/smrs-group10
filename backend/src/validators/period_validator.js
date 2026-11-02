const Joi = require('joi');

const createPeriodSchema = Joi.object({
    academicYear: Joi.string().pattern(/^\d{4}\/\d{4}$/).required().messages({
        'string.pattern.base': 'Academic year must be in the format YYYY/YYYY (e.g., 2023/2024).'
    }),
    semester: Joi.number().integer().valid(1, 2).required(),
    openDate: Joi.date().iso().required(),
    closeDate: Joi.date().iso().greater(Joi.ref('openDate')).required().messages({
        'date.greater': 'Close date must be after the open date.'
    }),
    lateRegistrationAllowed: Joi.boolean().default(false),
    lateOpenDate: Joi.date().iso().allow(null, ''),
    lateCloseDate: Joi.date().iso().allow(null, ''),
    status: Joi.string().valid('upcoming', 'active', 'closed').default('upcoming')
});

module.exports = { createPeriodSchema };