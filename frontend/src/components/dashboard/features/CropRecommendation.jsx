import { useState } from 'react';
import { calculateCropRecommendation, soilPresets } from '../../../utils/cropRecommendation';
import { apiRequest } from '../../../utils/api';

const defaultInputs = { N: 90, P: 42, K: 43, ph: 6.5, rainfall: 202, temp: 26.5, humidity: 82 };

export default function CropRecommendation() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(() => calculateCropRecommendation(defaultInputs));
  const [loading, setLoading] = useState(false);
  const [apiSource, setApiSource] = useState('');

  const set = (field) => (e) => setInputs((prev) => ({ ...prev, [field]: parseFloat(e.target.value) }));

  const loadPreset = (type) => setInputs(soilPresets[type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send inputs to live Django REST endpoint
      const res = await apiRequest('/ai/crop-recommendation/', 'POST', inputs);
      setResults(res);
      setApiSource('Django Backend API (http://127.0.0.1:8000)');
    } catch {
      // Fallback if Django server is not active
      setResults(calculateCropRecommendation(inputs));
      setApiSource('Offline Recommendation Engine');
    } finally {
      setLoading(false);
    }
  };

  const CropCard = ({ rank, crop, top }) => (
    <div className={`rec-crop-card${top ? ' top-choice' : ''}`}>
      <div className="crop-header">
        <span className="crop-emoji">{crop.emoji}</span>
        <div>
          <div className="rec-rank">#{rank} {top ? 'Prime' : rank === 2 ? 'Secondary Alternative' : 'Tertiary Option'} ({crop.match} Match)</div>
          <h4>{crop.title}</h4>
        </div>
      </div>
      <p>{crop.desc}</p>
      {crop.yield && (
        <div className="crop-metrics">
          <div><strong>Expected Yield:</strong> {crop.yield}</div>
          <div><strong>Suitability:</strong> Certified for your climate zone</div>
        </div>
      )}
    </div>
  );

  return (
    <section id="section-recommendation" className="dash-section active">
      <div className="section-card-header">
        <div className="header-icon-box">
          <svg viewBox="0 0 24 24"><path d="M4 18h16v2H4v-2Zm1-4c4.7-4.4 9.3-4.4 14 0v2H5v-2Zm3-7.5C8 4.6 9.6 3 11.5 3S15 4.6 15 6.5c0 1.1-.5 2.1-1.2 2.7 1.2.2 2.4.7 3.6 1.5l-1.1 1.7c-2.9-1.8-5.7-1.8-8.6 0l-1.1-1.7c1.1-.8 2.3-1.3 3.6-1.5A3.5 3.5 0 0 1 8 6.5Z" /></svg>
        </div>
        <div>
          <h2>AI Soil &amp; Climate Crop Recommendation</h2>
          <p>AI crop matching based on soil chemistry and local climate parameters.</p>
        </div>
      </div>

      <div className="tool-split-grid">
        <div className="dash-card">
          <h3>Soil &amp; Climate Parameters</h3>
          <form id="formCropRec" onSubmit={handleSubmit}>
            <div className="form-row-3">
              {[['N','Nitrogen (N)','mg/kg',0,140],['P','Phosphorus (P)','mg/kg',0,145],['K','Potassium (K)','mg/kg',0,205]].map(([f,l,u,min,max])=>(
                <div className="form-group" key={f}>
                  <label htmlFor={`input${f}`}>{l} <small>{u}</small></label>
                  <input type="number" id={`input${f}`} value={inputs[f]} min={min} max={max} required onChange={set(f)} />
                </div>
              ))}
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="inputPh">Soil pH Level (0-14)</label>
                <input type="number" step="0.1" id="inputPh" value={inputs.ph} min="3.5" max="9.5" required onChange={set('ph')} />
              </div>
              <div className="form-group">
                <label htmlFor="inputRainfall">Annual Rainfall <small>mm</small></label>
                <input type="number" id="inputRainfall" value={inputs.rainfall} min="20" max="3000" required onChange={set('rainfall')} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="inputTemp">Temperature <small>°C</small></label>
                <input type="number" step="0.1" id="inputTemp" value={inputs.temp} min="5" max="50" required onChange={set('temp')} />
              </div>
              <div className="form-group">
                <label htmlFor="inputHumidity">Humidity <small>%</small></label>
                <input type="number" id="inputHumidity" value={inputs.humidity} min="10" max="100" required onChange={set('humidity')} />
              </div>
            </div>
            <div className="preset-links">
              <span>Quick Soil Presets:</span>
              {[['alluvial','Alluvial Soil (Rice/Wheat)'],['black','Black Soil (Cotton/Pulses)'],['red','Red Soil (Maize/Groundnut)']].map(([k,l])=>(
                <button type="button" key={k} onClick={() => loadPreset(k)} style={{ background:'none',border:'none',cursor:'pointer',textDecoration:'underline',color:'inherit' }}>{l}</button>
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              <span>{loading ? 'Executing ML Classification...' : 'Generate Crop Matches'}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg>
            </button>
          </form>
        </div>

        <div className="dash-card">
          <h3>Recommended Crops</h3>
          {apiSource && (
            <div style={{ fontSize: '0.76rem', color: '#1e7e34', fontWeight: 700, marginBottom: '12px' }}>
              ⚡ Model Executed via {apiSource}
            </div>
          )}
          <div id="recResults">
            <CropCard rank={1} crop={results.topCrop} top />
            <CropCard rank={2} crop={results.secondCrop} />
            <CropCard rank={3} crop={results.thirdCrop} />
          </div>
        </div>
      </div>
    </section>
  );
}
