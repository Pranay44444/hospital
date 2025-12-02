import { Link } from 'react-router-dom';
import { User, MapPin, Award, Clock } from 'lucide-react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
    return (
        <Link to={`/doctor/${doctor._id}`} className="doctor-card">
            <div className="doctor-card-header">
                <div className="doctor-avatar">
                    <User size={40} />
                </div>
                <div className="doctor-info">
                    <h3 className="doctor-name">{doctor.userId?.name || 'Unknown'}</h3>
                    <p className="doctor-specialization">{doctor.specialization}</p>
                </div>
            </div>

            <div className="doctor-card-body">
                <div className="doctor-detail">
                    <Award size={16} />
                    <span>{doctor.degree}</span>
                </div>

                <div className="doctor-detail">
                    <Clock size={16} />
                    <span>{doctor.experience} years experience</span>
                </div>

                <div className="doctor-detail">
                    <MapPin size={16} />
                    <span>{doctor.hospital}</span>
                </div>

                {doctor.location && (
                    <div className="doctor-detail">
                        <MapPin size={16} />
                        <span>{doctor.location}</span>
                    </div>
                )}
            </div>

            {doctor.rating > 0 && (
                <div className="doctor-rating">
                    ⭐ {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
                </div>
            )}

            <div className="doctor-card-footer">
                <button className="btn-view-profile">View Profile</button>
            </div>
        </Link>
    );
};

export default DoctorCard;
