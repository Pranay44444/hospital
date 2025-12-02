import { Link } from 'react-router-dom';
import { ArrowRight, Video, Clock, Shield } from 'lucide-react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Shield size={16} />
            <span>HIPAA Compliant & Secure</span>
          </div>

          <h1 className="hero-title">
            Streamline Your OPD <span className="gradient-text">Video Consultations</span>
          </h1>

          <p className="hero-description">
            OPDFlow revolutionizes outpatient department workflows with seamless video consultation requests,
            intelligent intake forms, and real-time patient-doctor connections. Experience healthcare without boundaries.
          </p>

          <div className="hero-ctas">
            <Link to="/request" className="btn btn-primary btn-lg">
              Request Appointment
              <ArrowRight size={20} />
            </Link>
            <Link to="/intake" className="btn btn-secondary btn-lg">
              <Video size={20} />
              Watch Demo
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <Clock size={20} />
              <span><strong>5 min</strong> avg. wait time</span>
            </div>
            <div className="hero-stat">
              <Video size={20} />
              <span><strong>10,000+</strong> consultations</span>
            </div>
            <div className="hero-stat">
              <Shield size={20} />
              <span><strong>100%</strong> secure</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-card floating">
            <div className="card-icon">
              <Video size={32} />
            </div>
            <h3>Live Consultation</h3>
            <p>Connect with doctors instantly</p>
          </div>
          <div className="hero-card floating" style={{ animationDelay: '0.2s' }}>
            <div className="card-icon">
              <Clock size={32} />
            </div>
            <h3>Quick Response</h3>
            <p>Average 5-minute wait time</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
