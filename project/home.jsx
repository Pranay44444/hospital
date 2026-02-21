/* Home page — hero + sections */

/* Meaningful 3D healthcare model: a chunky red torus ring with an extruded
   rounded plus sign floating at its center. Mirrors the reference sculpture. */

const MedicalCross = () => (
  <div className="cross-wrap">
    <div id="three-stage" />
  </div>
);

const Hero = () => (
  <section className="hero">
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">A Telehealth Platform · Est. 2021</span>
        <h1 className="hero-title">
          <span className="line">Outpatient</span>
          <span className="line">care that <em>meets</em></span>
          <span className="line">you where <em>you are.</em></span>
        </h1>
        <p className="hero-sub">
          OPD Flow connects patients and clinicians through calm, secure video consultations,
          intelligent intake and a scheduling layer that respects everyone's time. No waiting room.
          No paperwork you've already filled out.
        </p>
        <div className="hero-ctas">
          <a href="appointment.html" className="btn btn-primary">
            Request an appointment <i className="arrow-ic" />
          </a>
          <a href="#how" className="btn btn-ghost">See how it works</a>
        </div>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <div className="hero-meta-num">5<span style={{color:'var(--accent-2)'}}>'</span></div>
            <div className="hero-meta-lbl">Avg. wait time</div>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-num">142<span style={{color:'var(--accent-2)'}}>k</span></div>
            <div className="hero-meta-lbl">Consultations / yr</div>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-num">4.9<span style={{color:'var(--accent-2)'}}>★</span></div>
            <div className="hero-meta-lbl">Patient rating</div>
          </div>
        </div>
      </div>

      <div className="stage-3d" aria-hidden="true">
        <div className="scene">
          <MedicalCross />
        </div>
        <div className="float-chip one">
          <span className="chip-dot" />
          <div>
            <strong>Dr. Meera Iyer</strong>
            <span className="sub">CARDIOLOGY · IN CALL</span>
          </div>
        </div>
        <div className="float-chip two">
          <span className="chip-dot" style={{background:'var(--accent)'}}/>
          <div>
            <strong>Intake reviewed</strong>
            <span className="sub">4 MIN AGO</span>
          </div>
        </div>
        <div className="float-chip three">
          <span className="chip-dot" />
          <div>
            <strong>Rx dispatched</strong>
            <span className="sub">DELIVERY BY 6PM</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Trust = () => {
  const items = ['Apollo Associates', 'Mayo Affiliate Network', 'NABH Accredited', 'HIPAA Compliant', 'ABDM Certified', 'ISO 27001', 'Teladoc Partner'];
  const loop = [...items, ...items];
  return (
    <div className="trust">
      <div className="trust-track">
        {loop.map((x, i) => <span key={i} className="trust-item">{x}</span>)}
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    { n: '01', t: 'Request a visit', b: 'Tell us what\'s going on. Upload records if you have them. Takes under 2 minutes.' },
    { n: '02', t: 'Auto-triage', b: 'Our clinical team reviews every request within 30 minutes — not a chatbot, a nurse.' },
    { n: '03', t: 'Pick a slot', b: 'We suggest three times that fit your schedule and match a right-specialty clinician.' },
    { n: '04', t: 'Meet & follow up', b: 'Secure video, with Rx, referrals and a written summary delivered afterward.' },
  ];
  return (
  <section className="how" id="how">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">How it works</span>
        <div>
          <h2>Four steps. <em className="italic-accent">Zero friction.</em></h2>
          <p>Designed alongside clinicians at three teaching hospitals, our flow removes the paperwork, the waiting, and the phone tag — without losing the human part.</p>
        </div>
      </div>
      <div className="how-steps">
        {steps.map((s,i) => (
          <div className="how-step" key={s.n}>
            <span className="step-num">STEP / {s.n}</span>
            <h3 className="step-title">{s.t}</h3>
            <p className="step-body">{s.b}</p>
            <Img src={STEP_IMAGES[i]} alt={s.t} aspect="4 / 3" style={{ marginTop: 28, marginRight: 20 }} />
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

const Services = () => (
  <section>
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">Departments</span>
        <div>
          <h2>Care across <em className="italic-accent">14 specialties.</em></h2>
          <p>From a second-opinion on a radiology report to chronic-condition management — our network is built around a single patient record and a single care team.</p>
        </div>
      </div>
      <div className="svc-grid">
        <div className="svc-card big">
          <span className="eyebrow">Flagship · 24/7</span>
          <h3>General medicine &<br/><em style={{fontStyle:'italic', color:'var(--accent-2)'}}>virtual triage.</em></h3>
          <p>Always-on care from board-certified GPs. Fever, migraines, minor injuries, medication refills, second opinions. Connected in under ten minutes, any time of day.</p>
          <div className="svc-foot">
            <span>From ₹499 / visit</span>
            <a href="services.html" style={{color:'inherit'}}>Explore <i className="arrow-ic" /></a>
          </div>
        </div>
        <div className="svc-card">
          <span className="eyebrow">Specialty</span>
          <h3>Cardiology</h3>
          <p>ECG review, arrhythmia follow-ups, and long-term lifestyle counseling with senior consultants.</p>
          <div className="svc-foot"><span>12 consultants</span><span>→</span></div>
        </div>
        <div className="svc-card">
          <span className="eyebrow">Specialty</span>
          <h3>Dermatology</h3>
          <p>Photo-first skin consults. Turnaround within four hours for flare-ups and chronic conditions.</p>
          <div className="svc-foot"><span>8 consultants</span><span>→</span></div>
        </div>
        <div className="svc-card">
          <span className="eyebrow">Specialty</span>
          <h3>Mental health</h3>
          <p>Confidential therapy and psychiatry. Continuous care with the same clinician, not a new face each visit.</p>
          <div className="svc-foot"><span>22 clinicians</span><span>→</span></div>
        </div>
        <div className="svc-card">
          <span className="eyebrow">Specialty</span>
          <h3>Pediatrics</h3>
          <p>Evening-friendly slots for parents. Common childhood concerns, growth tracking, lactation support.</p>
          <div className="svc-foot"><span>9 consultants</span><span>→</span></div>
        </div>
      </div>
      <div className="svc-mini">
        {['Orthopedics', 'Gynecology', 'Endocrinology', 'Nutrition', 'ENT', 'Urology', 'Ophthalmology', 'Physiotherapy'].map(s =>
          <div key={s} className="svc-mini-item"><span>{s}</span><i className="arrow-ic" /></div>
        )}
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="stats">
    <div className="wrap">
      <div className="section-head" style={{color:'var(--accent-ink)'}}>
        <span className="eyebrow" style={{color:'color-mix(in oklab, var(--accent-ink) 60%, transparent)'}}>By the numbers</span>
        <div>
          <h2 style={{color:'var(--accent-ink)'}}>Measured by outcomes, <em className="italic-accent">not vanity.</em></h2>
          <p style={{color:'color-mix(in oklab, var(--accent-ink) 75%, transparent)'}}>Every quarter we publish anonymized outcome data — because trust in healthcare has to be earned with evidence.</p>
        </div>
      </div>
      <div className="stats-grid">
        <div>
          <div className="stat-big">142<em>k</em></div>
          <div className="stat-lbl">Consultations completed in 2025</div>
        </div>
        <div>
          <div className="stat-big">4.9<em>/5</em></div>
          <div className="stat-lbl">Avg. patient satisfaction across departments</div>
        </div>
        <div>
          <div className="stat-big">96<em>%</em></div>
          <div className="stat-lbl">Of patients seen within 30 minutes of request</div>
        </div>
        <div>
          <div className="stat-big">14<em>+</em></div>
          <div className="stat-lbl">Specialties under a single medical record</div>
        </div>
      </div>
    </div>
  </section>
);

const Doctors = () => {
  const docs = [
    { n: 'Dr. Meera Iyer', s: 'Cardiology · 18 yrs' },
    { n: 'Dr. Rajat Kulkarni', s: 'General Medicine · 12 yrs' },
    { n: 'Dr. Anaya Rao', s: 'Pediatrics · 9 yrs' },
    { n: 'Dr. Ishaan Desai', s: 'Psychiatry · 14 yrs' },
  ];
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Meet the clinicians</span>
          <div>
            <h2>Seasoned doctors. <em className="italic-accent">Unhurried visits.</em></h2>
            <p>Our clinicians average 13 years of practice, and every consultation is scheduled for 20 minutes minimum — long enough to actually listen.</p>
          </div>
        </div>
        <div className="doc-row">
          {docs.map((d, i) => (
            <a key={i} href="doctors.html" className="doc-card">
              <Img src={DOCTOR_IMAGES[i]} alt={d.n} aspect="3 / 4" />
              <div className="name">{d.n}</div>
              <div className="spec">{d.s}</div>
            </a>
          ))}
        </div>
        <div style={{marginTop: 40, textAlign: 'center'}}>
          <a href="doctors.html" className="btn btn-ghost">View all 72 clinicians <i className="arrow-ic" /></a>
        </div>
      </div>
    </section>
  );
};

const Testi = () => (
  <section className="testi">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">Patient voices</span>
        <div>
          <h2>Kind words from <em className="italic-accent">real visits.</em></h2>
          <p>Verified testimonials from patients seen in the last 12 months. Edited only for length and privacy.</p>
        </div>
      </div>
      <div className="testi-grid">
        <div className="testi-card">
          <p className="testi-quote">A calm, attentive doctor who actually listened. The follow-up summary arrived before I'd finished my chai.</p>
          <div className="testi-who">
            <Img src={PATIENT_IMAGES[0]} aspect="1/1" style={{width:48, height:48, borderRadius:'50%'}}/>
            <div className="testi-who-info">
              <strong>Priya Mehta</strong>
              <span>Bangalore · Cardiology</span>
            </div>
          </div>
        </div>
        <div className="testi-card">
          <p className="testi-quote">I was expecting another impersonal telehealth chat. Instead I got a proper 20-minute visit and a clinician who remembered me next month.</p>
          <div className="testi-who">
            <Img src={PATIENT_IMAGES[1]} aspect="1/1" style={{width:48, height:48, borderRadius:'50%'}}/>
            <div className="testi-who-info">
              <strong>Arjun Sharma</strong>
              <span>Pune · Mental Health</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Awards = () => (
  <section style={{paddingTop: 60, paddingBottom: 60}}>
    <div className="wrap">
      <div style={{marginBottom: 32}}>
        <span className="eyebrow">Recognition</span>
      </div>
      <div className="awards">
        {[
          { y: '2026', t: 'Best Digital Health Experience', b: 'FICCI Healthcare Awards' },
          { y: '2025', t: 'Top 10 Telehealth Platforms', b: 'YourStory Health 50' },
          { y: '2025', t: 'Patient Safety Commendation', b: 'NABH Council' },
          { y: '2024', t: 'Design Excellence, Healthcare', b: 'Kyoorius Awards' },
        ].map((a, i) => (
          <div className="award" key={i}>
            <span className="award-yr">{a.y}</span>
            <span className="award-title">{a.t}</span>
            <span className="award-by">{a.b}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactCta = () => (
  <section className="contact-cta">
    <div className="wrap contact-inner">
      <h2>Your <em>care team</em><br/>is one<br/>message away.</h2>
      <div className="contact-right">
        <p>Join 142,000+ patients who've found a calmer, more attentive way to see a doctor. No subscription required.</p>
        <div className="contact-form">
          <input type="email" placeholder="you@example.com" />
          <button className="btn btn-primary btn-sm">Get started <i className="arrow-ic" /></button>
        </div>
        <p style={{marginTop: 20, fontSize: 12, fontFamily:'var(--font-mono)', letterSpacing:'0.08em', color:'var(--ink-3)'}}>
          OR CALL · +91 20 4100 0000
        </p>
      </div>
    </div>
  </section>
);

const Home = () => {
  const [tweaks, setTweaks] = useTweaks({
    palette: 'cream',
    type: 'serif-display',
    heroLayout: 'capsule',
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-palette', tweaks.palette);
    document.documentElement.setAttribute('data-type', tweaks.type);
    localStorage.setItem('opd-palette', tweaks.palette);
    localStorage.setItem('opd-type', tweaks.type);
  }, [tweaks.palette, tweaks.type]);

  return (
    <>
      <Nav current="home" />
      <Hero />
      <Trust />
      <HowItWorks />
      <Services />
      <Stats />
      <Doctors />
      <Testi />
      <Awards />
      <ContactCta />
      <Footer />
      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakRadio value={tweaks.palette} onChange={v => setTweaks({palette: v})}
            options={[
              {value:'cream', label:'Editorial cream + forest + ochre'},
              {value:'terracotta', label:'White + black + terracotta'},
              {value:'navy', label:'Off-white + deep navy'},
              {value:'sage', label:'Pale sage + teal'},
            ]}/>
        </TweakSection>
        <TweakSection title="Typography">
          <TweakRadio value={tweaks.type} onChange={v => setTweaks({type: v})}
            options={[
              {value:'serif-display', label:'Serif display + sans body (default)'},
              {value:'sans', label:'All sans'},
              {value:'serif-all', label:'Serif everywhere'},
            ]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Home />);
