import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import DiseaseDetection from '../components/dashboard/features/DiseaseDetection';
import CropRecommendation from '../components/dashboard/features/CropRecommendation';
import YieldPrediction from '../components/dashboard/features/YieldPrediction';
import GrowthMonitoring from '../components/dashboard/features/GrowthMonitoring';
import MarketPrices from '../components/dashboard/features/MarketPrices';

export default function DashboardPage() {
  const location = useLocation();
  const [activeFeature, setActiveFeature] = useState('disease');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const validTabs = ['disease', 'recommendation', 'yield', 'growth', 'market'];
    if (validTabs.includes(hash)) {
      setActiveFeature(hash);
    }
  }, [location]);

  const handleFeatureChange = (featureKey) => {
    setActiveFeature(featureKey);
    setSidebarOpen(false);
    window.history.replaceState(null, null, `#${featureKey}`);
  };

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
