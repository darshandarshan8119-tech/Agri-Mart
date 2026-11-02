// src/utils/marketData.js
// Agri-MART Comprehensive Market Intelligence, Risk Engine & Algorithmic Deductions

export const COMMODITIES_DATA = [
  {
    id: 'wheat-ludhiana',
    code: 'WHEAT_SHARBATI',
    name: 'Wheat (Sharbati)',
    category: 'Grains & Cereals',
    mandi: 'Ludhiana APMC, Punjab',
    marketCode: 'APMC_LUD',
    price: 2450,
    prevPrice: 2390,
    change: '+2.4%',
    isUp: true,
    dayHigh: 2480,
    dayLow: 2410,
    volume: '4,250 Qtl',
    agmarknetBenchmark: 2275,
    standardMSP: 2275,
    grade: 'Grade-A Sharbati',
    moisture: '11.2%',
    basisMoisture: 11.0,
    maxMoistureTolerance: 14.0,
    moisturePenaltyPerPct: 30, // ₹30/qtl per 1% excess moisture
    volatility: 'Low',
    riskLevel: 'LOW',
    trendDirection: 'BULLISH',
    recommendation: 'HOLD',
    recommendationReason: 'Expected 7-day modal gain (+₹60/Qtl) exceeds warehouse storage cost (₹4.2/Qtl for 7 days). Consider holding harvest lot.',
    projected7Day: 2510,
    lowerRange7Day: 2460,
    upperRange7Day: 2560,
    priceHistory: {
      '1D': [2410, 2420, 2435, 2440, 2430, 2445, 2450],
      '1W': [2380, 2395, 2410, 2400, 2430, 2445, 2450],
      '1M': [2320, 2350, 2370, 2390, 2400, 2420, 2450],
      '1Y': [2125, 2180, 2220, 2275, 2340, 2390, 2450]
    },
    forecastPoints: [
      { day: 'Day 1', price: 2460 },
      { day: 'Day 2', price: 2475 },
      { day: 'Day 3', price: 2480 },
      { day: 'Day 4', price: 2495 },
      { day: 'Day 5', price: 2505 },
      { day: 'Day 6', price: 2510 },
      { day: 'Day 7', price: 2510 }
    ],
    depth: {
      bestBid: 2450,
      bestAsk: 2470,
      spread: 20,
      spreadPct: '0.81%',
      totalBidQty: 450,
      totalAskQty: 380,
      imbalance: 'Bid Dominant (+18.4%)',
      liquidityRating: 'High Liquidity',
      bids: [
        { price: 2450, qty: 120, orders: 3 },
        { price: 2445, qty: 90, orders: 2 },
        { price: 2440, qty: 110, orders: 4 },
        { price: 2435, qty: 80, orders: 2 },
        { price: 2430, qty: 50, orders: 1 }
      ],
      asks: [
        { price: 2470, qty: 80, orders: 2 },
        { price: 2475, qty: 100, orders: 3 },
        { price: 2480, qty: 90, orders: 2 },
        { price: 2485, qty: 60, orders: 1 },
        { price: 2490, qty: 50, orders: 2 }
      ]
    },
    regionalMandis: [
      { name: 'Ludhiana APMC, Punjab', distanceKm: 32, quotedRate: 2450, buyerDemand: '4,250 Qtl', arrivalsRate: 'Normal' },
      { name: 'Karnal Grain Market, Haryana', distanceKm: 125, quotedRate: 2380, buyerDemand: '2,900 Qtl', arrivalsRate: 'Heavy' },
      { name: 'Alwar APMC, Rajasthan', distanceKm: 340, quotedRate: 2340, buyerDemand: '1,800 Qtl', arrivalsRate: 'Moderate' },
      { name: 'Indore APMC, MP', distanceKm: 780, quotedRate: 2420, buyerDemand: '3,100 Qtl', arrivalsRate: 'Normal' }
    ]
  },
  {
    id: 'mustard-alwar',
    code: 'MUSTARD_SEED',
    name: 'Mustard (Pusa Bold)',
    category: 'Oilseeds',
    mandi: 'Alwar APMC, Rajasthan',
    marketCode: 'APMC_ALW',
    price: 5680,
    prevPrice: 5580,
    change: '+1.8%',
    isUp: true,
    dayHigh: 5720,
    dayLow: 5550,
    volume: '2,890 Qtl',
    agmarknetBenchmark: 5650,
    standardMSP: 5650,
    grade: 'High-Oil 42% Pusa Bold',
    moisture: '7.8%',
    basisMoisture: 8.0,
    maxMoistureTolerance: 10.0,
    moisturePenaltyPerPct: 45,
    volatility: 'Moderate',
    riskLevel: 'LOW',
    trendDirection: 'BULLISH',
    recommendation: 'HOLD',
    recommendationReason: 'Crusher oil extraction demand is elevating spot premiums. Strong buying absorption across Rajasthan mandis.',
    projected7Day: 5790,
    lowerRange7Day: 5680,
    upperRange7Day: 5880,
    priceHistory: {
      '1D': [5580, 5600, 5630, 5650, 5640, 5670, 5680],
      '1W': [5500, 5540, 5580, 5610, 5590, 5650, 5680],
      '1M': [5350, 5420, 5480, 5520, 5570, 5620, 5680],
      '1Y': [4950, 5100, 5250, 5400, 5500, 5580, 5680]
    },
    forecastPoints: [
      { day: 'Day 1', price: 5700 },
      { day: 'Day 2', price: 5720 },
      { day: 'Day 3', price: 5740 },
      { day: 'Day 4', price: 5755 },
      { day: 'Day 5', price: 5770 },
      { day: 'Day 6', price: 5780 },
      { day: 'Day 7', price: 5790 }
    ],
    depth: {
      bestBid: 5680,
      bestAsk: 5710,
      spread: 30,
      spreadPct: '0.53%',
      totalBidQty: 320,
      totalAskQty: 290,
      imbalance: 'Bid Dominant (+9.8%)',
      liquidityRating: 'Moderate Liquidity',
      bids: [
        { price: 5680, qty: 80, orders: 2 },
        { price: 5670, qty: 70, orders: 2 },
        { price: 5660, qty: 90, orders: 3 },
        { price: 5650, qty: 50, orders: 1 },
        { price: 5640, qty: 30, orders: 1 }
      ],
      asks: [
        { price: 5710, qty: 60, orders: 2 },
        { price: 5720, qty: 80, orders: 2 },
        { price: 5730, qty: 70, orders: 3 },
        { price: 5740, qty: 50, orders: 1 },
        { price: 5750, qty: 30, orders: 1 }
      ]
    },
    regionalMandis: [
      { name: 'Alwar APMC, Rajasthan', distanceKm: 45, quotedRate: 5680, buyerDemand: '2,890 Qtl', arrivalsRate: 'Normal' },
      { name: 'Bharatpur Mandi, Rajasthan', distanceKm: 85, quotedRate: 5640, buyerDemand: '2,100 Qtl', arrivalsRate: 'Heavy' },
      { name: 'Kota APMC, Rajasthan', distanceKm: 280, quotedRate: 5690, buyerDemand: '3,400 Qtl', arrivalsRate: 'Normal' },
      { name: 'Delhi Narela Mandi', distanceKm: 160, quotedRate: 5660, buyerDemand: '2,400 Qtl', arrivalsRate: 'Moderate' }
    ]
  },
  {
    id: 'cotton-rajkot',
    code: 'COTTON_SHANKAR',
    name: 'Cotton (Shankar-6)',
    category: 'Fibers',
    mandi: 'Rajkot APMC, Gujarat',
    marketCode: 'APMC_RAJ',
    price: 7140,
    prevPrice: 7180,
    change: '-0.6%',
    isUp: false,
    dayHigh: 7220,
    dayLow: 7110,
    volume: '6,400 Bales',
    agmarknetBenchmark: 7020,
    standardMSP: 7020,
    grade: '29mm Shankar-6 Long Staple',
    moisture: '8.4%',
    basisMoisture: 8.0,
    maxMoistureTolerance: 10.0,
    moisturePenaltyPerPct: 60,
    volatility: 'High',
    riskLevel: 'HIGH_DOWNSIDE',
    trendDirection: 'BEARISH',
    recommendation: 'LIQUIDATE',
    recommendationReason: 'Global textile mill spinning demand soft. Inflow arrivals increasing +12% this week; liquidate immediately to avoid price erosion.',
    projected7Day: 7040,
    lowerRange7Day: 6980,
    upperRange7Day: 7110,
    priceHistory: {
      '1D': [7190, 7180, 7160, 7150, 7140, 7145, 7140],
      '1W': [7250, 7220, 7200, 7180, 7190, 7160, 7140],
      '1M': [7400, 7350, 7300, 7240, 7210, 7180, 7140],
      '1Y': [6800, 6950, 7100, 7300, 7450, 7300, 7140]
    },
    forecastPoints: [
      { day: 'Day 1', price: 7120 },
      { day: 'Day 2', price: 7100 },
      { day: 'Day 3', price: 7080 },
      { day: 'Day 4', price: 7070 },
      { day: 'Day 5', price: 7055 },
      { day: 'Day 6', price: 7045 },
      { day: 'Day 7', price: 7040 }
    ],
    depth: {
      bestBid: 7140,
      bestAsk: 7180,
      spread: 40,
      spreadPct: '0.56%',
      totalBidQty: 280,
      totalAskQty: 490,
      imbalance: 'Ask Dominant (-42.8%)',
      liquidityRating: 'Thin Bid Depth',
      bids: [
        { price: 7140, qty: 60, orders: 2 },
        { price: 7120, qty: 70, orders: 2 },
        { price: 7100, qty: 80, orders: 3 },
        { price: 7080, qty: 40, orders: 1 },
        { price: 7060, qty: 30, orders: 1 }
      ],
      asks: [
        { price: 7180, qty: 110, orders: 4 },
        { price: 7200, qty: 130, orders: 4 },
        { price: 7220, qty: 120, orders: 3 },
        { price: 7240, qty: 80, orders: 2 },
        { price: 7260, qty: 50, orders: 2 }
      ]
    },
    regionalMandis: [
      { name: 'Rajkot APMC, Gujarat', distanceKm: 25, quotedRate: 7140, buyerDemand: '6,400 Bales', arrivalsRate: 'Heavy Inflow' },
      { name: 'Surendranagar Mandi, Gujarat', distanceKm: 110, quotedRate: 7110, buyerDemand: '4,200 Bales', arrivalsRate: 'Heavy' },
      { name: 'Guntur APMC, Andhra Pradesh', distanceKm: 1150, quotedRate: 7280, buyerDemand: '5,800 Bales', arrivalsRate: 'Moderate' },
      { name: 'Warangal Cotton Yard, Telangana', distanceKm: 980, quotedRate: 7220, buyerDemand: '3,900 Bales', arrivalsRate: 'Normal' }
    ]
  },
  {
    id: 'paddy-karnal',
    code: 'BASMATI_1121',
    name: 'Basmati Paddy 1121',
    category: 'Grains & Cereals',
    mandi: 'Karnal APMC, Haryana',
    marketCode: 'APMC_KAR',
    price: 4420,
    prevPrice: 4290,
    change: '+3.1%',
    isUp: true,
    dayHigh: 4460,
    dayLow: 4280,
    volume: '5,120 Qtl',
    agmarknetBenchmark: 3850,
    standardMSP: 2320,
    grade: 'Export Grade Extra-Long 8.35mm',
    moisture: '12.0%',
    basisMoisture: 12.0,
    maxMoistureTolerance: 15.0,
    moisturePenaltyPerPct: 40,
    volatility: 'Moderate',
    riskLevel: 'LOW',
    trendDirection: 'BULLISH',
    recommendation: 'HOLD',
    recommendationReason: 'Middle East export quotas opened; institutional basmati millers aggressively building warehouse inventories.',
    projected7Day: 4540,
    lowerRange7Day: 4450,
    upperRange7Day: 4620,
    priceHistory: {
      '1D': [4300, 4340, 4380, 4390, 4400, 4410, 4420],
      '1W': [4220, 4260, 4290, 4320, 4360, 4400, 4420],
      '1M': [4050, 4120, 4180, 4240, 4310, 4380, 4420],
      '1Y': [3600, 3750, 3900, 4100, 4250, 4350, 4420]
    },
    forecastPoints: [
      { day: 'Day 1', price: 4440 },
      { day: 'Day 2', price: 4465 },
      { day: 'Day 3', price: 4490 },
      { day: 'Day 4', price: 4505 },
      { day: 'Day 5', price: 4520 },
      { day: 'Day 6', price: 4535 },
      { day: 'Day 7', price: 4540 }
    ],
    depth: {
      bestBid: 4420,
      bestAsk: 4445,
      spread: 25,
      spreadPct: '0.57%',
      totalBidQty: 540,
      totalAskQty: 410,
      imbalance: 'Bid Dominant (+24.2%)',
      liquidityRating: 'High Liquidity',
      bids: [
        { price: 4420, qty: 150, orders: 4 },
        { price: 4410, qty: 120, orders: 3 },
        { price: 4400, qty: 130, orders: 3 },
        { price: 4390, qty: 80, orders: 2 },
        { price: 4380, qty: 60, orders: 1 }
      ],
      asks: [
        { price: 4445, qty: 90, orders: 2 },
        { price: 4450, qty: 110, orders: 3 },
        { price: 4460, qty: 100, orders: 2 },
        { price: 4470, qty: 70, orders: 2 },
        { price: 4480, qty: 40, orders: 1 }
      ]
    },
    regionalMandis: [
      { name: 'Karnal APMC, Haryana', distanceKm: 28, quotedRate: 4420, buyerDemand: '5,120 Qtl', arrivalsRate: 'Normal' },
      { name: 'Amritsar APMC, Punjab', distanceKm: 240, quotedRate: 4460, buyerDemand: '4,800 Qtl', arrivalsRate: 'Normal' },
      { name: 'Taran Taran Mandi, Punjab', distanceKm: 270, quotedRate: 4440, buyerDemand: '3,200 Qtl', arrivalsRate: 'Moderate' },
      { name: 'Kaithal Mandi, Haryana', distanceKm: 65, quotedRate: 4390, buyerDemand: '2,900 Qtl', arrivalsRate: 'Heavy' }
    ]
  },
  {
    id: 'soybean-indore',
    code: 'SOYBEAN_YELLOW',
    name: 'Soybean (Yellow)',
    category: 'Oilseeds',
    mandi: 'Indore APMC, MP',
    marketCode: 'APMC_IND',
    price: 4820,
    prevPrice: 4780,
    change: '+0.9%',
    isUp: true,
    dayHigh: 4850,
    dayLow: 4760,
    volume: '3,700 Qtl',
    agmarknetBenchmark: 4892,
    standardMSP: 4892,
    grade: 'Yellow Food-Grade Protein 38%',
    moisture: '10.5%',
    basisMoisture: 10.0,
    maxMoistureTolerance: 12.0,
    moisturePenaltyPerPct: 35,
    volatility: 'Low',
    riskLevel: 'LOW',
    trendDirection: 'NEUTRAL',
    recommendation: 'NEUTRAL',
    recommendationReason: 'Trading within a narrow band (+/-0.8%). Staged liquidation recommended if working capital is needed.',
    projected7Day: 4840,
    lowerRange7Day: 4790,
    upperRange7Day: 4890,
    priceHistory: {
      '1D': [4770, 4780, 4800, 4810, 4800, 4815, 4820],
      '1W': [4720, 4750, 4780, 4760, 4790, 4810, 4820],
      '1M': [4650, 4690, 4720, 4760, 4780, 4800, 4820],
      '1Y': [4400, 4550, 4680, 4750, 4800, 4820, 4820]
    },
    forecastPoints: [
      { day: 'Day 1', price: 4825 },
      { day: 'Day 2', price: 4830 },
      { day: 'Day 3', price: 4830 },
      { day: 'Day 4', price: 4835 },
      { day: 'Day 5', price: 4840 },
      { day: 'Day 6', price: 4840 },
      { day: 'Day 7', price: 4840 }
    ],
    depth: {
      bestBid: 4820,
      bestAsk: 4840,
      spread: 20,
      spreadPct: '0.41%',
      totalBidQty: 410,
      totalAskQty: 390,
      imbalance: 'Balanced (+4.8%)',
      liquidityRating: 'High Liquidity',
      bids: [
        { price: 4820, qty: 110, orders: 3 },
        { price: 4810, qty: 90, orders: 2 },
        { price: 4800, qty: 100, orders: 3 },
        { price: 4790, qty: 70, orders: 2 },
        { price: 4780, qty: 40, orders: 1 }
      ],
      asks: [
        { price: 4840, qty: 90, orders: 2 },
        { price: 4850, qty: 100, orders: 3 },
        { price: 4860, qty: 90, orders: 2 },
        { price: 4870, qty: 60, orders: 2 },
        { price: 4880, qty: 50, orders: 1 }
      ]
    },
    regionalMandis: [
      { name: 'Indore APMC, MP', distanceKm: 30, quotedRate: 4820, buyerDemand: '3,700 Qtl', arrivalsRate: 'Normal' },
      { name: 'Ujjain Mandi, MP', distanceKm: 55, quotedRate: 4800, buyerDemand: '2,600 Qtl', arrivalsRate: 'Normal' },
      { name: 'Dewas APMC, MP', distanceKm: 42, quotedRate: 4810, buyerDemand: '1,900 Qtl', arrivalsRate: 'Moderate' },
      { name: 'Nagpur Cotton & Grain, Maharashtra', distanceKm: 460, quotedRate: 4880, buyerDemand: '3,200 Qtl', arrivalsRate: 'Normal' }
    ]
  },
  {
    id: 'maize-davangere',
    code: 'MAIZE_FEED',
    name: 'Maize (Yellow Feed)',
    category: 'Coarse Cereals',
    mandi: 'Davangere APMC, Karnataka',
    marketCode: 'APMC_DAV',
    price: 2280,
    prevPrice: 2210,
    change: '+3.2%',
    isUp: true,
    dayHigh: 2310,
    dayLow: 2190,
    volume: '6,100 Qtl',
    agmarknetBenchmark: 2090,
    standardMSP: 2090,
    grade: 'Starch > 68% Poult-Grade',
    moisture: '11.8%',
    basisMoisture: 12.0,
    maxMoistureTolerance: 14.5,
    moisturePenaltyPerPct: 25,
    volatility: 'Low',
    riskLevel: 'LOW',
    trendDirection: 'BULLISH',
    recommendation: 'HOLD',
    recommendationReason: 'Poultry feed compounders running full capacity before festival season. Upward spot momentum likely to continue.',
    projected7Day: 2350,
    lowerRange7Day: 2290,
    upperRange7Day: 2390,
    priceHistory: {
      '1D': [2220, 2240, 2250, 2260, 2270, 2275, 2280],
      '1W': [2190, 2210, 2240, 2230, 2260, 2275, 2280],
      '1M': [2100, 2140, 2180, 2210, 2230, 2250, 2280],
      '1Y': [1950, 2020, 2080, 2140, 2200, 2240, 2280]
    },
    forecastPoints: [
      { day: 'Day 1', price: 2290 },
      { day: 'Day 2', price: 2305 },
      { day: 'Day 3', price: 2320 },
      { day: 'Day 4', price: 2330 },
      { day: 'Day 5', price: 2340 },
      { day: 'Day 6', price: 2345 },
      { day: 'Day 7', price: 2350 }
    ],
    depth: {
      bestBid: 2280,
      bestAsk: 2300,
      spread: 20,
      spreadPct: '0.87%',
      totalBidQty: 620,
      totalAskQty: 450,
      imbalance: 'Bid Dominant (+32.1%)',
      liquidityRating: 'High Liquidity',
      bids: [
        { price: 2280, qty: 180, orders: 4 },
        { price: 2270, qty: 140, orders: 3 },
        { price: 2260, qty: 150, orders: 3 },
        { price: 2250, qty: 90, orders: 2 },
        { price: 2240, qty: 60, orders: 1 }
      ],
      asks: [
        { price: 2300, qty: 100, orders: 2 },
        { price: 2310, qty: 120, orders: 3 },
        { price: 2320, qty: 110, orders: 3 },
        { price: 2330, qty: 70, orders: 2 },
        { price: 2340, qty: 50, orders: 1 }
      ]
    },
    regionalMandis: [
      { name: 'Davangere APMC, Karnataka', distanceKm: 20, quotedRate: 2280, buyerDemand: '6,100 Qtl', arrivalsRate: 'Normal' },
      { name: 'Shimoga Mandi, Karnataka', distanceKm: 82, quotedRate: 2250, buyerDemand: '3,400 Qtl', arrivalsRate: 'Moderate' },
      { name: 'Haveri APMC, Karnataka', distanceKm: 75, quotedRate: 2260, buyerDemand: '2,800 Qtl', arrivalsRate: 'Normal' },
      { name: 'Khammam Mandi, Telangana', distanceKm: 580, quotedRate: 2320, buyerDemand: '4,600 Qtl', arrivalsRate: 'Normal' }
    ]
  },
  {
    id: 'tomato-nashik',
    code: 'TOMATO_HYBRID',
    name: 'Tomato (Hybrid Red)',
    category: 'Vegetables',
    mandi: 'Nashik Market Yard, Maharashtra',
    marketCode: 'APMC_NSK',
    price: 1840,
    prevPrice: 1730,
    change: '+6.4%',
    isUp: true,
    dayHigh: 1950,
    dayLow: 1680,
    volume: '7,800 Crates (20kg)',
    agmarknetBenchmark: 1600,
    standardMSP: 1500,
    grade: 'A-Grade Firm Ripe 60-70mm',
    moisture: 'Perishable',
    basisMoisture: 0,
    maxMoistureTolerance: 0,
    moisturePenaltyPerPct: 0,
    volatility: 'Very High',
    riskLevel: 'HIGH_VOLATILITY',
    trendDirection: 'BULLISH',
    recommendation: 'SELL_NOW',
    recommendationReason: 'Highly perishable vegetable commodity currently at a +6.4% peak spike. Immediate sale advised to eliminate spoilage and glut depreciation.',
    projected7Day: 1720,
    lowerRange7Day: 1550,
    upperRange7Day: 1900,
    priceHistory: {
      '1D': [1730, 1760, 1800, 1820, 1810, 1835, 1840],
      '1W': [1620, 1660, 1710, 1750, 1780, 1810, 1840],
      '1M': [1350, 1420, 1510, 1600, 1690, 1780, 1840],
      '1Y': [1100, 1400, 2200, 1800, 1500, 1650, 1840]
    },
    forecastPoints: [
      { day: 'Day 1', price: 1850 },
      { day: 'Day 2', price: 1820 },
      { day: 'Day 3', price: 1790 },
      { day: 'Day 4', price: 1760 },
      { day: 'Day 5', price: 1740 },
      { day: 'Day 6', price: 1725 },
      { day: 'Day 7', price: 1720 }
    ],
    depth: {
      bestBid: 1840,
      bestAsk: 1880,
      spread: 40,
      spreadPct: '2.17%',
      totalBidQty: 850,
      totalAskQty: 920,
      imbalance: 'Ask Dominant (-7.9%)',
      liquidityRating: 'Fast Turnover',
      bids: [
        { price: 1840, qty: 220, orders: 5 },
        { price: 1820, qty: 190, orders: 4 },
        { price: 1800, qty: 210, orders: 4 },
        { price: 1780, qty: 130, orders: 3 },
        { price: 1760, qty: 100, orders: 2 }
      ],
      asks: [
        { price: 1880, qty: 240, orders: 4 },
        { price: 1900, qty: 260, orders: 5 },
        { price: 1920, qty: 210, orders: 4 },
        { price: 1940, qty: 120, orders: 3 },
        { price: 1960, qty: 90, orders: 2 }
      ]
    },
    regionalMandis: [
      { name: 'Nashik Market Yard, Maharashtra', distanceKm: 18, quotedRate: 1840, buyerDemand: '7,800 Crates', arrivalsRate: 'Heavy' },
      { name: 'Kolar Market, Karnataka', distanceKm: 780, quotedRate: 1780, buyerDemand: '9,200 Crates', arrivalsRate: 'Heavy' },
      { name: 'Vashi APMC, Mumbai', distanceKm: 165, quotedRate: 1980, buyerDemand: '12,000 Crates', arrivalsRate: 'High Demand' },
      { name: 'Pune Gultekdi Mandi', distanceKm: 210, quotedRate: 1910, buyerDemand: '6,400 Crates', arrivalsRate: 'Normal' }
    ]
  }
];

