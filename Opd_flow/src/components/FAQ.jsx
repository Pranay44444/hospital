import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: 'How quickly can I connect with a doctor?',
    answer: 'Most patients connect with a doctor within 5 minutes during peak hours. Our average wait time is under 3 minutes. You can see real-time availability before requesting a consultation.'
  },
  {
    question: 'Is OPDFlow HIPAA compliant and secure?',
    answer: 'Yes, OPDFlow is fully HIPAA compliant. We use end-to-end encryption for all video consultations and store your medical data on secure, encrypted servers. Your privacy and security are our top priorities.'
  },
  {
    question: 'What equipment do I need for a video consultation?',
    answer: 'You only need a device with a camera and microphone (smartphone, tablet, or computer) and a stable internet connection. Our platform works on all modern browsers without requiring any downloads.'
  },
  {
    question: 'Can I get prescriptions through OPDFlow?',
    answer: 'Yes, if the doctor determines that medication is necessary, they can send prescriptions directly to your preferred pharmacy electronically. You\'ll also receive a digital copy in your account.'
  },
  {
    question: 'What types of medical conditions can be treated?',
    answer: 'OPDFlow is ideal for non-emergency conditions like cold and flu symptoms, minor infections, skin conditions, follow-up consultations, prescription refills, and general health concerns. For emergencies, please call 911.'
  },
  {
    question: 'How do I access my medical records and prescriptions?',
    answer: 'All your consultation notes, prescriptions, and medical records are stored securely in your OPDFlow dashboard. You can access them anytime from any device, and you can also download or share them with other healthcare providers.'
  },
  {
    question: 'Can I choose my doctor?',
    answer: 'Yes, you can view available doctors with their specialties, ratings, and availability. You can choose to connect with a specific doctor or let our system match you with the next available qualified physician.'
  },
  {
    question: 'What if I need to cancel or reschedule?',
    answer: 'You can cancel or reschedule appointments up to 2 hours before the scheduled time without any charges. For scheduled appointments, we send reminders 24 hours and 1 hour before your consultation.'
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description">
            Have questions? We have answers. If you can't find what you're looking for, contact our support team.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={24}
                  className="faq-icon"
                />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
