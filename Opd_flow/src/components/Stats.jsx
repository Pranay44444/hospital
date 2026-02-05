import './Stats.css';

const stats = [
  { big: '142', suffix: 'k', label: 'Consultations completed in 2025' },
  { big: '4.9', suffix: '/5', label: 'Avg. patient satisfaction across departments' },
  { big: '96', suffix: '%', label: 'Of patients seen within 30 minutes of request' },
  { big: '14', suffix: '+', label: 'Specialties under a single medical record' },
];

function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="section-head" style={{ color: 'var(--accent-ink)' }}>
          <span className="eyebrow" style={{ color: 'color-mix(in oklab, var(--accent-ink) 60%, transparent)' }}>
            By the numbers
          </span>
          <div>
            <h2 style={{ color: 'var(--accent-ink)' }}>
              Measured by outcomes, <em className="italic-accent">not vanity.</em>
            </h2>
            <p style={{ color: 'color-mix(in oklab, var(--accent-ink) 75%, transparent)' }}>
              Every quarter we publish anonymized outcome data — because trust in healthcare has to be earned with evidence.
            </p>
          </div>
        </div>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="stat-big">{s.big}<em>{s.suffix}</em></div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
