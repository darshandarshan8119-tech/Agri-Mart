import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm({ onSwitchTab, showAlert }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    fullname: '', email: '', phone: '', role: 'farmer',
    password: '', confirmPassword: '', terms: false,
  });

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

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
    if (form.password.length < 6) { showAlert('Password must be at least 6 characters long.', 'error'); return; }
    if (form.password !== form.confirmPassword) { showAlert('Passwords do not match. Please verify.', 'error'); return; }
    if (!form.terms) { showAlert('Please agree to the Terms of Service & Privacy Policy.', 'error'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showAlert(`Account created successfully for ${form.fullname} (${form.role})! Launching Dashboard...`, 'success');
      login({ fullname: form.fullname, email: form.email, phone: form.phone, role: form.role, registeredAt: new Date().toISOString() });
      setTimeout(() => navigate('/dashboard'), 1400);
    }, 1200);
  };

  const PwIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );

  return (
    <div id="panel-register" className="auth-tab-content active" role="tabpanel" aria-labelledby="tab-btn-register">
      <div className="auth-form-header">
        <h2>Join Agri-MART</h2>
        <p>Register now for free to unlock AI crop intelligence and farmer tools.</p>
      </div>

      <form id="form-register" className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-fullname">Full Name</label>
          <div className="input-wrap">
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <input type="text" id="reg-fullname" name="fullname" required placeholder="e.g. Ramesh Patel" autoComplete="name" value={form.fullname} onChange={set('fullname')} />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input type="email" id="reg-email" name="email" required placeholder="you@domain.com" autoComplete="email" value={form.email} onChange={set('email')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number</label>
            <div className="input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <input type="tel" id="reg-phone" name="phone" required placeholder="+91 98765 43210" autoComplete="tel" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-role">I am a...</label>
          <div className="input-wrap select-wrap">
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <select id="reg-role" name="role" required value={form.role} onChange={set('role')}>
              <option value="farmer">Farmer / Land Cultivator</option>
              <option value="student">Agricultural Student / Researcher</option>
              <option value="agronomist">Agronomist / Field Advisor</option>
              <option value="supplier">Agri-Input Merchant / Supplier</option>
            </select>
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-wrap">
              <PwIcon />
              <input type={showPw ? 'text' : 'password'} id="reg-password" name="password" required placeholder="At least 6 characters" autoComplete="new-password" value={form.password} onChange={set('password')} />
              <button type="button" className={`toggle-password${showPw ? ' active' : ''}`} aria-label="Toggle password visibility" onClick={() => setShowPw((v) => !v)}>
                <svg className="eye-open" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm-password">Confirm Password</label>
            <div className="input-wrap">
              <PwIcon />
              <input type="password" id="reg-confirm-password" name="confirm_password" required placeholder="Re-enter password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} />
            </div>
          </div>
        </div>

        <div className="form-options">
          <label className="custom-checkbox">
            <input type="checkbox" id="reg-terms" required checked={form.terms} onChange={set('terms')} />
            <span className="checkmark" />
            <span>I agree to Agri-MART's <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</button> &amp; <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</button></span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-submit" id="btn-register-submit" disabled={loading}>
          {loading ? (
            <><span className="spinner" /><span>Creating your account...</span></>
          ) : (
            <><span>Create Agri-MART Account</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="auth-divider"><span>Or sign up with</span></div>

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
        Already registered with us?{' '}
        <button type="button" onClick={() => onSwitchTab('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}>
          Sign In here
        </button>
      </p>
    </div>
  );
}
