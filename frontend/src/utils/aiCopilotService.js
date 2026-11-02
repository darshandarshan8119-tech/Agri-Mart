// src/utils/aiCopilotService.js
// Universal AI Farming & Market Copilot Engine for Agri-MART
// Serves every project feature via plain-language explanation and interactive flash-cards

import { 
  COMMODITIES_DATA, 
  VERIFIED_BUYERS, 
  compareRegionalMandis, 
  computeRiskAdvisory 
} from './marketData';
import { sampleDiseases } from './diseaseData';
import { calculateCropRecommendation, soilPresets } from './cropRecommendation';
import { calculateYield } from './yieldCalculator';

/**
 * Dispatches farmer messages to appropriate Agri-MART core capability
 * Returns structured response: { content, cardType, cardData, actions }
 */
export async function processFarmerQuery(queryText, userContext = {}) {
  const query = (queryText || '').toLowerCase().trim();
  const userName = userContext?.name || 'Kisan Bandhu';

  // Helper to extract commodity name
  let targetCommodity = COMMODITIES_DATA[0]; // Default Wheat
  if (query.includes('mustard') || query.includes('sarson')) {
    targetCommodity = COMMODITIES_DATA.find(c => c.id.includes('mustard')) || targetCommodity;
  } else if (query.includes('cotton') || query.includes('kapas')) {
    targetCommodity = COMMODITIES_DATA.find(c => c.id.includes('cotton')) || targetCommodity;
  } else if (query.includes('paddy') || query.includes('basmati') || query.includes('rice')) {
    targetCommodity = COMMODITIES_DATA.find(c => c.id.includes('paddy')) || targetCommodity;
  } else if (query.includes('soybean') || query.includes('soya')) {
    targetCommodity = COMMODITIES_DATA.find(c => c.id.includes('soybean')) || targetCommodity;
  } else if (query.includes('maize') || query.includes('corn') || query.includes('makka')) {
    targetCommodity = COMMODITIES_DATA.find(c => c.id.includes('maize')) || targetCommodity;
  } else if (query.includes('tomato') || query.includes('tamatar')) {
    targetCommodity = COMMODITIES_DATA.find(c => c.id.includes('tomato')) || targetCommodity;
  }

  // 1. CROP DISEASE DETECTION INTENT
  if (query.includes('disease') || query.includes('leaf') || query.includes('infection') || query.includes('pest') || query.includes('blight') || query.includes('rust') || query.includes('scan') || query.includes('yellow leaf') || query.includes('spots') || query.includes('diagnos') || query.includes('cure')) {
    // Map user keywords to actual diseaseData keys
    const diseaseKey = (query.includes('rice') || query.includes('paddy')) ? 'healthy_rice'
      : (query.includes('corn') || query.includes('maize') || query.includes('rust')) ? 'corn_rust'
      : 'tomato_early_blight';
    const disease = sampleDiseases[diseaseKey] || sampleDiseases.tomato_early_blight;

    return {
      content: `Namaste ${userName}, I diagnosed plant health symptoms. For **${disease.crop}**, signs indicate **${disease.disease}**.\n\nHere is the immediate treatment action card. You can also upload a direct leaf photo using our Disease Scanner.`,
      cardType: 'disease',
      cardData: {
        crop: disease.crop,
        diseaseName: disease.disease,
        confidence: disease.confidence,
        severity: 'Moderate Infection',
        symptoms: disease.symptoms,
        organicCure: disease.treatments[0] || '',
        chemicalCure: disease.treatments.slice(1).join('; '),
        sampleImg: disease.imgUrl
      },
      actions: [
        { label: '📷 Open Leaf Disease Scanner', feature: 'disease' },
        { label: '🌱 Check Soil Health', feature: 'recommendation' }
      ]
    };
  }

  // 2. CROP RECOMMENDATION INTENT (Soil, NPK, what to grow)
  if (query.includes('recommend') || query.includes('soil') || query.includes('what to plant') || query.includes('what crop') || query.includes('npk') || query.includes('fertilizer') || query.includes('grow')) {
    const preset = query.includes('black') ? 'black' : query.includes('red') ? 'red' : query.includes('sandy') ? 'sandy' : 'alluvial';
    const soilData = soilPresets[preset] || soilPresets.alluvial;
    const recs = calculateCropRecommendation(soilData);
    const topCrop = recs.topCrop;

    return {
      content: `Based on your soil and agro-climate conditions, **${topCrop.title}** is your #1 prime choice (${topCrop.match} suitability match).\n\nHere is your Soil & Climate Crop Recommendation Flash Card:`,
      cardType: 'recommendation',
      cardData: {
        soilType: preset.charAt(0).toUpperCase() + preset.slice(1) + ' Soil',
        npk: `N:${soilData.N} P:${soilData.P} K:${soilData.K} • pH ${soilData.ph}`,
        topCrop: topCrop.title,
        topEmoji: topCrop.emoji,
        match: topCrop.match,
        expectedYield: topCrop.yield,
        desc: topCrop.desc,
        secondaryCrop: recs.secondCrop?.title || 'Gram (Chana)'
      },
      actions: [
        { label: '🧪 Open Crop Recommendation Tool', feature: 'recommendation' },
        { label: '📈 Check Market Price for this Crop', feature: 'market', payload: { commodityId: targetCommodity.id } }
      ]
    };
  }

  // 3. YIELD PREDICTION INTENT (Harvest estimate, tonnage, revenue)
  if (query.includes('yield') || query.includes('harvest') || query.includes('tonnage') || query.includes('how much quintal') || query.includes('revenue') || query.includes('production')) {
    const yieldCalc = calculateYield({ crop: 'wheat', acres: 5, season: 'rabi', irrigation: 'drip', fertilizer: 'balanced' });
    const totalQuintals = (parseFloat(yieldCalc.totalTonnes) * 10).toFixed(0);

    return {
      content: `Here is the estimated yield and gross revenue projection for **5 acres of Wheat** under optimal drip irrigation.\n\nExpected total harvest is **${totalQuintals} Quintals** with an estimated revenue of **₹${yieldCalc.grossRevenue}**.`,
      cardType: 'yield',
      cardData: {
        crop: yieldCalc.cropName + ' (Rabi Season)',
        acres: '5 Acres',
        irrigation: 'Drip Irrigation',
        yieldPerAcre: `${yieldCalc.yieldPerAcre} T/Acre`,
        totalHarvest: `${yieldCalc.totalTonnes} Tonnes`,
        estimatedRevenue: `₹${yieldCalc.grossRevenue}`,
        mspBenchmark: `₹${yieldCalc.mspPerQtl}/Qtl`
      },
      actions: [
        { label: '🚜 Open Yield Estimator', feature: 'yield' },
        { label: '📊 View Market Selling Prices', feature: 'market', payload: { commodityId: 'wheat-ludhiana' } }
      ]
    };
  }

  // 4. PLANT GROWTH & NDVI INTENT (Phenology, growth stages, watering)
  if (query.includes('growth') || query.includes('ndvi') || query.includes('stage') || query.includes('water') || query.includes('irrigation') || query.includes('schedule') || query.includes('vigor')) {
    return {
      content: `Your active wheat crop batch is currently in **Phase 3: Tillering & Stem Extension (Day 48)**.\n\nNDVI vegetative vigor index is **0.78 (Vibrant Green Canopy)** with top 5% chlorophyll health.`,
      cardType: 'growth',
      cardData: {
        cropBatch: 'Wheat Field #3 (Day 48)',
        currentStage: 'Stage 3: Tillering & Stemming',
        progressPct: 80,
        ndviScore: '0.78',
        ndviStatus: 'Vibrant Green Canopy (Healthy)',
        nextWatering: 'In 3 Days (Root Zone Moisture: 68%)',
        nextAction: 'First Top-Dressing Urea / Nitrogen application'
      },
      actions: [
        { label: '🌱 Open Growth Monitoring Tracker', feature: 'growth' },
        { label: '📷 Scan Leaves for Deficiency', feature: 'disease' }
      ]
    };
  }

  // 5. REGIONAL MANDI COMPARISON & NET IN-HAND PROCEEDS
  if (query.includes('compare') || query.includes('which mandi') || query.includes('best mandi') || query.includes('highest price') || query.includes('where to sell')) {
    const comparisons = compareRegionalMandis(targetCommodity, 100);
    const topMandi = comparisons[0];
    const secondMandi = comparisons[1];
    const diff = topMandi.financials.netProceeds - (secondMandi ? secondMandi.financials.netProceeds : 0);

    return {
      content: `I analyzed regional APMC mandis for your **100 Quintals of ${targetCommodity.name}**.\n\n**${topMandi.name}** yields the highest net in-hand proceeds of **₹${topMandi.financials.netProceeds.toLocaleString()}** (₹${diff.toLocaleString()} higher than ${secondMandi?.name || 'others'}), even after accounting for transport freight and 1.5% APMC cess.`,
      cardType: 'comparison',
      cardData: {
        commodity: targetCommodity.name,
        quantity: 100,
        unit: 'Quintals',
        recommendationReason: `Ranked by net in-hand proceeds after freight (₹18/Qtl/100km), 1.5% cess & 0.5% escrow.`,
        mandis: comparisons.slice(0, 3).map(m => ({
          name: m.name,
          distanceKm: m.distanceKm,
          quotedRate: m.quotedRate,
          buyerDemand: m.buyerDemand,
          freight: m.financials.freight,
          mandiCess: m.financials.mandiCess,
          netProceeds: m.financials.netProceeds
        }))
      },
      actions: [
        { label: '📊 View in Market Terminal', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'comparison' } },
        { label: '🚚 Check Gate Arrivals', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'arrivals' } }
      ]
    };
  }

  // 6. RISK ALERT & PRICE FORECAST (Hold vs Sell, Volatility)
  if (query.includes('risk') || query.includes('alert') || query.includes('forecast') || query.includes('hold') || query.includes('sell') || query.includes('future') || query.includes('next week') || query.includes('trend')) {
    const advisory = computeRiskAdvisory(targetCommodity, 7);

    return {
      content: `Here is the AI Risk Alert & Price Forecast for **${targetCommodity.name}**:\n\n• **Advisory**: **${advisory.action}**\n• **Risk Rating**: ${advisory.riskLevel}\n• **Projected 7-Day Target**: ₹${advisory.targetPrice}/Qtl (${targetCommodity.change} momentum)\n• **Storage Cost Comparison**: ${advisory.advice}`,
      cardType: 'forecast_risk',
      cardData: {
        commodity: targetCommodity.name,
        mandi: targetCommodity.mandi,
        currentPrice: targetCommodity.price,
        projectedPrice: targetCommodity.projected7Day,
        lowerRange: targetCommodity.lowerRange7Day,
        upperRange: targetCommodity.upperRange7Day,
        action: advisory.action,
        riskLevel: advisory.riskLevel,
        badgeClass: advisory.badgeClass,
        advice: advisory.advice,
        storageCost: `₹${advisory.holdingCostPerQtl}/Qtl (7 days)`,
        forecastPoints: targetCommodity.forecastPoints
      },
      actions: [
        { label: '📈 Analyze Market Price & Risk', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'forecast' } },
        { label: '⚖️ Compare All Regional Mandis', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'comparison' } }
      ]
    };
  }

  // 7. 5-LEVEL MARKET DEPTH & ORDER BOOK
  if (query.includes('depth') || query.includes('order book') || query.includes('spread') || query.includes('liquidity') || query.includes('bids') || query.includes('asks')) {
    const depth = targetCommodity.depth;

    return {
      content: `Live **5-level electronic market depth** for **${targetCommodity.name}** at ${targetCommodity.mandi}.\n\nThe market is currently **${depth.imbalance}** with a bid/ask spread of **₹${depth.spread}/Qtl (${depth.spreadPct})**.`,
      cardType: 'liquidity',
      cardData: {
        commodity: targetCommodity.name,
        mandi: targetCommodity.mandi,
        bestBid: depth.bestBid,
        bestAsk: depth.bestAsk,
        spread: depth.spread,
        spreadPct: depth.spreadPct,
        totalBidQty: depth.totalBidQty,
        totalAskQty: depth.totalAskQty,
        imbalance: depth.imbalance,
        liquidityRating: depth.liquidityRating,
        bids: depth.bids,
        asks: depth.asks
      },
      actions: [
        { label: '📊 View Full Depth Ladder', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'depth' } },
        { label: '🏢 Connect with Verified Buyers', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'buyers' } }
      ]
    };
  }

  // 8. VERIFIED INSTITUTIONAL BUYERS INTENT
  if (query.includes('buyer') || query.includes('institutional') || query.includes('merchant') || query.includes('who will buy') || query.includes('traders')) {
    const matchedBuyers = VERIFIED_BUYERS.filter(b => b.commodities.some(c => targetCommodity.name.includes(c)));

    return {
      content: `I matched **${matchedBuyers.length} verified institutional APMC buyers** with pre-funded escrow for **${targetCommodity.name}**.\n\nAll payments are guaranteed via Axis Escrow T+0 RTGS settlement.`,
      cardType: 'buyers',
      cardData: {
        commodity: targetCommodity.name,
        buyers: matchedBuyers.map(b => ({
          name: b.name,
          apmcLicense: b.apmcLicense,
          offeredRate: targetCommodity.price + b.offeredRateOffset,
          rating: b.rating,
          capacity: b.capacity,
          settlementTimeline: b.settlementTimeline,
          isVerified: b.escrowGuaranteed
        }))
      },
      actions: [
        { label: '🏢 View Buyers in Terminal', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'buyers' } },
        { label: '📅 Book Delivery Slot', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'arrivals' } }
      ]
    };
  }

  // 9. DELIVERY GATE BOOKING INTENT
  if (query.includes('book') || query.includes('slot') || query.includes('weighbridge') || query.includes('gate') || query.includes('delivery')) {
    return {
      content: `Delivery window available at **${targetCommodity.mandi} Gate #2 (Electronic Axle Weighbridge)** for tomorrow morning.\n\nReview the gate pass details below and tap confirm to reserve:`,
      cardType: 'booking',
      cardData: {
        mandi: targetCommodity.mandi,
        gate: 'Gate No. 2 (Bulk Grain Axle Scales)',
        date: 'Tomorrow Morning',
        timeSlot: '08:00 AM - 11:30 AM',
        commodity: targetCommodity.name,
        quantity: '100 Quintals',
        vehicleAssigned: 'Tractor Trolley PB-10-DT-4821',
        tokenStatus: 'PENDING_CONFIRMATION'
      },
      actions: [
        { label: '✅ Confirm Weighbridge Slot', feature: 'confirm_slot' },
        { label: '🚚 Check Live Queue Status', feature: 'market', payload: { tab: 'arrivals' } }
      ]
    };
  }

  // 10. GENERAL COMMODITY SPOT PRICE & MARKET INTENT (Default)
  return {
    content: `Verified spot rate for **${targetCommodity.name}** at **${targetCommodity.mandi}** is **₹${targetCommodity.price.toLocaleString()}/Qtl** (${targetCommodity.change} today).\n\nStatutory AGMARKNET benchmark is **₹${targetCommodity.agmarknetBenchmark.toLocaleString()}/Qtl**. Market risk is currently **${targetCommodity.riskLevel}**.`,
    cardType: 'price',
    cardData: {
      commodity: targetCommodity.name,
      mandi: targetCommodity.mandi,
      currentPrice: targetCommodity.price,
      prevPrice: targetCommodity.prevPrice,
      change: targetCommodity.change,
      isUp: targetCommodity.isUp,
      dayHigh: targetCommodity.dayHigh,
      dayLow: targetCommodity.dayLow,
      agmarknetBenchmark: targetCommodity.agmarknetBenchmark,
      volume: targetCommodity.volume,
      moisture: targetCommodity.moisture,
      grade: targetCommodity.grade
    },
    actions: [
      { label: '📈 Full Market Analysis & Risk Alert', feature: 'market', payload: { commodityId: targetCommodity.id } },
      { label: '⚖️ Compare Regional Mandis', feature: 'market', payload: { commodityId: targetCommodity.id, tab: 'comparison' } }
    ]
  };
}
