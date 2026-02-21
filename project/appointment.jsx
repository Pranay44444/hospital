/* Appointment multi-step flow */
const specs = [
  ['General Medicine','24/7'],['Cardiology','12 docs'],['Dermatology','8 docs'],
  ['Pediatrics','9 docs'],['Mental Health','22 docs'],['Gynecology','11 docs']
];
const days = [
  ['Mon',24],['Tue',25],['Wed',26],['Thu',27],['Fri',28],['Sat',29],['Sun',30]
];
const times = ['09:00','10:30','11:45','14:15','15:30','17:00','18:45','20:00'];

const Appt = () => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({spec:null, day:null, time:null, name:'', email:'', symptoms:''});
  const update = (k,v) => setData(d => ({...d, [k]:v}));
  const canNext = [data.spec, data.day!==null && data.time, data.name && data.email && data.symptoms, true][step];

  return (
    <section>
      <div className="appt-wrap appt">
        <div className="appt-progress">
          {[0,1,2,3].map(i => <div key={i} className={"bar" + (i<=step?' on':'')}/>)}
        </div>
        <div className="appt-step-lbl">STEP / {String(step+1).padStart(2,'0')} OF 04</div>

        {step===0 && <>
          <h1>What brings you<br/>in <em>today?</em></h1>
          <p>Not sure? Start with General Medicine — we'll route you to the right specialist if needed.</p>
          <div className="appt-body">
            <div className="spec-grid">
              {specs.map(([t,s]) => (
                <button key={t} className={"spec-btn"+(data.spec===t?' on':'')} onClick={()=>update('spec',t)}>
                  <span className="t">{t}</span>
                  <span className="s">{s}</span>
                </button>
              ))}
            </div>
          </div>
        </>}

        {step===1 && <>
          <h1>Pick a <em>time</em>.</h1>
          <p>Your consultation will be with {data.spec}. All slots are IST.</p>
          <div className="appt-body">
            <div className="slot-cal">
              {days.map(([d,n],i) => (
                <button key={i} className={"slot-day"+(data.day===i?' on':'')} onClick={()=>update('day',i)}>
                  <div className="d">{d}</div><div className="n">{n}</div>
                </button>
              ))}
            </div>
            {data.day!==null && (
              <div className="slot-times">
                {times.map(t => (
                  <button key={t} className={"slot-time"+(data.time===t?' on':'')} onClick={()=>update('time',t)}>{t}</button>
                ))}
              </div>
            )}
          </div>
        </>}

        {step===2 && <>
          <h1>Tell us <em>about you.</em></h1>
          <p>This helps your clinician prepare. Everything is encrypted and HIPAA-compliant.</p>
          <div className="appt-body">
            <div className="form-two">
              <div className="form-row"><label>Full name</label><input value={data.name} onChange={e=>update('name',e.target.value)} placeholder="Priya Mehta"/></div>
              <div className="form-row"><label>Email</label><input type="email" value={data.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com"/></div>
            </div>
            <div className="form-row"><label>What's going on?</label><textarea value={data.symptoms} onChange={e=>update('symptoms',e.target.value)} placeholder="Describe your symptoms, when they started, anything you've tried…"></textarea></div>
          </div>
        </>}

        {step===3 && <>
          <h1>You're <em>booked.</em></h1>
          <p>A confirmation just landed in your inbox. A nurse will review your intake within 30 minutes.</p>
          <div className="appt-body">
            <div className="summary-row"><span className="k">Specialty</span><span className="v">{data.spec}</span></div>
            <div className="summary-row"><span className="k">Date</span><span className="v">{data.day!==null ? `${days[data.day][0]} April ${days[data.day][1]}` : '—'}</span></div>
            <div className="summary-row"><span className="k">Time</span><span className="v">{data.time} IST</span></div>
            <div className="summary-row"><span className="k">Patient</span><span className="v">{data.name}</span></div>
            <div className="summary-row"><span className="k">Reference</span><span className="v">OPD-2026-{Math.floor(Math.random()*9000+1000)}</span></div>
          </div>
          <div style={{marginTop:32, display:'flex', gap:12}}>
            <a href="video.html" className="btn btn-primary">Join test call <i className="arrow-ic"/></a>
            <a href="index.html" className="btn btn-ghost">Back to home</a>
          </div>
        </>}

        {step<3 && (
          <div className="appt-nav">
            <button className="btn btn-ghost" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} style={{opacity:step===0?0.4:1}}>Back</button>
            <button className="btn btn-primary" disabled={!canNext} onClick={()=>setStep(step+1)} style={{opacity:canNext?1:0.4}}>
              {step===2?'Confirm':'Continue'} <i className="arrow-ic"/>
            </button>
          </div>
        )}
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
  return (<><Nav/><Appt/><Footer/></>);
};
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
