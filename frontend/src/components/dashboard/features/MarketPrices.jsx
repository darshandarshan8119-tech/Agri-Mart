import { useState } from 'react';

const mandiData = [
  { commodity: '🌾 Wheat (Lokwan)', mandi: 'Kalyan APMC, Maharashtra', arrivals: '1,240', min: '2,280', max: '2,540', modal: '2,450', forecast: 'Bullish (+4%) 📈', forecastClass: 'bullish' },
  { commodity: '🌾 Paddy (Common)', mandi: 'Burdwan Mandi, West Bengal', arrivals: '3,100', min: '2,150', max: '2,380', modal: '2,290', forecast: 'Stable (±1%) ⚖️', forecastClass: 'stable' },
  { commodity: '🌽 Maize (Yellow)', mandi: 'Davanagere, Karnataka', arrivals: '890', min: '1,920', max: '2,210', modal: '2,100', forecast: 'Rising (+2.5%) 📈', forecastClass: 'bullish' },
  { commodity: '🌱 Soybean (Yellow)', mandi: 'Ujjain APMC, MP', arrivals: '2,450', min: '4,350', max: '4,780', modal: '4,620', forecast: 'Bearish (-2%) 📉', forecastClass: 'bearish' },
  { commodity: '🍅 Tomato', mandi: 'Kolar Market, Karnataka', arrivals: '4,600', min: '1,400', max: '1,950', modal: '1,780', forecast: 'High Demand (+8%) 📈', forecastClass: 'bullish' },
  { commodity: '🧅 Onion (Red)', mandi: 'Lasalgaon Mandi, Nashik', arrivals: '5,800', min: '1,650', max: '2,200', modal: '1,980', forecast: 'Stable (±1.2%) ⚖️', forecastClass: 'stable' },
  { commodity: '🥔 Potato (Jyoti)', mandi: 'Agra APMC, UP', arrivals: '6,200', min: '1,120', max: '1,480', modal: '1,350', forecast: 'Bullish (+3%) 📈', forecastClass: 'bullish' },
];

export default function MarketPrices() {
  const [search, setSearch] = useState('');

  const filteredData = mandiData.filter(
    (row) =>
      row.commodity.toLowerCase().includes(search.toLowerCase()) ||
      row.mandi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="section-market" className="dash-section active">
      <div className="section-card-header">
        <div className="header-icon-box">
          <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>
        </div>
        <div>
          <h2>Live Agricultural Commodity Market Prices</h2>
          <p>Real-time regional APMC Mandi rates &amp; 7-day AI price trend forecasts.</p>
        </div>
      </div>

      <div className="market-ticker-grid">
        {[
          { tag: 'Wheat (Sharbati)', price: '₹ 2,420', trend: '+3.8% ↑', trendClass: 'up', mandi: 'Indore APMC Mandi' },
          { tag: 'Paddy Rice (Basmati 1121)', price: '₹ 3,850', trend: '+1.5% ↑', trendClass: 'up', mandi: 'Karnal Grain Market' },
          { tag: 'Cotton (Medium Staple)', price: '₹ 7,120', trend: '-0.8% ↓', trendClass: 'down', mandi: 'Rajkot APMC' },
          { tag: 'Tomato (Hybrid)', price: '₹ 1,840', trend: '+6.2% ↑', trendClass: 'up', mandi: 'Nashik Vegetable Mandi' },
        ].map((t) => (
          <div className="market-ticker-card" key={t.tag}>
            <span className="crop-tag">{t.tag}</span>
            <div className="price-row">
              <strong className="price">{t.price}</strong>
              <span className={`trend ${t.trendClass}`}>{t.trend}</span>
            </div>
            <small className="mandi-loc">{t.mandi}</small>
          </div>
        ))}
      </div>

      <div className="dash-card table-card">
        <div className="table-header-filter">
          <h3>Regional Mandi Spot Rates &amp; AI 7-Day Forecast</h3>
          <div className="search-input-wrap">
            <input
              type="text"
              id="mandiSearch"
              placeholder="Filter crop or mandi name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="mandi-table" id="mandiTable">
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Mandi / Location</th>
                <th>Arrivals (Qtl)</th>
                <th>Min Price / Qtl</th>
                <th>Max Price / Qtl</th>
                <th>Modal Price</th>
                <th>7-Day AI Forecast</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.commodity}</strong></td>
                  <td>{row.mandi}</td>
                  <td>{row.arrivals}</td>
                  <td>₹ {row.min}</td>
                  <td>₹ {row.max}</td>
                  <td><strong className="price-highlight">₹ {row.modal}</strong></td>
                  <td><span className={`badge-forecast ${row.forecastClass}`}>{row.forecast}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
