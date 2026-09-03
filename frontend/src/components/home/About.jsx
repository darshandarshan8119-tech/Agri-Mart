export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container split">
        <div className="section-copy reveal">
          <p className="eyebrow">About Agri-MART</p>
          <h2>One platform for clearer agricultural decisions.</h2>
          <p>
            Agri-MART is an AI-powered agricultural platform designed to help farmers understand their crops,
            detect diseases, choose suitable crops, estimate yields, and monitor plant growth.
          </p>
          <p>
            The experience is simple by design: provide crop images or field information, then receive practical
            insights that support healthier crops and better planning.
          </p>
        </div>
        <div className="about-panel reveal">
          <div className="panel-image" />
          <div className="panel-note">
            <span>Field-ready intelligence</span>
            <strong>Built for farmers, students, and agricultural teams.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
