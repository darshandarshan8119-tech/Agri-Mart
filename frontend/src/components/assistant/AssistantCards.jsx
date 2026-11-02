// src/components/assistant/AssistantCards.jsx
// Visual interactive Flash Cards for Agri-MART AI Copilot

import React, { useState } from 'react';

export function CommodityPriceCard({ data }) {
  if (!data) return null;
  const isUp = data.isUp !== false;

  return (
    <div className="copilot-card card-price">
      <div className="copilot-card-badge">APMC MANDI SPOT BENCHMARK</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.commodity}</h4>
          <span className="copilot-subtext">📍 {data.mandi}</span>
        </div>
        <div className="copilot-price-box">
          <div className="copilot-price">₹{Number(data.currentPrice).toLocaleString()}</div>
          <span className={`copilot-trend ${isUp ? 'trend-up' : 'trend-down'}`}>
            {isUp ? '▲' : '▼'} {data.change}
          </span>
        </div>
      </div>

      <div className="copilot-grid-3">
        <div className="stat-pill">
          <small>Day High</small>
          <strong>₹{data.dayHigh}</strong>
        </div>
        <div className="stat-pill">
          <small>Day Low</small>
          <strong>₹{data.dayLow}</strong>
        </div>
        <div className="stat-pill">
          <small>MSP Benchmark</small>
          <strong>₹{data.agmarknetBenchmark}</strong>
        </div>
      </div>

      <div className="copilot-card-footer">
        <span>Moisture: <strong>{data.moisture || '11.2%'}</strong></span>
        <span>Volume: <strong>{data.volume || '4,250 Qtl'}</strong></span>
      </div>
    </div>
  );
}

export function ForecastRiskCard({ data }) {
  if (!data) return null;
  const isHold = data.action?.includes('HOLD');
  const isLiquidate = data.action?.includes('LIQUIDATE') || data.action?.includes('SELL');

  return (
    <div className="copilot-card card-forecast">
      <div className="copilot-card-badge badge-purple">AI PRICE TRAJECTORY &amp; RISK ENGINE</div>
      
      <div className={`risk-banner ${isLiquidate ? 'risk-banner-danger' : isHold ? 'risk-banner-safe' : 'risk-banner-warn'}`}>
        <div className="risk-banner-left">
          <span className="risk-action-badge">{data.action}</span>
          <span className="risk-rating-label">{data.riskLevel}</span>
        </div>
        <div className="risk-banner-right">
          <small>7-Day Target</small>
          <strong>₹{data.projectedPrice}/Qtl</strong>
        </div>
      </div>

      <p className="copilot-advice-text">{data.advice}</p>

      {data.forecastPoints && (
        <div className="copilot-spark-row">
          {data.forecastPoints.map((pt, i) => (
            <div key={i} className="spark-node">
              <span className="spark-day">{pt.day.replace('Day ', 'D')}</span>
              <span className="spark-val">₹{pt.price}</span>
            </div>
          ))}
        </div>
      )}

      <div className="copilot-card-footer">
        <span>Est. Range: <strong>₹{data.lowerRange} - ₹{data.upperRange}</strong></span>
        <span>Holding Cost: <strong>{data.storageCost}</strong></span>
      </div>
    </div>
  );
}

