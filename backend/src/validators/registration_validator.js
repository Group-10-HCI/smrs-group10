const Joi = require('joi');

const submitRegistrationSchema = Joi.object({
    academicYear: Joi.string().pattern(/^\d{4}\/\d{4}$/).required(),
    semester: Joi.number().integer().valid(1, 2).required(),
    courseIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required().messages({
        'array.min': 'You must select at least one course.'
    })
});

const addDropCourseSchema = Joi.object({
    registrationId: Joi.string().hex().length(24).required(),
    courseId: Joi.string().hex().length(24).required()
});

const rejectRegistrationSchema = Joi.object({
    reason: Joi.string().trim().min(5).required().messages({
        'string.min': 'Please provide a clear reason (at least 5 characters).'
    })
});

module.exports = { submitRegistrationSchema, addDropCourseSchema, rejectRegistrationSchema };