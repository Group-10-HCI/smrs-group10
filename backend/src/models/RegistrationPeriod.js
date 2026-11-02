const mongoose = require('mongoose');

const registrationPeriodSchema = new mongoose.Schema(
    {
        academicYear: {
            type: String,
            required: true,
            trim: true
        }, // e.g., "2023/2024"
        semester: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        // Normal Registration Dates
        openDate: {
            type: Date,
            required: true
        },
        closeDate: {
            type: Date,
            required: true
        },
        // Late Registration (FR-024)
        lateRegistrationAllowed: {
            type: Boolean,
            default: false
        },
        lateOpenDate: {
            type: Date
        },
        lateCloseDate: {
            type: Date
        },

        // Controls whether the period is active or archived
        status: {
            type: String,
            enum: ['upcoming', 'active', 'closed'],
            default: 'upcoming'
        }
    },
    { timestamps: true }
);

registrationPeriodSchema.index({ academicYear: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('RegistrationPeriod', registrationPeriodSchema);