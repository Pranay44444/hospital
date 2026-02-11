import { Link } from 'react-router-dom';
import './DoctorsSection.css';

const DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
];

const docs = [
  { name: 'Dr. Meera Iyer',     spec: 'Cardiology · 18 yrs' },
  { name: 'Dr. Rajat Kulkarni', spec: 'General Medicine · 12 yrs' },
  { name: 'Dr. Anaya Rao',      spec: 'Pediatrics · 9 yrs' },
  { name: 'Dr. Ishaan Desai',   spec: 'Psychiatry · 14 yrs' },
];

function DoctorsSection() {
  return (
    <section className="doctors-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Meet the clinicians</span>
          <div>
            <h2>Seasoned doctors. <em className="italic-accent">Unhurried visits.</em></h2>
            <p>Our clinicians average 13 years of practice, and every consultation is scheduled for 20 minutes minimum — long enough to actually listen.</p>
          </div>
        </div>
        <div className="doc-row">
          {docs.map((d, i) => (
            <Link key={i} to="/doctors" className="doc-card">
              <div className="doc-img">
                <img src={DOCTOR_IMAGES[i]} alt={d.name} loading="lazy" />
              </div>
              <div className="doc-name">{d.name}</div>
              <div className="doc-spec">{d.spec}</div>
            </Link>
          ))}
        </div>
        <div className="doc-cta">
          <Link to="/doctors" className="btn btn-ghost">
            View all 72 clinicians <span className="arrow-ic" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DoctorsSection;
