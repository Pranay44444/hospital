import { Link } from 'react-router-dom';
import './About.css';

const TEAM_IMGS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
];

const TEAM = [
  ['Dr. Meera Iyer', 'Chief Medical Officer'],
  ['Dr. Rajat Kulkarni', 'Head of General Medicine'],
  ['Anaya Patel', 'Founder & CEO'],
  ['Vikram Shah', 'Co-founder & CTO'],
  ['Dr. Ishaan Desai', 'Head of Psychiatry'],
  ['Leela Narayan', 'Head of Patient Experience'],
  ['Dr. Priya Nair', 'Head of Pediatrics'],
  ['Rohan Joshi', 'Head of Design'],
  ['Dr. Kabir Rao', 'Head of Cardiology'],
  ['Nisha Reddy', 'Head of Operations'],
];

const VALUES = [
  ['01', 'Time, not volume', "Every consultation is booked for a minimum of 20 minutes. Our clinicians are paid by the hour, not by the case — so there's no incentive to rush."],
  ['02', 'One record, one team', 'Your history, labs, notes and prescriptions live in one place. Every specialist sees the same story.'],
  ['03', 'Published outcomes', 'We share anonymized outcome data every quarter. Trust has to be earned with evidence, not slogans.'],
];

function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <span className="eyebrow" style={{ marginBottom: 32, display: 'block' }}>About</span>
            <h1>Built by <em>clinicians</em><br />for the way<br />care <em>actually</em> happens.</h1>
          </div>
          <div className="page-hero-meta">
            <span className="tag">Founded 2021 · Pune, India</span>
            <p>OPD Flow started in a teaching-hospital break room. Two doctors and an engineer kept trading the same complaint: patients were being asked the same questions five times, consultations were running short, and follow-up was falling through the cracks. So we built what we wished we had.</p>
          </div>
        </div>
      </section>

      <section className="about-lead">
        <div className="container about-lead-grid">
          <div className="about-lead-img">
            <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80" alt="Founders" />
          </div>
          <div>
            <p>We think good healthcare is unhurried, attentive, and above all — <em className="italic-accent">consistent</em>. The same clinician, the same record, the same standard of care every single visit.</p>
            <p>Five years on, we serve 142,000 patients a year across 14 specialties. We publish our outcomes quarterly. We pay our clinicians for time, not volume. And we still have a suggestion box on every floor.</p>
            <div className="about-ctas">
              <Link to="/doctors" className="btn btn-primary">Meet our doctors <span className="arrow-ic" /></Link>
              <Link to="/services" className="btn btn-ghost">Explore departments</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <span className="eyebrow values-eyebrow">Our principles</span>
          <h2>Four commitments<br />we <em>won't</em> compromise.</h2>
          <div className="values-grid">
            {VALUES.map(([n, t, p]) => (
              <div className="value" key={n}>
                <span className="value-num">PRINCIPLE / {n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-wall">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leadership &amp; clinicians</span>
            <div>
              <h2>The people <em className="italic-accent">behind</em> the care.</h2>
              <p>A rotating sample from our team of 72 clinicians and 28 staff. Full roster on our Doctors page.</p>
            </div>
          </div>
          <div className="team-grid">
            {TEAM.map(([n, r], i) => (
              <div className="team-card" key={i}>
                <img src={TEAM_IMGS[i]} alt={n} />
                <div className="tn">{n}</div>
                <div className="tr">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
