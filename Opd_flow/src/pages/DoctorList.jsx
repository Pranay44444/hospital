import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { doctorAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import './DoctorList.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');

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
            setError(err.message || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        let filtered = [...doctors];

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(doctor =>
                doctor.userId?.name.toLowerCase().includes(searchLower) ||
                doctor.hospital.toLowerCase().includes(searchLower) ||
                doctor.specialization.toLowerCase().includes(searchLower)
            );
        }

        // Filter by specialization
        if (selectedSpecialization) {
            filtered = filtered.filter(doctor =>
                doctor.specialization === selectedSpecialization
            );
        }

        setFilteredDoctors(filtered);
    };

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    if (loading) {
        return (
            <div className="doctor-list-container">
                <div className="loading">Loading doctors...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="doctor-list-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="doctor-list-container">
            <div className="doctor-list-header">
                <h1>Find a Doctor</h1>
                <p>Browse our qualified medical professionals</p>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, hospital, or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Specializations</option>
                    {specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>

            <div className="results-info">
                Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            </div>

            {filteredDoctors.length === 0 ? (
                <div className="no-results">
                    <p>No doctors found matching your criteria</p>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorList;
