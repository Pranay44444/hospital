import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import './Contact.css';

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    reason: 'new', message: ''
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact-page">
      <div className="container contact-grid">
        <aside className="contact-left">
          <span className="eyebrow">Get in touch</span>
          <h1>
            Tell us what's going on. We'll <em>reply</em> within the hour.
          </h1>
          <p className="contact-lede">
            Whether you're booking your first visit, following up on a referral,
            or just wondering if we're a good fit — we read every message personally.
          </p>

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
              <p>2108 Canal Street<br />Pune, MH 411001</p>
            </div>
            <div className="contact-block">
              <h5>Hours</h5>
              <p>Mon–Fri 7a–9p<br />Sat 8a–6p · Sun 9a–3p</p>
            </div>
          </div>
        </aside>

        <div className="contact-right">
          {sent ? (
            <div className="form-sent">
              <CheckCircle size={56} color="var(--accent)" />
              <h3>Message received.</h3>
              <p>We'll respond within an hour during clinic hours.</p>
              <button className="btn btn-ghost" onClick={() => setSent(false)}>
                Send another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="cf-row-2">
                <div className="cf-field">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    required
                    placeholder="Priya"
                    value={form.firstName}
                    onChange={update('firstName')}
                  />
                </div>
                <div className="cf-field">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    required
                    placeholder="Mehta"
                    value={form.lastName}
                    onChange={update('lastName')}
                  />
                </div>
              </div>

              <div className="cf-row-2">
                <div className="cf-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                  />
                </div>
                <div className="cf-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={update('phone')}
                  />
                </div>
              </div>

              <div className="cf-field">
                <label htmlFor="reason">Reason for contact</label>
                <select id="reason" value={form.reason} onChange={update('reason')}>
                  <option value="new">Book a new appointment</option>
                  <option value="followup">Follow up on a past visit</option>
                  <option value="billing">Billing question</option>
                  <option value="partner">Hospital / clinic partnership</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div className="cf-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us what's going on…"
                  value={form.message}
                  onChange={update('message')}
                />
              </div>

              <div className="cf-footer">
                <small>Encrypted · HIPAA-compliant</small>
                <button className="btn btn-primary" type="submit">
                  Send message <span className="arrow-ic" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
