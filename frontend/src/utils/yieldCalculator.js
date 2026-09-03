// Yield calculator logic extracted from dashboard.js
export const cropYieldMultipliers = {
  wheat:     { basePerAcre: 3.8,  mspPerQtl: 2275, name: 'Wheat' },
  rice:      { basePerAcre: 4.9,  mspPerQtl: 2200, name: 'Rice' },
  cotton:    { basePerAcre: 1.4,  mspPerQtl: 6620, name: 'Cotton' },
  sugarcane: { basePerAcre: 35.0, mspPerQtl: 315,  name: 'Sugarcane' },
  tomato:    { basePerAcre: 14.0, mspPerQtl: 1600, name: 'Tomato' },
  soybean:   { basePerAcre: 1.8,  mspPerQtl: 4600, name: 'Soybean' },
};

export function calculateYield({ crop, acres, irrigation, fertilizer }) {
  const cropData = cropYieldMultipliers[crop] || cropYieldMultipliers.rice;

  const irrigMap = { drip: 1.2, sprinkler: 1.1, canal: 1.0, rainfed: 0.82 };
  const fertMap  = { balanced: 1.12, chemical: 1.0, pure_organic: 0.95 };

  const irrigMultiplier = irrigMap[irrigation] ?? 1.0;
  const fertMultiplier  = fertMap[fertilizer]  ?? 1.0;

  const yieldPerAcre  = cropData.basePerAcre * irrigMultiplier * fertMultiplier;
  const totalTonnes   = (yieldPerAcre * acres).toFixed(1);
  const totalQuintals = totalTonnes * 10;
  const grossRevenue  = Math.round(totalQuintals * cropData.mspPerQtl);

  return {
    totalTonnes,
    yieldPerAcre: yieldPerAcre.toFixed(2),
    grossRevenue: grossRevenue.toLocaleString('en-IN'),
    mspPerQtl: cropData.mspPerQtl,
    cropName: cropData.name,
  };
}
