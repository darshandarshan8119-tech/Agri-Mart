import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignInForm({ onSwitchTab, showAlert }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const fillDemo = (role) => {
    if (role === 'farmer') {
      setEmail('farmer.ramesh@agrimart.com');
      setPassword('Harvest2026!');
      showAlert('Loaded Farmer demo credentials. Click "Sign In" to continue.', 'info');
    } else {
      setEmail('dr.anita.cropadvisor@agrimart.com');
      setPassword('SoilHealth99#');
      showAlert('Loaded Agronomist Advisor demo credentials. Click "Sign In" to continue.', 'info');
    }
  };

  const handleForgotPassword = () => {
    const addr = prompt('Enter your registered email address to receive password reset instructions:');
    if (addr && addr.includes('@')) {
      showAlert(`Password reset link has been dispatched to ${addr}.`, 'info');
    } else if (addr) {
      showAlert('Please enter a valid email address.', 'error');
    }
  };

  const socialAuth = (provider) => {
    showAlert(`Connecting with ${provider} Secure OAuth...`, 'info');
    setTimeout(() => {
      showAlert(`Successfully verified with ${provider}! Launching Dashboard...`, 'success');
      login({ provider, email: `user.${provider.toLowerCase()}@agrimart.com` });
      setTimeout(() => navigate('/dashboard'), 1200);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showAlert('Please provide your email / phone and password.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showAlert(`Welcome back, ${email.split('@')[0]}! Redirecting to your AI Farming Dashboard...`, 'success');
      login({ email, loginTime: new Date().toISOString() });
      setTimeout(() => navigate('/dashboard'), 1400);
    }, 1000);
  };

  return (
    <div id="panel-signin" className="auth-tab-content active" role="tabpanel" aria-labelledby="tab-btn-signin">
      <div className="auth-form-header">
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your smart farming dashboard.</p>
      </div>

      <div className="demo-login-box">
        <span className="demo-label">Quick Demo Access:</span>
        <div className="demo-buttons">
          <button type="button" className="btn-demo" onClick={() => fillDemo('farmer')}>🌾 Farmer</button>
          <button type="button" className="btn-demo" onClick={() => fillDemo('agronomist')}>🔬 Agronomist</button>
        </div>
      </div>

      <form id="form-signin" className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="signin-email">Email or Mobile Number</label>
          <div className="input-wrap">
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <input
              type="text" id="signin-email" name="email" required
              placeholder="farmer@agrimart.com or 9876543210"
              autoComplete="username"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="signin-password">Password</label>
            <button type="button" className="forgot-link" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Forgot Password?
            </button>
          </div>
          <div className="input-wrap">
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <input
              type={showPw ? 'text' : 'password'} id="signin-password" name="password" required
              placeholder="Enter your password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className={`toggle-password${showPw ? ' active' : ''}`}
              aria-label="Toggle password visibility" onClick={() => setShowPw((v) => !v)}>
              <svg className="eye-open" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="custom-checkbox">
            <input type="checkbox" id="signin-remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="checkmark" />
            <span>Remember me on this device</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-submit" id="btn-signin-submit" disabled={loading}>
          {loading ? (
            <><span className="spinner" /><span>Authenticating...</span></>
          ) : (
            <><span>Sign In to Dashboard</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="auth-divider"><span>Or continue with</span></div>

      <div className="social-auth-grid">
        <button type="button" className="btn-social" onClick={() => socialAuth('Google')}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
            <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
          </svg>
          <span>Google</span>
        </button>
        <button type="button" className="btn-social" onClick={() => socialAuth('OTP')}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
          </svg>
          <span>Mobile OTP</span>
        </button>
      </div>

      <p className="auth-switch-text">
        Don't have an Agri-MART account yet?{' '}
        <button type="button" onClick={() => onSwitchTab('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}>
          Create an account
        </button>
      </p>
    </div>
  );
}
