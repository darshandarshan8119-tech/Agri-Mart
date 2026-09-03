export default function AuthShowcase() {
  return (
    <section className="auth-showcase" aria-label="Agri-MART Platform Highlights">
      <div className="auth-badge">
        <span className="pulse" />
        <span>Next-Gen Agricultural Intelligence</span>
      </div>

      <h1 className="auth-showcase-title">Empowering farmers with AI-driven harvest precision.</h1>
      <p className="auth-showcase-desc">
        Access real-time crop disease detection, soil-tailored crop suggestions, yield predictions, and seamless market access.
      </p>

      <div className="auth-feature-list">
        <div className="auth-feature-item">
          <div className="auth-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M19.5 4.5C10 4.6 5 9.4 5 16.7c0 1.1.2 2.1.6 3l3.2-3.2c.9-5.3 5.1-7.3 8.8-8.2-3.2 1.9-5.6 4.8-6.7 8.4l-4 4 1.4 1.4 3.6-3.6c1 .4 2.1.6 3.2.6 5.4 0 8.5-4.8 8.4-14.6h-4Z" /></svg>
          </div>
          <div>
            <strong>Instant Disease Scanning</strong>
            <span>Over 94% diagnostic accuracy with corrective actions</span>
          </div>
        </div>

        <div className="auth-feature-item">
          <div className="auth-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M4 18h16v2H4v-2Zm1-4c4.7-4.4 9.3-4.4 14 0v2H5v-2Zm3-7.5C8 4.6 9.6 3 11.5 3S15 4.6 15 6.5c0 1.1-.5 2.1-1.2 2.7 1.2.2 2.4.7 3.6 1.5l-1.1 1.7c-2.9-1.8-5.7-1.8-8.6 0l-1.1-1.7c1.1-.8 2.3-1.3 3.6-1.5A3.5 3.5 0 0 1 8 6.5Z" /></svg>
          </div>
          <div>
            <strong>Soil &amp; Climate Matching</strong>
            <span>Personalized crop recommendations for maximized yield</span>
          </div>
        </div>

        <div className="auth-feature-item">
          <div className="auth-feature-icon">
            <svg viewBox="0 0 24 24"><path d="M12 21c-4.4-1.8-7-5.2-7-9.6V5l7-3 7 3v6.4c0 4.4-2.6 7.8-7 9.6Zm0-2.2c3.1-1.5 5-4.1 5-7.4V6.3l-5-2.1-5 2.1v5.1c0 3.3 1.9 5.9 5 7.4Zm-1.1-4.1-2.8-2.8 1.4-1.4 1.4 1.4 3.8-3.8 1.4 1.4-5.2 5.2Z" /></svg>
          </div>
          <div>
            <strong>Marketplace &amp; Field Records</strong>
            <span>Direct access to trusted seeds, nutrients, and supplies</span>
          </div>
        </div>
      </div>

      <div className="auth-stats-card">
        <div className="stats-icon">🌿</div>
        <div className="stats-text">
          <strong>15,000+ Active Acres Monitored</strong>
          <span>Trusted across farms, agri-institutions &amp; research centers</span>
        </div>
      </div>
    </section>
  );
}
