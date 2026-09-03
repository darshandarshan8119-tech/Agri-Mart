export default function GrowthMonitoring() {
  const steps = [
    { num: 1, label: 'Germination', dates: 'Days 1 - 10', status: 'completed' },
    { num: 2, label: 'Seedling Emergence', dates: 'Days 11 - 28', status: 'completed' },
    { num: 3, label: 'Tillering & Stemming', dates: 'Days 29 - 60 (Active - 80%)', status: 'current' },
    { num: 4, label: 'Booting & Flowering', dates: 'Days 61 - 85 (Upcoming)', status: 'pending' },
    { num: 5, label: 'Grain Filling & Ripening', dates: 'Days 86 - 120 (Harvest)', status: 'pending' },
  ];

  return (
    <section id="section-growth" className="dash-section active">
      <div className="section-card-header">
        <div className="header-icon-box">
          <svg viewBox="0 0 24 24"><path d="M11 21v-5.1C7.1 15.4 4 12.1 4 8V5h3c2.5 0 4.7 1.3 6 3.2A7.5 7.5 0 0 1 19.5 5H21v2.5c0 4-3.1 7.4-7 7.9V21h-3Zm-5-14v1c0 2.8 2.2 5.2 5 5.8V13c0-3.3-2.7-6-6-6Zm8 6.4c2.8-.6 5-3 5-5.9V7.1c-2.9.6-5 3.2-5 6.3Z" /></svg>
        </div>
        <div>
          <h2>Plant Growth &amp; Phenology Tracker</h2>
          <p>Track vegetative growth stages, NDVI vigor index, and irrigation schedule.</p>
        </div>
      </div>

      <div className="growth-dashboard-grid">
        <div className="dash-card full-span">
          <div className="card-title-row">
            <h3>Current Batch: Wheat Field #3 (Planted 48 Days Ago)</h3>
            <span className="badge-stage">Phase 3: Tillering &amp; Stem Extension</span>
          </div>
          <div className="growth-stepper">
            {steps.map((step) => (
              <div className={`growth-step ${step.status}`} key={step.num}>
                <div className={`step-circle${step.status === 'current' ? ' pulse-circle' : ''}`}>
                  {step.status === 'completed' ? '✓' : step.num}
                </div>
                <div className="step-details">
                  <strong>Stage {step.num}: {step.label}</strong>
                  <span>{step.dates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <h3>NDVI Vegetative Vigor</h3>
          <div className="gauge-display">
            <div className="gauge-value">0.78</div>
            <div className="gauge-rating">Vibrant Green Canopy (Healthy)</div>
          </div>
          <p className="gauge-desc">Canopy density and chlorophyll absorption are in the top 5% index for Day 48 wheat cultivation.</p>
          <div className="metric-meter">
            <div className="meter-bar" style={{ width: '78%' }} />
          </div>
        </div>

        <div className="dash-card">
          <h3>Upcoming Scheduled Interventions</h3>
          <div className="schedule-list">
            {[
              { icon: '💧', title: 'Secondary Crown Root Irrigation', sub: 'Scheduled in 2 days (40mm drip)', badge: 'upcoming', badgeLabel: 'In 2 Days' },
              { icon: '🧪', title: 'Foliar Zinc Micronutrient Spray', sub: 'Recommended before flag leaf emergence', badge: '', badgeLabel: 'In 7 Days' },
              { icon: '🌾', title: 'Estimated Harvest Date', sub: 'April 12 - April 18, 2026', badge: 'harvest', badgeLabel: 'Harvest Ready' },
            ].map((item) => (
              <div className="sched-item" key={item.title}>
                <span className="sched-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </div>
                <span className={`sched-badge${item.badge ? ' ' + item.badge : ''}`}>{item.badgeLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
