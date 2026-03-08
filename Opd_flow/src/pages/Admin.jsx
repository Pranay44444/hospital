import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, User, Award, Building, Mail, AlertCircle, Users, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authAPI, { adminAPI } from '../services/api';
import './Admin.css';

function Admin() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, totalUsers: 0 });
    const [doctors, setDoctors] = useState([]);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login', { state: { from: '/admin' } });
            return;
        }
        if (currentUser.role !== 'admin') {
            toast.error('Admin access required');
            navigate('/');
            return;
        }
        setUser(currentUser);
        loadData('pending');
    }, [navigate]);

    useEffect(() => {
        if (user) loadData(activeTab);
    }, [activeTab]);

    const loadData = async (tab) => {
        try {
            setLoading(true);
            const [statsRes, docRes] = await Promise.all([
                adminAPI.getStats(),
                tab === 'pending' ? adminAPI.getPendingDoctors() : adminAPI.getDoctors(tab),
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (docRes.success) setDoctors(docRes.data.doctors);
        } catch (err) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await adminAPI.approveDoctor(id);
            if (res.success) {
                toast.success('Doctor approved');
                loadData(activeTab);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to approve');
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            const res = await adminAPI.rejectDoctor(id, rejectReason);
            if (res.success) {
                toast.success('Doctor rejected');
                setRejectingId(null);
                setRejectReason('');
                loadData(activeTab);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to reject');
        }
    };

    const handleSuspend = async (id) => {
        if (!window.confirm('Suspend this doctor? They will no longer be visible to patients.')) return;
        try {
            const res = await adminAPI.suspendDoctor(id);
            if (res.success) {
                toast.success('Doctor suspended');
                loadData(activeTab);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to suspend');
        }
    };

    if (!user) return null;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1><ShieldCheck size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Admin Panel</h1>
                    <p>Manage doctor applications and platform access</p>
                </div>
            </div>

            {/* Stats */}
            <div className="admin-stats">
                <div className="admin-stat">
                    <AlertCircle className="admin-stat-icon" size={20} />
                    <div>
                        <p className="admin-stat-value">{stats.pending}</p>
                        <p className="admin-stat-label">Pending</p>
                    </div>
                </div>
                <div className="admin-stat">
                    <CheckCircle className="admin-stat-icon admin-stat-icon--ok" size={20} />
                    <div>
                        <p className="admin-stat-value">{stats.approved}</p>
                        <p className="admin-stat-label">Approved</p>
                    </div>
                </div>
                <div className="admin-stat">
                    <XCircle className="admin-stat-icon admin-stat-icon--err" size={20} />
                    <div>
                        <p className="admin-stat-value">{stats.rejected}</p>
                        <p className="admin-stat-label">Rejected</p>
                    </div>
                </div>
                <div className="admin-stat">
                    <Users className="admin-stat-icon" size={20} />
                    <div>
                        <p className="admin-stat-value">{stats.totalUsers}</p>
                        <p className="admin-stat-label">Total Users</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {['pending', 'approved', 'rejected', 'suspended'].map(tab => (
                    <button
                        key={tab}
                        className={`admin-tab ${activeTab === tab ? 'admin-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="admin-loading">Loading...</div>
            ) : doctors.length === 0 ? (
                <div className="admin-empty">
                    <Clock size={48} />
                    <p>No {activeTab} applications</p>
                </div>
            ) : (
                <div className="admin-list">
                    {doctors.map(doc => (
                        <div key={doc._id} className={`admin-doctor-card admin-doctor-card--${doc.status}`}>
                            <div className="admin-doctor-header">
                                <div className="admin-doctor-identity">
                                    <div className="admin-doctor-avatar"><User size={22} /></div>
                                    <div>
                                        <h3>{doc.userId?.name || 'Unknown'}</h3>
                                        <p className="admin-doctor-email"><Mail size={13} /> {doc.userId?.email}</p>
                                    </div>
                                </div>
                                <span className={`admin-status-badge admin-status-badge--${doc.status}`}>
                                    {doc.status}
                                </span>
                            </div>

                            <div className="admin-doctor-details">
                                <div className="admin-detail"><Award size={14} /> <span>{doc.degree} — {doc.specialization}</span></div>
                                <div className="admin-detail"><Building size={14} /> <span>{doc.hospital}{doc.location ? `, ${doc.location}` : ''}</span></div>
                                <div className="admin-detail"><Clock size={14} /> <span>{doc.experience} years experience · ₹{doc.consultationFee}</span></div>
                                {doc.bio && <p className="admin-doctor-bio">{doc.bio}</p>}
                                {doc.rejectionReason && (
                                    <div className="admin-rejection-reason">
                                        <strong>Rejection reason:</strong> {doc.rejectionReason}
                                    </div>
                                )}
                            </div>

                            {rejectingId === doc._id ? (
                                <div className="admin-reject-form">
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Reason for rejection..."
                                        rows={2}
                                    />
                                    <div className="admin-actions">
                                        <button className="admin-btn admin-btn--danger" onClick={() => handleReject(doc._id)}>
                                            Confirm Reject
                                        </button>
                                        <button className="admin-btn admin-btn--secondary" onClick={() => { setRejectingId(null); setRejectReason(''); }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="admin-actions">
                                    {doc.status === 'pending' && (
                                        <>
                                            <button className="admin-btn admin-btn--primary" onClick={() => handleApprove(doc._id)}>
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button className="admin-btn admin-btn--danger" onClick={() => setRejectingId(doc._id)}>
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </>
                                    )}
                                    {doc.status === 'approved' && (
                                        <button className="admin-btn admin-btn--danger" onClick={() => handleSuspend(doc._id)}>
                                            Suspend
                                        </button>
                                    )}
                                    {doc.status === 'rejected' && (
                                        <button className="admin-btn admin-btn--primary" onClick={() => handleApprove(doc._id)}>
                                            <CheckCircle size={14} /> Approve Now
                                        </button>
                                    )}
                                    {doc.status === 'suspended' && (
                                        <button className="admin-btn admin-btn--primary" onClick={() => handleApprove(doc._id)}>
                                            Reinstate
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Admin;
