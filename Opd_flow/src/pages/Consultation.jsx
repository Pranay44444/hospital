import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, FileText, Send, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authAPI, { appointmentAPI, doctorAPI } from '../services/api';
import './Consultation.css';

function Consultation() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [appointment, setAppointment] = useState(location.state?.appointment || null);
    const [loading, setLoading] = useState(true);

    // Prescription State
    const [prescription, setPrescription] = useState(null);
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

    // Review State
    const [review, setReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchData(currentUser);
    }, [appointmentId, navigate]);

    const fetchData = async (currentUser) => {
        try {
            setLoading(true);

            // Fetch appointment if not available
            // Note: In a real app, we'd have a specific endpoint for this, 
            // but for now we'll rely on what we have or just fetch related data

            // Fetch Prescription
            try {
                // We need to add this method to api.js
                const presResponse = await fetch(`http://localhost:3000/api/prescriptions/appointment/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const presData = await presResponse.json();
                if (presData.success) {
                    setPrescription(presData.data.prescription);
                }
            } catch (err) {
                console.log('No prescription found yet');
            }

            // Fetch Review
            try {
                const revResponse = await fetch(`http://localhost:3000/api/reviews/appointment/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const revData = await revResponse.json();
                if (revData.success) {
                    setReview(revData.data.review);
                }
            } catch (err) {
                console.log('No review found yet');
            }

        } catch (err) {
            console.error('Error fetching consultation data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const newMedicines = [...medicines];
        newMedicines.splice(index, 1);
        setMedicines(newMedicines);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const handleSubmitPrescription = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/prescriptions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    patientId: appointment?.patientId?._id || appointment?.patientId, // Handle populated or ID
                    appointmentId,
                    medicines,
                    notes
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Prescription sent successfully');
                setPrescription(data.data.prescription);
                setShowPrescriptionForm(false);
            }
        } catch (err) {
            console.error('Error submitting prescription:', err);
            toast.error('Failed to submit prescription');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/reviews/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    doctorId: appointment?.doctorId?._id || appointment?.doctorId,
                    appointmentId,
                    rating,
                    comment
                })
            });
            const data = await response.json();
            if (data.success) {
                setReview(data.data.review);
                alert('Review submitted successfully!');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            alert('Failed to submit review');
        }
    };

    if (loading) return <div className="loading">Loading consultation details...</div>;

    return (
        <div className="consultation-page">
            <div className="consultation-container">
                <div className="consultation-header">
                    <h1>Consultation Details</h1>
                    <p>Appointment ID: {appointmentId}</p>
                    <button onClick={() => navigate('/appointments')} className="btn-back-outline">
                        Back to Appointments
                    </button>
                </div>

                <div className="consultation-content">
                    {/* Appointment Details Section */}
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Appointment Details</h2>
                        </div>
                        <div className="appointment-details-grid">
                            <div className="detail-item">
                                <strong>Type:</strong>
                                <span>{appointment?.type === 'video' ? 'Video Call' : 'In-Person Visit'}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Date:</strong>
                                <span>{appointment?.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Time:</strong>
                                <span>{appointment?.time || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Status:</strong>
                                <span className={`status-${appointment?.status}`}>{appointment?.status || 'N/A'}</span>
                            </div>
                        </div>

                        {appointment?.type === 'in-person' && (
                            <>
                                <div className="divider"></div>
                                <h3>Doctor Information</h3>
                                <div className="doctor-info-grid">
                                    <div className="detail-item">
                                        <strong>Doctor:</strong>
                                        <span>{appointment?.doctorId?.userId?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Specialization:</strong>
                                        <span>{appointment?.doctorId?.specialization || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Hospital:</strong>
                                        <span>{appointment?.doctorId?.hospital || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Location:</strong>
                                        <span>{appointment?.doctorId?.location || 'N/A'}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Prescription Section */}
                    <div className="section-card">
                        <div className="section-header">
                            <h2><FileText className="icon" /> Prescription</h2>
                            {user?.isDoctor && !prescription && !showPrescriptionForm && (
                                <button
                                    onClick={() => setShowPrescriptionForm(true)}
                                    className="btn-primary-sm"
                                >
                                    <Plus size={16} /> Write Prescription
                                </button>
                            )}
                        </div>

                        {prescription ? (
                            <div className="prescription-view">
                                <div className="medicines-list">
                                    {prescription.medicines.map((med, idx) => (
                                        <div key={idx} className="medicine-item">
                                            <h4>{med.name}</h4>
                                            <p>{med.dosage} - {med.frequency} - {med.duration}</p>
                                        </div>
                                    ))}
                                </div>
                                {prescription.notes && (
                                    <div className="prescription-notes">
                                        <strong>Notes:</strong>
                                        <p>{prescription.notes}</p>
                                    </div>
                                )}
                            </div>
                        ) : showPrescriptionForm ? (
                            <form onSubmit={handleSubmitPrescription} className="prescription-form">
                                {medicines.map((med, idx) => (
                                    <div key={idx} className="medicine-input-group">
                                        <div className="medicine-row">
                                            <input
                                                placeholder="Medicine Name"
                                                value={med.name}
                                                onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                                                required
                                            />
                                            <input
                                                placeholder="Dosage (e.g. 500mg)"
                                                value={med.dosage}
                                                onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                                                required
                                            />
                                            <input
                                                placeholder="Frequency (e.g. 1-0-1)"
                                                value={med.frequency}
                                                onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                                                required
                                            />
                                            <input
                                                placeholder="Duration (e.g. 5 days)"
                                                value={med.duration}
                                                onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                                                required
                                            />
                                            {medicines.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveMedicine(idx)} className="btn-icon-danger">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddMedicine} className="btn-text-action">
                                    <Plus size={16} /> Add Medicine
                                </button>

                                <textarea
                                    placeholder="Additional Notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="form-textarea"
                                    rows="3"
                                />

                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowPrescriptionForm(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Send Prescription
                                    </button>                                </div>
                            </form>
                        ) : (
                            <p className="empty-text">No prescription added yet.</p>
                        )}
                    </div>

                    {/* Review Section */}
                    {!user?.isDoctor && (
                        <div className="section-card">
                            <div className="section-header">
                                <h2><Star className="icon" /> Doctor Review</h2>
                                {appointment?.doctorId?.rating > 0 && (
                                    <div className="doctor-stats">
                                        <span className="rating-badge">
                                            ⭐ {appointment.doctorId.rating.toFixed(1)}
                                        </span>
                                        <span className="review-count">
                                            ({appointment.doctorId.reviewCount} reviews)
                                        </span>
                                    </div>
                                )}
                            </div>

                            {review ? (
                                <div className="review-view">
                                    <div className="star-rating-static">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={24}
                                                fill={star <= review.rating ? "#fbbf24" : "none"}
                                                color={star <= review.rating ? "#fbbf24" : "#d1d5db"}
                                            />
                                        ))}
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <p className="review-date">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="review-form">
                                    <div className="star-rating-input">
                                        <p>Rate your experience:</p>
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={32}
                                                    className="star-cursor"
                                                    fill={star <= (hoveredRating || rating) ? "#fbbf24" : "none"}
                                                    color={star <= (hoveredRating || rating) ? "#fbbf24" : "#d1d5db"}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Share your feedback about the doctor..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="form-textarea"
                                        rows="4"
                                    />

                                    <button type="submit" className="btn btn-primary" disabled={rating === 0}>
                                        Submit Review
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Consultation;
