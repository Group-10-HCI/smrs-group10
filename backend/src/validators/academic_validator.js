const Joi = require('joi');

const createProgrammeSchema = Joi.object({
    code: Joi.string().uppercase().trim().required(),
    name: Joi.string().trim().required(),
    faculty: Joi.string().required(),
    department: Joi.string().required(),
    qualification: Joi.string().required(),
    duration: Joi.number().integer().min(1).max(8).required(),
    studyMode: Joi.string().valid('Full-time', 'Part-time', 'Distance').default('Full-time'),
    status: Joi.string().valid('active', 'inactive').default('active')
});

const createCourseSchema = Joi.object({
    code: Joi.string().uppercase().trim().required(),
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    creditHours: Joi.number().integer().min(1).max(10).required(),
    department: Joi.string().required(),
    programme: Joi.string().hex().length(24).required(), // Must be a valid MongoDB ID
    level: Joi.number().integer().min(1).max(6).required(),
    semester: Joi.number().integer().valid(1, 2).required(),
    status: Joi.string().valid('active', 'inactive').default('active')
});

module.exports = { createProgrammeSchema, createCourseSchema };