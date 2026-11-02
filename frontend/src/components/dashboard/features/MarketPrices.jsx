// src/components/dashboard/features/MarketPrices.jsx
// Agri-MART Market Price Analysis & Risk Alert Terminal
// Comprehensive manual analysis for educated farmers & data-driven producers

import { useState, useEffect } from 'react';
import { 
  COMMODITIES_DATA, 
  VERIFIED_BUYERS, 
  LIVE_GATE_ARRIVALS, 
  compareRegionalMandis, 
  computeRiskAdvisory 
} from '../../../utils/marketData';
import './MarketPrices.css';

export default function MarketPrices() {
  const [selectedId, setSelectedId] = useState(COMMODITIES_DATA[0].id);
  const [timeframe, setTimeframe] = useState('1W');
  const [lotQuantity, setLotQuantity] = useState(100);
  const [farmerMoisture, setFarmerMoisture] = useState(11.2);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const selectedCommodity = COMMODITIES_DATA.find((c) => c.id === selectedId) || COMMODITIES_DATA[0];

  const handleSelectCommodity = (id) => {
    setSelectedId(id);
    const comm = COMMODITIES_DATA.find((c) => c.id === id);
    if (comm) {
      setFarmerMoisture(parseFloat(comm.moisture) || 11.0);
    }
  };

  // Listen for copilot navigation events
  useEffect(() => {
    const handleNavigate = (e) => {
      const payload = e.detail?.payload;
      if (payload?.commodityId) {
        handleSelectCommodity(payload.commodityId);
      }
    };
    window.addEventListener('agrimart:feature-navigate', handleNavigate);
    return () => window.removeEventListener('agrimart:feature-navigate', handleNavigate);
  }, []);

  // Compute live risk advisory
  const riskAdvisory = computeRiskAdvisory(selectedCommodity, 7);

  // Compare regional mandis by net in-hand proceeds
  const rankedMandis = compareRegionalMandis(selectedCommodity, lotQuantity, farmerMoisture);

  // SVG Chart Calculations
  const historySeries = selectedCommodity.priceHistory[timeframe] || selectedCommodity.priceHistory['1W'];
  const minVal = Math.min(...historySeries) * 0.985;
  const maxVal = Math.max(...historySeries) * 1.015;
  const range = maxVal - minVal || 1;

  const chartWidth = 600;
  const chartHeight = 180;
  const paddingX = 30;
  const paddingY = 20;

  const points = historySeries.map((val, idx) => {
    const x = paddingX + (idx / (historySeries.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);
    return { x, y, val, label: `${timeframe} Point ${idx + 1}` };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaStr = `${points[0].x},${chartHeight - paddingY} ${polylineStr} ${points[points.length - 1].x},${chartHeight - paddingY}`;

  // Forecast extension line (last point to target point)
  const lastPoint = points[points.length - 1];
  const targetY = chartHeight - paddingY - ((selectedCommodity.projected7Day - minVal) / range) * (chartHeight - paddingY * 2);
  const forecastX = chartWidth - 10;

  return (
    <section id="section-market" className="dash-section active">
      {/* SECTION HEADER */}
      <div className="section-card-header">
        <div className="header-icon-box">
          <svg viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
        </div>
        <div>
          <h2>Market Price Analysis &amp; Risk Alert Terminal</h2>
          <p>Real-time APMC electronic price discovery, 5-level market depth, and algorithmic hold/sell risk advisory.</p>
        </div>
      </div>

      <div className="market-terminal-wrapper">
        {/* COMMODITY SELECTOR STRIP */}
        <div className="commodity-selector-strip" role="tablist">
          {COMMODITIES_DATA.map((c) => {
            const isSelected = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                className={`commodity-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectCommodity(c.id)}
              >
                <span className="chip-name">{c.name}</span>
                <div className="chip-price-row">
                  <span className="chip-price">₹{c.price.toLocaleString()}</span>
                  <span className={`chip-trend ${c.isUp ? 'up' : 'down'}`}>
                    {c.isUp ? '▲' : '▼'} {c.change}
                  </span>
                </div>
                <span className="chip-mandi">{c.mandi}</span>
              </button>
            );
          })}
        </div>

        {/* SPOTLIGHT & RISK ALERT SECTION */}
        <div className="spotlight-risk-grid">
          {/* LEFT: COMMODITY SPOTLIGHT */}
          <div className="dash-card spotlight-card">
            <div>
              <div className="spotlight-header">
                <div className="spotlight-title">
                  <h3>{selectedCommodity.name}</h3>
                  <div className="spotlight-mandi-badge">
                    <span>📍 {selectedCommodity.mandi}</span>
                    <span>• {selectedCommodity.grade}</span>
                  </div>
                </div>

                <div className="spotlight-price-hero">
                  <div className="hero-price">₹{selectedCommodity.price.toLocaleString()}</div>
                  <span className="hero-unit">per Quintal</span>
                  <span className={`hero-trend ${selectedCommodity.isUp ? 'up' : 'down'}`}>
                    {selectedCommodity.isUp ? '▲ Bullish' : '▼ Bearish'} ({selectedCommodity.change} today)
                  </span>
                </div>
              </div>

              <div className="spotlight-kpi-row">
                <div className="kpi-box">
                  <small>Day High</small>
                  <strong>₹{selectedCommodity.dayHigh}</strong>
                </div>
                <div className="kpi-box">
                  <small>Day Low</small>
                  <strong>₹{selectedCommodity.dayLow}</strong>
                </div>
                <div className="kpi-box">
                  <small>MSP Benchmark</small>
                  <strong className="msp-gap">₹{selectedCommodity.agmarknetBenchmark}</strong>
                </div>
                <div className="kpi-box">
                  <small>Basis Moisture</small>
                  <strong>{selectedCommodity.moisture}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: AI RISK ALERT & HOLD VS LIQUIDATE ADVISORY */}
          <div className={`dash-card risk-engine-card ${riskAdvisory?.badgeClass?.replace('badge-', '') || 'safe'}`}>
            <div>
              <div className={`risk-status-strip ${riskAdvisory?.badgeClass?.replace('badge-', '') || 'safe'}`}>
                <div>
                  <span className="risk-action-heading">{riskAdvisory?.action}</span>
                  <span className="risk-sub-label">{riskAdvisory?.riskLevel}</span>
                </div>
                <div className="text-right">
                  <span className="target-num">₹{riskAdvisory?.targetPrice}/Qtl</span>
                  <small>7-Day Horizon</small>
                </div>
              </div>

              <p className="risk-narrative">{riskAdvisory?.advice}</p>
            </div>

            <div className="storage-cost-calc">
              <span>Warehouse Holding Cost:</span>
              <strong>₹{riskAdvisory?.holdingCostPerQtl}/Qtl (7 Days @ ₹18/mo)</strong>
            </div>
          </div>
        </div>

        {/* CHART & 5-LEVEL DEPTH SECTION */}
        <div className="chart-depth-grid">
          {/* INTERACTIVE PRICE TREND CHART */}
          <div className="dash-card">
            <div className="chart-card-header">
              <h3>Price Trajectory &amp; 7-Day Forecast</h3>
              <div className="timeframe-toggles">
                {['1D', '1W', '1M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={`btn-timeframe ${timeframe === tf ? 'active' : ''}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-container-svg">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="rgba(6,78,59,0.08)" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="rgba(6,78,59,0.08)" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(6,78,59,0.08)" strokeDasharray="3 3" />

                {/* Area under historical price */}
                <polygon points={areaStr} fill="url(#chartGradient)" />

                {/* Historical Price Line */}
                <polyline
                  fill="none"
                  stroke="#047857"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylineStr}
                />

                {/* 7-Day Projected Forecast Dotted Line */}
                <line
                  x1={lastPoint.x}
                  y1={lastPoint.y}
                  x2={forecastX}
                  y2={targetY}
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Forecast End Target Circle */}
                <circle cx={forecastX} cy={targetY} r="4" fill="#8b5cf6" />

                {/* Historical Point Circles */}
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.idx === idx ? 6 : 3.5}
                    fill={hoveredPoint?.idx === idx ? '#064e3b' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer', transition: 'r 150ms ease' }}
                    onMouseEnter={() => setHoveredPoint({ ...p, idx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {hoveredPoint && (
                <div
                  style={{
                    position: 'absolute',
                    top: Math.max(hoveredPoint.y - 38, 5),
                    left: Math.min(Math.max(hoveredPoint.x - 45, 10), chartWidth - 100),
                    background: '#022c22',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  ₹{hoveredPoint.val}
                </div>
              )}
            </div>

            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color-dot historical" />
                <span>Historical APMC Settlement</span>
              </span>
              <span className="legend-item">
                <span className="legend-color-dot forecast" />
                <span>7-Day AI Projected Target (₹{selectedCommodity.projected7Day})</span>
              </span>
            </div>
          </div>

          {/* 5-LEVEL ORDER BOOK MARKET DEPTH */}
          <div className="dash-card">
            <div className="depth-header-strip">
              <h3>5-Level Electronic Market Depth</h3>
              <div className="spread-badge-box">
                Spread: <strong>₹{selectedCommodity.depth.spread} ({selectedCommodity.depth.spreadPct})</strong>
              </div>
            </div>

            <div className="depth-ladder-container">
              {/* BUYER BIDS */}
              <div>
                <div className="ladder-col-header bids">
                  <span>Bid Qty</span>
                  <span>Buy Price</span>
                </div>
                {selectedCommodity.depth.bids.map((b, i) => (
                  <div key={i} className="ladder-row bid-item">
                    <span>{b.qty} Qtl</span>
                    <strong>₹{b.price}</strong>
                  </div>
                ))}
              </div>

              {/* SELLER ASKS */}
              <div>
                <div className="ladder-col-header asks">
                  <span>Sell Price</span>
                  <span>Ask Qty</span>
                </div>
                {selectedCommodity.depth.asks.map((a, i) => (
                  <div key={i} className="ladder-row ask-item">
                    <strong>₹{a.price}</strong>
                    <span>{a.qty} Qtl</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="depth-footer-stat">
              <span>Order Imbalance: <strong>{selectedCommodity.depth.imbalance}</strong></span>
              <span>Liquidity: <strong>{selectedCommodity.depth.liquidityRating}</strong></span>
            </div>
          </div>
        </div>

        {/* REGIONAL MANDI COMPARISON & NET IN-HAND PROCEEDS RADAR */}
        <div className="dash-card mandi-radar-card">
          <div className="radar-controls-row">
            <div>
              <h3>Regional Mandi Net In-Hand Proceeds Radar</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
                Ranks regional APMCs by net take-home realization after freight (@ ₹18/Qtl/100km), 1.5% APMC cess, 0.5% escrow guarantee, and moisture discounts.
              </p>
            </div>

            <div className="radar-inputs-group">
              <label className="control-input-pill">
                <span>Lot Size:</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={lotQuantity}
                  onChange={(e) => setLotQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                />
                <span>Quintals</span>
              </label>

              <label className="control-input-pill">
                <span>Moisture:</span>
                <input
                  type="number"
                  min="5"
                  max="25"
                  step="0.1"
                  value={farmerMoisture}
                  onChange={(e) => setFarmerMoisture(parseFloat(e.target.value) || 11.0)}
                />
                <span>%</span>
              </label>
            </div>
          </div>

          <div className="radar-table-scroll">
            <table className="clean-radar-table">
              <thead>
                <tr>
                  <th>Mandi / APMC Location</th>
                  <th>Distance</th>
                  <th>Quoted Rate</th>
                  <th>Est. Freight</th>
                  <th>APMC Cess (1.5%)</th>
                  <th>Moisture Penalty</th>
                  <th>Est. Net In-Hand</th>
                  <th>Effective Rate</th>
                </tr>
              </thead>
              <tbody>
                {rankedMandis.map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={idx} className={isTop ? 'top-mandi-row' : ''}>
                      <td>
                        <strong>{m.name}</strong>
                        {isTop && <span className="best-net-badge">🏆 #1 Best Proceeds</span>}
                      </td>
                      <td>{m.distanceKm} km</td>
                      <td>₹{m.quotedRate.toLocaleString()}/Qtl</td>
                      <td>-₹{m.financials.freight.toLocaleString()}</td>
                      <td>-₹{m.financials.mandiCess.toLocaleString()}</td>
                      <td>
                        {m.financials.moisturePenalty > 0 ? (
                          <span style={{ color: '#dc2626' }}>-₹{m.financials.moisturePenalty.toLocaleString()}</span>
                        ) : (
                          '₹0'
                        )}
                      </td>
                      <td>
                        <strong className="net-proceeds-highlight">
                          ₹{m.financials.netProceeds.toLocaleString()}
                        </strong>
                      </td>
                      <td>₹{m.financials.effectivePricePerQtl.toLocaleString()}/Qtl</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* VERIFIED INSTITUTIONAL BUYERS & LIVE WEIGHBRIDGE QUEUE */}
        <div className="buyers-arrivals-grid">
          {/* VERIFIED BUYERS */}
          <div className="dash-card">
            <h3 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 800 }}>
              Verified Institutional APMC Buyers
            </h3>
            <div className="buyers-stack">
              {VERIFIED_BUYERS.map((b) => {
                const offeredPrice = selectedCommodity.price + b.offeredRateOffset;
                return (
                  <div key={b.id} className="buyer-card-row">
                    <div className="buyer-row-left">
                      <strong>{b.name}</strong>
                      <small>Lic: {b.apmcLicense} • Rating: ⭐ {b.rating} • Cap: {b.capacity}</small>
                      <div style={{ marginTop: '4px' }}>
                        <span className="escrow-verified-tag">🛡️ {b.settlementTimeline}</span>
                      </div>
                    </div>
                    <div className="buyer-row-right">
                      <span className="buyer-row-rate">₹{offeredPrice.toLocaleString()}/Qtl</span>
                      <small style={{ color: 'var(--green-700)', fontWeight: 700 }}>+₹{b.offeredRateOffset} premium</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ARRIVALS & WEIGHBRIDGE QUEUE */}
          <div className="dash-card">
            <h3 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 800 }}>
              Live Gate Arrivals &amp; Weighbridge Transit
            </h3>
            <div className="arrivals-list">
              {LIVE_GATE_ARRIVALS.map((arr) => (
                <div key={arr.id} className="arrival-item-box">
                  <div className="arrival-top-row">
                    <div>
                      <strong>{arr.mandi}</strong>
                      <small style={{ display: 'block', color: 'var(--muted)', marginTop: '2px' }}>
                        Commodity: {arr.crop}
                      </small>
                    </div>
                    <span className="gate-status-pill">{arr.gateStatus}</span>
                  </div>

                  <div className="arrival-stats-row">
                    <span>Today's Inflow: <strong>{arr.todayArrival}</strong></span>
                    <span>Vehicles: <strong>{arr.vehicleCount}</strong></span>
                    <span>Scale Wait: <strong>~{arr.weighbridgeWaitMinutes} mins</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
