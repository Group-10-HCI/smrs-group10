const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        creditHours: {
            type: Number,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        programme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Programme',
            required: true
        },
        level: {
            type: Number,
            required: true
        },   // e.g., 1, 2, 3, 4
        semester: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);