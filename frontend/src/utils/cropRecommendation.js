// Crop recommendation logic extracted from dashboard.js
export function calculateCropRecommendation({ N, rainfall, ph }) {
  let topCrop, secondCrop, thirdCrop;

  if (rainfall > 160) {
    topCrop = { emoji: '🌾', title: 'Rice (Paddy)', match: '98.4%', yield: '4.8 - 5.5 Tonnes / Acre', desc: 'High rainfall and adequate nitrogen create prime flooded and loamy conditions for heavy rice panicle growth.' };
    secondCrop = { emoji: '🌽', title: 'Maize (Corn)', match: '89.1%', desc: 'Strong secondary alternative with moderate drought resilience.' };
    thirdCrop = { emoji: '🌱', title: 'Jute & Pulses', match: '84.0%', desc: 'Ideal for rotational nitrogen stabilization.' };
  } else if (N > 100) {
    topCrop = { emoji: '☁️', title: 'Cotton (Bt-Cotton)', match: '96.5%', yield: '1.2 - 1.8 Tonnes / Acre', desc: 'High nitrogen supply and warm temperatures optimize vegetative branch formation and boll weight.' };
    secondCrop = { emoji: '🌾', title: 'Wheat (Durum)', match: '91.2%', desc: 'Thrives in rich soil matrix during Rabi cooler cycles.' };
    thirdCrop = { emoji: '🌻', title: 'Sunflower / Mustard', match: '86.4%', desc: 'Excellent deep root nutrient extraction.' };
  } else {
    topCrop = { emoji: '🥔', title: 'Potato & Tubers', match: '95.1%', yield: '8.5 - 11 Tonnes / Acre', desc: 'Moderate pH and well-drained soil structure foster superior tuber expansion.' };
    secondCrop = { emoji: '🍅', title: 'Tomato / Vegetables', match: '90.3%', desc: 'Strong commercial market returns with balanced irrigation.' };
    thirdCrop = { emoji: '🥜', title: 'Groundnut / Peanuts', match: '87.5%', desc: 'High nitrogen fixing capability for soil rejuvenation.' };
  }

  return { topCrop, secondCrop, thirdCrop };
}

export const soilPresets = {
  alluvial: { N: 90, P: 42, K: 43, ph: 6.5, rainfall: 210, temp: 26, humidity: 82 },
  black:    { N: 118, P: 52, K: 19, ph: 7.2, rainfall: 85,  temp: 31, humidity: 58 },
  red:      { N: 75,  P: 35, K: 28, ph: 5.8, rainfall: 110, temp: 28, humidity: 65 },
};
