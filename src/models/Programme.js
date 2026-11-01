const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema(
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
        faculty: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        qualification: {
            type: String,
            required: true
        }, // e.g., "Bachelor of Science"
        duration: {
            type: Number,
            required: true
        },      // e.g., 4 (years)
        studyMode: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Distance'],
            default: 'Full-time'
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Programme', programmeSchema);