import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import authAPI from '../services/api';
import { useToast } from '../context/ToastContext';
import './Login.css';

function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectTo = location.state?.from || '/';

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.googleLogin(credentialResponse.credential);
            if (response.success) {
                toast.success('Account created');
                navigate(redirectTo);
            }
        } catch (err) {
            setError(err.message || 'Google sign-up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (formData.password !== formData.confirm) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            if (response.success) {
                toast.success('Account created successfully');
                navigate(redirectTo);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page login-page">
            <div className="container">
                <div className="login-container">
                    <div className="login-header">
                        <h1>Create account</h1>
                        <p>Join OPDFlow to book appointments</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="name">Full name</label>
                            <div className="auth-input-wrap">
                                <User size={16} className="auth-input-icon" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">Email</label>
                            <div className="auth-input-wrap">
                                <Mail size={16} className="auth-input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="auth-input-wrap">
                                <Lock size={16} className="auth-input-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 6 characters"
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="auth-input-toggle"
                                    onClick={() => setShowPassword(s => !s)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirm">Confirm password</label>
                            <div className="auth-input-wrap">
                                <Lock size={16} className="auth-input-icon" />
                                <input
                                    id="confirm"
                                    name="confirm"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirm}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or sign up with</span>
                    </div>

                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google sign-up failed')}
                            theme="filled_blue"
                            shape="pill"
                            text="signup_with"
                            width="100%"
                        />
                    </div>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
