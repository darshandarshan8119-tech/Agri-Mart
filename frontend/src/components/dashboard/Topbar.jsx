import { Link } from 'react-router-dom';

const featureTitles = {
  disease: 'Crop Disease Detection',
  recommendation: 'Crop Recommendation',
  yield: 'Yield Prediction',
  growth: 'Plant Growth Monitoring',
  market: 'Market Price Tracking',
};

const BrandSVG = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path d="M12 3c5.2 3 7.8 7 7.8 11.8 0 3.3-2.4 5.9-5.8 6.2v-5.5l3.1-3.1-1.4-1.4-1.7 1.7V9.2h-2v6.1L9.6 13l-1.4 1.4 3.8 3.8V21c-3.9-.5-7-3.8-7-7.8C5 8.6 7.3 5.3 12 3Z" />
  </svg>
);

export default function Topbar({ activeFeature, onMenuOpen }) {
  return (
    <header className="dash-topbar">
      <div className="topbar-left">
        <div className="topbar-brand-col">
          <Link className="brand topbar-brand" to="/" aria-label="Agri-MART Home">
            <span className="brand-mark" aria-hidden="true"><BrandSVG /></span>
            <span className="topbar-brand-title">Agri-MART</span>
          </Link>
          <button type="button" className="menu-open-pill-btn" onClick={onMenuOpen} aria-label="Open AI Features Menu">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
            <span>Features Menu</span>
          </button>
        </div>
      </div>

      <div className="topbar-center">
        <div className="active-feature-indicator">
          <span className="badge-dot" />
          <span className="active-crumb-text" id="activeCrumbText">
            {featureTitles[activeFeature] || 'Dashboard'}
          </span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="live-pill neural-pill">
          <span className="pulse" />
          <span>AI Engine Online</span>
        </div>
        <div className="live-pill weather-pill">
          <span>🌦️ 28°C • Nashik Agro-Zone</span>
        </div>
      </div>
    </header>
  );
}
