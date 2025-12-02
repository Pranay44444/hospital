const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    hospital: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true
    },
    degree: {
        type: String,
        required: [true, 'Degree is required'],
        trim: true
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true
    },
    experience: {
        type: Number,
        required: [true, 'Years of experience is required'],
        min: 0
    },
    location: {
        type: String,
        trim: true
    },
    timings: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        slots: [{
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            },
            available: {
                type: Boolean,
                default: true
            }
        }]
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'suspended'],
        default: 'active'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    consultationFee: {
        type: Number,
        default: 500,
        min: 0,
        required: [true, 'Consultation fee is required']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Index for faster queries
doctorSchema.index({ specialization: 1, status: 1 });
doctorSchema.index({ userId: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
