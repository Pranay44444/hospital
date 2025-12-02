import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import authAPI from '../services/api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await authAPI.googleLogin(credentialResponse.credential);
      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1>Sign In with Google</h1>
            <p>Welcome to OPDFlow - Secure authentication with Google</p>
          </div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              useOneTap
              theme="filled_blue"
              shape="pill"
              text="signin_with"
              width="100%"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-message">
              Signing you in...
            </div>
          )}

          <div className="login-footer">
            <p className="info-text">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              Your data is secure and protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
