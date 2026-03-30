const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth, admin);

// GET /api/admin/doctors/pending
router.get('/doctors/pending', async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'pending' })
            .populate('userId', 'name email createdAt')
            .sort({ createdAt: 1 });
        res.json({ success: true, count: doctors.length, data: { doctors } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching pending doctors', error: error.message });
    }
});

// GET /api/admin/doctors
router.get('/doctors', async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const doctors = await Doctor.find(query)
            .populate('userId', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: doctors.length, data: { doctors } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching doctors', error: error.message });
    }
});

// POST /api/admin/doctors/:id/approve
router.post('/doctors/:id/approve', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        doctor.status = 'approved';
        doctor.approvedBy = req.user._id;
        doctor.approvedAt = new Date();
        doctor.rejectionReason = '';
        await doctor.save();

        await User.findByIdAndUpdate(doctor.userId, {
            isDoctor: true,
            doctorId: doctor._id,
            doctorApplicationStatus: 'none'
        });

        res.json({ success: true, message: 'Doctor approved', data: { doctor } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error approving doctor', error: error.message });
    }
});

// POST /api/admin/doctors/:id/reject
router.post('/doctors/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        doctor.status = 'rejected';
        doctor.rejectionReason = reason || 'Application did not meet requirements';
        await doctor.save();

        await User.findByIdAndUpdate(doctor.userId, {
            isDoctor: false,
            doctorApplicationStatus: 'rejected'
        });

        res.json({ success: true, message: 'Doctor rejected', data: { doctor } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error rejecting doctor', error: error.message });
    }
});

// POST /api/admin/doctors/:id/suspend
router.post('/doctors/:id/suspend', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        doctor.status = 'suspended';
        await doctor.save();

        await User.findByIdAndUpdate(doctor.userId, { isDoctor: false });

        res.json({ success: true, message: 'Doctor suspended', data: { doctor } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error suspending doctor', error: error.message });
    }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [pending, approved, rejected, totalUsers] = await Promise.all([
            Doctor.countDocuments({ status: 'pending' }),
            Doctor.countDocuments({ status: 'approved' }),
            Doctor.countDocuments({ status: 'rejected' }),
            User.countDocuments({})
        ]);
        res.json({ success: true, data: { pending, approved, rejected, totalUsers } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
    }
});

module.exports = router;
