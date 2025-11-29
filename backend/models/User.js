const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    // Skip password validation and hashing for Google OAuth users
    if (this.googleId && !this.password) {
        return; // Google user with no password is OK
    }

    // Validate password length for non-Google users
    if (!this.googleId && (!this.password || this.password.length < 6)) {
        throw new Error('Password must be at least 6 characters');
    }

    // Only hash if password is modified and not empty
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
