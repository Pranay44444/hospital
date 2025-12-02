const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const auth = require('../middleware/auth');

// @route   POST /api/prescriptions/create
// @desc    Create a new prescription
// @access  Private (Doctor only)
router.post('/create', auth, async (req, res) => {
    try {
        const { patientId, appointmentId, medicines, notes } = req.body;

        // Validation
        if (!patientId || !appointmentId || !medicines || medicines.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Get doctor ID from logged in user
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can create prescriptions'
            });
        }

        // Create prescription
        const prescription = new Prescription({
            doctorId: doctor._id,
            patientId,
            appointmentId,
            medicines,
            notes
        });

        await prescription.save();

        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: {
                prescription
            }
        });
    } catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating prescription',
            error: error.message
        });
    }
});

// @route   GET /api/prescriptions/appointment/:appointmentId
// @desc    Get prescription for a specific appointment
// @access  Private
router.get('/appointment/:appointmentId', auth, async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
            .populate('doctorId', 'hospital specialization')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name' }
            });

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                prescription
            }
        });
    } catch (error) {
        console.error('Get prescription error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prescription',
            error: error.message
        });
    }
});

module.exports = router;
