import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Activity, Users, FileText, Video, MessageCircle, CalendarClock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authAPI, { appointmentAPI } from '../services/api';
import './DoctorPanel.css';

function DoctorPanel() {
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, activePatients: 0 });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('today');

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login', { state: { from: '/doctor-panel' } });
            return;
        }
        if (!currentUser.isDoctor) {
            navigate('/');
            return;
        }
        setUser(currentUser);
        loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [apptRes, statsRes] = await Promise.all([
                appointmentAPI.getDoctorAppointments(),
                appointmentAPI.getDoctorStats(),
            ]);
            if (apptRes.success) setAppointments(apptRes.data.appointments);
            if (statsRes.success) setStats(statsRes.data);
        } catch (err) {
            console.error('Failed to load panel data:', err);
        } finally {
            setLoading(false);
        }
    };

    const [reschedulingId, setReschedulingId] = useState(null);
    const [rescheduleForm, setRescheduleForm] = useState({ proposedDate: '', proposedTime: '', note: '' });

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const response = await appointmentAPI.updateAppointmentStatus(appointmentId, newStatus);
            if (response.success) {
                setAppointments(prev =>
                    prev.map(apt => apt._id === appointmentId ? { ...apt, status: newStatus } : apt)
                );
                toast.success(`Appointment ${newStatus}`);
            }
        } catch (err) {
            toast.error('Failed to update appointment');
        }
    };

    const handleRescheduleSubmit = async (apt) => {
        if (!rescheduleForm.proposedDate || !rescheduleForm.proposedTime) {
            toast.error('Please select a date and time');
            return;
        }
        try {
            const res = await appointmentAPI.requestReschedule(apt._id, rescheduleForm);
            if (res.success) {
                toast.success('Reschedule request sent to patient');
                setReschedulingId(null);
                setRescheduleForm({ proposedDate: '', proposedTime: '', note: '' });
                loadData();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to request reschedule');
        }
    };

    const handleRescheduleRespond = async (apt, action) => {
        try {
            const res = await appointmentAPI.respondReschedule(apt._id, action);
            if (res.success) {
                toast.success(`Reschedule ${action}d`);
                loadData();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to respond');
        }
    };

    const messagePatient = (apt) => {
        navigate(`/messages?to=${apt.patientId?._id || apt.patientId}`);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const todayAppointments = appointments.filter(apt => {
        const d = new Date(apt.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime() && apt.status !== 'cancelled';
    }).sort((a, b) => a.time.localeCompare(b.time));

    const upcomingAppointments = appointments.filter(apt => {
        const d = new Date(apt.date);
        d.setHours(0, 0, 0, 0);
        return d > today && d <= nextWeek && apt.status !== 'cancelled';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const pendingCount = todayAppointments.filter(a => a.status === 'pending').length;
    const completedToday = todayAppointments.filter(a => a.status === 'completed').length;

    const statusIcon = (status) => {
        if (status === 'confirmed') return <CheckCircle size={16} className="icon-confirmed" />;
        if (status === 'cancelled') return <XCircle size={16} className="icon-cancelled" />;
        if (status === 'completed') return <CheckCircle size={16} className="icon-completed" />;
        return <AlertCircle size={16} className="icon-pending" />;
    };

    const AppointmentCard = ({ apt, showDate = false }) => (
        <div className={`dp-card dp-card--${apt.status}`}>
            <div className="dp-card-top">
                <div className="dp-card-time">
                    <Clock size={14} />
                    <span>{apt.time}</span>
                    {showDate && <span className="dp-card-date">{new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                </div>
                <div className={`dp-status dp-status--${apt.status}`}>
                    {statusIcon(apt.status)}
                    <span>{apt.status}</span>
                </div>
            </div>

            <div className="dp-card-patient">
                <User size={16} />
                <div>
                    <p className="dp-patient-name">{apt.patientName}</p>
                    <p className="dp-patient-contact">{apt.patientEmail}</p>
                </div>
                {apt.type === 'video' && (
                    <span className="dp-badge-video"><Video size={12} /> Video</span>
                )}
            </div>

            {apt.reason && (
                <p className="dp-reason">{apt.reason}</p>
            )}

            {apt.rescheduleRequest?.status === 'pending' && (
                <div className="dp-reschedule-banner">
                    <strong>{apt.rescheduleRequest.requestedBy === 'patient' ? 'Patient' : 'You'}</strong> proposed:{' '}
                    {new Date(apt.rescheduleRequest.proposedDate).toLocaleDateString()} at {apt.rescheduleRequest.proposedTime}
                    {apt.rescheduleRequest.note && <p className="dp-reschedule-note">"{apt.rescheduleRequest.note}"</p>}
                    {apt.rescheduleRequest.requestedBy === 'patient' && (
                        <div className="dp-card-actions" style={{ marginTop: 8 }}>
                            <button className="dp-btn dp-btn--confirm" onClick={() => handleRescheduleRespond(apt, 'approve')}>Accept</button>
                            <button className="dp-btn dp-btn--cancel" onClick={() => handleRescheduleRespond(apt, 'reject')}>Reject</button>
                        </div>
                    )}
                </div>
            )}

            {reschedulingId === apt._id ? (
                <div className="dp-reschedule-form">
                    <div className="dp-reschedule-fields">
                        <input type="date" value={rescheduleForm.proposedDate} min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setRescheduleForm(f => ({ ...f, proposedDate: e.target.value }))} />
                        <input type="time" value={rescheduleForm.proposedTime}
                            onChange={(e) => setRescheduleForm(f => ({ ...f, proposedTime: e.target.value }))} />
                    </div>
                    <input type="text" placeholder="Note for patient (optional)" value={rescheduleForm.note}
                        onChange={(e) => setRescheduleForm(f => ({ ...f, note: e.target.value }))} />
                    <div className="dp-card-actions">
                        <button className="dp-btn dp-btn--complete" onClick={() => handleRescheduleSubmit(apt)}>Send Request</button>
                        <button className="dp-btn dp-btn--secondary" onClick={() => { setReschedulingId(null); setRescheduleForm({ proposedDate: '', proposedTime: '', note: '' }); }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="dp-card-actions">
                    {apt.status === 'pending' && (
                        <>
                            <button className="dp-btn dp-btn--confirm" onClick={() => handleStatusUpdate(apt._id, 'confirmed')}>
                                Confirm
                            </button>
                            <button className="dp-btn dp-btn--cancel" onClick={() => handleStatusUpdate(apt._id, 'cancelled')}>
                                Cancel
                            </button>
                        </>
                    )}
                    {apt.status === 'confirmed' && (
                        <>
                            <button className="dp-btn dp-btn--complete" onClick={() => handleStatusUpdate(apt._id, 'completed')}>
                                Mark Complete
                            </button>
                            <button className="dp-btn dp-btn--secondary" onClick={() => navigate(`/consultation/${apt._id}`, { state: { appointment: apt } })}>
                                Add Prescription
                            </button>
                            {apt.type === 'video' && (
                                <button className="dp-btn dp-btn--video" onClick={() => navigate(`/video/${apt._id}`, { state: { appointment: apt } })}>
                                    <Video size={14} /> Join Call
                                </button>
                            )}
                        </>
                    )}
                    {(apt.status === 'pending' || apt.status === 'confirmed') && !apt.rescheduleRequest?.status && (
                        <button className="dp-btn dp-btn--secondary" onClick={() => setReschedulingId(apt._id)}>
                            <CalendarClock size={14} /> Reschedule
                        </button>
                    )}
                    <button className="dp-btn dp-btn--secondary" onClick={() => messagePatient(apt)}>
                        <MessageCircle size={14} /> Message
                    </button>
                    {(apt.status === 'completed' || apt.status === 'cancelled') && (
                        <button className="dp-btn dp-btn--secondary" onClick={() => navigate(`/consultation/${apt._id}`, { state: { appointment: apt } })}>
                            View Details
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    if (loading) {
        return <div className="dp-loading">Loading panel...</div>;
    }

    return (
        <div className="dp-container">
            <div className="dp-header">
                <div>
                    <h1>Doctor Panel</h1>
                    <p>Welcome, Dr. {user?.name} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="dp-stats">
                <div className="dp-stat">
                    <div className="dp-stat-icon"><Calendar size={24} /></div>
                    <div>
                        <p className="dp-stat-value">{todayAppointments.length}</p>
                        <p className="dp-stat-label">Today's Appointments</p>
                    </div>
                </div>
                <div className="dp-stat">
                    <div className="dp-stat-icon"><AlertCircle size={24} /></div>
                    <div>
                        <p className="dp-stat-value">{pendingCount}</p>
                        <p className="dp-stat-label">Pending Today</p>
                    </div>
                </div>
                <div className="dp-stat">
                    <div className="dp-stat-icon"><Activity size={24} /></div>
                    <div>
                        <p className="dp-stat-value">{stats.upcoming}</p>
                        <p className="dp-stat-label">Upcoming</p>
                    </div>
                </div>
                <div className="dp-stat">
                    <div className="dp-stat-icon"><Users size={24} /></div>
                    <div>
                        <p className="dp-stat-value">{stats.activePatients}</p>
                        <p className="dp-stat-label">Total Patients</p>
                    </div>
                </div>
                <div className="dp-stat">
                    <div className="dp-stat-icon"><FileText size={24} /></div>
                    <div>
                        <p className="dp-stat-value">{stats.total}</p>
                        <p className="dp-stat-label">All Time</p>
                    </div>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="dp-tabs">
                <button
                    className={`dp-tab ${activeSection === 'today' ? 'dp-tab--active' : ''}`}
                    onClick={() => setActiveSection('today')}
                >
                    <Calendar size={16} /> Today's Queue ({todayAppointments.length})
                </button>
                <button
                    className={`dp-tab ${activeSection === 'upcoming' ? 'dp-tab--active' : ''}`}
                    onClick={() => setActiveSection('upcoming')}
                >
                    <Clock size={16} /> Next 7 Days ({upcomingAppointments.length})
                </button>
            </div>

            {/* Content */}
            <div className="dp-content">
                {activeSection === 'today' && (
                    todayAppointments.length === 0 ? (
                        <div className="dp-empty">
                            <Calendar size={48} />
                            <p>No appointments scheduled for today</p>
                        </div>
                    ) : (
                        <div className="dp-grid">
                            {todayAppointments.map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
                        </div>
                    )
                )}

                {activeSection === 'upcoming' && (
                    upcomingAppointments.length === 0 ? (
                        <div className="dp-empty">
                            <Clock size={48} />
                            <p>No upcoming appointments in the next 7 days</p>
                        </div>
                    ) : (
                        <div className="dp-grid">
                            {upcomingAppointments.map(apt => <AppointmentCard key={apt._id} apt={apt} showDate />)}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default DoctorPanel;
