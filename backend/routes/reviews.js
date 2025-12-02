const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// @route   POST /api/reviews/create
// @desc    Create a new review
// @access  Private (Patient only)
router.post('/create', auth, async (req, res) => {
    try {
        const { doctorId, appointmentId, rating, comment } = req.body;

        // Validation
        if (!doctorId || !appointmentId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create review
        const review = new Review({
            patientId: req.user._id,
            doctorId,
            appointmentId,
            rating,
            comment
        });

        await review.save();

        // Update doctor's average rating
        const reviews = await Review.find({ doctorId });
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Doctor.findByIdAndUpdate(doctorId, {
            rating: averageRating,
            reviewCount: reviews.length
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: {
                review
            }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
});

// @route   GET /api/reviews/doctor/:doctorId
// @desc    Get reviews for a doctor
// @access  Public
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const reviews = await Review.find({ doctorId: req.params.doctorId })
            .populate('patientId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: {
                reviews
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
});

// @route   GET /api/reviews/appointment/:appointmentId
// @desc    Get review for a specific appointment
// @access  Private
router.get('/appointment/:appointmentId', auth, async (req, res) => {
    try {
        const review = await Review.findOne({ appointmentId: req.params.appointmentId });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                review
            }
        });
    } catch (error) {
        console.error('Get appointment review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching review',
            error: error.message
        });
    }
});

module.exports = router;