export function MandiComparisonCard({ data }) {
  if (!data || !data.mandis) return null;

  return (
    <div className="copilot-card card-comparison">
      <div className="copilot-card-badge badge-emerald">REGIONAL MANDI RADAR</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.commodity}</h4>
          <span className="copilot-subtext">Lot Size: {data.quantity} {data.unit}</span>
        </div>
      </div>

      <div className="copilot-mandi-list">
        {data.mandis.map((m, idx) => (
          <div key={idx} className={`copilot-mandi-item ${idx === 0 ? 'top-ranked' : ''}`}>
            <div className="mandi-item-top">
              <div className="mandi-title-wrap">
                {idx === 0 && <span className="best-tag">🏆 Best Net Proceeds</span>}
                <strong>{m.name}</strong>
                <small>{m.distanceKm} km transit • Quoted: ₹{m.quotedRate}/Qtl</small>
              </div>
              <div className="mandi-net-col">
                <small>Est. Net In-Hand</small>
                <strong className="net-val">₹{Number(m.netProceeds).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiquidityCard({ data }) {
  if (!data) return null;

  return (
    <div className="copilot-card card-depth">
      <div className="copilot-card-badge badge-blue">5-LEVEL APMC ORDER BOOK DEPTH</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.commodity}</h4>
          <span className="copilot-subtext">{data.mandi}</span>
        </div>
        <div className="copilot-spread-box">
          <small>Spread</small>
          <strong>₹{data.spread} ({data.spreadPct})</strong>
        </div>
      </div>

      <div className="depth-table-wrap">
        <div className="depth-side">
          <span className="side-label bid-label">Top Buyer Bids</span>
          {data.bids?.slice(0, 3).map((b, i) => (
            <div key={i} className="depth-row bid-row">
              <span>{b.qty} Qtl</span>
              <strong>₹{b.price}</strong>
            </div>
          ))}
        </div>
        <div className="depth-side">
          <span className="side-label ask-label">Lowest Seller Asks</span>
          {data.asks?.slice(0, 3).map((a, i) => (
            <div key={i} className="depth-row ask-row">
              <strong>₹{a.price}</strong>
              <span>{a.qty} Qtl</span>
            </div>
          ))}
        </div>
      </div>

      <div className="copilot-card-footer">
        <span>Imbalance: <strong>{data.imbalance}</strong></span>
        <span>Rating: <strong>{data.liquidityRating}</strong></span>
      </div>
    </div>
  );
}

export function BuyerCard({ data }) {
  if (!data || !data.buyers) return null;

  return (
    <div className="copilot-card card-buyers">
      <div className="copilot-card-badge badge-blue">VERIFIED INSTITUTIONAL APMC BUYERS</div>
      <div className="copilot-card-head">
        <h4>Procurement Matches: {data.commodity}</h4>
      </div>

      <div className="buyers-list">
        {data.buyers.slice(0, 2).map((b, idx) => (
          <div key={idx} className="buyer-item">
            <div className="buyer-head">
              <div>
                <strong>{b.name}</strong>
                <small>Lic: {b.apmcLicense} • Rating: ⭐ {b.rating}</small>
              </div>
              <div className="buyer-rate">
                <small>Offered Rate</small>
                <strong>₹{b.offeredRate}/Qtl</strong>
              </div>
            </div>
            <div className="buyer-sub">
              <span>Cap: {b.capacity}</span>
              <span className="escrow-pill">🛡️ Axis Escrow Protected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BookingCard({ data }) {
  const [confirmed, setConfirmed] = useState(false);
  const [passToken] = useState(() => `AGX-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!data) return null;

  return (
    <div className="copilot-card card-booking">
      <div className="copilot-card-badge badge-amber">APMC DELIVERY GATE RESERVATION</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.commodity}</h4>
          <span className="copilot-subtext">📍 {data.mandi}</span>
        </div>
      </div>

      <div className="booking-details-box">
        <div className="booking-row">
          <span>Gate Window:</span>
          <strong>{data.gate} ({data.timeSlot})</strong>
        </div>
        <div className="booking-row">
          <span>Assigned Load:</span>
          <strong>{data.quantity} • {data.vehicleAssigned}</strong>
        </div>
      </div>

      <div className="booking-action-box">
        {confirmed ? (
          <div className="booking-confirmed-tag">
            ✅ Slot Reserved! Token #{passToken} issued to APMC gate ledger.
          </div>
        ) : (
          <button 
            type="button" 
            className="btn-confirm-slot" 
            onClick={() => setConfirmed(true)}
          >
            Confirm &amp; Issue Gate Pass
          </button>
        )}
      </div>
    </div>
  );
}

export function DiseaseScanCard({ data }) {
  if (!data) return null;

  return (
    <div className="copilot-card card-disease">
      <div className="copilot-card-badge badge-red">AI LEAF DIAGNOSIS RESULT</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.crop} • {data.diseaseName}</h4>
          <span className="disease-conf-pill">Confidence: {data.confidence} • {data.severity}</span>
        </div>
      </div>

      <div className="copilot-treatment-box">
        <div className="treatment-block">
          <strong>🌿 Organic / Biological Remedy:</strong>
          <p>{data.organicCure}</p>
        </div>
        <div className="treatment-block">
          <strong>🧪 Recommended Chemical Spray:</strong>
          <p>{data.chemicalCure}</p>
        </div>
      </div>
    </div>
  );
}

export function CropRecommendationCard({ data }) {
  if (!data) return null;

  return (
    <div className="copilot-card card-recommendation">
      <div className="copilot-card-badge badge-emerald">AI SOIL &amp; CLIMATE MATCH</div>
      <div className="crop-rec-hero">
        <span className="crop-big-emoji">{data.topEmoji || '🌾'}</span>
        <div>
          <span className="top-choice-pill">#1 Prime Recommendation ({data.match} Match)</span>
          <h4>{data.topCrop}</h4>
          <small>{data.soilType} • {data.npk}</small>
        </div>
      </div>

      <p className="crop-desc-text">{data.desc}</p>

      <div className="copilot-card-footer">
        <span>Expected Yield: <strong>{data.expectedYield}</strong></span>
        <span>Alternative: <strong>{data.secondaryCrop}</strong></span>
      </div>
    </div>
  );
}

export function YieldPredictionCard({ data }) {
  if (!data) return null;

  return (
    <div className="copilot-card card-yield">
      <div className="copilot-card-badge badge-amber">HARVEST &amp; REVENUE ESTIMATE</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.crop}</h4>
          <span className="copilot-subtext">{data.acres} • {data.irrigation}</span>
        </div>
      </div>

      <div className="copilot-grid-2">
        <div className="yield-stat-box">
          <small>Projected Harvest</small>
          <strong>{data.totalHarvest}</strong>
          <span>({data.yieldPerAcre})</span>
        </div>
        <div className="yield-stat-box highlight-revenue">
          <small>Est. Gross Realization</small>
          <strong>{data.estimatedRevenue}</strong>
          <span>@ MSP {data.mspBenchmark}</span>
        </div>
      </div>
    </div>
  );
}

export function GrowthMonitoringCard({ data }) {
  if (!data) return null;

  return (
    <div className="copilot-card card-growth">
      <div className="copilot-card-badge badge-emerald">PHENOLOGY &amp; NDVI VIGOR</div>
      <div className="copilot-card-head">
        <div>
          <h4>{data.cropBatch}</h4>
          <span className="copilot-subtext">{data.currentStage}</span>
        </div>
        <div className="ndvi-score-pill">
          <small>NDVI</small>
          <strong>{data.ndviScore}</strong>
        </div>
      </div>

      <div className="growth-info-box">
        <div className="growth-item">
          <span>Vigor Rating:</span>
          <strong>{data.ndviStatus}</strong>
        </div>
        <div className="growth-item">
          <span>Irrigation:</span>
          <strong>{data.nextWatering}</strong>
        </div>
        <div className="growth-item">
          <span>Agronomic Task:</span>
          <strong>{data.nextAction}</strong>
        </div>
      </div>
    </div>
  );
}
