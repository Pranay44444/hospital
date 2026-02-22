/* Shared layout: Nav + Footer + Placeholder img + icons */

const Logo = ({ size = 34 }) => (
  <span className="logo-hybrid" style={{fontSize: size * 0.72}}>
    <span className="logo-word">OPD</span>
    <span className="logo-icon" style={{width: size, height: size}}>
      <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)"/>
            <stop offset="1" stopColor="var(--accent-2)"/>
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--accent-2)"/>
            <stop offset="1" stopColor="var(--accent)"/>
          </linearGradient>
        </defs>
        {/* outer disc */}
        <circle cx="20" cy="20" r="19" fill="url(#logoGrad)"/>
        {/* inner ring */}
        <circle cx="20" cy="20" r="14" fill="none" stroke="var(--bg)" strokeWidth="0.8" opacity="0.35"/>
        {/* medical cross, inset */}
        <path d="M17 9 h6 v8 h8 v6 h-8 v8 h-6 v-8 h-8 v-6 h8 z"
          fill="var(--bg)"/>
        {/* pulse highlight */}
        <path d="M8 22 h5 l2-3 l3 6 l2-3 h12"
          stroke="url(#logoGrad2)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      </svg>
    </span>
    <span className="logo-word">Flow</span>
  </span>
);

const Nav = ({ current = 'home' }) => {
  const links = [
    { k: 'home', label: 'Home', href: 'index.html' },
    { k: 'services', label: 'Services', href: 'services.html' },
    { k: 'doctors', label: 'Doctors', href: 'doctors.html' },
    { k: 'about', label: 'About', href: 'about.html' },
    { k: 'contact', label: 'Contact', href: 'contact.html' },
  ];
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="index.html" className="logo">
          <Logo size={30}/>
        </a>
        <nav className="nav-links">
          {links.map(l => (
            <a key={l.k} href={l.href}
               className={"nav-link" + (l.k === current ? ' active' : '')}>
              {l.label}
            </a>
          ))}
          <a href="appointment.html" className="btn btn-primary btn-sm">
            Book visit <i className="arrow-ic" />
          </a>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="wrap">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">OPD<br/>Flow<span style={{color:'var(--accent-2)'}}>.</span></div>
          <p style={{fontSize:14, opacity:0.8, maxWidth:'32ch', lineHeight:1.6}}>
            A calm front door for outpatient care.<br/>
            Licensed across 14 states. HIPAA-compliant.
          </p>
        </div>
        <div>
          <h5>Visit</h5>
          <ul>
            <li>Services</li>
            <li>Doctors</li>
            <li>How it works</li>
            <li>Insurance</li>
            <li>Patient portal</li>
          </ul>
        </div>
        <div>
          <h5>Hours</h5>
          <ul>
            <li>Mon – Fri · 7a – 9p</li>
            <li>Saturday · 8a – 6p</li>
            <li>Sunday · 9a – 3p</li>
            <li>24/7 virtual triage</li>
          </ul>
        </div>
        <div>
          <h5>Find us</h5>
          <ul>
            <li>2108 Canal Street</li>
            <li>Pune, MH 411001</li>
            <li>hello@opdflow.health</li>
            <li>+91 20 4100 0000</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 OPD Flow Health Pvt. Ltd.</span>
        <span>Crafted with care · Pune / Bengaluru</span>
      </div>
    </div>
  </footer>
);

/* Generic striped placeholder block */
const Ph = ({ label, aspect = '4 / 5', style = {}, children }) => (
  <div className="ph" style={{ aspectRatio: aspect, ...style }}>
    {children}
    {label && <span className="ph-label">{label}</span>}
  </div>
);

/* Real imagery component — uses Unsplash featured photos */
const Img = ({ src, alt, aspect = '3 / 4', style = {}, children }) => (
  <div className="ph" style={{ aspectRatio: aspect, backgroundImage: 'none', ...style }}>
    <img src={src} alt={alt||''} loading="lazy"
      style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
    {children}
  </div>
);

/* Doctor headshots — curated Unsplash photos of medical professionals */
const DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', // woman doc coat
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80', // man doc stethoscope
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80', // woman doc smiling
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80', // man doc portrait
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80', // woman doc scrubs
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80', // man doc confident
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80', // woman doc coat 2
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&q=80', // woman doc indian
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=600&q=80', // indian male doc
  'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=600&q=80', // indian woman doc
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&q=80', // male doc smiling
  'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&q=80', // woman doc friendly
];
const PATIENT_IMAGES = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
];
const FOUNDERS_IMAGE = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80';
const STEP_IMAGES = [
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80', // patient on phone
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80', // nurse review
  'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=500&q=80', // calendar scheduling
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80', // telehealth consult
];

/* Simple hairline icons — geometry only */
const Ic = {
  Arrow: (p) => <i className="arrow-ic" {...p} />,
  Plus: ({size=14})=>(
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  Check: ({size=14})=>(
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7.5l3 3 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dot: ({size=6, color='currentColor'})=>(
    <span style={{display:'inline-block', width:size, height:size, borderRadius:'50%', background:color}} />
  ),
};

Object.assign(window, { Nav, Footer, Ph, Img, Ic, Logo, DOCTOR_IMAGES, PATIENT_IMAGES, FOUNDERS_IMAGE, STEP_IMAGES });