// Verified Institutional Buyers
export const VERIFIED_BUYERS = [
  {
    id: 'buy-1',
    name: 'ITC Agri Business Division',
    apmcLicense: 'APMC-PUN-2024-9982',
    commodities: ['Wheat', 'Basmati Paddy', 'Soybean'],
    rating: 4.9,
    offeredRateOffset: 25, // ₹25 premium above modal
    escrowGuaranteed: true,
    settlementTimeline: 'T+0 RTGS Direct to Farmer',
    capacity: '1,500 Qtl/Day'
  },
  {
    id: 'buy-2',
    name: 'Rajkot Agri-Exports Pvt Ltd',
    apmcLicense: 'APMC-GUJ-2023-4109',
    commodities: ['Cotton', 'Mustard', 'Wheat'],
    rating: 4.8,
    offeredRateOffset: 15,
    escrowGuaranteed: true,
    settlementTimeline: 'T+0 RTGS Direct to Farmer',
    capacity: '800 Qtl/Day'
  },
  {
    id: 'buy-3',
    name: 'Adani Wilmar Procurement Desk',
    apmcLicense: 'APMC-MP-2024-6721',
    commodities: ['Mustard', 'Soybean', 'Maize'],
    rating: 4.9,
    offeredRateOffset: 30,
    escrowGuaranteed: true,
    settlementTimeline: 'T+0 RTGS Direct to Farmer',
    capacity: '2,200 Qtl/Day'
  },
  {
    id: 'buy-4',
    name: 'Cargill India Food Distribution',
    apmcLicense: 'APMC-HAR-2023-5512',
    commodities: ['Wheat', 'Basmati Paddy', 'Maize'],
    rating: 4.8,
    offeredRateOffset: 20,
    escrowGuaranteed: true,
    settlementTimeline: 'T+0 RTGS Direct to Farmer',
    capacity: '1,800 Qtl/Day'
  }
];

