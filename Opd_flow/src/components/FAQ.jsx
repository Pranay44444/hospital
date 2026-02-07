import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const faqs = [
  { q: 'How quickly can I connect with a doctor?', a: 'Most patients connect with a doctor within 5 minutes. Our average wait time is under 3 minutes. You can see real-time availability before requesting a consultation.' },
  { q: 'Is OPD Flow HIPAA compliant and secure?', a: 'Yes. We use end-to-end encryption for all video consultations and store your medical data on secure, encrypted servers. Your privacy is non-negotiable.' },
  { q: 'What equipment do I need?', a: 'A device with a camera and microphone (smartphone, tablet, or computer) and a stable internet connection. No downloads required — we work on all modern browsers.' },
  { q: 'Can I get prescriptions through OPD Flow?', a: 'Yes. If the doctor determines medication is necessary, they send prescriptions electronically to your preferred pharmacy. A digital copy also appears in your account.' },
  { q: 'What conditions can be treated?', a: 'Non-emergency conditions: cold and flu symptoms, minor infections, skin conditions, follow-up consultations, prescription refills, and general health concerns. For emergencies, call 112.' },
  { q: 'Can I choose my doctor?', a: 'Yes — filter by specialty, language, or availability. You can choose a specific clinician or let us match you with the next available physician.' },
  { q: 'What if I need to cancel or reschedule?', a: 'Cancel or reschedule up to 2 hours before the appointment at no charge. We send reminders 24 hours and 1 hour before your consultation.' },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Common questions</span>
          <div>
            <h2>Everything you <em className="italic-accent">need to know.</em></h2>
            <p>Can't find an answer? Email us at hello@opdflow.health — we reply within the hour.</p>
          </div>
        </div>
        <div className="faq-container">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggle(i)} aria-expanded={openIndex === i}>
                <span>{faq.q}</span>
                <ChevronDown size={20} className="faq-icon" />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
