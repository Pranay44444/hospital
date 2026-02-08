import './Testimonials.css';

const PATIENT_IMAGES = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
];

const testimonials = [
  {
    quote: 'A calm, attentive doctor who actually listened. The follow-up summary arrived before I had finished my chai.',
    name: 'Priya Mehta',
    detail: 'Bangalore · Cardiology',
    img: PATIENT_IMAGES[0],
  },
  {
    quote: 'I was expecting another impersonal telehealth chat. Instead I got a proper 20-minute visit and a clinician who remembered me next month.',
    name: 'Arjun Sharma',
    detail: 'Pune · Mental Health',
    img: PATIENT_IMAGES[1],
  },
];

function Testimonials() {
  return (
    <section className="testi-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Patient voices</span>
          <div>
            <h2>Kind words from <em className="italic-accent">real visits.</em></h2>
            <p>Verified testimonials from patients seen in the last 12 months. Edited only for length and privacy.</p>
          </div>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testi-card">
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-who">
                <div className="testi-avatar">
                  <img src={t.img} alt={t.name} />
                </div>
                <div className="testi-who-info">
                  <strong>{t.name}</strong>
                  <span>{t.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
