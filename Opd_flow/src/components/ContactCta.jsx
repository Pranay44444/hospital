import { Link } from 'react-router-dom';
import './ContactCta.css';

function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container contact-inner">
        <h2>Your <em>care team</em><br />is one<br />message away.</h2>
        <div className="contact-right">
          <p>Join 142,000+ patients who've found a calmer, more attentive way to see a doctor. No subscription required.</p>
          <div className="contact-form">
            <input type="email" placeholder="you@example.com" />
            <Link to="/request" className="btn btn-primary btn-sm">
              Get started <span className="arrow-ic" />
            </Link>
          </div>
          <p className="contact-phone">OR CALL · +91 20 4100 0000</p>
        </div>
      </div>
    </section>
  );
}

export default ContactCta;
