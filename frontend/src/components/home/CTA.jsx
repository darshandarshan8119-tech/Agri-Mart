import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="cta-section" id="signin">
      <span className="anchor-target" id="register" aria-hidden="true" />
      <div className="container">
        <div className="cta-card reveal">
          <div className="cta-bg" aria-hidden="true" />
          <div className="cta-inner">
            <p className="eyebrow">Start growing with intelligence</p>
            <h2>Ready to Make Farming Smarter?</h2>
            <p>Join Agri-MART and use the power of AI to make better decisions for your crops.</p>
            <div className="cta-actions">
              <Link className="btn btn-light" to="/login">Sign In</Link>
              <Link className="btn btn-dark" to="/login?mode=register">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
