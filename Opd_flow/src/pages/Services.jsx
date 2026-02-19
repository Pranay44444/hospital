import { Link } from 'react-router-dom';
import './Services.css';

const departments = [
  ['General Medicine', 'Primary care, preventive screenings, second opinions, prescription refills. A lasting relationship with a single GP.', '24/7 · 18 clinicians'],
  ['Cardiology', 'ECG review, arrhythmia follow-ups, hypertension management, post-procedure monitoring.', '12 consultants'],
  ['Dermatology', 'Photo-first consults. Acne, eczema, psoriasis, skin-cancer screening, cosmetic referrals.', '8 consultants'],
  ['Mental Health', 'Therapy and psychiatry — CBT, DBT, medication management, couples counseling. Same clinician every visit.', '22 clinicians'],
  ['Pediatrics', 'Evening-friendly slots. Common illnesses, developmental milestones, lactation and feeding support.', '9 consultants'],
  ['Gynecology', 'Annual exams, family planning, menopause management, post-partum follow-ups.', '11 consultants'],
  ['Endocrinology', 'Thyroid, diabetes, PCOS, metabolic conditions. Continuous lab-to-clinician feedback.', '6 consultants'],
  ['Orthopedics', 'Injury triage, post-surgical rehab plans, chronic joint pain management.', '7 consultants'],
  ['ENT', 'Ear, nose, throat — sinusitis, vertigo, hearing concerns, pediatric tonsil care.', '5 consultants'],
  ['Ophthalmology', 'Vision changes, post-surgical checks, diabetic eye exams, prescription updates.', '4 consultants'],
  ['Nutrition', 'One-on-one with Registered Dietitians. Clinical nutrition for chronic conditions and athletic performance.', '14 dietitians'],
  ['Physiotherapy', 'Guided recovery programs. Post-operative, post-injury, posture and chronic pain.', '9 therapists'],
  ['Urology', "Men's health, kidney and bladder conditions, discreet second opinions.", '4 consultants'],
  ['Oncology (Second Opinions)', 'Independent review of diagnoses, treatment plans and pathology reports.', 'By referral · 3 consultants'],
];

function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <span className="eyebrow" style={{ marginBottom: 32, display: 'block' }}>All Departments</span>
            <h1>Fourteen specialties,<br />one <em>care team.</em></h1>
          </div>
          <div className="page-hero-meta">
            <span className="tag">Updated April 2026</span>
            <p>OPD Flow carries a single medical record across every specialty, so your cardiologist and your endocrinologist don't each have to ask you the same four questions. Consultations are 20+ minutes. Follow-up notes are always shared in writing.</p>
            <div className="svc-hero-stats">
              <div className="svc-hero-stat">
                <div className="big">72</div>
                <div className="lbl">Board-certified clinicians</div>
              </div>
              <div className="svc-hero-stat">
                <div className="big">14<span style={{ color: 'var(--accent-2)' }}>+</span></div>
                <div className="lbl">Specialties under one roof</div>
              </div>
              <div className="svc-hero-stat">
                <div className="big">₹499<span style={{ color: 'var(--accent-2)' }}>'</span></div>
                <div className="lbl">Starting consultation fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dept-section">
        <div className="container">
          <div className="dept-list">
            {departments.map(([name, desc, meta], i) => (
              <Link key={i} to="/request" className="dept-row">
                <div className="dept-num">{String(i + 1).padStart(2, '0')} /</div>
                <div className="dept-name">{name}</div>
                <div className="dept-desc">{desc}</div>
                <div className="dept-meta">{meta}</div>
                <div className="dept-arrow"><span className="arrow-ic" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-cta-section">
        <div className="container svc-cta-inner">
          <h2>Not sure where<br />you <em className="italic-accent">belong?</em></h2>
          <div className="svc-cta-right">
            <p>Start with a general-medicine visit. Your GP will route you to the right specialist — same platform, same record.</p>
            <Link to="/request" className="btn btn-primary">Request a visit <span className="arrow-ic" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
