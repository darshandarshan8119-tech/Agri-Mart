import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import DiseaseDetection from '../components/dashboard/features/DiseaseDetection';
import CropRecommendation from '../components/dashboard/features/CropRecommendation';
import YieldPrediction from '../components/dashboard/features/YieldPrediction';
import GrowthMonitoring from '../components/dashboard/features/GrowthMonitoring';
import MarketPrices from '../components/dashboard/features/MarketPrices';

const VALID_TABS = ['disease', 'recommendation', 'yield', 'growth', 'market'];

export default function DashboardPage() {
  const location = useLocation();
  const [activeFeature, setActiveFeature] = useState('disease');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFeatureChange = useCallback((featureKey) => {
    setActiveFeature(featureKey);
    setSidebarOpen(false);
    window.history.replaceState(null, null, `#${featureKey}`);
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (VALID_TABS.includes(hash)) {
      setActiveFeature(hash);
    }
  }, [location]);

  useEffect(() => {
    const handleNavigate = (e) => {
      const feat = e.detail?.feature;
      if (feat && VALID_TABS.includes(feat)) {
        handleFeatureChange(feat);
      }
    };
    window.addEventListener('agrimart:feature-navigate', handleNavigate);
    return () => window.removeEventListener('agrimart:feature-navigate', handleNavigate);
  }, [handleFeatureChange]);

  return (
    <div className="dash-v2-body">
      <div className="dash-v2-container">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeFeature={activeFeature}
          onFeatureChange={handleFeatureChange}
        />

        <div
          className={`sidebar-backdrop${sidebarOpen ? ' active' : ''}`}
          id="sidebarBackdrop"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="dash-workspace-panel">
          <Topbar activeFeature={activeFeature} onMenuOpen={() => setSidebarOpen((prev) => !prev)} />

          <main className="dash-view-content">
            {activeFeature === 'disease' && <DiseaseDetection />}
            {activeFeature === 'recommendation' && <CropRecommendation />}
            {activeFeature === 'yield' && <YieldPrediction />}
            {activeFeature === 'growth' && <GrowthMonitoring />}
            {activeFeature === 'market' && <MarketPrices />}
          </main>
        </div>
      </div>
    </div>
  );
}
