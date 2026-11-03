import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="home">
      <div className="hero-media" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-tech" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <p className="eyebrow">{t('AI-powered farming intelligence')}</p>
          <h1>{t('Smart Farming. Better Decisions. Better Harvests.')}</h1>
          <p className="hero-text">
            {t('Agri-MART uses Artificial Intelligence and Machine Learning to help farmers understand crops, detect disease, choose suitable crops, and analyze market price risks with confidence.')}
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/login?mode=register">{t('Get Started')}</Link>
            <a className="btn btn-secondary" href="#features">{t('Explore Features')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
