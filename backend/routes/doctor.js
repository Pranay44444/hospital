const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/doctor/register
// @desc    Register as a doctor
// @access  Private
router.post('/register', auth, async (req, res) => {
    try {
        const { hospital, degree, specialization, experience, location, timings, bio, consultationFee } = req.body;
        const userId = req.user._id;

        // Validation
        if (!hospital || !degree || !specialization || experience === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: hospital, degree, specialization, and experience'
            });
        }

        // Check for existing doctor profile
        const existingDoctor = await Doctor.findOne({ userId });
        if (existingDoctor) {
            // Block if already approved/active — they shouldn't re-apply
            if (existingDoctor.status === 'approved' || existingDoctor.status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'You are already an approved doctor'
                });
            }
            // Block if there's a pending application (prevent spam)
            if (existingDoctor.status === 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'You already have a pending application. Please wait for admin review.'
                });
            }
            // Allow resubmit if rejected or suspended — update the existing doc
            existingDoctor.hospital = hospital;
            existingDoctor.degree = degree;
            existingDoctor.specialization = specialization;
            existingDoctor.experience = experience;
            existingDoctor.location = location;
            existingDoctor.timings = timings || [];
            existingDoctor.bio = bio;
            existingDoctor.consultationFee = consultationFee || 500;
            existingDoctor.status = 'pending';
            existingDoctor.rejectionReason = '';
            await existingDoctor.save();

            req.user.doctorApplicationStatus = 'pending';
            req.user.doctorId = existingDoctor._id;
            await req.user.save();

            return res.status(200).json({
                success: true,
                message: 'Application resubmitted. An admin will review it shortly.',
                data: { doctor: existingDoctor }
            });
        }

        // Create new doctor profile (pending admin approval)
        const doctor = new Doctor({
            userId,
            hospital,
            degree,
            specialization,
            experience,
            location,
            timings: timings || [],
            bio,
            consultationFee: consultationFee || 500,
            status: 'pending'
        });

        await doctor.save();

        req.user.doctorApplicationStatus = 'pending';
        req.user.doctorId = doctor._id;
        await req.user.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted. An admin will review your request shortly.',
            data: { doctor }
        });
    } catch (error) {
        console.error('Doctor registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering as doctor',
            error: error.message
        });
    }
});

// @route   GET /api/doctor/list
// @desc    Get all active doctors
// @access  Public
router.get('/list', async (req, res) => {
    try {
        const { specialization, search } = req.query;

        // Build query (only show approved doctors)
        let query = { status: 'approved' };

        if (specialization) {
            query.specialization = specialization;
        }

        const doctors = await Doctor.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        // Filter by search if provided
        let filteredDoctors = doctors;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredDoctors = doctors.filter(doc =>
                doc.userId.name.toLowerCase().includes(searchLower) ||
                doc.hospital.toLowerCase().includes(searchLower) ||
                doc.specialization.toLowerCase().includes(searchLower)
            );
        }

        res.status(200).json({
            success: true,
            count: filteredDoctors.length,
            data: {
                doctors: filteredDoctors
            }
        });
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors',
            error: error.message
        });
    }
});

// @route   GET /api/doctor/profile/:id
// @desc    Get doctor profile by ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('userId', 'name email');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                doctor
            }
        });
    } catch (error) {
        console.error('Get doctor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor profile',
            error: error.message
        });
    }
});

// @route   GET /api/doctor/my-profile
// @desc    Get current user's doctor profile
// @access  Private
router.get('/my-profile', auth, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id })
            .populate('userId', 'name email');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                doctor
            }
        });
    } catch (error) {
        console.error('Get my doctor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor profile',
            error: error.message
        });
    }
});

// @route   PUT /api/doctor/update
// @desc    Update doctor profile
// @access  Private
router.put('/update', auth, async (req, res) => {
    try {
        const { hospital, degree, specialization, experience, location, bio } = req.body;

        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        // Update fields
        if (hospital) doctor.hospital = hospital;
        if (degree) doctor.degree = degree;
        if (specialization) doctor.specialization = specialization;
        if (experience !== undefined) doctor.experience = experience;
        if (location) doctor.location = location;
        if (bio !== undefined) doctor.bio = bio;

        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
            data: {
                doctor
            }
        });
    } catch (error) {
        console.error('Update doctor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating doctor profile',
            error: error.message
        });
    }
});

// @route   POST /api/doctor/timings
// @desc    Update doctor timings
// @access  Private
router.post('/timings', auth, async (req, res) => {
    try {
        const { timings } = req.body;

        if (!timings || !Array.isArray(timings)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid timings array'
            });
        }

        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        doctor.timings = timings;
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Timings updated successfully',
            data: {
                timings: doctor.timings
            }
        });
    } catch (error) {
        console.error('Update timings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating timings',
            error: error.message
        });
    }
});

module.exports = router;
