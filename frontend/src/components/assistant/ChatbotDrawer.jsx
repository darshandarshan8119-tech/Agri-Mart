// src/components/assistant/ChatbotDrawer.jsx
// Always-available Floating AI Copilot for Agri-MART
// Serves every project feature with plain-language guidance & direct-linked Flash Cards

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { processFarmerQuery } from '../../utils/aiCopilotService';
import {
  CommodityPriceCard,
  ForecastRiskCard,
  MandiComparisonCard,
  LiquidityCard,
  BuyerCard,
  BookingCard,
  DiseaseScanCard,
  CropRecommendationCard,
  YieldPredictionCard,
  GrowthMonitoringCard
} from './AssistantCards';
import './ChatbotDrawer.css';

const QUICK_PROMPTS = [
  { label: '🌾 Wheat Price & Risk', query: 'What is the modal price and 7-day risk alert for Wheat?' },
  { label: '⚖️ Best Mandi for 100 Qtl', query: 'Which mandi gives the highest net proceeds for 100 quintals?' },
  { label: '📊 5-Level Market Depth', query: 'Show 5-level order book depth and spread for Mustard' },
  { label: '🔬 Check Leaf Disease', query: 'How to diagnose and cure leaf blight disease?' },
  { label: '🌱 Recommend Crop for Soil', query: 'What is the best crop for alluvial soil with high nitrogen?' },
  { label: '🚜 Estimate Yield', query: 'Estimate harvest yield and gross revenue for 5 acres of wheat' },
  { label: '📅 Book Delivery Gate', query: 'Book a weighbridge arrival slot at Ludhiana APMC' }
];