// Live Gate Inflow & Weighbridge Arrivals
export const LIVE_GATE_ARRIVALS = [
  {
    id: 'arr-1',
    mandi: 'Ludhiana APMC, Punjab',
    crop: 'Wheat (Sharbati)',
    todayArrival: '4,250 Quintals',
    vehicleCount: '142 Vehicles',
    currentRate: 2450,
    isUp: true,
    gateStatus: 'Smooth Transit (Gate 2 & 4 Open)',
    weighbridgeWaitMinutes: 18,
    recentVehicles: [
      { vehicleNo: 'PB-10-DT-4821', weight: '42 Qtl', moisture: '11.2%', status: 'Weighed' },
      { vehicleNo: 'PB-08-AX-9912', weight: '180 Qtl', moisture: '11.6%', status: 'In Scale Queue' },
      { vehicleNo: 'PB-11-K-3341', weight: '38 Qtl', moisture: '11.0%', status: 'Weighed' }
    ]
  },
  {
    id: 'arr-2',
    mandi: 'Alwar APMC, Rajasthan',
    crop: 'Mustard Seed',
    todayArrival: '2,890 Quintals',
    vehicleCount: '98 Pickups',
    currentRate: 5680,
    isUp: true,
    gateStatus: 'Gate 1 Heavy Inflow',
    weighbridgeWaitMinutes: 32,
    recentVehicles: [
      { vehicleNo: 'RJ-02-GB-1102', weight: '22 Qtl', moisture: '8.0%', status: 'Weighed' },
      { vehicleNo: 'RJ-02-TA-8419', weight: '54 Qtl', moisture: '7.8%', status: 'In Scale Queue' }
    ]
  },
  {
    id: 'arr-3',
    mandi: 'Rajkot APMC, Gujarat',
    crop: 'Cotton (Shankar-6)',
    todayArrival: '6,400 Bales',
    vehicleCount: '210 Trucks',
    currentRate: 7140,
    isUp: false,
    gateStatus: 'Normal Inflow',
    weighbridgeWaitMinutes: 24,
    recentVehicles: [
      { vehicleNo: 'GJ-03-BW-7781', weight: '120 Bales', moisture: '8.4%', status: 'Weighed' }
    ]
  }
];

