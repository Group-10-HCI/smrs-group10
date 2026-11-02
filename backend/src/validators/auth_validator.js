const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().trim().required().messages({
        'string.empty': 'First name is required.',
        'any.required': 'First name is required.'
    }),
    lastName: Joi.string().trim().allow('').optional(),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };