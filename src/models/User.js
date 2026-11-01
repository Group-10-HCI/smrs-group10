const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['student', 'registration_officer', 'lecturer', 'admin', 'sysadmin'];

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ROLES,
            default: 'student',
        },
        phone: String,
        status: {
            type: String,
            enum: ['active', 'inactive', 'locked'],
            default: 'active',
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },

        refreshTokens: [
            {
                tokenHash: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                userAgent: String,
            }
        ],

        locale: {
            type: String,
            default: 'en',
        },
        accessibilityPrefs: {
            largeText: {
                type: Boolean,
                default: false,
            },
            highContrast: {
                type: Boolean,
                default: false,
            },
            screenReader: {
                type: Boolean,
                default: false,
            }
        },

        lastLoginAt: Date,
    },
    { timestamps: true }
);

// Instance method for hashing and setting passowrd
userSchema.methods.setPassword = async function (plain) {
    this.passwordHash = await bcrypt.hash(plain, 12);
};

// Instance method for comparing a plain password with the stored hash password
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;