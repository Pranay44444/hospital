/* Doctors list page */
const docs = [
  ['Dr. Meera Iyer','Cardiology','18 yrs','on'],
  ['Dr. Rajat Kulkarni','General Medicine','12 yrs','on'],
  ['Dr. Anaya Rao','Pediatrics','9 yrs','off'],
  ['Dr. Ishaan Desai','Psychiatry','14 yrs','on'],
  ['Dr. Priya Nair','Pediatrics','11 yrs','on'],
  ['Dr. Kabir Rao','Cardiology','22 yrs','off'],
  ['Dr. Lakshmi Menon','Dermatology','8 yrs','on'],
  ['Dr. Samir Kapoor','Orthopedics','15 yrs','on'],
  ['Dr. Neha Bhatt','Gynecology','13 yrs','on'],
  ['Dr. Arman Sheikh','General Medicine','7 yrs','on'],
  ['Dr. Tanvi Patel','Endocrinology','10 yrs','off'],
  ['Dr. Rohit Jain','ENT','16 yrs','on'],
];

const DocList = () => {
  const [filter, setFilter] = React.useState('All');
  const specs = ['All', 'General Medicine', 'Cardiology', 'Pediatrics', 'Psychiatry', 'Dermatology', 'Orthopedics', 'Gynecology', 'Endocrinology', 'ENT'];
  const shown = filter==='All' ? docs : docs.filter(d => d[1] === filter);

  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero-grid">
          <div>
            <span className="eyebrow" style={{marginBottom:32, display:'block'}}>Clinicians</span>
            <h1>Seasoned doctors.<br/><em>Unhurried</em> visits.</h1>
          </div>
          <div className="page-hero-meta">
            <span className="tag">72 clinicians · avg. 13 yrs practice</span>
            <p>Every clinician on OPD Flow is board-certified, paid for their time rather than case volume, and committed to 20-minute minimum consultations. Filter by specialty to find the right match.</p>
          </div>
        </div>
      </section>
      <section style={{paddingTop: 32}}>
        <div className="wrap">
          <div className="doc-filter">
            {specs.map(s => (
              <button key={s} className={"chip" + (filter===s?' active':'')} onClick={()=>setFilter(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="doc-wall">
            {shown.map(([n, s, y, av], i) => {
              const imgIdx = docs.findIndex(d => d[0]===n);
              return (
                <a key={i} href="appointment.html" className="doc-big doc-card">
                  <div style={{position:'relative', marginBottom:18}}>
                    <Img src={DOCTOR_IMAGES[imgIdx % DOCTOR_IMAGES.length]} alt={n} aspect="3/4"/>
                    <span className={"avail " + av} style={{position:'absolute', top:12, right:12}}>{av==='on' ? 'Available today' : 'Next week'}</span>
                  </div>
                  <div className="name">{n}</div>
                  <div className="meta">
                    <span>{s}</span>
                    <span>{y}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

const App = () => {
  React.useEffect(() => {
    const p = localStorage.getItem('opd-palette') || 'cream';
    const t = localStorage.getItem('opd-type') || 'serif-display';
    document.documentElement.setAttribute('data-palette', p);
    document.documentElement.setAttribute('data-type', t);
  }, []);
  return (<><Nav current="doctors"/><DocList/><Footer/></>);
};
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
