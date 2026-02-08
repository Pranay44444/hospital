import './HowItWorks.css';

const STEP_IMAGES = [
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80',
  'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=500&q=80',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80',
];

const steps = [
  { n: '01', t: 'Request a visit', b: "Tell us what's going on. Upload records if you have them. Takes under 2 minutes." },
  { n: '02', t: 'Auto-triage', b: 'Our clinical team reviews every request within 30 minutes — not a chatbot, a nurse.' },
  { n: '03', t: 'Pick a slot', b: 'We suggest three times that fit your schedule and match a right-specialty clinician.' },
  { n: '04', t: 'Meet & follow up', b: 'Secure video, with Rx, referrals and a written summary delivered afterward.' },
];

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <div>
            <h2>Four steps. <em className="italic-accent">Zero friction.</em></h2>
            <p>Designed alongside clinicians at three teaching hospitals, our flow removes the paperwork, the waiting, and the phone tag — without losing the human part.</p>
          </div>
        </div>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div className="how-step" key={s.n}>
              <span className="step-num">STEP / {s.n}</span>
              <h3 className="step-title">{s.t}</h3>
              <p className="step-body">{s.b}</p>
              <div className="step-img">
                <img src={STEP_IMAGES[i]} alt={s.t} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
