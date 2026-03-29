const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// @route   POST /api/appointments/create
// @desc    Create a new appointment
// @access  Private
router.post('/create', auth, async (req, res) => {
    try {
        const { doctorId, patientName, patientEmail, patientPhone, date, time, reason, type } = req.body;

        // Validation
        if (!doctorId || !patientName || !patientEmail || !patientPhone || !date || !time || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Verify doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Create appointment
        const appointmentData = {
            patientId: req.user._id,
            doctorId,
            patientName,
            patientEmail,
            patientPhone,
            date,
            time,
            reason,
            status: 'pending',
            type: type || 'in-person'
        };

        if (type === 'video') {
            // Generate a unique meeting link using Jitsi Meet
            // Format: https://meet.jit.si/opd-flow-<timestamp>-<randomString>
            const uniqueId = Math.random().toString(36).substring(7);
            appointmentData.meetingLink = `https://meet.jit.si/opd-flow-${Date.now()}-${uniqueId}`;
        }

        const appointment = new Appointment(appointmentData);

        await appointment.save();

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: {
                appointment
            }
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
});

// @route   GET /api/appointments/patient
// @desc    Get all appointments for current patient
// @access  Private
router.get('/patient', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id })
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name email' }
            })
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: {
                appointments
            }
        });
    } catch (error) {
        console.error('Get patient appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

// @route   GET /api/appointments/doctor
// @desc    Get all appointments for current doctor
// @access  Private
router.get('/doctor', auth, async (req, res) => {
    try {
        // Get doctor profile
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate('patientId', 'name email')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: {
                appointments
            }
        });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.id;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment status updated',
            data: {
                appointment
            }
        });
    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
});

// @route   GET /api/appointments/stats/patient
// @desc    Get appointment statistics for patient
// @access  Private
router.get('/stats/patient', auth, async (req, res) => {
    try {
        const total = await Appointment.countDocuments({ patientId: req.user._id });
        const upcoming = await Appointment.countDocuments({
            patientId: req.user._id,
            date: { $gte: new Date() },
            status: { $in: ['pending', 'confirmed'] }
        });

        const doctorsVisited = await Appointment.distinct('doctorId', {
            patientId: req.user._id
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                upcoming,
                doctorsVisited: doctorsVisited.length,
                medicalRecords: 0 // Placeholder
            }
        });
    } catch (error) {
        console.error('Get patient stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// @route   GET /api/appointments/stats/doctor
// @desc    Get appointment statistics for doctor
// @access  Private
router.get('/stats/doctor', auth, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        const total = await Appointment.countDocuments({ doctorId: doctor._id });
        const upcoming = await Appointment.countDocuments({
            doctorId: doctor._id,
            date: { $gte: new Date() },
            status: { $in: ['pending', 'confirmed'] }
        });
        const activePatients = await Appointment.distinct('patientId', {
            doctorId: doctor._id
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                upcoming,
                activePatients: activePatients.length
            }
        });
    } catch (error) {
        console.error('Get doctor stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// POST /api/appointments/:id/reschedule — patient or doctor requests reschedule
router.post('/:id/reschedule', auth, async (req, res) => {
    try {
        const { proposedDate, proposedTime, note } = req.body;
        if (!proposedDate || !proposedTime) {
            return res.status(400).json({ success: false, message: 'proposedDate and proposedTime are required' });
        }

        const appointment = await Appointment.findById(req.params.id).populate('doctorId');
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        // Determine who is requesting
        const isPatient = String(appointment.patientId) === String(req.user._id);
        const isDoctor = appointment.doctorId && String(appointment.doctorId.userId) === String(req.user._id);
        if (!isPatient && !isDoctor) {
            return res.status(403).json({ success: false, message: 'Not authorized for this appointment' });
        }

        appointment.rescheduleRequest = {
            proposedDate,
            proposedTime,
            requestedBy: isPatient ? 'patient' : 'doctor',
            note: note || '',
            status: 'pending',
            createdAt: new Date()
        };
        await appointment.save();

        res.json({ success: true, message: 'Reschedule request submitted', data: { appointment } });
    } catch (error) {
        console.error('Reschedule request error:', error);
        res.status(500).json({ success: false, message: 'Error submitting reschedule request', error: error.message });
    }
});

// POST /api/appointments/:id/reschedule/respond — other party approves/rejects
router.post('/:id/reschedule/respond', auth, async (req, res) => {
    try {
        const { action } = req.body; // 'approve' | 'reject'
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'action must be approve or reject' });
        }

        const appointment = await Appointment.findById(req.params.id).populate('doctorId');
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (!appointment.rescheduleRequest || appointment.rescheduleRequest.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'No pending reschedule request' });
        }

        const isPatient = String(appointment.patientId) === String(req.user._id);
        const isDoctor = appointment.doctorId && String(appointment.doctorId.userId) === String(req.user._id);
        if (!isPatient && !isDoctor) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Only the other party can respond
        const requester = appointment.rescheduleRequest.requestedBy;
        if ((requester === 'patient' && !isDoctor) || (requester === 'doctor' && !isPatient)) {
            return res.status(403).json({ success: false, message: 'Only the other party can respond to this request' });
        }

        if (action === 'approve') {
            appointment.date = appointment.rescheduleRequest.proposedDate;
            appointment.time = appointment.rescheduleRequest.proposedTime;
            appointment.rescheduleRequest.status = 'approved';
        } else {
            appointment.rescheduleRequest.status = 'rejected';
        }
        await appointment.save();

        res.json({ success: true, message: `Reschedule ${action}d`, data: { appointment } });
    } catch (error) {
        console.error('Reschedule respond error:', error);
        res.status(500).json({ success: false, message: 'Error responding to reschedule', error: error.message });
    }
});

module.exports = router;
