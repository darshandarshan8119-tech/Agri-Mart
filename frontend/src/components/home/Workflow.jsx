import { useState, useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    tag: 'Quick Setup',
    title: 'Register Your Farm',
    desc: 'Create your Agri-MART account in seconds to personalize recommendations for your region, acreage, and crops.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    num: '02',
    tag: 'Field & Crop Input',
    title: 'Provide Information',
    desc: 'Enter soil NPK values, weather parameters, or upload smartphone photos of crop leaves for instant scanning.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    num: '03',
    tag: 'Deep Intelligence',
    title: 'AI Diagnostics & ML Analysis',
    desc: 'Our deep learning CNNs and agronomic models evaluate leaf pathologies, soil chemistry, and local weather trends.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11a2 2 0 0 1-2 2H8"/>
        <path d="M12 18h.01"/>
        <circle cx="12" cy="12" r="9"/>
      </svg>
    ),
  },
  {
    num: '04',
    tag: 'Actionable Harvest',
    title: 'Get Real-Time Insights',
    desc: 'Receive tailored treatment plans, optimal fertilizer dosages, yield forecasts, and fair marketplace prices.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

export default function Workflow() {
  const timelineRef = useRef(null);
  const nodeRefs = useRef([]);
  const [lineFillPx, setLineFillPx] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(1000);
  const [nodeOffsets, setNodeOffsets] = useState([120, 360, 600, 840]);

  useEffect(() => {
    const updateMetrics = () => {
      if (!timelineRef.current) return;
      const tRect = timelineRef.current.getBoundingClientRect();
      setTimelineHeight(tRect.height);

      const offsets = nodeRefs.current.map((nodeEl) => {
        if (!nodeEl) return 0;
        const nRect = nodeEl.getBoundingClientRect();
        return nRect.top - tRect.top + nRect.height / 2;
      });

      if (offsets.length === 4 && offsets.every((o) => o > 0)) {
        setNodeOffsets(offsets);
      }
    };

    updateMetrics();
    const timer = setTimeout(updateMetrics, 120);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!timelineRef.current) {
            ticking = false;
            return;
          }

          const tRect = timelineRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Ergonomic eye-level focal point: 60% down viewport
          // Each node activates right when it reaches this comfortable reading zone!
          const focalY = windowHeight * 0.60;
          const currentFill = focalY - tRect.top;
          const clampedFill = Math.min(Math.max(currentFill, 0), tRect.height);

          setLineFillPx(clampedFill);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateMetrics();
      handleScroll();
    }, { passive: true });

    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMetrics);
    };
  }, []);

  // Compute active count for the top indicator
  const activeCount = nodeOffsets.filter((offset) => lineFillPx >= offset).length;

  return (
    <section className="section workflow" id="how-it-works">
      <div className="container">
        <div className="section-heading reveal visible">
          <div className="workflow-eyebrow-row">
            <p className="eyebrow">How it works</p>
            <div className="workflow-scroll-pill">
              <span className="scroll-pill-dot" />
              <span>
                {activeCount === 4
                  ? 'All Steps Activated'
                  : `Step ${Math.max(1, activeCount)} of 4`}
              </span>
            </div>
          </div>
          <h2>From field data to clear insights.</h2>
          <p className="workflow-subtitle">
            Follow the central journey as raw sensor data and imagery transform into high-yield farming decisions.
          </p>
        </div>

        {/* Central Vertical Timeline */}
        <div className="central-timeline" ref={timelineRef}>
          {/* Central Vertical Animated SVG Spine with glowing tip */}
          <div className="central-timeline-spine" aria-hidden="true">
            <svg
              className="central-timeline-svg"
              width="8"
              height={timelineHeight}
              viewBox={`0 0 8 ${timelineHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="leadHeadGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base distinct grey line */}
              <line
                x1="4"
                y1="0"
                x2="4"
                y2={timelineHeight}
                stroke="#CBD5E1"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Scroll-driven fill line: Fills the grey line with the SAME GREEN #064E3B */}
              <line
                x1="4"
                y1="0"
                x2="4"
                y2={timelineHeight}
                stroke="#064E3B"
                strokeWidth="4.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: timelineHeight,
                  strokeDashoffset: Math.max(0, timelineHeight - lineFillPx),
                  transition: 'stroke-dashoffset 40ms linear',
                }}
              />

              {/* Glowing pulse head traveling at the leading tip of the green line */}
              {lineFillPx > 4 && lineFillPx < timelineHeight - 4 && (
                <g filter="url(#leadHeadGlow)">
                  <circle
                    cx="4"
                    cy={lineFillPx}
                    r="8"
                    fill="rgba(6, 78, 59, 0.35)"
                  />
                  <circle
                    cx="4"
                    cy={lineFillPx}
                    r="5"
                    fill="#064E3B"
                    stroke="#10B981"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Timeline Step Rows */}
          {steps.map((step, index) => {
            const nodeOffset = nodeOffsets[index] || (index + 1) * 220;
            // Node activates when line fill physically reaches its center
            const isNodeActive = lineFillPx >= nodeOffset;

            // Card begins scaling/illuminating smoothly as the line approaches the node
            const approachDist = lineFillPx - (nodeOffset - 110);
            const cardProgress = clamp(approachDist / 130, 0, 1);
            const isCardActive = cardProgress >= 0.85;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={step.num}
                className={`central-timeline-row ${isLeft ? 'row-left' : 'row-right'} ${isNodeActive ? 'is-active' : ''}`}
              >
                {/* Left side card (for even steps 01, 03) or Spacer */}
                {isLeft ? (
                  <div
                    className={`timeline-card ${isCardActive ? 'card-active' : ''}`}
                    style={{
                      opacity: 0.38 + cardProgress * 0.62,
                      transform: `scale(${0.93 + cardProgress * 0.07}) translateY(${(1 - cardProgress) * 12}px)`,
                    }}
                  >
                    <div className="card-top-row">
                      <span className="card-tag">{step.tag}</span>
                      <div className="card-icon-wrap">{step.icon}</div>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                    <div className="card-branch-anchor branch-right" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="timeline-spacer" aria-hidden="true" />
                )}

                {/* Central Step Node */}
                <div className="timeline-node-wrap">
                  <div
                    ref={(el) => (nodeRefs.current[index] = el)}
                    className={`timeline-node ${isNodeActive ? 'node-active' : ''}`}
                    aria-label={`Step ${step.num}`}
                  >
                    <span>{step.num}</span>
                    {isNodeActive && <span className="node-pulse-beacon" aria-hidden="true" />}
                  </div>
                </div>

                {/* Right side card (for odd steps 02, 04) or Spacer */}
                {!isLeft ? (
                  <div
                    className={`timeline-card ${isCardActive ? 'card-active' : ''}`}
                    style={{
                      opacity: 0.38 + cardProgress * 0.62,
                      transform: `scale(${0.93 + cardProgress * 0.07}) translateY(${(1 - cardProgress) * 12}px)`,
                    }}
                  >
                    <div className="card-top-row">
                      <span className="card-tag">{step.tag}</span>
                      <div className="card-icon-wrap">{step.icon}</div>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                    <div className="card-branch-anchor branch-left" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="timeline-spacer" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
