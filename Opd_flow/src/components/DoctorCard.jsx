import { Link } from 'react-router-dom';
import './DoctorCard.css';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&q=80',
];

let imgCounter = 0;

const DoctorCard = ({ doctor }) => {
  const imgSrc = doctor.photo || FALLBACK_IMAGES[(imgCounter++) % FALLBACK_IMAGES.length];
  const isAvailable = doctor.isAvailable !== false;

  return (
    <Link to={`/doctor/${doctor._id}`} className="doctor-card">
      <div className="doctor-card-img">
        <img src={imgSrc} alt={doctor.userId?.name || 'Doctor'} loading="lazy" />
        <span className={`avail-badge ${isAvailable ? 'avail-on' : 'avail-off'}`}>
          {isAvailable ? 'Available today' : 'Next week'}
        </span>
      </div>
      <div className="doctor-name">{doctor.userId?.name || 'Doctor'}</div>
      <div className="doctor-meta">
        <span className="doctor-specialization">{doctor.specialization}</span>
        <span>{doctor.experience} yrs</span>
      </div>
    </Link>
  );
};

export default DoctorCard;
