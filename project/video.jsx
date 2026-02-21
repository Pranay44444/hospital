/* Video consultation screen */
const Video = () => {
  const [t, setT] = React.useState(0);
  const [mic, setMic] = React.useState(true);
  const [cam, setCam] = React.useState(true);
  React.useEffect(()=>{ const i = setInterval(()=>setT(x=>x+1),1000); return ()=>clearInterval(i); },[]);
  const mm = String(Math.floor(t/60)).padStart(2,'0');
  const ss = String(t%60).padStart(2,'0');
  return (
    <div className="video-shell">
      <div className="video-top">
        <div className="brand">OPD<span style={{color:'var(--accent-2)'}}>·</span>Flow</div>
        <div className="timer">LIVE · {mm}:{ss}</div>
      </div>
      <div className="video-stage">
        <div className="video-main">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80" alt=""
            style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.88}}/>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(10,13,12,0.1) 0%, rgba(10,13,12,0.75) 100%)'}}/>
          <div className="video-doctor" style={{position:'absolute', bottom:24, left:24, textAlign:'left', maxWidth:'60%'}}>
            <h2>Dr. Meera Iyer</h2>
            <div className="spec">Cardiology · Consulting now</div>
          </div>
          <div className="video-self">
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt=""
              style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:9}}/>
          </div>
        </div>
        <div className="video-side">
          <div>
            <h4>Consultation notes</h4>
            <p>Chief complaint: intermittent palpitations, 3 weeks. Reviewing prior ECG from Apollo (uploaded).</p>
          </div>
          <div>
            <h4>Vitals shared</h4>
            <p>BP 128/82 · HR 76 · SpO₂ 98% · Last reading 22 Apr</p>
          </div>
          <div>
            <h4>Prescriptions</h4>
            <p style={{opacity:0.6}}>None yet — to be added after consultation.</p>
          </div>
          <div style={{marginTop:'auto', paddingTop:20, borderTop:'1px solid rgba(234,227,212,0.1)'}}>
            <h4>Encrypted end-to-end</h4>
            <p style={{fontSize:11, opacity:0.5}}>Session ID · OPD-2026-4821</p>
          </div>
        </div>
      </div>
      <div className="video-controls">
        <button className={"vc-btn"+(mic?'':' off')} onClick={()=>setMic(!mic)}>{mic?'MIC':'MUTE'}</button>
        <button className={"vc-btn"+(cam?'':' off')} onClick={()=>setCam(!cam)}>{cam?'CAM':'OFF'}</button>
        <button className="vc-btn">CHAT</button>
        <button className="vc-btn">NOTES</button>
        <button className="vc-btn danger" onClick={()=>location.href='index.html'}>END</button>
      </div>
    </div>
  );
};
ReactDOM.createRoot(document.getElementById('root')).render(<Video/>);
