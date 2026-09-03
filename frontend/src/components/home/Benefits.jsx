const benefits = [
  { path: 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 5.8 3.2L12 10.7 6.2 7.5 12 4.3ZM5 9.2l6 3.3v6.9l-6-3.3V9.2Zm8 10.2v-6.9l6-3.3v6.9l-6 3.3Z', label: 'AI-powered agricultural insights' },
  { path: 'M4 5h16v11H4V5Zm2 2v7h12V7H6Zm3 12h6v2H9v-2Z', label: 'Easy-to-use interface' },
  { path: 'M5 20V4h2v14h13v2H5Zm4-4V9h3v7H9Zm5 0V6h3v10h-3Zm5 0v-5h3v5h-3Z', label: 'Data-driven decisions' },
  { path: 'M12 21c-4.4-1.8-7-5.2-7-9.6V5l7-3 7 3v6.4c0 4.4-2.6 7.8-7 9.6Zm0-2.2c3.1-1.5 5-4.1 5-7.4V6.3l-5-2.1-5 2.1v5.1c0 3.3 1.9 5.9 5 7.4Zm-1.1-4.1-2.8-2.8 1.4-1.4 1.4 1.4 3.8-3.8 1.4 1.4-5.2 5.2Z', label: 'Crop health monitoring' },
  { path: 'M4 19h16v2H4v-2Zm2-3c.5-4 2.4-7 6-9.1V3h2v3.9c3.6 2.1 5.5 5.1 6 9.1h-2c-.4-2.8-1.7-5-4-6.7V16h-2V9.3C9.7 11 8.4 13.2 8 16H6Z', label: 'Better crop planning' },
  { path: 'M4 17h4V7H4v10Zm6 0h4V3h-4v14Zm6 0h4v-7h-4v7ZM3 19h18v2H3v-2Z', label: 'Expected yield estimation' },
];

export default function Benefits() {
  return (
    <section className="section benefits">
      <div className="container">
        <div className="section-heading reveal">
          <p className="eyebrow">Why Agri-MART?</p>
          <h2>Designed for better farming outcomes.</h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((b) => (
            <div className="benefit reveal" key={b.label}>
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d={b.path} /></svg>
              </span>
              <p>{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