/**
 * Deterministic Net Proceeds Calculator
 * Replicates VIBEATHON high-precision math:
 * Gross Value - (Freight + Mandi Cess 1.5% + Escrow 0.5% + Handling + Moisture Penalty) = Net In-Hand
 */
export function calculateNetProceeds({
  quantityQuintals,
  ratePerQuintal,
  distanceKm = 40,
  freightPerKmPerQtl = 0.18, // ₹18/qtl per 100km
  moisturePct = 11.0,
  basisMoisturePct = 11.0,
  moisturePenaltyPerPct = 30,
  mandiCessPct = 1.5,
  escrowFeePct = 0.5,
  handlingRatePerQtl = 15
}) {
  const qty = Math.max(Number(quantityQuintals) || 0, 0.1);
  const rate = Math.max(Number(ratePerQuintal) || 0, 0);
  const dist = Math.max(Number(distanceKm) || 0, 0);

  const grossValue = Math.round(qty * rate);
  const freight = Math.round(dist * freightPerKmPerQtl * qty);
  const mandiCess = Math.round(grossValue * (mandiCessPct / 100));
  const escrowFee = Math.round(grossValue * (escrowFeePct / 100));
  const handling = Math.round(qty * handlingRatePerQtl);

  let moisturePenalty = 0;
  if (moisturePct > basisMoisturePct) {
    const excess = moisturePct - basisMoisturePct;
    moisturePenalty = Math.round(excess * moisturePenaltyPerPct * qty);
  }

  const totalDeductions = freight + mandiCess + escrowFee + handling + moisturePenalty;
  const netProceeds = Math.max(grossValue - totalDeductions, 0);
  const effectivePricePerQtl = Math.round(netProceeds / qty);
  const deductionPct = grossValue > 0 ? ((totalDeductions / grossValue) * 100).toFixed(1) : 0;

  return {
    grossValue,
    freight,
    mandiCess,
    escrowFee,
    handling,
    moisturePenalty,
    totalDeductions,
    netProceeds,
    effectivePricePerQtl,
    deductionPct
  };
}

