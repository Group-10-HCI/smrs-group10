const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // One profile per user
        },
        // Immutable / Academic Fields (Set by Admin later, or on creation)
        studentNumber: {
            type: String,
            trim: true
        },
        programme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Programme'
        },
        yearOfStudy: {
            type: Number,
            default: 1
        },
        dateOfBirth: {
            type: Date
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer_not_to_say']
        },
        nationality: {
            type: String
        },

        // Editable Contact Info
        phone: {
            type: String,
            trim: true
        },
        physicalAddress: {
            type: String,
            trim: true
        },
        // Emergency Contact (Next of Kin)
        nextOfKin: {
            name: {
                type: String,
                trim: true
            },
            relationship: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                trim: true
            }
        },
        accessibilityPrefs: {
            largeText: {
                type: Boolean,
                default: false
            },
            highContrast: {
                type: Boolean,
                default: false
            },
            screenReader: {
                type: Boolean,
                default: false
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);