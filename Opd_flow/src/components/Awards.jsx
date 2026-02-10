import './Awards.css';

const awards = [
  { year: '2026', title: 'Best Digital Health Experience', org: 'FICCI Healthcare Awards' },
  { year: '2025', title: 'Top 10 Telehealth Platforms',   org: 'YourStory Health 50' },
  { year: '2025', title: 'Patient Safety Commendation',   org: 'NABH Council' },
  { year: '2024', title: 'Design Excellence, Healthcare', org: 'Kyoorius Awards' },
];

function Awards() {
  return (
    <section className="awards-section">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <span className="eyebrow">Recognition</span>
        </div>
        <div className="awards-grid">
          {awards.map((a, i) => (
            <div className="award" key={i}>
              <span className="award-yr">{a.year}</span>
              <span className="award-title">{a.title}</span>
              <span className="award-by">{a.org}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Awards;