/**
 * Compare Regional Mandis Ranked by Net In-Hand Proceeds
 */
export function compareRegionalMandis(commodity, lotQty = 100, farmerMoisture = null) {
  if (!commodity || !commodity.regionalMandis) return [];
  const moisture = farmerMoisture !== null ? Number(farmerMoisture) : parseFloat(commodity.moisture) || 11.0;

  const ranked = commodity.regionalMandis.map((m) => {
    const financials = calculateNetProceeds({
      quantityQuintals: lotQty,
      ratePerQuintal: m.quotedRate,
      distanceKm: m.distanceKm,
      moisturePct: moisture,
      basisMoisturePct: commodity.basisMoisture || 11.0,
      moisturePenaltyPerPct: commodity.moisturePenaltyPerPct || 30
    });

    return {
      ...m,
      lotQty,
      moisturePct: moisture,
      financials
    };
  });

  // Sort descending by highest Net In-Hand Proceeds
  ranked.sort((a, b) => b.financials.netProceeds - a.financials.netProceeds);
  return ranked;
}

/**
 * Economic Risk & Hold vs Liquidate Advisory
 * Warehouse storage charge: ₹18/Qtl/Month = ₹0.60/Qtl/Day
 */
export function computeRiskAdvisory(commodity, horizonDays = 7) {
  if (!commodity) return null;
  const currentPrice = commodity.price;
  const targetPrice = commodity.projected7Day;
  const holdingCostPerQtl = (horizonDays / 30) * 18; // ~₹4.20/qtl for 7 days
  const projectedGainPerQtl = targetPrice - currentPrice;
  const netAdvantage = projectedGainPerQtl - holdingCostPerQtl;

  let action = 'HOLD';
  let badgeClass = 'badge-hold';
  let riskLevel = 'LOW';
  let advice = '';

  if (commodity.riskLevel === 'HIGH_DOWNSIDE' || projectedGainPerQtl < 0) {
    action = 'LIQUIDATE IMMEDIATELY';
    badgeClass = 'badge-liquidate';
    riskLevel = 'HIGH DOWNSIDE RISK';
    advice = `Downward market pressure detected. Expected loss of ₹${Math.abs(projectedGainPerQtl).toFixed(1)}/Qtl. Liquidating immediately captures current spot liquidity.`;
  } else if (commodity.riskLevel === 'HIGH_VOLATILITY') {
    action = 'SELL NOW (PERISHABLE PEAK)';
    badgeClass = 'badge-liquidate';
    riskLevel = 'HIGH VOLATILITY';
    advice = `Spot price is at a premium spike (+${commodity.change}). Lock in gains now to avoid post-peak saturation.`;
  } else if (projectedGainPerQtl > holdingCostPerQtl * 2) {
    action = 'STRATEGIC HOLD (LOW RISK)';
    badgeClass = 'badge-hold';
    riskLevel = 'LOW MARKET RISK';
    advice = `Projected gain of +₹${projectedGainPerQtl}/Qtl exceeds ${horizonDays}-day storage cost (₹${holdingCostPerQtl.toFixed(1)}/Qtl) by ₹${netAdvantage.toFixed(1)}/Qtl. Hold to maximize proceeds.`;
  } else {
    action = 'NEUTRAL / STAGE SALES';
    badgeClass = 'badge-neutral';
    riskLevel = 'MODERATE';
    advice = `Gain is closely matched with holding cost. Liquidate in tranches if immediate liquidity is required.`;
  }

  return {
    action,
    badgeClass,
    riskLevel,
    advice,
    currentPrice,
    targetPrice,
    projectedGainPerQtl,
    holdingCostPerQtl: holdingCostPerQtl.toFixed(1),
    netAdvantage: netAdvantage.toFixed(1)
  };
}

