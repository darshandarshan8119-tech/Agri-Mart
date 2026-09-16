import { useState, useRef } from 'react';
import { sampleDiseases } from '../../../utils/diseaseData';
import { apiRequest } from '../../../utils/api';

export default function DiseaseDetection() {
  const [currentSample, setCurrentSample] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewTag, setPreviewTag] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [apiSource, setApiSource] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef();

  const loadSample = (key) => {
    const s = sampleDiseases[key];
    setCurrentSample(s);
    setFileToUpload(null);
    setPreviewSrc(s.imgUrl);
    setPreviewTag(s.crop);
    setResult(null);
    setErrorMsg('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileToUpload(file);
    setCurrentSample(null); // Clear preset sample so it doesn't mask real model results
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewSrc(ev.target.result);
      setPreviewTag(file.name || 'Custom Uploaded Leaf');
      setResult(null);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const runScan = async () => {
    if (!previewSrc) {
      alert('Please upload an image or click one of the quick test sample buttons below!');
      return;
    }
    setScanning(true);
    setResult(null);
    setErrorMsg('');
    setApiSource('');

    try {
      // Attempt sending to live Django backend
      let res;
      if (fileToUpload) {
        const formData = new FormData();
        formData.append('image', fileToUpload);
        res = await apiRequest('/ai/disease-scan/', 'POST', formData, true);
      } else if (currentSample) {
        res = await apiRequest('/ai/disease-scan/', 'POST', { sample_key: currentSample });
      }

      if (res && res.error) {
        throw new Error(res.error);
      }

      setResult({
        crop: res.crop,
        disease: res.disease,
        confidence: res.confidence,
        barWidth: res.bar_width || res.confidence,
        symptoms: res.symptoms,
        treatments: res.treatments || [],
        severity: res.severity,
        organicAlt: res.organic_alt
      });
      setApiSource('Django Backend AI Engine (plant_disease_model.keras)');
    } catch (err) {
      console.error('Scan error:', err);
      if (fileToUpload) {
        setErrorMsg('Unable to reach Django backend (http://127.0.0.1:8000). Please verify that the backend server is running: python manage.py runserver');
      } else if (currentSample) {
        // Fallback only for preset samples if backend is offline
        setResult(currentSample);
        setApiSource('Offline Sample Preview (Backend not reachable)');
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <section id="section-disease" className="dash-section active">
      <div className="section-card-header">
        <div className="header-icon-box">
          <svg viewBox="0 0 24 24"><path d="M19.5 4.5C10 4.6 5 9.4 5 16.7c0 1.1.2 2.1.6 3l3.2-3.2c.9-5.3 5.1-7.3 8.8-8.2-3.2 1.9-5.6 4.8-6.7 8.4l-4 4 1.4 1.4 3.6-3.6c1 .4 2.1.6 3.2.6 5.4 0 8.5-4.8 8.4-14.6h-4Z" /></svg>
        </div>
        <div>
          <h2>AI Crop Disease Detection &amp; Diagnosis</h2>
          <p>AI-powered leaf scan for instant disease diagnosis and corrective remedies.</p>
        </div>
      </div>

      <div className="tool-split-grid">
        <div className="dash-card">
          <h3>Upload Leaf Image</h3>
          <p className="tool-subtext">Supports PNG, JPG, WEBP. Ensure the affected foliage is centered under good lighting.</p>

          <div className="drop-zone" id="diseaseDropZone" onClick={() => fileInputRef.current?.click()}>
            <input type="file" ref={fileInputRef} accept="image/*" className="file-input-hidden" onChange={handleFileUpload} />
            {!previewSrc ? (
              <div className="drop-zone-content" id="dropZonePrompt">
                <div className="drop-icon">📸</div>
                <strong>Click to upload or drag &amp; drop crop image</strong>
                <span>Supports Tomato, Potato, Corn, Wheat, Cotton, Rice, Pepper</span>
              </div>
            ) : (
              <div className="image-preview-box" id="imagePreviewBox">
                <img id="previewImg" src={previewSrc} alt="Crop Leaf Scan" />
                {scanning && <div className="scan-laser-line scanning" id="scanLaser" />}
                <div className="preview-overlay-tag" id="previewTag">🌿 {previewTag}</div>
              </div>
            )}
          </div>

          <div className="sample-preset-row">
            <span>Quick Test Samples:</span>
            <button type="button" className="btn-sample" onClick={() => loadSample('tomato_early_blight')}>🍅 Tomato Early Blight</button>
            <button type="button" className="btn-sample" onClick={() => loadSample('corn_rust')}>🌽 Corn Rust</button>
            <button type="button" className="btn-sample" onClick={() => loadSample('healthy_rice')}>🌾 Healthy Rice</button>
          </div>

          <button type="button" className="btn btn-primary btn-full" id="btnRunDiagnosis" onClick={runScan} disabled={scanning}>
            <span>{scanning ? 'Connecting to Django AI Engine...' : 'Run AI Diagnostic Scan'}</span>
            {!scanning && (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            )}
          </button>
        </div>

        <div className="dash-card" id="diseaseResultCard">
          <h3>Diagnostic Results &amp; Treatment Plan</h3>
          {errorMsg ? (
            <div className="empty-state" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <div className="empty-icon" style={{ color: '#ef4444' }}>⚠️</div>
              <p style={{ color: '#ef4444', fontWeight: 600 }}>Backend Connection Required</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>{errorMsg}</p>
            </div>
          ) : !result ? (
            <div id="diseaseResultPlaceholder" className="empty-state">
              <div className="empty-icon">🔬</div>
              <p>Upload an image or pick a test sample, then press <strong>"Run AI Diagnostic Scan"</strong> to analyze.</p>
            </div>
          ) : (
            <div id="diseaseResultContent" className="disease-analysis-result">
              <div className="diagnosis-header-badge" id="diagStatusBadge">
                <span className="status-indicator" />
                <span id="diagCropName">{result.crop}</span>
              </div>
              {apiSource && (
                <div style={{ fontSize: '0.76rem', color: '#1e7e34', fontWeight: 700, marginBottom: '10px' }}>
                  ⚡ Model Executed via {apiSource}
                </div>
              )}
              <div className="confidence-box">
                <div className="conf-top">
                  <span className="conf-title" id="diagDiseaseName">{result.disease}</span>
                  <span className="conf-percent" id="diagConfidence">{result.confidence} Confidence</span>
                </div>
                <div className="conf-bar-track">
                  <div className="conf-bar-fill" id="diagBarFill" style={{ width: result.barWidth }} />
                </div>
              </div>
              <div className="analysis-section">
                <h4>Symptom Analysis:</h4>
                <p id="diagSymptoms">{result.symptoms}</p>
              </div>
              <div className="analysis-section">
                <h4>Recommended Immediate Action:</h4>
                <ul className="treatment-list" id="diagTreatmentList">
                  {result.treatments.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div className="badge-tag-row">
                <span className="badge-tag">Severity: {result.severity || 'Moderate'}</span>
                <span className="badge-tag">Organic Alternative: {result.organicAlt || 'Neem Oil (3%)'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
