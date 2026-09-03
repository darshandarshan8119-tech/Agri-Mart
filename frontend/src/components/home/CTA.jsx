import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="cta" id="signin">
      <div className="cta-bg" aria-hidden="true" />
      <span className="anchor-target" id="register" aria-hidden="true" />
      <div className="container cta-inner reveal">
        <p className="eyebrow">Start growing with intelligence</p>
        <h2>Ready to Make Farming Smarter?</h2>
        <p>Join Agri-MART and use the power of AI to make better decisions for your crops.</p>
        <div className="cta-actions">
          <Link className="btn btn-light" to="/login">Sign In</Link>
          <Link className="btn btn-dark" to="/login?mode=register">Create Account</Link>
        </div>
      </div>
    </section>
  );
}
