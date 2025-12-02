import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, Clock, MapPin, Calendar, FileText, Activity, TrendingUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authAPI, { doctorAPI, appointmentAPI, paymentAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedDoctorData, setEditedDoctorData] = useState({});
    const [saving, setSaving] = useState(false);

    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        activePatients: 0,
        doctorsVisited: 0,
        medicalRecords: 0
    });

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            return;
        }

        setUser(currentUser);
        setEditedName(currentUser.name);

        const loadData = async () => {
            try {
                if (currentUser.isDoctor) {
                    await Promise.all([fetchDoctorProfile(), fetchDoctorStats()]);
                } else {
                    await fetchPatientStats();
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    const fetchDoctorStats = async () => {
        try {
            const response = await appointmentAPI.getDoctorStats();
            if (response.success) {
                setStats(prev => ({
                    ...prev,
                    total: response.data.total,
                    upcoming: response.data.upcoming,
                    activePatients: response.data.activePatients
                }));
            }
        } catch (err) {
            console.error('Failed to fetch doctor stats:', err);
        }
    };

    const fetchPatientStats = async () => {
        try {
            const response = await appointmentAPI.getPatientStats();
            if (response.success) {
                setStats(prev => ({
                    ...prev,
                    total: response.data.total,
                    upcoming: response.data.upcoming,
                    doctorsVisited: response.data.doctorsVisited,
                    medicalRecords: response.data.medicalRecords
                }));
            }
        } catch (err) {
            console.error('Failed to fetch patient stats:', err);
        }
    };

    const fetchDoctorProfile = async () => {
        try {
            const response = await doctorAPI.getMyDoctorProfile();
            if (response.success) {
                setDoctorProfile(response.data.doctor);
                setEditedDoctorData({
                    degree: response.data.doctor.degree,
                    specialization: response.data.doctor.specialization,
                    experience: response.data.doctor.experience,
                    hospital: response.data.doctor.hospital,
                    location: response.data.doctor.location || '',
                    bio: response.data.doctor.bio || ''
                });
            }
        } catch (err) {
            console.error('Failed to fetch doctor profile:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedName(user.name);
        if (doctorProfile) {
            setEditedDoctorData({
                degree: doctorProfile.degree,
                specialization: doctorProfile.specialization,
                experience: doctorProfile.experience,
                hospital: doctorProfile.hospital,
                location: doctorProfile.location || '',
                bio: doctorProfile.bio || ''
            });
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Update user name if changed
            if (editedName !== user.name) {
                const response = await authAPI.updateProfile({ name: editedName });
                if (response.success) {
                    setUser(response.data.user);
                }
            }

            // Update doctor profile if is doctor
            if (user.isDoctor) {
                const response = await doctorAPI.updateDoctor(editedDoctorData);
                if (response.success) {
                    setDoctorProfile(response.data.doctor);
                }
            }


            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Doctor Dashboard
    if (user.isDoctor && doctorProfile) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Doctor Dashboard</h1>
                    <p>Welcome back, Dr. {user.name}</p>
                </div>

                <div className="dashboard-grid">
                    {/* Statistics Cards */}
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Calendar size={32} />
                        </div>
                        <div className="stat-info">
                            <h3>Total Appointments</h3>
                            <p className="stat-value">{stats.total}</p>
                            <span className="stat-label">All time</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Activity size={32} />
                        </div>
                        <div className="stat-info">
                            <h3>Active Patients</h3>
                            <p className="stat-value">{stats.activePatients}</p>
                            <span className="stat-label">Currently active</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <TrendingUp size={32} />
                        </div>
                        <div className="stat-info">
                            <h3>Rating</h3>
                            <p className="stat-value">{doctorProfile.rating > 0 ? doctorProfile.rating.toFixed(1) : 'N/A'}</p>
                            <span className="stat-label">{doctorProfile.reviewCount} reviews</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FileText size={32} />
                        </div>
                        <div className="stat-info">
                            <h3>Experience</h3>
                            <p className="stat-value">{doctorProfile.experience}</p>
                            <span className="stat-label">Years</span>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="profile-section">
                    <div className="section-title-row">
                        <h2>Your Profile</h2>
                        {!isEditing ? (
                            <button onClick={handleEdit} className="btn-edit">Edit Profile</button>
                        ) : (
                            <div className="edit-actions">
                                <button onClick={handleSave} className="btn-save" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button onClick={handleCancel} className="btn-cancel" disabled={saving}>Cancel</button>
                            </div>
                        )}
                    </div>
                    <div className="profile-grid">
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <User size={24} />
                                <h3>Personal Information</h3>
                            </div>
                            <div className="profile-card-body">
                                <div className="info-row">
                                    <span className="info-label">Name:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="info-input"
                                        />
                                    ) : (
                                        <span className="info-value">{user.name}</span>
                                    )}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-card">
                            <div className="profile-card-header">
                                <Award size={24} />
                                <h3>Professional Details</h3>
                            </div>
                            <div className="profile-card-body">
                                <div className="info-row">
                                    <span className="info-label">Degree:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedDoctorData.degree || ''}
                                            onChange={(e) => setEditedDoctorData({ ...editedDoctorData, degree: e.target.value })}
                                            className="info-input"
                                        />
                                    ) : (
                                        <span className="info-value">{doctorProfile.degree}</span>
                                    )}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Specialization:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedDoctorData.specialization || ''}
                                            onChange={(e) => setEditedDoctorData({ ...editedDoctorData, specialization: e.target.value })}
                                            className="info-input"
                                        />
                                    ) : (
                                        <span className="info-value">{doctorProfile.specialization}</span>
                                    )}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Experience:</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedDoctorData.experience || ''}
                                            onChange={(e) => setEditedDoctorData({ ...editedDoctorData, experience: parseInt(e.target.value) })}
                                            className="info-input"
                                        />
                                    ) : (
                                        <span className="info-value">{doctorProfile.experience} years</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="profile-card">
                            <div className="profile-card-header">
                                <MapPin size={24} />
                                <h3>Practice Location</h3>
                            </div>
                            <div className="profile-card-body">
                                <div className="info-row">
                                    <span className="info-label">Hospital:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedDoctorData.hospital || ''}
                                            onChange={(e) => setEditedDoctorData({ ...editedDoctorData, hospital: e.target.value })}
                                            className="info-input"
                                        />
                                    ) : (
                                        <span className="info-value">{doctorProfile.hospital}</span>
                                    )}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Location:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedDoctorData.location || ''}
                                            onChange={(e) => setEditedDoctorData({ ...editedDoctorData, location: e.target.value })}
                                            className="info-input"
                                        />
                                    ) : (
                                        <span className="info-value">{doctorProfile.location || 'N/A'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {doctorProfile.timings && doctorProfile.timings.length > 0 && (
                            <div className="profile-card">
                                <div className="profile-card-header">
                                    <Clock size={24} />
                                    <h3>Available Timings</h3>
                                </div>
                                <div className="profile-card-body">
                                    {doctorProfile.timings.slice(0, 3).map((timing, index) => (
                                        <div key={index} className="info-row">
                                            <span className="info-label">{timing.day}:</span>
                                            <span className="info-value">
                                                {timing.slots[0]?.startTime} - {timing.slots[0]?.endTime}
                                            </span>
                                        </div>
                                    ))}
                                    {doctorProfile.timings.length > 3 && (
                                        <p className="info-more">+ {doctorProfile.timings.length - 3} more days</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {(doctorProfile.bio || isEditing) && (
                        <div className="bio-section">
                            <h3>About You</h3>
                            {isEditing ? (
                                <textarea
                                    value={editedDoctorData.bio || ''}
                                    onChange={(e) => setEditedDoctorData({ ...editedDoctorData, bio: e.target.value })}
                                    className="bio-textarea"
                                    rows="4"
                                    placeholder="Tell patients about yourself..."
                                />
                            ) : (
                                <p>{doctorProfile.bio}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="actions-section">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <button onClick={() => navigate('/doctors')} className="action-btn">
                            View All Doctors
                        </button>
                        <button onClick={() => navigate('/request')} className="action-btn">
                            View Appointments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Patient Dashboard
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Patient Dashboard</h1>
                <p>Welcome back, {user.name}</p>
            </div>

            <div className="dashboard-grid">
                {/* Patient Statistics */}
                <div className="stat-card">
                    <div className="stat-icon">
                        <Calendar size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Appointments</h3>
                        <p className="stat-value">{stats.total}</p>
                        <span className="stat-label">Total appointments</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Activity size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Upcoming</h3>
                        <p className="stat-value">{stats.upcoming}</p>
                        <span className="stat-label">Scheduled appointments</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FileText size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Medical Records</h3>
                        <p className="stat-value">{stats.medicalRecords}</p>
                        <span className="stat-label">Documents</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <User size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Doctors Visited</h3>
                        <p className="stat-value">{stats.doctorsVisited}</p>
                        <span className="stat-label">Unique doctors</span>
                    </div>
                </div>
            </div>

            {/* Patient Profile */}
            <div className="profile-section">
                <div className="section-title-row">
                    <h2>Your Information</h2>
                    {!isEditing ? (
                        <button onClick={handleEdit} className="btn-edit">Edit Profile</button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={handleSave} className="btn-save" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={handleCancel} className="btn-cancel" disabled={saving}>Cancel</button>
                        </div>
                    )}
                </div>
                <div className="profile-grid">
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <User size={24} />
                            <h3>Personal Details</h3>
                        </div>
                        <div className="profile-card-body">
                            <div className="info-row">
                                <span className="info-label">Name:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="info-input"
                                    />
                                ) : (
                                    <span className="info-value">{user.name}</span>
                                )}
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Member Since:</span>
                                <span className="info-value">
                                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-section">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <button onClick={() => navigate('/doctors')} className="action-btn">
                        Find a Doctor
                    </button>
                    <button onClick={() => navigate('/request')} className="action-btn">
                        Request Appointment
                    </button>
                    <button onClick={() => navigate('/doctor/register')} className="action-btn-secondary">
                        Become a Doctor
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
