import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import AuthShowcase from '../components/auth/AuthShowcase';
import SignInForm from '../components/auth/SignInForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('signin');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const mode = searchParams.get('mode') || searchParams.get('tab');
    const hash = location.hash.toLowerCase();
    if (mode === 'register' || mode === 'signup' || hash === '#register' || hash === '#signup') {
      setActiveTab('register');
    } else {
      setActiveTab('signin');
    }
  }, [searchParams, location]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    if (type !== 'info') {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setAlert(null);
  };

  return (
    <div className="auth-body">
      <div className="auth-page-wrapper">
        <div className="auth-bg-media" aria-hidden="true" />
        <div className="auth-bg-overlay" aria-hidden="true" />
        <div className="hero-tech" aria-hidden="true">
          <span /><span /><span />
        </div>

        <header className="auth-header">
          <div className="auth-header-container">
            <Link className="brand" to="/" aria-label="Return to Agri-MART home">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M12 3c5.2 3 7.8 7 7.8 11.8 0 3.3-2.4 5.9-5.8 6.2v-5.5l3.1-3.1-1.4-1.4-1.7 1.7V9.2h-2v6.1L9.6 13l-1.4 1.4 3.8 3.8V21c-3.9-.5-7-3.8-7-7.8C5 8.6 7.3 5.3 12 3Z" />
                </svg>
              </span>
              <span>Agri-MART</span>
            </Link>

            <Link to="/" className="auth-back-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="m7.828 11 5.364-5.364-1.414-1.414L4 12l7.778 7.778 1.414-1.414L7.828 13H20v-2z" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="auth-container">
          <AuthShowcase />

          <section className="auth-card-panel" aria-labelledby="auth-tabs">
            <div className="auth-glass-card">
              <div className="auth-tabs" id="auth-tabs" role="tablist">
                <button
                  type="button"
                  className={`auth-tab${activeTab === 'signin' ? ' active' : ''}`}
                  id="tab-btn-signin"
                  role="tab"
                  aria-selected={activeTab === 'signin'}
                  aria-controls="panel-signin"
                  onClick={() => handleTabSwitch('signin')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab${activeTab === 'register' ? ' active' : ''}`}
                  id="tab-btn-register"
                  role="tab"
                  aria-selected={activeTab === 'register'}
                  aria-controls="panel-register"
                  onClick={() => handleTabSwitch('register')}
                >
                  Register
                </button>
              </div>

              {alert && (
                <div id="auth-alert" className={`auth-alert ${alert.type}`} role="alert">
                  <span className="alert-icon">{alert.type === 'success' ? '✓' : alert.type === 'info' ? 'ℹ' : '⚠'}</span>
                  <span className="alert-msg">{alert.message}</span>
                </div>
              )}

              {activeTab === 'signin' ? (
                <SignInForm onSwitchTab={handleTabSwitch} showAlert={showAlert} />
              ) : (
                <RegisterForm onSwitchTab={handleTabSwitch} showAlert={showAlert} />
              )}
            </div>
          </section>
        </main>

        <footer className="auth-footer">
          <p>© 2026 Agri-MART. Smart Farming. Better Decisions. Better Harvests.</p>
        </footer>
      </div>
    </div>
  );
}
