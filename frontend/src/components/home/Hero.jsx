import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-media" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-tech" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <p className="eyebrow">AI-powered farming intelligence</p>
          <h1>Smart Farming. Better Decisions. Better Harvests.</h1>
          <p className="hero-text">
            Agri-MART uses Artificial Intelligence and Machine Learning to help farmers understand crops,
            detect disease, choose suitable crops, estimate yields, and monitor plant growth with confidence.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/login?mode=register">Get Started</Link>
            <a className="btn btn-secondary" href="#features">Explore Features</a>
          </div>
        </div>
      </div>
    </section>
  );
}
