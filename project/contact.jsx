/* Contact page */
const ContactPage = () => {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="contact-page">
      <div className="wrap contact-grid">
        <div className="contact-left">
          <span className="eyebrow" style={{marginBottom:32, display:'block'}}>Get in touch</span>
          <h1>Tell us what's<br/>going on. We'll <em>reply</em><br/>within the hour.</h1>
          <p>Whether you're booking your first visit, following up on a referral, or just wondering if we're a good fit — we read every message personally.</p>
          <div className="contact-blocks">
            <div className="contact-block">
              <h5>Call</h5>
              <p>+91 20 4100 0000</p>
            </div>
            <div className="contact-block">
              <h5>Email</h5>
              <p>hello@opdflow.health</p>
            </div>
            <div className="contact-block">
              <h5>Visit</h5>
              <p>2108 Canal Street<br/>Pune, MH 411001</p>
            </div>
            <div className="contact-block">
              <h5>Hours</h5>
              <p>Mon–Fri 7a–9p<br/>Sat 8a–6p · Sun 9a–3p</p>
            </div>
          </div>
        </div>
        <div className="contact-right">
          {sent ? (
            <div style={{padding:'40px 0', textAlign:'center'}}>
              <Ic.Check size={48}/>
              <h3 style={{fontFamily:'var(--font-display)', fontSize:32, margin:'20px 0 8px'}}>Message received.</h3>
              <p style={{color:'var(--ink-2)'}}>We'll respond within an hour during clinic hours.</p>
            </div>
          ) : (
            <form onSubmit={e=>{e.preventDefault(); setSent(true);}}>
              <div className="form-two">
                <div className="form-row">
                  <label>First name</label>
                  <input required placeholder="Priya"/>
                </div>
                <div className="form-row">
                  <label>Last name</label>
                  <input required placeholder="Mehta"/>
                </div>
              </div>
              <div className="form-two">
                <div className="form-row">
                  <label>Email</label>
                  <input type="email" required placeholder="you@example.com"/>
                </div>
                <div className="form-row">
                  <label>Phone</label>
                  <input placeholder="+91 98765 43210"/>
                </div>
              </div>
              <div className="form-row">
                <label>Reason for contact</label>
                <select defaultValue="new">
                  <option value="new">Book a new appointment</option>
                  <option value="followup">Follow up on a past visit</option>
                  <option value="billing">Billing question</option>
                  <option value="partner">Hospital / clinic partnership</option>
                  <option value="other">Something else</option>
                </select>
              </div>
              <div className="form-row">
                <label>Message</label>
                <textarea placeholder="Tell us what's going on…"></textarea>
              </div>
              <div className="form-submit">
                <small>Encrypted · HIPAA-compliant</small>
                <button className="btn btn-primary" type="submit">Send message <i className="arrow-ic"/></button>
              </div>
            </form>
          )}
        </div>
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
  return (<><Nav current="contact"/><ContactPage/><Footer/></>);
};
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
