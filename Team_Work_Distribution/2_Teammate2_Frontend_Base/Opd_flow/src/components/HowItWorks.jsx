import { UserPlus, FileText, Video, CheckCircle } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email or phone number. No complicated forms or lengthy verification processes.'
  },
  {
    icon: FileText,
    title: 'Fill Intake Form',
    description: 'Complete a quick medical intake form so your doctor has all the necessary information before the consultation.'
  },
  {
    icon: Video,
    title: 'Connect with Doctor',
    description: 'Get matched with an available doctor and start your video consultation within minutes.'
  },
  {
    icon: CheckCircle,
    title: 'Receive Care & Follow-up',
    description: 'Get your diagnosis, prescription, and follow-up instructions instantly. Access everything in your dashboard.'
  }
];

function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Get started with OPDFlow in four simple steps. Quality healthcare has never been this accessible.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="step-item">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">
                  <Icon size={32} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
