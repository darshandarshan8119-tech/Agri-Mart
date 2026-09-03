import { useState, useEffect } from 'react';
import { calculateYield } from '../../../utils/yieldCalculator';

const defaultForm = { crop: 'rice', acres: 5, season: 'kharif', irrigation: 'drip', fertilizer: 'balanced' };

export default function YieldPrediction() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(() => calculateYield(defaultForm));

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    setResult(calculateYield(form));
  }, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(calculateYield(form));
  };

  return (
    <section id="section-yield" className="dash-section active">
      <div className="section-card-header">
        <div className="header-icon-box">
          <svg viewBox="0 0 24 24"><path d="M5 20V4h2v14h13v2H5Zm4-4V9h3v7H9Zm5 0V6h3v10h-3Zm5 0v-5h3v5h-3Z" /></svg>
        </div>
        <div>
          <h2>AI Agricultural Yield Estimator</h2>
          <p>Forecast expected harvest tonnage and estimated gross revenue.</p>
        </div>
      </div>

      <div className="tool-split-grid">
        <div className="dash-card">
          <h3>Farm Specifications</h3>
          <form id="formYield" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="yieldCropSelect">Select Crop</label>
              <div className="input-wrap select-wrap">
                <select id="yieldCropSelect" required value={form.crop} onChange={set('crop')}>
                  <option value="wheat">Wheat (Grain)</option>
                  <option value="rice">Rice (Paddy)</option>
                  <option value="cotton">Cotton (Lint)</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="tomato">Tomato (Vegetable)</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="yieldLandSize">Farm Land Area <small>(Acres)</small></label>
                <input type="number" id="yieldLandSize" value={form.acres} min="0.5" step="0.5" required onChange={set('acres')} />
              </div>
              <div className="form-group">
                <label htmlFor="yieldSeason">Farming Season</label>
                <div className="input-wrap select-wrap">
                  <select id="yieldSeason" value={form.season} onChange={set('season')}>
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="yieldIrrigation">Irrigation Type</label>
                <div className="input-wrap select-wrap">
                  <select id="yieldIrrigation" value={form.irrigation} onChange={set('irrigation')}>
                    <option value="drip">Drip Irrigation (High Efficiency)</option>
                    <option value="sprinkler">Sprinkler System</option>
                    <option value="canal">Canal / Flood Water</option>
                    <option value="rainfed">Rainfed Only</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="yieldFertilizer">Fertilizer Regimen</label>
                <div className="input-wrap select-wrap">
                  <select id="yieldFertilizer" value={form.fertilizer} onChange={set('fertilizer')}>
                    <option value="balanced">Balanced NPK + Bio-Organic</option>
                    <option value="chemical">Conventional Chemical Only</option>
                    <option value="pure_organic">100% Certified Organic</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              <span>Calculate Yield Forecast</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" /></svg>
            </button>
          </form>
        </div>

        <div className="dash-card">
          <h3>Yield &amp; Revenue Projection</h3>
          <div className="yield-summary-cards">
            <div className="yield-stat-box primary">
              <span className="stat-label">Expected Total Production</span>
              <strong className="stat-val" id="resTotalYield">{result.totalTonnes} Tonnes</strong>
              <span className="stat-sub" id="resYieldPerAcre">~{result.yieldPerAcre} Tonnes / Acre</span>
            </div>
            <div className="yield-stat-box secondary">
              <span className="stat-label">Estimated Gross Revenue</span>
              <strong className="stat-val" id="resEstRevenue">₹ {result.grossRevenue}</strong>
              <span className="stat-sub">Based on ₹{result.mspPerQtl}/quintal MSP</span>
            </div>
          </div>
          <div className="yield-insights-box">
            <h4>AI Production Insights:</h4>
            <ul className="clean-bullet-list" id="yieldInsightsList">
              <li>✅ Drip irrigation optimization boosts estimated output by <strong>+18%</strong> vs flood methods.</li>
              <li>✅ Soil nitrogen profile supports top 10th percentile harvest benchmarks.</li>
              <li>💡 Split fertilizer dosage into 3 intervals to minimize nitrogen leeching.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
