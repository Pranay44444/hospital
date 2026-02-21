/* Services page */

const SvcHero = () => (
  <section className="page-hero">
    <div className="wrap page-hero-grid">
      <div>
        <span className="eyebrow" style={{marginBottom: 32, display:'block'}}>All Departments</span>
        <h1>Fourteen specialties,<br/>one <em>care team.</em></h1>
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
            <div className="big">14<span style={{color:'var(--accent-2)'}}>+</span></div>
            <div className="lbl">Specialties under one roof</div>
          </div>
          <div className="svc-hero-stat">
            <div className="big">₹499<span style={{color:'var(--accent-2)'}}>'</span></div>
            <div className="lbl">Starting consultation fee</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
  ['Urology', 'Men\'s health, kidney and bladder conditions, discreet second opinions.', '4 consultants'],
  ['Oncology (Second Opinions)', 'Independent review of diagnoses, treatment plans and pathology reports.', 'By referral · 3 consultants'],
];

const DeptList = () => (
  <section>
    <div className="wrap">
      <div className="dept-list">
        {departments.map(([name, desc, meta], i) => (
          <a key={i} href="doctors.html" className="dept-row">
            <div className="dept-num">{String(i+1).padStart(2,'0')} /</div>
            <div className="dept-name">{name}</div>
            <div className="dept-desc">{desc}</div>
            <div className="dept-meta">{meta}</div>
            <div className="dept-arrow"><i className="arrow-ic"/></div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

const ContactCta = () => (
  <section className="contact-cta">
    <div className="wrap contact-inner">
      <h2>Not sure where<br/>you <em>belong?</em></h2>
      <div className="contact-right">
        <p>Start with a general-medicine visit. Your GP will route you to the right specialist — same platform, same record.</p>
        <a href="appointment.html" className="btn btn-primary">Request a visit <i className="arrow-ic"/></a>
      </div>
    </div>
  </section>
);

const App = () => {
  React.useEffect(() => {
    const p = localStorage.getItem('opd-palette') || 'cream';
    const t = localStorage.getItem('opd-type') || 'serif-display';
    document.documentElement.setAttribute('data-palette', p);
    document.documentElement.setAttribute('data-type', t);
  }, []);
  return (
    <>
      <Nav current="services"/>
      <SvcHero/>
      <DeptList/>
      <ContactCta/>
      <Footer/>
    </>
  );
};
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
