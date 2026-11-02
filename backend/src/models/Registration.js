const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        academicYear: {
            type: String,
            required: true
        },
        semester: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        // Array of courses the student is registering for
        courses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                },
                status: {
                    type: String,
                    enum: ['registered', 'dropped'],
                    default: 'registered'
                }
            }
        ],
        totalCredits: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'locked'],
            default: 'submitted'
        },
        rejectionReason: {
            type: String
        }, // Required if rejected
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, // The officer/admin
        reviewedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

registrationSchema.index(
    {
        student: 1,
        academicYear: 1,
        semester: 1
    },
    {
        unique: true
    });

module.exports = mongoose.model('Registration', registrationSchema);