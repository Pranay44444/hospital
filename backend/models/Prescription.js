const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    medicines: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        }
    }],
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Prevent multiple prescriptions for the same appointment (optional, but good for now)
prescriptionSchema.index({ appointmentId: 1 }, { unique: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
