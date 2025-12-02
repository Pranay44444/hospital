import { useState, useEffect } from 'react';
import { Search, X, User as UserIcon, Award, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, paymentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import './Request.css';

function Request() {
  const navigate = useNavigate();
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [modalDoctor, setModalDoctor] = useState(null);

  // Appointment form data
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    type: 'in-person'
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialization, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctors();
      if (response.success) {
        setDoctors(response.data.doctors);
        setFilteredDoctors(response.data.doctors);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.userId?.name.toLowerCase().includes(searchLower) ||
        doctor.hospital.toLowerCase().includes(searchLower) ||
        doctor.specialization.toLowerCase().includes(searchLower)
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(doctor =>
        doctor.specialization === selectedSpecialization
      );
    }

    setFilteredDoctors(filtered);
  };

  const specializations = [...new Set(doctors.map(d => d.specialization))];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleViewDoctor = (doctor) => {
    setModalDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create Razorpay Order
      const amount = selectedDoctor.consultationFee || 500; // Use doctor's fee or default to ₹500

      console.log('Creating order with amount:', amount);

      // Pass amount directly as a number, not as an object
      const orderResponse = await paymentAPI.createOrder(amount);

      if (!orderResponse.success) {
        toast.error('Failed to create payment order');
        return;
      }

      const order = orderResponse.data.order;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: order.amount,
        currency: order.currency,
        name: "OPD Flow",
        description: `Appointment with Dr. ${selectedDoctor.userId?.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              // 4. Create Appointment
              await createAppointment(response.razorpay_payment_id);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: appointmentData.name,
          email: appointmentData.email,
          contact: appointmentData.phone
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err) {
      console.error('Payment initiation error:', err);
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (paymentId) => {
    try {
      setLoading(true);
      const appointmentPayload = {
        doctorId: selectedDoctor._id,
        patientName: appointmentData.name,
        patientEmail: appointmentData.email,
        patientPhone: appointmentData.phone,
        date: appointmentData.date,
        time: appointmentData.time,
        reason: appointmentData.reason,
        type: appointmentData.type,
        paymentStatus: 'paid',
        paymentId: paymentId
      };

      const response = await appointmentAPI.createAppointment(appointmentPayload);

      if (response.success) {
        toast.success(`Appointment booked successfully!`);

        // Reset form
        setAppointmentData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          reason: '',
          type: 'in-person'
        });
        setSelectedDoctor(null);

        // Navigate to appointments page
        navigate('/appointments');
      }
    } catch (err) {
      console.error('Create appointment error:', err);
      toast.error('Payment successful but failed to create appointment. Please contact support with Payment ID: ' + paymentId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-page">
      <div className="request-container">
        <div className="request-header">
          <h1>Request Appointment</h1>
          <p>Select a doctor and schedule your appointment</p>
        </div>

        <div className="request-content">
          {/* Doctor Selection Section */}
          <div className="doctor-selection-section">
            <h2>Select a Doctor</h2>

            {selectedDoctor ? (
              <div className="selected-doctor-card">
                <div className="selected-doctor-info">
                  <div className="doctor-avatar-small">
                    <UserIcon size={32} />
                  </div>
                  <div>
                    <h3>{selectedDoctor.userId?.name}</h3>
                    <p className="spec-small">{selectedDoctor.specialization}</p>
                    <p className="hospital-small">{selectedDoctor.hospital}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="btn-change-doctor"
                >
                  Change Doctor
                </button>
              </div>
            ) : (
              <>
                <div className="filters-section-compact">
                  <div className="search-box-compact">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input-compact"
                    />
                  </div>

                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="filter-select-compact"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="doctors-list-compact">
                  {loading ? (
                    <div className="loading-state">Loading doctors...</div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="no-doctors">No doctors found</div>
                  ) : (
                    filteredDoctors.map(doctor => (
                      <div key={doctor._id} className="doctor-card-compact">
                        <div className="doctor-info-compact">
                          <div className="doctor-avatar-tiny">
                            <UserIcon size={24} />
                          </div>
                          <div className="doctor-details-compact">
                            <h4>{doctor.userId?.name}</h4>
                            <p className="spec-tiny">{doctor.specialization}</p>
                            <p className="hospital-tiny">{doctor.hospital}</p>
                          </div>
                        </div>
                        <div className="doctor-card-actions">
                          <button
                            onClick={() => handleViewDoctor(doctor)}
                            className="btn-view-doctor"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDoctorSelect(doctor)}
                            className="btn-select-doctor"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Appointment Form Section */}
          <div className="appointment-form-section">
            <h2>Appointment Details</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={appointmentData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={appointmentData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={appointmentData.time}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Appointment Type *</label>
                <div className="appointment-type-selector">
                  <label className={`type-option ${appointmentData.type === 'in-person' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="in-person"
                      checked={appointmentData.type === 'in-person'}
                      onChange={handleInputChange}
                    />
                    <span className="type-label">In-Person Visit</span>
                  </label>
                  <label className={`type-option ${appointmentData.type === 'video' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={appointmentData.type === 'video'}
                      onChange={handleInputChange}
                    />
                    <span className="type-label">Video Call</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Visit *</label>
                <textarea
                  name="reason"
                  value={appointmentData.reason}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                  rows="4"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                />
              </div>

              <button type="submit" className="btn-submit-appointment" disabled={!selectedDoctor}>
                Pay & Book Appointment (₹{selectedDoctor?.consultationFee || 500})
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showDoctorModal && modalDoctor && (
        <div className="modal-overlay" onClick={() => setShowDoctorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowDoctorModal(false)}
            >
              <X size={24} />
            </button>

            <div className="modal-header">
              <div className="modal-avatar">
                <UserIcon size={60} />
              </div>
              <div>
                <h2>{modalDoctor.userId?.name}</h2>
                <p className="modal-spec">{modalDoctor.specialization}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-info-item">
                <Award size={20} />
                <span>{modalDoctor.degree}</span>
              </div>
              <div className="modal-info-item">
                <Clock size={20} />
                <span>{modalDoctor.experience} years of experience</span>
              </div>
              <div className="modal-info-item">
                <MapPin size={20} />
                <span>{modalDoctor.hospital}, {modalDoctor.location}</span>
              </div>

              {modalDoctor.bio && (
                <div className="modal-bio">
                  <h3>About</h3>
                  <p>{modalDoctor.bio}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                handleDoctorSelect(modalDoctor);
                setShowDoctorModal(false);
              }}
              className="btn-modal-select"
            >
              Select this Doctor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Request;
