require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const DOCTORS = [
    {
        name: 'Dr. Aarav Sharma',
        email: 'aarav.sharma@opdflow.health',
        specialization: 'Cardiology',
        degree: 'MBBS, MD (Cardiology)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Pune, Maharashtra',
        experience: 14,
        consultationFee: 1200,
        bio: 'Interventional cardiologist with a focus on preventive care and long-term outcomes.',
        rating: 4.8,
        reviewCount: 212
    },
    {
        name: 'Dr. Meera Iyer',
        email: 'meera.iyer@opdflow.health',
        specialization: 'General Medicine',
        degree: 'MBBS, MD (Internal Medicine)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Pune, Maharashtra',
        experience: 11,
        consultationFee: 499,
        bio: 'Primary care physician. Believes in time over volume.',
        rating: 4.9,
        reviewCount: 340
    },
    {
        name: 'Dr. Rohan Desai',
        email: 'rohan.desai@opdflow.health',
        specialization: 'Orthopedics',
        degree: 'MBBS, MS (Orthopedics)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Mumbai, Maharashtra',
        experience: 16,
        consultationFee: 1100,
        bio: 'Sports injuries and joint preservation.',
        rating: 4.7,
        reviewCount: 189
    },
    {
        name: 'Dr. Priya Menon',
        email: 'priya.menon@opdflow.health',
        specialization: 'Dermatology',
        degree: 'MBBS, MD (Dermatology)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Bengaluru, Karnataka',
        experience: 9,
        consultationFee: 900,
        bio: 'Medical and cosmetic dermatology, evidence-first approach.',
        rating: 4.8,
        reviewCount: 156
    },
    {
        name: 'Dr. Kabir Khanna',
        email: 'kabir.khanna@opdflow.health',
        specialization: 'Pediatrics',
        degree: 'MBBS, MD (Pediatrics)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Pune, Maharashtra',
        experience: 12,
        consultationFee: 700,
        bio: 'Child health, development, and vaccinations.',
        rating: 4.9,
        reviewCount: 278
    },
    {
        name: 'Dr. Ananya Rao',
        email: 'ananya.rao@opdflow.health',
        specialization: 'Gynecology',
        degree: 'MBBS, MS (OB-GYN)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Hyderabad, Telangana',
        experience: 13,
        consultationFee: 950,
        bio: 'Womens health, fertility, and prenatal care.',
        rating: 4.8,
        reviewCount: 221
    },
    {
        name: 'Dr. Vikram Shetty',
        email: 'vikram.shetty@opdflow.health',
        specialization: 'Neurology',
        degree: 'MBBS, DM (Neurology)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Mumbai, Maharashtra',
        experience: 18,
        consultationFee: 1500,
        bio: 'Headache, stroke, and movement disorders.',
        rating: 4.7,
        reviewCount: 145
    },
    {
        name: 'Dr. Simran Bedi',
        email: 'simran.bedi@opdflow.health',
        specialization: 'Psychiatry',
        degree: 'MBBS, MD (Psychiatry)',
        hospital: 'OPD Flow Main Clinic',
        location: 'Delhi',
        experience: 10,
        consultationFee: 1300,
        bio: 'Mood, anxiety, and sleep disorders.',
        rating: 4.9,
        reviewCount: 198
    }
];

const DEFAULT_TIMINGS = [
    { day: 'Monday', slots: [{ startTime: '09:00', endTime: '13:00', available: true }] },
    { day: 'Tuesday', slots: [{ startTime: '09:00', endTime: '13:00', available: true }] },
    { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '13:00', available: true }] },
    { day: 'Thursday', slots: [{ startTime: '14:00', endTime: '18:00', available: true }] },
    { day: 'Friday', slots: [{ startTime: '14:00', endTime: '18:00', available: true }] },
    { day: 'Saturday', slots: [{ startTime: '10:00', endTime: '14:00', available: true }] }
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const d of DOCTORS) {
            let user = await User.findOne({ email: d.email });
            if (!user) {
                user = new User({
                    name: d.name,
                    email: d.email,
                    password: 'doctor123',
                    isDoctor: true
                });
                await user.save();
                console.log('Created user:', d.email);
            }

            let doctor = await Doctor.findOne({ userId: user._id });
            if (doctor) {
                console.log('Doctor exists:', d.name);
                continue;
            }

            doctor = new Doctor({
                userId: user._id,
                hospital: d.hospital,
                degree: d.degree,
                specialization: d.specialization,
                experience: d.experience,
                location: d.location,
                consultationFee: d.consultationFee,
                bio: d.bio,
                rating: d.rating,
                reviewCount: d.reviewCount,
                status: 'active',
                timings: DEFAULT_TIMINGS
            });
            await doctor.save();

            user.isDoctor = true;
            user.doctorId = doctor._id;
            await user.save();

            console.log('Seeded doctor:', d.name);
        }

        console.log('Done.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
})();
