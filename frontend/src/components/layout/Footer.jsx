import { Link } from 'react-router-dom';

const BrandSVG = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path d="M12 3c5.2 3 7.8 7 7.8 11.8 0 3.3-2.4 5.9-5.8 6.2v-5.5l3.1-3.1-1.4-1.4-1.7 1.7V9.2h-2v6.1L9.6 13l-1.4 1.4 3.8 3.8V21c-3.9-.5-7-3.8-7-7.8C5 8.6 7.3 5.3 12 3Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div>
          <a className="brand footer-brand" href="/#home">
            <span className="brand-mark" aria-hidden="true"><BrandSVG /></span>
            <span>Agri-MART</span>
          </a>
          <p>Smart Farming. Better Decisions. Better Harvests.</p>
        </div>
        <div>
          <h3>Navigation</h3>
          <a href="/#home">Home</a>
          <a href="/#about">About</a>
          <a href="/#features">Features</a>
          <a href="/#marketplace">Marketplace</a>
          <a href="/#contact">Contact</a>
        </div>
        <div>
          <h3>Account</h3>
          <Link to="/login">Sign In</Link>
          <Link to="/login?mode=register">Register</Link>
        </div>
      </div>
      <div className="container copyright">© 2026 Agri-MART. All rights reserved.</div>
    </footer>
  );
}
