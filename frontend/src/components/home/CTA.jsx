import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="cta-section" id="signin">
      <span className="anchor-target" id="register" aria-hidden="true" />
      <div className="container">
        <div className="cta-card reveal">
          <div className="cta-bg" aria-hidden="true" />
          <div className="cta-inner">
            <div className="cta-badge">
              <span className="cta-badge-dot" aria-hidden="true" />
              <span>Start Growing with Intelligence</span>
            </div>
            <h2>
              Ready to Make Farming <span className="cta-highlight">Smarter?</span>
            </h2>
            <p className="cta-desc">
              Join Agri-MART and use the power of AI to diagnose crops, optimize soil nutrition, and predict harvest yields.
            </p>
            <div className="cta-actions">
              <Link className="btn btn-cta-secondary" to="/login">
                Sign In
              </Link>
              <Link className="btn btn-cta-primary" to="/login?mode=register">
                <span>Create Free Account</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="cta-perks" aria-label="Key features included">
              <span className="cta-perk-item">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant AI Diagnostics
              </span>
              <span className="cta-perk-item">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Calibrated Soil Matching
              </span>
              <span className="cta-perk-item">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Real-Time APMC Mandi Rates
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
