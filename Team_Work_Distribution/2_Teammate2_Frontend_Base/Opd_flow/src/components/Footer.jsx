import { Link } from 'react-router-dom'
import { Activity, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div className="sec">
            <div className="brand">
              <Activity size={32} />
              <span>OPDFlow</span>
            </div>
            <p className="desc">Making quality healthcare accessible to everyone through innovative video consultation technology.</p>
            <div className="social">
              <a href="#" className="link" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="link" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="link" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="link" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>

          <div className="sec">
            <h3 className="title">Quick Links</h3>
            <ul className="links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/request">Request Appointment</Link></li>
              <li><Link to="/intake">Intake Form</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          <div className="sec">
            <h3 className="title">Resources</h3>
            <ul className="links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="sec">
            <h3 className="title">Contact Us</h3>
            <ul className="contact">
              <li>
                <Mail size={18} />
                <a href="mailto:support@opdflow.com">support@opdflow.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <p>&copy; {year} OPDFlow. All rights reserved.</p>
          <div className="legal">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
