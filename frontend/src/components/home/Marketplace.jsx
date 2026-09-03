import { Link } from 'react-router-dom';

export default function Marketplace() {
  return (
    <section className="section marketplace" id="marketplace">
      <div className="container marketplace-grid">
        <div className="section-copy reveal">
          <p className="eyebrow">Marketplace preview</p>
          <h2>Everything You Need for Smarter Farming</h2>
          <p>
            Agri-MART will help users discover trusted agricultural products such as seeds, fertilizers,
            farming equipment, crop-care products, and other agricultural supplies.
          </p>
          <Link className="btn btn-primary" to="/login?mode=register">Explore Agri-MART</Link>
        </div>
        <div className="market-list reveal" aria-label="Marketplace categories">
          <div><span>01</span>Seeds</div>
          <div><span>02</span>Fertilizers</div>
          <div><span>03</span>Farming equipment</div>
          <div><span>04</span>Crop-care products</div>
          <div><span>05</span>Agricultural supplies</div>
        </div>
      </div>
    </section>
  );
}
