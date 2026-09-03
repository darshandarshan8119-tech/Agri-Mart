import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BrandSVG = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path d="M12 3c5.2 3 7.8 7 7.8 11.8 0 3.3-2.4 5.9-5.8 6.2v-5.5l3.1-3.1-1.4-1.4-1.7 1.7V9.2h-2v6.1L9.6 13l-1.4 1.4 3.8 3.8V21c-3.9-.5-7-3.8-7-7.8C5 8.6 7.3 5.3 12 3Z" />
  </svg>
);

const navItems = [
  {
    key: 'disease', label: 'Crop Disease Detection', sub: 'AI Leaf Health Scanner',
    iconPath: 'M19.5 4.5C10 4.6 5 9.4 5 16.7c0 1.1.2 2.1.6 3l3.2-3.2c.9-5.3 5.1-7.3 8.8-8.2-3.2 1.9-5.6 4.8-6.7 8.4l-4 4 1.4 1.4 3.6-3.6c1 .4 2.1.6 3.2.6 5.4 0 8.5-4.8 8.4-14.6h-4Z',
  },
  {
    key: 'recommendation', label: 'Crop Recommendation', sub: 'Soil & Climate Matrix',
    iconPath: 'M4 18h16v2H4v-2Zm1-4c4.7-4.4 9.3-4.4 14 0v2H5v-2Zm3-7.5C8 4.6 9.6 3 11.5 3S15 4.6 15 6.5c0 1.1-.5 2.1-1.2 2.7 1.2.2 2.4.7 3.6 1.5l-1.1 1.7c-2.9-1.8-5.7-1.8-8.6 0l-1.1-1.7c1.1-.8 2.3-1.3 3.6-1.5A3.5 3.5 0 0 1 8 6.5Z',
  },
  {
    key: 'yield', label: 'Yield Prediction', sub: 'Harvest & Revenue Est.',
    iconPath: 'M5 20V4h2v14h13v2H5Zm4-4V9h3v7H9Zm5 0V6h3v10h-3Zm5 0v-5h3v5h-3Z',
  },
  {
    key: 'growth', label: 'Growth Monitoring', sub: 'Phenology & NDVI Index',
    iconPath: 'M11 21v-5.1C7.1 15.4 4 12.1 4 8V5h3c2.5 0 4.7 1.3 6 3.2A7.5 7.5 0 0 1 19.5 5H21v2.5c0 4-3.1 7.4-7 7.9V21h-3Zm-5-14v1c0 2.8 2.2 5.2 5 5.8V13c0-3.3-2.7-6-6-6Zm8 6.4c2.8-.6 5-3 5-5.9V7.1c-2.9.6-5 3.2-5 6.3Z',
  },
  {
    key: 'market', label: 'Market Price Tracking', sub: 'Live APMC Mandi Rates',
    iconPath: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  },
];

const roleMap = {
  farmer: 'Cultivator / Grower',
  student: 'Agri-Scholar / Student',
  agronomist: 'Advisor / Agronomist',
  supplier: 'Merchant / Supplier',
};

export default function Sidebar({ isOpen, onClose, activeFeature, onFeatureChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullname || (user?.email ? user.email.split('@')[0] : 'Farmer Ramesh');
  const roleLabel = user?.role ? (roleMap[user.role] || user.role) : 'Verified Grower';
  const avatar =
    user?.role === 'agronomist' || user?.role === 'student' ? '🔬'
    : user?.role === 'supplier' ? '🏬' : '🧑‍🌾';

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out of your Agri-MART dashboard?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <aside className={`dash-sidebar${isOpen ? ' open' : ''}`} id="dashSidebar">
      <div className="sidebar-brand-header">
        <Link className="brand" to="/" aria-label="Agri-MART Home">
          <span className="brand-mark" aria-hidden="true"><BrandSVG /></span>
          <div className="brand-text-group">
            <span className="brand-name">Agri-MART</span>
            <span className="brand-tagline">AI FARMING INTELLIGENCE</span>
          </div>
        </Link>
      </div>

      <button type="button" className="menu-open-pill-btn" onClick={onClose} aria-label="Close AI Features Menu" style={{ margin: '0 20px 10px' }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        <span>Close Menu</span>
      </button>

      <div className="sidebar-nav-section">
        <span className="nav-section-label">AI CORE MODULES</span>
        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-nav-item${activeFeature === item.key ? ' active' : ''}`}
              data-feature={item.key}
              onClick={() => onFeatureChange(item.key)}
            >
              <span className="nav-icon-wrap">
                <svg viewBox="0 0 24 24"><path d={item.iconPath} /></svg>
              </span>
              <div className="nav-text-col">
                <strong>{item.label}</strong>
                <small>{item.sub}</small>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer-group">
        <div className="sidebar-user-card">
          <div className="user-avatar-circle" id="userAvatar">{avatar}</div>
          <div className="user-info">
            <strong id="userName">{displayName}</strong>
            <span id="userRole">{roleLabel}</span>
          </div>
        </div>
        <div className="sidebar-action-links">
          <Link to="/" className="sidebar-btn-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            <span>Back to Home</span>
          </Link>
          <button type="button" className="sidebar-btn-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
