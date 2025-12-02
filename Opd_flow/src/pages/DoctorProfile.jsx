import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Award, Clock, Calendar, Phone } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { doctorAPI } from '../services/api';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctorProfile();
    }, [id]);

    const fetchDoctorProfile = async () => {
        try {
            setLoading(true);
            const response = await doctorAPI.getDoctorProfile(id);

            if (response.success) {
                setDoctor(response.data.doctor);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch doctor profile');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = () => {
        // For now, redirect to request page
        // In the future, this can open a booking modal with doctor's timings
        navigate('/request');
    };

    const handleStartCall = () => {
        // Placeholder for call functionality
        toast.info('Video call functionality coming soon!');
    };

    if (loading) {
        return (
            <div className="doctor-profile-container">
                <div className="loading">Loading doctor profile...</div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="doctor-profile-container">
                <div className="error">{error || 'Doctor not found'}</div>
                <button onClick={() => navigate('/doctors')} className="btn-back">
                    Back to Doctors List
                </button>
            </div>
        );
    }

    return (
        <div className="doctor-profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <User size={80} />
                </div>
                <div className="profile-info">
                    <h1>{doctor.userId?.name || 'Unknown'}</h1>
                    <p className="specialization">{doctor.specialization}</p>
                    {doctor.rating > 0 && (
                        <div className="rating">
                            ⭐ {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
                        </div>
                    )}
                </div>
                <div className="profile-actions">
                    <button onClick={handleBookAppointment} className="btn btn-primary">
                        <Calendar size={20} />
                        Book Appointment
                    </button>
                    <button onClick={handleStartCall} className="btn btn-secondary">
                        <Phone size={20} />
                        Start Call
                    </button>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <h2>Professional Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <Award className="info-icon" />
                            <div>
                                <p className="info-label">Degree</p>
                                <p className="info-value">{doctor.degree}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Clock className="info-icon" />
                            <div>
                                <p className="info-label">Experience</p>
                                <p className="info-value">{doctor.experience} years</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <MapPin className="info-icon" />
                            <div>
                                <p className="info-label">Hospital</p>
                                <p className="info-value">{doctor.hospital}</p>
                            </div>
                        </div>

                        {doctor.location && (
                            <div className="info-item">
                                <MapPin className="info-icon" />
                                <div>
                                    <p className="info-label">Location</p>
                                    <p className="info-value">{doctor.location}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {doctor.bio && (
                    <div className="profile-section">
                        <h2>About</h2>
                        <p className="bio-text">{doctor.bio}</p>
                    </div>
                )}

                {doctor.timings && doctor.timings.length > 0 && (
                    <div className="profile-section">
                        <h2>Available Timings</h2>
                        <div className="timings-grid">
                            {doctor.timings.map((timing, index) => (
                                <div key={index} className="timing-card">
                                    <div className="timing-day">{timing.day}</div>
                                    {timing.slots.map((slot, slotIndex) => (
                                        <div key={slotIndex} className="timing-slot">
                                            {slot.startTime} - {slot.endTime}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-footer">
                <button onClick={() => navigate('/doctors')} className="btn-back">
                    ← Back to Doctors List
                </button>
            </div>
        </div>
    );
};

export default DoctorProfile;
