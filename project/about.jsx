/* About page */
const AboutHero = () => (
  <section className="page-hero">
    <div className="wrap page-hero-grid">
      <div>
        <span className="eyebrow" style={{marginBottom:32, display:'block'}}>About</span>
        <h1>Built by <em>clinicians</em><br/>for the way<br/>care <em>actually</em> happens.</h1>
      </div>
      <div className="page-hero-meta">
        <span className="tag">Founded 2021 · Pune, India</span>
        <p>OPD Flow started in a teaching-hospital break room. Two doctors and an engineer kept trading the same complaint: patients were being asked the same questions five times, consultations were running short, and follow-up was falling through the cracks. So we built what we wished we had.</p>
      </div>
    </div>
  </section>
);

const AboutLead = () => (
  <section className="about-lead">
    <div className="wrap about-lead-grid">
      <div className="about-lead-img">
        <Img src={FOUNDERS_IMAGE} alt="Founders" aspect="4/5"/>
      </div>
      <div>
        <p>We think good healthcare is unhurried, attentive, and above all — <em className="italic-accent">consistent</em>. The same clinician, the same record, the same standard of care every single visit.</p>
        <p>Five years on, we serve 142,000 patients a year across 14 specialties. We publish our outcomes quarterly. We pay our clinicians for time, not volume. And we still have a suggestion box on every floor.</p>
        <div style={{marginTop: 40, display:'flex', gap: 12}}>
          <a className="btn btn-primary" href="doctors.html">Meet our doctors <i className="arrow-ic"/></a>
          <a className="btn btn-ghost" href="services.html">Explore departments</a>
        </div>
      </div>
    </div>
  </section>
);

const Values = () => (
  <section className="values">
    <div className="wrap">
      <span className="eyebrow" style={{color:'color-mix(in oklab,var(--accent-ink) 60%,transparent)', marginBottom:32, display:'block'}}>Our principles</span>
      <h2>Four commitments<br/>we <em>won't</em> compromise.</h2>
      <div className="values-grid">
        {[
          ['01','Time, not volume','Every consultation is booked for a minimum of 20 minutes. Our clinicians are paid by the hour, not by the case — so there\'s no incentive to rush.'],
          ['02','One record, one team','Your history, labs, notes and prescriptions live in one place. Every specialist sees the same story.'],
          ['03','Published outcomes','We share anonymized outcome data every quarter. Trust has to be earned with evidence, not slogans.'],
        ].map(([n,t,p])=>(
          <div className="value" key={n}>
            <span className="value-num">PRINCIPLE / {n}</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TeamWall = () => {
  const team = [
    ['Dr. Meera Iyer','Chief Medical Officer'],
    ['Dr. Rajat Kulkarni','Head of General Medicine'],
    ['Anaya Patel','Founder & CEO'],
    ['Vikram Shah','Co-founder & CTO'],
    ['Dr. Ishaan Desai','Head of Psychiatry'],
    ['Leela Narayan','Head of Patient Experience'],
    ['Dr. Priya Nair','Head of Pediatrics'],
    ['Rohan Joshi','Head of Design'],
    ['Dr. Kabir Rao','Head of Cardiology'],
    ['Nisha Reddy','Head of Operations'],
  ];
  return (
    <section className="team-wall">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Leadership & clinicians</span>
          <div>
            <h2>The people <em className="italic-accent">behind</em> the care.</h2>
            <p>A rotating sample from our team of 72 clinicians and 28 staff. Full roster on our Doctors page.</p>
          </div>
        </div>
        <div className="team-grid">
          {team.map(([n,r],i)=>(
            <div className="team-card" key={i}>
              <Img src={DOCTOR_IMAGES[i % DOCTOR_IMAGES.length]} alt={n}/>
              <div className="tn">{n}</div>
              <div className="tr">{r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  React.useEffect(() => {
    const p = localStorage.getItem('opd-palette') || 'cream';
    const t = localStorage.getItem('opd-type') || 'serif-display';
    document.documentElement.setAttribute('data-palette', p);
    document.documentElement.setAttribute('data-type', t);
  }, []);
  return (<><Nav current="about"/><AboutHero/><AboutLead/><Values/><TeamWall/><Footer/></>);
};
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
