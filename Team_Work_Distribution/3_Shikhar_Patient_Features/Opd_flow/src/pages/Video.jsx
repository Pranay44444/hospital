import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import authAPI, { appointmentAPI } from '../services/api';
import './Video.css';

function Video() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jitsiContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Get appointment details from navigation state if available, or fetch them
  const appointment = location.state?.appointment;

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  useEffect(() => {
    if (!user || !requestId) return;

    // Load Jitsi Meet
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        startConference();
        return;
      }

      // Script is already in index.html, just wait a bit if not loaded yet
      const interval = setInterval(() => {
        if (window.JitsiMeetExternalAPI) {
          clearInterval(interval);
          startConference();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => clearInterval(interval), 10000);
    };

    const startConference = () => {
      try {
        setLoading(false);

        // Extract room name from the meeting link or generate one
        // Link format: https://meet.jit.si/opd-flow-<timestamp>-<randomString>
        // We need just the room name part: opd-flow-<timestamp>-<randomString>
        let roomName = `opd-flow-${requestId}`;

        // If we have the full link, try to extract the room name
        if (appointment?.meetingLink) {
          const parts = appointment.meetingLink.split('/');
          roomName = parts[parts.length - 1];
        }

        const domain = 'meet.jit.si';
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: user.name || user.email,
            email: user.email
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
              'security'
            ],
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
        // Note: We removed auto-navigation on videoConferenceLeft because it was causing issues
        // when users tried to log in to Jitsi (which triggers a redirect/reload in the iframe).
        // api.addEventListeners({
        //   videoConferenceLeft: handleCallEnd,
        //   readyToClose: handleCallEnd
        // });

      } catch (err) {
        console.error('Failed to start conference:', err);
        setError('Failed to start video conference. Please try again.');
        setLoading(false);
      }
    };

    loadJitsiScript();

    return () => {
      // Cleanup
      const container = jitsiContainerRef.current;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [user, requestId]);

  const handleCallEnd = async () => {
    // If we have appointment details, mark as completed
    if (appointment?._id) {
      try {
        // Only update status if it's not already completed/cancelled
        if (appointment.status !== 'completed' && appointment.status !== 'cancelled') {
          await appointmentAPI.updateAppointmentStatus(appointment._id, 'completed');
        }
      } catch (err) {
        console.error('Failed to update appointment status:', err);
      }
    }

    // Navigate to consultation page
    navigate(`/consultation/${appointment._id}`, { state: { appointment } });
  };

  if (error) {
    return (
      <div className="video-error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(`/consultation/${appointment?._id}`)} className="btn-back">
          Back to Consultation
        </button>
      </div>
    );
  }

  return (
    <div className="video-page">
      <div className="video-header">
        <h2>Video Consultation</h2>
        <button onClick={handleCallEnd} className="btn-end-call">
          End Consultation
        </button>
      </div>
      {loading && <div className="video-loading">Loading secure video room...</div>}
      <div
        ref={jitsiContainerRef}
        className="jitsi-container"
      />
    </div>
  );
}

export default Video;