export default function ChatbotDrawer({ onNavigateFeature }) {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [listening, setListening] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      time: 'Just now',
      text: `Namaste ${user?.fullname || 'Kisan Bandhu'}! I am your **Agri-AI Market & Farming Copilot**.\n\nWhether you need help with **mandi market prices**, **hold vs. sell risk alerts**, **leaf disease scanning**, or **soil crop recommendations**, ask me anything or tap a shortcut below!`,
      cardType: null,
      cardData: null,
      actions: [
        { label: '📈 Check Market Price & Risk', feature: 'market' },
        { label: '📷 Scan Leaf Disease', feature: 'disease' }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText = null) => {
    const textToSend = queryText || inputVal;
    if ((!textToSend.trim() && !image) || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend || `📷 ${image.name}`
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setLoading(true);

    try {
      // Use the built-in local AI engine — no API key required.
      // It covers all 10 Agri-MART features: market, disease, recommendation,
      // yield, growth, comparison, forecast/risk, depth, buyers, and booking.
      const response = await processFarmerQuery(textToSend, {
        name: user?.fullname,
        language
      });

      const assistantMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.content,
        cardType: response.cardType,
        cardData: response.cardData,
        actions: response.actions || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setImage(null);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          time: 'Just now',
          text: `Sorry, I ran into an issue. Please try again or use the feature buttons above.`,
          cardType: null,
          cardData: null,
          actions: [{ label: '🌾 View Market Prices', feature: 'market' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, { id: `asst-${Date.now()}`, sender: 'assistant', time: 'Just now', text: 'Voice input is not available in this browser. You can type or use Chrome/Edge on Android.', actions: [] }]);
      return;
    }
    recognitionRef.current?.stop();
    const recognition = new SpeechRecognition();
    recognition.lang = { kn: 'kn-IN', hi: 'hi-IN', en: 'en-IN' }[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => setInputVal(event.results[0][0].transcript);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = { kn: 'kn-IN', hi: 'hi-IN', en: 'en-IN' }[language] || 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleActionClick = (action) => {
    if (!action || !action.feature) return;

    if (action.feature === 'confirm_slot') {
      const token = `AGX-${Math.floor(1000 + Math.random() * 9000)}`;
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          time: 'Just now',
          text: `✅ **Delivery Slot Confirmed!**\n\nYour priority weighbridge arrival pass **#${token}** has been registered in the APMC gate ledger.\n\nYou can proceed directly to Gate #2 at the designated time window.`,
          cardType: null,
          cardData: null,
          actions: [{ label: '🚚 View Gate Arrivals & Inflow', feature: 'market', payload: { tab: 'arrivals' } }]
        }
      ]);
      return;
    }

    // Direct navigate to project feature
    if (onNavigateFeature) {
      onNavigateFeature(action.feature, action.payload);
    } else {
      // Default router navigation to dashboard with hash
      navigate(`/dashboard#${action.feature}`);
      if (action.payload) {
        window.dispatchEvent(new CustomEvent('agrimart:feature-navigate', { detail: action }));
      }
    }
  };

  const renderCard = (type, data) => {
    switch (type) {
      case 'price':
        return <CommodityPriceCard data={data} onAction={handleActionClick} />;
      case 'forecast_risk':
        return <ForecastRiskCard data={data} onAction={handleActionClick} />;
      case 'comparison':
        return <MandiComparisonCard data={data} onAction={handleActionClick} />;
      case 'liquidity':
        return <LiquidityCard data={data} onAction={handleActionClick} />;
      case 'buyers':
        return <BuyerCard data={data} onAction={handleActionClick} />;
      case 'booking':
        return <BookingCard data={data} onAction={handleActionClick} />;
      case 'disease':
        return <DiseaseScanCard data={data} onAction={handleActionClick} />;
      case 'recommendation':
        return <CropRecommendationCard data={data} onAction={handleActionClick} />;
      case 'yield':
        return <YieldPredictionCard data={data} onAction={handleActionClick} />;
      case 'growth':
        return <GrowthMonitoringCard data={data} onAction={handleActionClick} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ALWAYS-AVAILABLE DOCKED TRIGGER ON THE RIGHT SIDE */}
      <button
        type="button"
        className={`copilot-floating-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Agri-AI Copilot"
        title="Open Agri-AI Assistant"
      >
        <span className="trigger-pulse-ring" />
        <span className="trigger-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-1H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1v-1a5 5 0 0 1 5-5h2V5.72A2.002 2.002 0 0 1 10 4a2 2 0 0 1 2-2Zm-3 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/>
          </svg>
        </span>
        <span className="trigger-label">Agri-AI Copilot</span>
        <span className="trigger-online-dot" />
      </button>

      {/* BACKDROP ON MOBILE */}
      {isOpen && (
        <div 
          className="copilot-backdrop" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* SLIDE-OUT AI COPILOT DRAWER */}
      <div className={`copilot-drawer ${isOpen ? 'open' : ''}`}>
        {/* HEADER */}
        <div className="copilot-drawer-header">
          <div className="header-brand-info">
            <div className="header-avatar">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-1H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1v-1a5 5 0 0 1 5-5h2V5.72A2.002 2.002 0 0 1 10 4a2 2 0 0 1 2-2Z"/>
              </svg>
            </div>
            <div>
              <h3>Agri-AI Assistant</h3>
              <div className="header-sub">
                <span className="online-dot" />
                <span>Online • Market &amp; Farm Intelligence</span>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="copilot-close-btn" 
            onClick={() => setIsOpen(false)}
            aria-label="Close Assistant"
          >
            ✕
          </button>
        </div>

        {/* QUICK SHORTCUTS STRIP */}
        <div className="copilot-quick-strip">
          <span className="strip-title">Fast Actions:</span>
          <div className="strip-scroll">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-quick-prompt"
                onClick={() => handleSend(p.query)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES BODY */}
        <div className="copilot-messages-container">
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble-wrap ${m.sender === 'user' ? 'from-user' : 'from-asst'}`}>
              <div className="bubble-content">
                <p className="bubble-text">{m.text}</p>
                {m.sender === 'assistant' && (
                  <button type="button" className="btn-speak-message" onClick={() => speakMessage(m.text)} aria-label="Listen to this answer">🔊 Listen</button>
                )}
                
                {/* RENDER FLASH CARD IF PRESENT */}
                {m.cardType && renderCard(m.cardType, m.cardData)}

                {/* RENDER DIRECT-LINK ACTION BUTTONS */}
                {m.actions && m.actions.length > 0 && (
                  <div className="bubble-actions-row">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        className="btn-action-pill"
                        onClick={() => handleActionClick(act)}
                      >
                        {act.label}
                        <span className="pill-arrow">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="bubble-time">{m.time}</span>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-wrap from-asst">
              <div className="bubble-content loading-bubble">
                <span className="loader-dot" />
                <span className="loader-dot" />
                <span className="loader-dot" />
                <span className="loading-label">Evaluating market telemetry &amp; farm data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BOX */}
        {image && <div className="copilot-image-status">📷 {image.name}<button type="button" onClick={() => setImage(null)} aria-label="Remove image">×</button></div>}
        <form
          className="copilot-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Ask anything: prices, hold vs sell, disease, soil..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
          />
          <select className="assistant-language" value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Assistant language" disabled={loading}>
            <option value="en">EN</option>
            <option value="hi">हिं</option>
            <option value="kn">ಕಂ</option>
          </select>
          <input ref={fileInputRef} className="assistant-file-input" type="file" accept="image/*" capture="environment" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <button type="button" className="btn-input-tool" onClick={() => fileInputRef.current?.click()} disabled={loading} aria-label="Take or attach crop, soil, or field photo">📷</button>
          <button type="button" className={`btn-input-tool ${listening ? 'is-listening' : ''}`} onClick={startListening} disabled={loading} aria-label="Speak your question">🎙️</button>
          <button 
            type="submit" 
            className="btn-send-message"
            disabled={(!inputVal.trim() && !image) || loading}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

