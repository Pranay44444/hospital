import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import './AnnouncementBanner.css';

function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-banner">
      <div className="container announcement-container">
        <div className="announcement-content">
          <Megaphone size={20} className="announcement-icon" />
          <p className="announcement-text">
            <strong>New Feature:</strong> Now supporting mental health consultations with certified therapists.
            <a href="/request" className="announcement-link">Learn more</a>
          </p>
        </div>
        <button
          className="announcement-close"
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBanner;
