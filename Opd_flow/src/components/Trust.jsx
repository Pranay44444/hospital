import './Trust.css';

const items = ['Apollo Associates', 'Mayo Affiliate Network', 'NABH Accredited', 'HIPAA Compliant', 'ABDM Certified', 'ISO 27001', 'Teladoc Partner'];
const loop = [...items, ...items];

function Trust() {
  return (
    <div className="trust">
      <div className="trust-track">
        {loop.map((x, i) => (
          <span key={i} className="trust-item">{x}</span>
        ))}
      </div>
    </div>
  );
}

export default Trust;
