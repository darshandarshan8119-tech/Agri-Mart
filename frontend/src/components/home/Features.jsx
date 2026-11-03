import { Link } from 'react-router-dom';

const featureCards = [
  {
    cls: 'leaves',
    iconPath: 'M19.5 4.5C10 4.6 5 9.4 5 16.7c0 1.1.2 2.1.6 3l3.2-3.2c.9-5.3 5.1-7.3 8.8-8.2-3.2 1.9-5.6 4.8-6.7 8.4l-4 4 1.4 1.4 3.6-3.6c1 .4 2.1.6 3.2.6 5.4 0 8.5-4.8 8.4-14.6h-4Z',
    title: 'Crop Disease Detection',
    desc: 'Upload a leaf image and let our AI identify common crop diseases and provide useful recommendations.',
    label: 'Detect Disease',
  },
  {
    cls: 'soil',
    iconPath: 'M4 18h16v2H4v-2Zm1-4c4.7-4.4 9.3-4.4 14 0v2H5v-2Zm3-7.5C8 4.6 9.6 3 11.5 3S15 4.6 15 6.5c0 1.1-.5 2.1-1.2 2.7 1.2.2 2.4.7 3.6 1.5l-1.1 1.7c-2.9-1.8-5.7-1.8-8.6 0l-1.1-1.7c1.1-.8 2.3-1.3 3.6-1.5A3.5 3.5 0 0 1 8 6.5Z',
    title: 'Crop Recommendation',
    desc: 'Get suitable crop recommendations based on soil and environmental conditions.',
    label: 'Find Suitable Crops',
  },
  {
    cls: 'analytics',
    iconPath: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
    title: 'Market Price & Risk Alert',
    desc: 'Analyze live APMC spot rates, 5-level market depth, regional mandi net proceeds, and algorithmic hold vs. sell risk alerts.',
    label: 'Track Market Prices',
  },
];

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section-heading reveal">
          <p className="eyebrow">Core AI tools</p>
          <h2>AI-Powered Agriculture</h2>
          <p>Practical machine learning features for crop health, field planning, and realtime market price risk intelligence.</p>
        </div>

        <div className="feature-grid">
          {featureCards.map((card, i) => (
            <article
              className="feature-card reveal"
              key={card.title}
              style={{ '--card-index': i }}
            >
              <div className={`feature-image ${card.cls}`} />
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d={card.iconPath} /></svg>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <Link to="/login?mode=register">{card.label} <span aria-hidden="true">-&gt;</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
