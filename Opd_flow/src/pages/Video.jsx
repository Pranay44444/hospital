import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Video as VideoIcon, VideoOff, Mic, MicOff, PhoneOff, ExternalLink, Users } from 'lucide-react';
import authAPI, { appointmentAPI } from '../services/api';
import './Video.css';

function Video() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const [phase, setPhase] = useState('lobby'); // lobby | loading | active | error
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const appointment = location.state?.appointment;

  const roomName = appointment?.meetingLink
    ? appointment.meetingLink.split('/').pop()
    : `opd-flow-${requestId}`;

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const startConference = () => {
    if (!user) return;
    setPhase('loading');

    const tryStart = () => {
      if (!window.JitsiMeetExternalAPI) {
        setError('Video SDK failed to load. Please refresh and try again.');
        setPhase('error');
        return;
      }

      try {
        const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: user.name || user.email,
            email: user.email,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'raisehand',
              'videoquality', 'tileview', 'settings',
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        });

        jitsiApiRef.current = api;

        api.addEventListeners({
          videoConferenceJoined: () => setPhase('active'),
          audioMuteStatusChanged: ({ muted }) => setIsMuted(muted),
          videoMuteStatusChanged: ({ muted }) => setIsVideoOff(muted),
        });
      } catch (err) {
        console.error('Jitsi init error:', err);
        setError('Failed to start video conference. Please try again.');
        setPhase('error');
      }
    };

    if (window.JitsiMeetExternalAPI) {
      tryStart();
      return;
    }

    // Script already in index.html — poll until it's ready (max 10s)
    let elapsed = 0;
    const poll = setInterval(() => {
      elapsed += 200;
      if (window.JitsiMeetExternalAPI) {
        clearInterval(poll);
        tryStart();
      } else if (elapsed >= 10000) {
        clearInterval(poll);
        setError('Video SDK timed out. Check your connection and refresh.');
        setPhase('error');
      }
    }, 200);
  };

  const handleEndCall = async () => {
    if (jitsiApiRef.current) {
      try { jitsiApiRef.current.executeCommand('hangup'); } catch (_) {}
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }

    if (appointment?._id) {
      try {
        if (appointment.status !== 'completed' && appointment.status !== 'cancelled') {
          await appointmentAPI.updateAppointmentStatus(appointment._id, 'completed');
        }
        navigate(`/consultation/${appointment._id}`, { state: { appointment } });
        return;
      } catch (_) {}
    }

    navigate('/appointments');
  };

  const toggleMute = () => {
    jitsiApiRef.current?.executeCommand('toggleAudio');
  };

  const toggleVideo = () => {
    jitsiApiRef.current?.executeCommand('toggleVideo');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, []);

  if (!user) return null;

  if (phase === 'error') {
    return (
      <div className="video-error-container">
        <div className="video-error-icon"><VideoOff size={40} /></div>
        <p className="error-message">{error}</p>
        <button onClick={() => setPhase('lobby')} className="btn-back">
          Try Again
        </button>
        <button onClick={() => navigate('/appointments')} className="btn-back btn-back--ghost">
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="video-page">
      {/* Lobby screen */}
      {phase === 'lobby' && (
        <div className="video-lobby">
          <div className="lobby-card">
            <div className="lobby-icon">
              <VideoIcon size={32} />
            </div>
            <h1 className="lobby-title">Video Consultation</h1>

            {appointment && (
              <div className="lobby-meta">
                <div className="lobby-meta-row">
                  <Users size={14} />
                  <span>
                    {appointment.doctorId?.userId?.name
                      ? `Dr. ${appointment.doctorId.userId.name}`
                      : appointment.patientName || 'Participant'}
                  </span>
                </div>
                {appointment.date && (
                  <div className="lobby-meta-row">
                    <span className="lobby-meta-label">Date</span>
                    <span>{new Date(appointment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
                {appointment.time && (
                  <div className="lobby-meta-row">
                    <span className="lobby-meta-label">Time</span>
                    <span>{appointment.time}</span>
                  </div>
                )}
              </div>
            )}

            <div className="lobby-room">
              <span className="lobby-room-label">Room</span>
              <span className="lobby-room-name">{roomName}</span>
              <a
                href={`https://meet.jit.si/${roomName}`}
                target="_blank"
                rel="noreferrer"
                className="lobby-room-external"
                title="Open in browser tab"
              >
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="lobby-notice">
              Your browser may ask for camera and microphone access — click <strong>Allow</strong> when prompted.
            </div>

            <button className="btn-join" onClick={startConference}>
              <VideoIcon size={18} />
              Join Now
            </button>

            <button className="btn-lobby-back" onClick={() => navigate('/appointments')}>
              Back to Appointments
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay (shown while Jitsi bootstraps) */}
      {phase === 'loading' && (
        <div className="video-loading-overlay">
          <div className="loading-spinner" />
          <p>Connecting to secure room…</p>
        </div>
      )}

      {/* Jitsi embed — always mounted once past lobby so ref is ready */}
      <div
        ref={jitsiContainerRef}
        className={`jitsi-container ${phase === 'active' || phase === 'loading' ? 'jitsi-visible' : ''}`}
      />

      {/* Controls bar — only shown when call is active */}
      {phase === 'active' && (
        <div className="video-controls">
          <button
            className={`vc-btn ${isMuted ? 'vc-btn--danger' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            className={`vc-btn ${isVideoOff ? 'vc-btn--danger' : ''}`}
            onClick={toggleVideo}
            title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
          >
            {isVideoOff ? <VideoOff size={18} /> : <VideoIcon size={18} />}
            <span>{isVideoOff ? 'Start Cam' : 'Stop Cam'}</span>
          </button>

          <button className="vc-btn vc-btn--end" onClick={handleEndCall} title="End Call">
            <PhoneOff size={18} />
            <span>End Call</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Video;
