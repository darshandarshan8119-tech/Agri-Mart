import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const BrandSVG = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path d="M12 3c5.2 3 7.8 7 7.8 11.8 0 3.3-2.4 5.9-5.8 6.2v-5.5l3.1-3.1-1.4-1.4-1.7 1.7V9.2h-2v6.1L9.6 13l-1.4 1.4 3.8 3.8V21c-3.9-.5-7-3.8-7-7.8C5 8.6 7.3 5.3 12 3Z" />
  </svg>
);

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`site-header${scrolled ? ' scrolled' : ''}`}
      data-header
    >
      <nav className="navbar" aria-label="Primary navigation">
        <Link className="brand" to="/" aria-label="Agri-MART home">
          <span className="brand-mark" aria-hidden="true"><BrandSVG /></span>
          <span>Agri-MART</span>
        </Link>

        <div className="nav-actions">
          {/* Language Switcher Button (Desktop & Mobile) */}
          <button
            className="nav-lang-btn"
            type="button"
            onClick={toggleLanguage}
            title={language === 'en' ? 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ' : 'Switch to English'}
            aria-label={language === 'en' ? 'Switch to Kannada' : 'Switch to English'}
          >
            <span className="nav-lang-icon" aria-hidden="true">🌐</span>
            <span className="nav-lang-label">{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            <span className="nav-lang-badge">{language.toUpperCase()}</span>
          </button>

          {isLoggedIn ? (
            <button
              className="nav-signin-btn nav-logout-btn"
              type="button"
              onClick={handleLogout}
              title={t('Sign Out')}
            >
              {t('Sign Out')}
            </button>
          ) : (
            <Link
              className="nav-signin-btn"
              to="/login"
            >
              {t('Sign In')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
