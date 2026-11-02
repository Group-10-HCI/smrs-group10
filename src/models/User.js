const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['student', 'registration_officer', 'lecturer', 'admin', 'sysadmin'];

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ROLES,
            default: 'student'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'locked'],
            default: 'active'
        },
        // Names
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: false,
            trim: true
        },
        displayName: {
            type: String,
            trim: true,
        },
        studentNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        refreshTokens: [
            {
                tokenHash: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                userAgent: String
            }
        ],
        locale: {
            type: String,
            default: 'en'
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
        },
        notificationPrefs: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            },
            push: {
                type: Boolean,
                default: true
            },
            inApp: {
                type: Boolean,
                default: true
            }
        }
    },
    { timestamps: true }
);

userSchema.methods.setPassword = async function (plain) {
    this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;