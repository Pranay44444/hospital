import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle, Video } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authAPI, { appointmentAPI } from '../services/api';
import './Appointments.css';

function Appointments() {
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [pastFilter, setPastFilter] = useState('all'); // 'all', 'completed', 'not-completed'
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            return;
        }
        setUser(currentUser);
        fetchAppointments(currentUser);
    }, [navigate]);

    const fetchAppointments = async (currentUser) => {
        try {
            setLoading(true);
            const response = currentUser.isDoctor
                ? await appointmentAPI.getDoctorAppointments()
                : await appointmentAPI.getPatientAppointments();

            if (response.success) {
                setAppointments(response.data.appointments);
            }
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const response = await appointmentAPI.updateAppointmentStatus(appointmentId, newStatus);
            if (response.success) {
                setAppointments(prev => prev.map(apt =>
                    apt._id === appointmentId ? { ...apt, status: newStatus } : apt
                ));
                toast.success(`Appointment ${newStatus} successfully`);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            toast.error('Failed to update appointment status');
        }
    };

    const upcomingAppointments = appointments.filter(apt => {
        // Completed or cancelled appointments should be in past
        if (apt.status === 'completed' || apt.status === 'cancelled') {
            return false;
        }

        // Check if appointment date/time is in the future
        const appointmentDate = new Date(apt.date);
        const now = new Date();

        // Only compare by date (ignore time for now since time is stored as string)
        appointmentDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        return appointmentDate >= now;
    });

    const pastAppointments = appointments.filter(apt => {
        // Completed or cancelled appointments are always in past
        if (apt.status === 'completed' || apt.status === 'cancelled') {
            return true;
        }

        // Check if appointment date is in the past
        const appointmentDate = new Date(apt.date);
        const now = new Date();

        appointmentDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        return appointmentDate < now;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle size={20} className="status-icon confirmed" />;
            case 'cancelled':
                return <XCircle size={20} className="status-icon cancelled" />;
            case 'pending':
                return <AlertCircle size={20} className="status-icon pending" />;
            default:
                return <Clock size={20} className="status-icon" />;
        }
    };

    const getStatusClass = (status) => {
        return `status-badge ${status}`;
    };

    if (loading) {
        return (
            <div className="appointments-container">
                <div className="loading">Loading appointments...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Apply past filter
    let displayAppointments;
    if (activeTab === 'upcoming') {
        displayAppointments = upcomingAppointments;
    } else {
        if (pastFilter === 'completed') {
            displayAppointments = pastAppointments.filter(apt => apt.status === 'completed');
        } else if (pastFilter === 'not-completed') {
            displayAppointments = pastAppointments.filter(apt => apt.status !== 'completed');
        } else {
            displayAppointments = pastAppointments;
        }
    }

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <h1>{user.isDoctor ? 'Doctor' : 'Patient'} Appointments</h1>
                <p>View and manage your appointments</p>
            </div>

            {/* Tabs */}
            <div className="appointments-tabs">
                <button
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    <Calendar size={20} />
                    Upcoming ({upcomingAppointments.length})
                </button>
                <button
                    className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    <Clock size={20} />
                    Past ({pastAppointments.length})
                </button>
            </div>

            {/* Past Appointments Sub-Filter */}
            {activeTab === 'past' && (
                <div className="past-filter-tabs">
                    <button
                        className={`filter-tab ${pastFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setPastFilter('all')}
                    >
                        All ({pastAppointments.length})
                    </button>
                    <button
                        className={`filter-tab ${pastFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setPastFilter('completed')}
                    >
                        Completed ({pastAppointments.filter(apt => apt.status === 'completed').length})
                    </button>
                    <button
                        className={`filter-tab ${pastFilter === 'not-completed' ? 'active' : ''}`}
                        onClick={() => setPastFilter('not-completed')}
                    >
                        Not Completed ({pastAppointments.filter(apt => apt.status !== 'completed').length})
                    </button>
                </div>
            )}

            {/* Appointments List */}
            <div className="appointments-content">
                {displayAppointments.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} />
                        <h3>No {activeTab} appointments</h3>
                        <p>
                            {activeTab === 'upcoming'
                                ? user.isDoctor
                                    ? "You don't have any scheduled appointments yet."
                                    : "You haven't requested any appointments yet."
                                : 'No appointment history found.'}
                        </p>
                        {activeTab === 'upcoming' && !user.isDoctor && (
                            <button
                                onClick={() => navigate('/request')}
                                className="btn-primary-action"
                            >
                                Request Appointment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="appointments-grid">
                        {displayAppointments.map((appointment, index) => (
                            <div key={index} className="appointment-card">
                                <div className="appointment-header">
                                    <div className="appointment-date">
                                        <Calendar size={20} />
                                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className={getStatusClass(appointment.status)}>
                                        {getStatusIcon(appointment.status)}
                                        {appointment.status}
                                    </div>
                                </div>

                                {appointment.type === 'video' && (
                                    <div className="appointment-type-badge video">
                                        <Video size={14} />
                                        Video Call
                                    </div>
                                )}
                                {appointment.type === 'in-person' && (
                                    <div className="appointment-type-badge in-person">
                                        <MapPin size={14} />
                                        In-Person
                                    </div>
                                )}

                                <div className="appointment-body">
                                    <div className="appointment-info">
                                        <User size={18} />
                                        <div>
                                            <p className="appointment-label">
                                                {user.isDoctor ? 'Patient' : 'Doctor'}
                                            </p>
                                            <p className="appointment-value">
                                                {user.isDoctor
                                                    ? appointment.patientName
                                                    : appointment.doctorId?.userId?.name || 'Unknown Doctor'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="appointment-info">
                                        <Clock size={18} />
                                        <div>
                                            <p className="appointment-label">Time</p>
                                            <p className="appointment-value">{appointment.time}</p>
                                        </div>
                                    </div>

                                    {!user.isDoctor && appointment.doctorId?.hospital && (
                                        <div className="appointment-info">
                                            <MapPin size={18} />
                                            <div>
                                                <p className="appointment-label">Location</p>
                                                <p className="appointment-value">{appointment.doctorId.hospital}</p>
                                            </div>
                                        </div>
                                    )}
                                    {appointment.reason && (
                                        <div className="appointment-reason">
                                            <p className="appointment-label">Reason</p>
                                            <p className="appointment-value">{appointment.reason}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="appointment-actions">
                                    {activeTab === 'upcoming' && appointment.status === 'confirmed' && appointment.type === 'video' && (
                                        <button
                                            onClick={() => {
                                                // Extract unique ID from link or use appointment ID
                                                let uniqueId = appointment._id;
                                                if (appointment.meetingLink) {
                                                    const parts = appointment.meetingLink.split('-');
                                                    // Try to get the last part if it looks like a unique ID
                                                    if (parts.length > 2) {
                                                        uniqueId = parts.slice(2).join('-');
                                                    }
                                                }
                                                navigate(`/video/${uniqueId}`, { state: { appointment } });
                                            }}
                                            className="btn-action video-call"
                                        >
                                            <Video size={16} />
                                            Join Video Call
                                        </button>
                                    )}
                                    {activeTab === 'upcoming' && appointment.status === 'confirmed' && user.isDoctor && (
                                        <button
                                            className="btn-action"
                                            onClick={() => navigate(`/consultation/${appointment._id}`, { state: { appointment } })}
                                        >
                                            Add Prescription
                                        </button>
                                    )}
                                    {activeTab === 'upcoming' && appointment.status === 'pending' && user.isDoctor && (
                                        <>
                                            <button
                                                className="btn-action confirm"
                                                onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="btn-action cancel"
                                                onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {appointment.status !== 'pending' && (
                                        <button
                                            className="btn-action-secondary"
                                            onClick={() => navigate(`/consultation/${appointment._id}`, { state: { appointment } })}
                                        >
                                            View Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}

export default Appointments;
