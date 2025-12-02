import { Link, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '../context/ToastContext';
import authAPI from '../services/api';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google sign-in initiated...');
        // Use access_token for backend verification
        const response = await authAPI.googleLogin(tokenResponse.access_token);
        console.log('Backend response:', response);

        if (response.success) {
          setUser(response.data.user);

          window.location.reload();
        }
      } catch (err) {
        console.error('Google login failed:', err);
        toast.error(`Sign-in failed: ${err.message || 'Please try again'}`);
      }
    },
    onError: () => {
      console.error('Google OAuth Error');
      toast.error('Google sign-in failed. Please try again.');
    }
  });

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} `}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Activity size={32} />
          <span>OPDFlow</span>
        </Link>

        <div className={`nav-center-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/doctors" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Find Doctors
          </Link>
          <Link to="/appointments" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Appointments
          </Link>
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            // Logged in user menu
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User size={20} />
                <span>{user.name}</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="dropdown-link"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Activity size={18} />
                    <span>Dashboard</span>
                  </Link>
                  {!user.isDoctor && (
                    <Link
                      to="/doctor/register"
                      className="dropdown-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} />
                      <span>Become a Doctor</span>
                    </Link>
                  )}
                  <button
                    className="dropdown-link logout-button"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not logged in - show custom Google sign in button
            <button className="btn-google-custom" onClick={() => login()}>
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          <Link to="/request" className="btn btn-primary">
            Request Appointment
          </Link>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
