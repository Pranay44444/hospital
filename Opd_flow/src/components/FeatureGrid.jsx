import { Video, Clock, Shield, Bell, Calendar, FileText, Users, Activity } from 'lucide-react';
import './FeatureGrid.css';

const features = [
  {
    icon: Video,
    title: 'HD Video Consultations',
    description: 'Crystal clear video quality with adaptive streaming for seamless doctor-patient interactions.'
  },
  {
    icon: Clock,
    title: 'Real-Time Availability',
    description: 'See available doctors instantly and get connected within minutes, not hours.'
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'End-to-end encryption and secure data storage ensure your privacy is always protected.'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Receive timely updates about appointments, prescriptions, and follow-ups via SMS and email.'
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Book appointments at your convenience with our intelligent scheduling system.'
  },
  {
    icon: FileText,
    title: 'Digital Records',
    description: 'Access your medical history, prescriptions, and reports anytime, anywhere.'
  },
  {
    icon: Users,
    title: 'Multi-Patient Support',
    description: 'Manage consultations for family members from a single account.'
  },
  {
    icon: Activity,
    title: 'Health Tracking',
    description: 'Monitor vitals and track your health metrics over time with detailed analytics.'
  }
];

function FeatureGrid() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Everything You Need for Modern Healthcare</h2>
          <p className="section-description">
            Comprehensive features designed to make healthcare accessible, efficient, and secure for everyone.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  <Icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;
