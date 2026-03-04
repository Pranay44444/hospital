import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Stethoscope, MessageCircle, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '../context/ToastContext';
import authAPI, { messageAPI } from '../services/api';
import './Navbar.css';

const OpdLogo = () => (
  <svg className="brand-icon" viewBox="0 0 40 40" fill="none" width="30" height="30">
    <defs>
      <linearGradient id="lgNav1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--accent)"/>
        <stop offset="1" stopColor="var(--accent-2)"/>
      </linearGradient>
      <linearGradient id="lgNav2" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="var(--accent-2)"/>
        <stop offset="1" stopColor="var(--accent)"/>
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="19" fill="url(#lgNav1)"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="var(--bg)" strokeWidth="0.8" opacity="0.35"/>
    <path d="M17 9 h6 v8 h8 v6 h-8 v8 h-6 v-8 h-8 v-6 h8 z" fill="var(--bg)"/>
    <path d="M8 22 h5 l2-3 l3 6 l2-3 h12"
      stroke="url(#lgNav2)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
  </svg>
);

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      messageAPI.getUnreadCount()
        .then(res => { if (res.success) setUnread(res.data.count); })
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await authAPI.googleLogin(tokenResponse.access_token);
        if (response.success) {
          setUser(response.data.user);
          window.location.reload();
        }
      } catch (err) {
        toast.error(`Sign-in failed: ${err.message || 'Please try again'}`);
      }
    },
    onError: () => toast.error('Google sign-in failed. Please try again.'),
  });

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-word">OPD</span>
          <OpdLogo />
          <span className="brand-word">Flow</span>
        </Link>

        <nav className={`nav-center-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/doctors" className={`navbar-link ${isActive('/doctors') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Doctors</Link>
          <Link to="/services" className={`navbar-link ${isActive('/services') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/about" className={`navbar-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/contact" className={`navbar-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/appointments" className={`navbar-link ${isActive('/appointments') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Appointments</Link>
        </nav>

        <div className="navbar-actions">
          {user && (
            <Link to="/messages" className="navbar-icon-btn" aria-label="Messages" title="Messages">
              <MessageCircle size={18} />
              {unread > 0 && <span className="navbar-badge">{unread > 99 ? '99+' : unread}</span>}
            </Link>
          )}
          {user ? (
            <div className="user-menu">
              <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                <User size={16} />
                <span>{user.name}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <Link to="/dashboard" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                    <LayoutDashboard size={16} /><span>Dashboard</span>
                  </Link>
                  {user.isDoctor && (
                    <Link to="/doctor-panel" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                      <Stethoscope size={16} /><span>Doctor Panel</span>
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                      <ShieldCheck size={16} /><span>Admin Panel</span>
                    </Link>
                  )}
                  {!user.isDoctor && user.doctorApplicationStatus !== 'pending' && (
                    <Link to="/doctor/register" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                      <User size={16} /><span>{user.doctorApplicationStatus === 'rejected' ? 'Reapply as Doctor' : 'Become a Doctor'}</span>
                    </Link>
                  )}
                  {user.doctorApplicationStatus === 'pending' && (
                    <div className="dropdown-link" style={{ cursor: 'default', opacity: 0.7 }}>
                      <Stethoscope size={16} /><span>Application Pending</span>
                    </div>
                  )}
                  <button className="dropdown-link logout-button" onClick={handleLogout}>
                    <LogOut size={16} /><span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-google-custom" onClick={() => login()}>
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1,0,0,1,27.009001,-39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign in
            </button>
          )}
          <Link to="/request" className="nav-book-btn">
            Book visit <span className="arrow-ic" />
          </Link>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
