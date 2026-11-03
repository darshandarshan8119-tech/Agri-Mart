import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navbar
    'Home': 'Home',
    'About': 'About',
    'AI Features': 'AI Features',
    'Marketplace': 'Marketplace',
    'Contact': 'Contact',
    'Sign In': 'Sign In',
    'Register': 'Register',
    'Sign Out': 'Sign Out',
    'Dashboard': 'Dashboard',

    // Hero
    'AI-powered farming intelligence': 'AI-powered farming intelligence',
    'Smart Farming. Better Decisions. Better Harvests.': 'Smart Farming. Better Decisions. Better Harvests.',
    'Agri-MART uses Artificial Intelligence and Machine Learning to help farmers understand crops, detect disease, choose suitable crops, and analyze market price risks with confidence.': 'Agri-MART uses Artificial Intelligence and Machine Learning to help farmers understand crops, detect disease, choose suitable crops, and analyze market price risks with confidence.',
    'Get Started': 'Get Started',
    'Explore Features': 'Explore Features',

    // Features
    'Crop Recommendation': 'Crop Recommendation',
    'Disease Detection': 'Disease Detection',
    'Market Price & Risk Alert': 'Market Price & Risk Alert',
    'Market Prices': 'Market Prices',
    'Soil Analysis': 'Soil Analysis',
    'Computer Vision': 'Computer Vision',
    'Price Risk Forecasting': 'Price Risk Forecasting',
    'Learn More': 'Learn More',

    // Footer & Common
    'Empowering Indian Agriculture with Artificial Intelligence': 'Empowering Indian Agriculture with Artificial Intelligence',
    'All rights reserved.': 'All rights reserved.',
    'Switch Language': 'Switch Language',
  },
  kn: {
    // Navbar
    'Home': 'ಮುಖಪುಟ',
    'About': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'AI Features': 'ಎಐ ವೈಶಿಷ್ಟ್ಯಗಳು',
    'Marketplace': 'ಮಾರುಕಟ್ಟೆ',
    'Contact': 'ಸಂಪರ್ಕಿಸಿ',
    'Sign In': 'ಲಾಗಿನ್ ಮಾಡಿ',
    'Register': 'ನೋಂದಾಯಿಸಿ',
    'Sign Out': 'ಸೈನ್ ಔಟ್',
    'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',

    // Hero
    'AI-powered farming intelligence': 'ಎಐ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಜ್ಞಾನ',
    'Smart Farming. Better Decisions. Better Harvests.': 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ. ಉತ್ತಮ ನಿರ್ಧಾರಗಳು. ಸಮೃದ್ಧ ಬೆಳೆ.',
    'Agri-MART uses Artificial Intelligence and Machine Learning to help farmers understand crops, detect disease, choose suitable crops, and analyze market price risks with confidence.': 'ಅಗ್ರಿ-ಮಾರ್ಟ್ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಯಂತ್ರ ಕಲಿಕೆಯನ್ನು ಬಳಸಿಕೊಂಡು ರೈತರಿಗೆ ಬೆಳೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ರೋಗಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು, ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಆರಿಸಲು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಅಪಾಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    'Get Started': 'ಪ್ರಾರಂಭಿಸಿ',
    'Explore Features': 'ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',

    // Features
    'Crop Recommendation': 'ಬೆಳೆ ಶಿಫಾರಸು',
    'Disease Detection': 'ರೋಗ ಪತ್ತೆ',
    'Market Price & Risk Alert': 'ಮಾರುಕಟ್ಟೆ ದರ ಮತ್ತು ಅಪಾಯದ ಎಚ್ಚರಿಕೆ',
    'Market Prices': 'ಮಾರುಕಟ್ಟೆ ದರಗಳು',
    'Soil Analysis': 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ',
    'Computer Vision': 'ಕಂಪ್ಯೂಟರ್ ದೃಷ್ಟಿ',
    'Price Risk Forecasting': 'ಬೆಲೆ ಅಪಾಯದ ಮುನ್ಸೂಚನೆ',
    'Learn More': 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',

    // Footer & Common
    'Empowering Indian Agriculture with Artificial Intelligence': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ಭಾರತೀಯ ಕೃಷಿಯನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು',
    'All rights reserved.': 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    'Switch Language': 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('agri_mart_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agri_mart_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
