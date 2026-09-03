import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BrandSVG = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path d="M12 3c5.2 3 7.8 7 7.8 11.8 0 3.3-2.4 5.9-5.8 6.2v-5.5l3.1-3.1-1.4-1.4-1.7 1.7V9.2h-2v6.1L9.6 13l-1.4 1.4 3.8 3.8V21c-3.9-.5-7-3.8-7-7.8C5 8.6 7.3 5.3 12 3Z" />
  </svg>
);

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 820) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const displayName = user?.fullname || (user?.email ? user.email.split('@')[0] : 'Farmer');

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header
      className={`site-header${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-active' : ''}`}
      data-header
    >
      <nav className="navbar" aria-label="Primary navigation">
        <Link className="brand" to="/" aria-label="Agri-MART home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true"><BrandSVG /></span>
          <span>Agri-MART</span>
        </Link>

        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <div className={`nav-panel${menuOpen ? ' is-open' : ''}`} data-nav-panel>
          <a href="/#home" onClick={closeMenu}>Home</a>
          <a href="/#about" onClick={closeMenu}>About</a>
          <a href="/#features" onClick={closeMenu}>AI Features</a>
          <a href="/#marketplace" onClick={closeMenu}>Marketplace</a>
          <a href="/#contact" onClick={closeMenu}>Contact</a>

          {isLoggedIn ? (
            <>
              <Link className="nav-auth" to="/dashboard" onClick={closeMenu}>
                📊 {displayName} (Dashboard)
              </Link>
              <button
                className="nav-logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link className="nav-auth" to="/login" onClick={closeMenu}>Sign In</Link>
              <Link className="nav-register" to="/login?mode=register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
