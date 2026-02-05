import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">OPD<br />Flow<span className="footer-dot">.</span></div>
            <p className="footer-desc">A calm front door for outpatient care.<br />Licensed across 14 states. HIPAA-compliant.</p>
          </div>
          <div>
            <h5>Visit</h5>
            <ul>
              <li><Link to="/doctors">Doctors</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/request">Book appointment</Link></li>
              <li><Link to="/dashboard">Patient portal</Link></li>
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
          <span>© {new Date().getFullYear()} OPD Flow Health Pvt. Ltd.</span>
          <span>Crafted with care · Pune / Bengaluru</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
