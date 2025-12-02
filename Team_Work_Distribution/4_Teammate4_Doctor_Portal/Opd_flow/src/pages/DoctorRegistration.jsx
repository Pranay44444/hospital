import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { doctorAPI } from '../services/api';
import authAPI from '../services/api';
import './DoctorRegistration.css';

const DoctorRegistration = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Step 1: Basic Info (pre-filled from user)
        name: '',
        email: '',

        // Step 2: Professional Info
        degree: '',
        specialization: '',
        customSpecialization: '', // For "Other" option
        experience: '',

        // Step 3: Hospital Info
        hospital: '',
        location: '',
        consultationFee: '500', // Default consultation fee

        // Step 4: Bio
        bio: '',

        // Step 5: Availability Settings
        availableFrom: '',
        availableUntil: '',
        slotDuration: '30', // Default 30 minutes
        unavailableDays: [], // Array of day names
        sessions: [] // Array of {startTime, endTime}
    });

    // Pre-fill user data
    useEffect(() => {
        const user = authAPI.getCurrentUser();
        if (!user) {
            navigate('/');
            return;
        }



        setFormData(prev => ({
            ...prev,
            name: user.name,
            email: user.email
        }));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = () => {
        setError('');

        // Validation for each step
        if (step === 2) {
            if (!formData.degree || !formData.specialization || !formData.experience) {
                setError('Please fill in all professional information');
                return;
            }
            if (formData.specialization === 'Other' && !formData.customSpecialization) {
                setError('Please specify your specialization');
                return;
            }
            if (formData.experience < 0) {
                setError('Experience cannot be negative');
                return;
            }
        }

        if (step === 3) {
            if (!formData.hospital) {
                setError('Please enter hospital name');
                return;
            }
        }

        if (step === 5) {
            // Validate availability settings
            if (formData.sessions.length === 0) {
                setError('Please add at least one time session');
                return;
            }
            const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const availableDays = allDays.filter(day => !formData.unavailableDays.includes(day));
            if (availableDays.length === 0) {
                setError('Please select at least one available day');
                return;
            }
        }

        setStep(prev => prev + 1);
    };

    const handlePrevious = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate sessions
            if (formData.sessions.length === 0) {
                setError('Please add at least one time session');
                setLoading(false);
                return;
            }

            // Determine final specialization value
            const finalSpecialization = formData.specialization === 'Other'
                ? formData.customSpecialization
                : formData.specialization;

            // Validate specialization
            if (!finalSpecialization) {
                setError('Please specify your specialization');
                setLoading(false);
                return;
            }

            // Convert sessions to timings format for backend
            // Sessions apply to all available days (days not in unavailableDays)
            const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const availableDays = allDays.filter(day => !formData.unavailableDays.includes(day));

            // Ensure at least one day is available
            if (availableDays.length === 0) {
                setError('Please select at least one available day');
                setLoading(false);
                return;
            }

            // Create timings array with sessions for each available day
            const timings = availableDays.map(day => ({
                day: day,
                slots: formData.sessions.map(session => ({
                    startTime: session.startTime,
                    endTime: session.endTime,
                    available: true
                }))
            }));

            const doctorData = {
                hospital: formData.hospital,
                degree: formData.degree,
                specialization: finalSpecialization,
                experience: parseInt(formData.experience),
                location: formData.location,
                bio: formData.bio,
                consultationFee: parseInt(formData.consultationFee),
                timings: timings,
                // Additional metadata (not critical for backend but useful)
                availableFrom: formData.availableFrom,
                availableUntil: formData.availableUntil,
                slotDuration: parseInt(formData.slotDuration)
            };

            console.log('Submitting doctor data:', doctorData);
            const response = await doctorAPI.registerDoctor(doctorData);
            console.log('Registration response:', response);

            if (response.success) {
                toast.success('Successfully registered as a doctor!');
                navigate('/doctors');
            } else {
                // Handle API errors that don't throw exceptions
                setError(response.message || 'Failed to register as doctor');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to register as doctor');
        } finally {
            setLoading(false);
        }
    };

    const addSession = () => {
        setFormData(prev => ({
            ...prev,
            sessions: [...prev.sessions, { startTime: '09:00', endTime: '17:00' }]
        }));
    };

    const removeSession = (index) => {
        setFormData(prev => ({
            ...prev,
            sessions: prev.sessions.filter((_, i) => i !== index)
        }));
    };

    const updateSession = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            sessions: prev.sessions.map((session, i) =>
                i === index ? { ...session, [field]: value } : session
            )
        }));
    };

    const toggleUnavailableDay = (day) => {
        setFormData(prev => ({
            ...prev,
            unavailableDays: prev.unavailableDays.includes(day)
                ? prev.unavailableDays.filter(d => d !== day)
                : [...prev.unavailableDays, day]
        }));
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="form-step">
                        <h2>Basic Information</h2>
                        <p className="step-description">Let's start with your basic details</p>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                disabled
                                className="form-input disabled"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="form-input disabled"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="form-step">
                        <h2>Professional Information</h2>
                        <p className="step-description">Tell us about your qualifications</p>

                        <div className="form-group">
                            <label>Degree/Qualifications *</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                placeholder="e.g., MBBS, MD"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Specialization *</label>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Select Specialization</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Orthopedic">Orthopedic</option>
                                <option value="Pediatrician">Pediatrician</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="General Physician">General Physician</option>
                                <option value="ENT Specialist">ENT Specialist</option>
                                <option value="Psychiatrist">Psychiatrist</option>
                                <option value="Ophthalmologist">Ophthalmologist</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {formData.specialization === 'Other' && (
                            <div className="form-group">
                                <label>Please Specify *</label>
                                <input
                                    type="text"
                                    name="customSpecialization"
                                    value={formData.customSpecialization}
                                    onChange={handleChange}
                                    placeholder="Enter your specialization"
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Years of Experience *</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                min="0"
                                placeholder="e.g., 5"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="form-step">
                        <h2>Hospital/Clinic Information</h2>
                        <p className="step-description">Where do you practice?</p>

                        <div className="form-group">
                            <label>Hospital/Clinic Name *</label>
                            <input
                                type="text"
                                name="hospital"
                                value={formData.hospital}
                                onChange={handleChange}
                                placeholder="e.g., City General Hospital"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., New York, NY"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Consultation Fee (₹) *</label>
                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                min="0"
                                step="50"
                                placeholder="e.g., 500"
                                className="form-input"
                                required
                            />
                            <p className="form-help-text">Set your consultation fee per appointment</p>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="form-step">
                        <h2>About You</h2>
                        <p className="step-description">Share a brief bio (optional)</p>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell patients about yourself, your approach to medicine, and your interests..."
                                className="form-textarea"
                                rows="6"
                                maxLength="500"
                            />
                            <small className="char-count">{formData.bio.length}/500</small>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="form-step">
                        <h2>Availability Settings</h2>
                        <p className="step-description">Configure your availability (you can update this later)</p>

                        {/* Date Range */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Available From *</label>
                                <input
                                    type="date"
                                    name="availableFrom"
                                    value={formData.availableFrom}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Available Until *</label>
                                <input
                                    type="date"
                                    name="availableUntil"
                                    value={formData.availableUntil}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Slot Duration */}
                        <div className="form-group">
                            <label>Appointment Slot Duration *</label>
                            <select
                                name="slotDuration"
                                value={formData.slotDuration}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>
                            <small className="form-help-text">Duration for each patient consultation slot</small>
                        </div>

                        {/* Working Days */}
                        <div className="form-group">
                            <label>Working Days *</label>
                            <p className="form-help-text">Select the days you are NOT available:</p>
                            <div className="days-grid">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <label key={day} className="day-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.unavailableDays.includes(day)}
                                            onChange={() => toggleUnavailableDay(day)}
                                        />
                                        <span>{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Daily Working Hours */}
                        <div className="form-group">
                            <label>Daily Working Hours *</label>
                            <p className="form-help-text">Set your working hours for each day:</p>

                            <div className="sessions-list">
                                {formData.sessions.length === 0 ? (
                                    <div className="empty-sessions-message">
                                        <p>No sessions added yet. Click the button below to add your first time session.</p>
                                    </div>
                                ) : (
                                    formData.sessions.map((session, index) => (
                                        <div key={index} className="session-card">
                                            <div className="session-header">
                                                <h4>Session {index + 1}</h4>
                                                {formData.sessions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSession(index)}
                                                        className="btn-remove-session"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="session-inputs">
                                                <div className="session-input-group">
                                                    <label>Session {index + 1} - Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={session.startTime}
                                                        onChange={(e) => updateSession(index, 'startTime', e.target.value)}
                                                        className="form-input-time"
                                                    />
                                                </div>
                                                <div className="session-input-group">
                                                    <label>Session {index + 1} - End Time</label>
                                                    <input
                                                        type="time"
                                                        value={session.endTime}
                                                        onChange={(e) => updateSession(index, 'endTime', e.target.value)}
                                                        className="form-input-time"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={addSession}
                                className="btn-add-session"
                            >
                                + Add Another Time Session
                            </button>
                        </div>
                    </div>
                );

            case 6:
                const finalSpec = formData.specialization === 'Other'
                    ? formData.customSpecialization
                    : formData.specialization;
                const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const availableDays = allDays.filter(day => !formData.unavailableDays.includes(day));

                return (
                    <div className="form-step">
                        <h2>Review & Submit</h2>
                        <p className="step-description">Please review your information</p>

                        <div className="review-section">
                            <h3>Personal Information</h3>
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                        </div>

                        <div className="review-section">
                            <h3>Professional Information</h3>
                            <p><strong>Degree:</strong> {formData.degree}</p>
                            <p><strong>Specialization:</strong> {finalSpec}</p>
                            <p><strong>Experience:</strong> {formData.experience} years</p>
                        </div>

                        <div className="review-section">
                            <h3>Hospital Information</h3>
                            <p><strong>Hospital:</strong> {formData.hospital}</p>
                            {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
                        </div>

                        {formData.bio && (
                            <div className="review-section">
                                <h3>Bio</h3>
                                <p>{formData.bio}</p>
                            </div>
                        )}

                        <div className="review-section">
                            <h3>Availability Settings</h3>
                            {formData.availableFrom && <p><strong>Available From:</strong> {new Date(formData.availableFrom).toLocaleDateString()}</p>}
                            {formData.availableUntil && <p><strong>Available Until:</strong> {new Date(formData.availableUntil).toLocaleDateString()}</p>}
                            <p><strong>Slot Duration:</strong> {formData.slotDuration} minutes</p>
                            <p><strong>Working Days:</strong> {availableDays.join(', ')}</p>
                            {formData.sessions.length > 0 && (
                                <>
                                    <p><strong>Daily Sessions:</strong></p>
                                    <ul>
                                        {formData.sessions.map((session, index) => (
                                            <li key={index}>
                                                Session {index + 1}: {session.startTime} - {session.endTime}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="doctor-registration-container">
            <div className="registration-card">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 6) * 100}%` }}></div>
                </div>

                <div className="step-indicator">
                    Step {step} of 6
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {renderStepContent()}

                    <div className="form-actions">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Previous
                            </button>
                        )}

                        {step < 6 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegistration;
