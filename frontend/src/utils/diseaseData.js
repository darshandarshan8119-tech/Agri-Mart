// Sample disease data extracted from dashboard.js
export const sampleDiseases = {
  tomato_early_blight: {
    crop: 'Tomato (Solanum lycopersicum)',
    disease: 'Early Blight (Alternaria solani)',
    confidence: '96.8%',
    barWidth: '96.8%',
    symptoms: 'Dark brown concentric ring spots on lower foliage leading to chlorosis and rapid leaf desiccation.',
    treatments: [
      'Prune and destroy infected bottom foliage; keep field clear of solanaceous weeds.',
      'Apply Mancozeb 75 WP (2g/L) or Copper Oxychloride 50 WP (2.5g/L) foliar spray.',
      'Transition irrigation to ground drip to prevent water splashing spores onto leaves.',
    ],
    imgUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22511?auto=format&fit=crop&w=600&q=80',
  },
  corn_rust: {
    crop: 'Maize / Corn (Zea mays)',
    disease: 'Common Rust (Puccinia sorghi)',
    confidence: '94.2%',
    barWidth: '94.2%',
    symptoms: 'Golden-brown to cinnamon pustules erupting across upper and lower leaf surfaces.',
    treatments: [
      'Apply Azoxystrobin + Difenoconazole fungicide solution at early pustule onset.',
      'Maintain adequate potassium (K) nutrition to bolster leaf cuticle strength.',
      'Rotate with non-cereal legumes in succeeding planting cycle.',
    ],
    imgUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  },
  healthy_rice: {
    crop: 'Paddy / Rice (Oryza sativa)',
    disease: 'Healthy Leaf Canopy (No Pathogens Detected)',
    confidence: '98.9%',
    barWidth: '98.9%',
    symptoms: 'Uniform chlorophyll distribution, clear vascular venation, zero necrotic lesions.',
    treatments: [
      'Maintain standard basal nitrogen dosing schedule.',
      'Continue intermittent wetting and drying (AWD) water management.',
      'Monitor for stem borer and gall midge periodically.',
    ],
    imgUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
  },
};
