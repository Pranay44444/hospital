import { Link } from 'react-router-dom';
import './FeatureGrid.css';

const mainServices = [
  { big: true, eyebrow: 'Flagship · 24/7', title: 'General medicine & virtual triage.', desc: 'Always-on care from board-certified GPs. Fever, migraines, minor injuries, medication refills, second opinions. Connected in under ten minutes, any time of day.', foot: 'From ₹499 / visit' },
  { eyebrow: 'Specialty', title: 'Cardiology', desc: 'ECG review, arrhythmia follow-ups, hypertension management, post-procedure monitoring.', foot: '12 consultants' },
  { eyebrow: 'Specialty', title: 'Dermatology', desc: 'Photo-first consults. Turnaround within four hours for flare-ups and chronic conditions.', foot: '8 consultants' },
  { eyebrow: 'Specialty', title: 'Mental Health', desc: 'Confidential therapy and psychiatry. Continuous care with the same clinician, not a new face each visit.', foot: '22 clinicians' },
  { eyebrow: 'Specialty', title: 'Pediatrics', desc: 'Evening-friendly slots. Common childhood concerns, growth tracking, lactation support.', foot: '9 consultants' },
];

const miniServices = ['Orthopedics', 'Gynecology', 'Endocrinology', 'Nutrition', 'ENT', 'Urology', 'Ophthalmology', 'Physiotherapy'];

function FeatureGrid() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Departments</span>
          <div>
            <h2>Care across <em className="italic-accent">14 specialties.</em></h2>
            <p>From a second-opinion on a radiology report to chronic-condition management — our network is built around a single patient record and a single care team.</p>
          </div>
        </div>
        <div className="svc-grid">
          {mainServices.map((s, i) => (
            <div key={i} className={`svc-card${s.big ? ' svc-big' : ''}`}>
              <span className="eyebrow">{s.eyebrow}</span>
              <h3 dangerouslySetInnerHTML={{ __html: s.big
                ? s.title.replace('virtual triage.', '<em>virtual triage.</em>')
                : s.title
              }} />
              <p>{s.desc}</p>
              <div className="svc-foot">
                <span>{s.foot}</span>
                <Link to="/doctors" className="svc-link">Explore <span className="arrow-ic" /></Link>
              </div>
            </div>
          ))}
        </div>
        <div className="svc-mini">
          {miniServices.map(s => (
            <Link key={s} to="/doctors" className="svc-mini-item">
              <span>{s}</span>
              <span className="arrow-ic" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;
