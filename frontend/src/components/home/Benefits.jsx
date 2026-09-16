const benefits = [
  {
    tag: 'INTELLIGENCE',
    title: 'AI-Powered Insights',
    desc: 'Neural network recommendations calibrated with real-time soil NPK, pH, and precipitation vectors.',
    metric: '98.4% Match Rate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
      </svg>
    ),
    accent: 'emerald',
  },
  {
    tag: 'EXPERIENCE',
    title: 'Easy-to-Use Interface',
    desc: 'Frictionless, responsive design built for both field smartphones and desktop operations.',
    metric: 'Zero Learning Curve',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    accent: 'gold',
  },
  {
    tag: 'ANALYTICS',
    title: 'Data-Driven Decisions',
    desc: 'Eliminate guesswork with live mandi commodity prices, MSP trackers, and historical price forecasting.',
    metric: 'Live Mandi Ticker',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    accent: 'emerald',
  },
  {
    tag: 'DIAGNOSTICS',
    title: 'Crop Health Monitoring',
    desc: 'Instant leaf disease scans identifying blights, rusts, and deficiencies with proven chemical & organic remedies.',
    metric: 'Under 2 Sec Scan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    accent: 'emerald',
  },
  {
    tag: 'AGRONOMY',
    title: 'Better Crop Planning',
    desc: 'Strategic crop rotation schedules that restore soil nitrogen, optimize water usage, and curb pests.',
    metric: 'Soil Preservation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    accent: 'gold',
  },
  {
    tag: 'FORECASTING',
    title: 'Expected Yield Estimation',
    desc: 'Calibrated acreage harvest regressors predicting gross tonnage, MSP market value, and revenue returns.',
    metric: 'Acreage Regressor',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    accent: 'emerald',
  },
];

export default function Benefits() {
  return (
    <section className="section benefits" id="why-agrimart">
      <div className="benefits-ambient-glow" aria-hidden="true" />
      <div className="container">
        <div className="section-heading reveal">
          <div className="benefits-badge">
            <span className="benefits-badge-glow" aria-hidden="true" />
            <span>Why Agri-MART?</span>
          </div>
          <h2>
            Designed for <span className="benefits-gold-gradient">better farming</span> outcomes.
          </h2>
          <p className="benefits-subheading">
            Enterprise-grade AI models calibrated for precision agriculture, higher yields, and maximum field profitability.
          </p>
        </div>
        <div className="benefit-grid">
          {benefits.map((b) => (
            <div className="benefit-card reveal" key={b.title}>
              <div className="benefit-card-top">
                <div className={`benefit-icon-box ${b.accent}`}>
                  {b.icon}
                </div>
                <span className="benefit-tag">{b.tag}</span>
              </div>
              <div className="benefit-card-body">
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
              <div className="benefit-card-footer">
                <span className="benefit-metric-pill">
                  <svg className="metric-check" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  {b.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
