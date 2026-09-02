// Agri-MART Smart Dashboard Script

// 1. Navigation & Feature Switcher
const featureTitles = {
  disease: 'Crop Disease Detection',
  recommendation: 'Crop Recommendation',
  yield: 'Yield Prediction',
  growth: 'Plant Growth Monitoring',
  market: 'Market Price Tracking',
};

function showFeature(featureKey) {
  // Update sidebar nav items
  const navBtns = document.querySelectorAll('.sidebar-nav-item, .dash-nav-btn');
  navBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-feature') === featureKey);
  });

  // Update sections
  const sections = document.querySelectorAll('.dash-section');
  sections.forEach((sec) => {
    sec.classList.toggle('active', sec.id === `section-${featureKey}`);
  });

  // Update breadcrumb title
  const crumbEl = document.getElementById('activeCrumbText');
  if (crumbEl && featureTitles[featureKey]) {
    crumbEl.textContent = featureTitles[featureKey];
  }

  // Close mobile sidebar if open
  toggleSidebar(false);

  // Update hash URL without jump
  history.replaceState(null, null, `#${featureKey}`);
}

function toggleSidebar(isOpen) {
  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  if (isOpen) {
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  } else {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }
}

// 2. User Session Load & Logout
function initUserSession() {
  try {
    const rawUser = localStorage.getItem('agrimart_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const nameEl = document.getElementById('userName');
      const roleEl = document.getElementById('userRole');
      const avatarEl = document.getElementById('userAvatar');

      if (user.fullname) {
        nameEl.textContent = user.fullname;
      } else if (user.email) {
        nameEl.textContent = user.email.split('@')[0];
      }

      if (user.role) {
        const roleMap = {
          farmer: 'Cultivator / Grower',
          student: 'Agri-Scholar / Student',
          agronomist: 'Advisor / Agronomist',
          supplier: 'Merchant / Supplier',
        };
        roleEl.textContent = roleMap[user.role] || user.role;
      }

      if (user.role === 'agronomist' || user.role === 'student') {
        avatarEl.textContent = '🔬';
      } else if (user.role === 'supplier') {
        avatarEl.textContent = '🏬';
      }
    }
  } catch (e) {
    console.error('Session load error:', e);
  }
}

function logoutUser() {
  if (confirm('Are you sure you want to sign out of your Agri-MART dashboard?')) {
    localStorage.removeItem('agrimart_user');
    window.location.href = 'login.html';
  }
}

// 3. Crop Disease Detection Simulator
const sampleDiseases = {
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

let currentSelectedSample = null;

function loadSampleDisease(key) {
  const sample = sampleDiseases[key];
  if (!sample) return;

  currentSelectedSample = sample;

  const dropPrompt = document.getElementById('dropZonePrompt');
  const previewBox = document.getElementById('imagePreviewBox');
  const previewImg = document.getElementById('previewImg');
  const previewTag = document.getElementById('previewTag');

  if (previewTag) {
    previewTag.textContent = sample.crop;
  }

  dropPrompt.style.display = 'none';
  previewBox.style.display = 'block';
  previewImg.src = sample.imgUrl;
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const dropPrompt = document.getElementById('dropZonePrompt');
    const previewBox = document.getElementById('imagePreviewBox');
    const previewImg = document.getElementById('previewImg');
    const previewTag = document.getElementById('previewTag');

    if (previewTag) {
      previewTag.textContent = file.name || 'Custom Uploaded Leaf';
    }

    dropPrompt.style.display = 'none';
    previewBox.style.display = 'block';
    previewImg.src = event.target.result;

    currentSelectedSample = sampleDiseases.tomato_early_blight;
  };
  reader.readAsDataURL(file);
}

function runDiseaseScan() {
  const previewBox = document.getElementById('imagePreviewBox');
  if (previewBox.style.display === 'none' || !currentSelectedSample) {
    alert('Please upload an image or click one of the quick test sample buttons below!');
    return;
  }

  const laser = document.getElementById('scanLaser');
  const btn = document.getElementById('btnRunDiagnosis');
  const placeholder = document.getElementById('diseaseResultPlaceholder');
  const resultContent = document.getElementById('diseaseResultContent');

  laser.classList.add('scanning');
  btn.disabled = true;
  btn.innerHTML = `<span>AI Neural Analysis in Progress...</span>`;

  setTimeout(() => {
    laser.classList.remove('scanning');
    btn.disabled = false;
    btn.innerHTML = `<span>Run AI Diagnostic Scan</span>`;

    const data = currentSelectedSample || sampleDiseases.tomato_early_blight;

    document.getElementById('diagCropName').textContent = data.crop;
    document.getElementById('diagDiseaseName').textContent = data.disease;
    document.getElementById('diagConfidence').textContent = `${data.confidence} Confidence`;
    document.getElementById('diagBarFill').style.width = data.barWidth;
    document.getElementById('diagSymptoms').textContent = data.symptoms;

    const listEl = document.getElementById('diagTreatmentList');
    listEl.innerHTML = data.treatments.map((t) => `<li>${t}</li>`).join('');

    placeholder.classList.add('hidden');
    resultContent.classList.remove('hidden');
  }, 1400);
}

// 4. Crop Recommendation Engine
function loadSoilPreset(type) {
  if (type === 'alluvial') {
    document.getElementById('inputN').value = 90;
    document.getElementById('inputP').value = 42;
    document.getElementById('inputK').value = 43;
    document.getElementById('inputPh').value = 6.5;
    document.getElementById('inputRainfall').value = 210;
    document.getElementById('inputTemp').value = 26;
    document.getElementById('inputHumidity').value = 82;
  } else if (type === 'black') {
    document.getElementById('inputN').value = 118;
    document.getElementById('inputP').value = 52;
    document.getElementById('inputK').value = 19;
    document.getElementById('inputPh').value = 7.2;
    document.getElementById('inputRainfall').value = 85;
    document.getElementById('inputTemp').value = 31;
    document.getElementById('inputHumidity').value = 58;
  } else if (type === 'red') {
    document.getElementById('inputN').value = 75;
    document.getElementById('inputP').value = 35;
    document.getElementById('inputK').value = 28;
    document.getElementById('inputPh').value = 5.8;
    document.getElementById('inputRainfall').value = 110;
    document.getElementById('inputTemp').value = 28;
    document.getElementById('inputHumidity').value = 65;
  }
}

function calculateCropRecommendation(e) {
  e.preventDefault();
  const n = parseFloat(document.getElementById('inputN').value);
  const rainfall = parseFloat(document.getElementById('inputRainfall').value);
  const ph = parseFloat(document.getElementById('inputPh').value);

  const resContainer = document.getElementById('recResults');

  let topCrop, secondCrop, thirdCrop;

  if (rainfall > 160) {
    topCrop = { emoji: '🌾', title: 'Rice (Paddy)', match: '98.4%', yield: '4.8 - 5.5 Tonnes / Acre', desc: 'High rainfall and adequate nitrogen create prime flooded and loamy conditions for heavy rice panicle growth.' };
    secondCrop = { emoji: '🌽', title: 'Maize (Corn)', match: '89.1%', desc: 'Strong secondary alternative with moderate drought resilience.' };
    thirdCrop = { emoji: '🌱', title: 'Jute & Pulses', match: '84.0%', desc: 'Ideal for rotational nitrogen stabilization.' };
  } else if (n > 100) {
    topCrop = { emoji: '☁️', title: 'Cotton (Bt-Cotton)', match: '96.5%', yield: '1.2 - 1.8 Tonnes / Acre', desc: 'High nitrogen supply and warm temperatures optimize vegetative branch formation and boll weight.' };
    secondCrop = { emoji: '🌾', title: 'Wheat (Durum)', match: '91.2%', desc: 'Thrives in rich soil matrix during Rabi cooler cycles.' };
    thirdCrop = { emoji: '🌻', title: 'Sunflower / Mustard', match: '86.4%', desc: 'Excellent deep root nutrient extraction.' };
  } else {
    topCrop = { emoji: '🥔', title: 'Potato & Tubers', match: '95.1%', yield: '8.5 - 11 Tonnes / Acre', desc: 'Moderate pH and well-drained soil structure foster superior tuber expansion.' };
    secondCrop = { emoji: '🍅', title: 'Tomato / Vegetables', match: '90.3%', desc: 'Strong commercial market returns with balanced irrigation.' };
    thirdCrop = { emoji: '🥜', title: 'Groundnut / Peanuts', match: '87.5%', desc: 'High nitrogen fixing capability for soil rejuvenation.' };
  }

  resContainer.innerHTML = `
    <div class="rec-crop-card top-choice">
      <div class="crop-header">
        <span class="crop-emoji">${topCrop.emoji}</span>
        <div>
          <div class="rec-rank">#1 Prime Recommendation (${topCrop.match} Match)</div>
          <h4>${topCrop.title}</h4>
        </div>
      </div>
      <p>${topCrop.desc}</p>
      <div class="crop-metrics">
        <div><strong>Expected Yield:</strong> ${topCrop.yield}</div>
        <div><strong>Suitability:</strong> Certified for your climate zone</div>
      </div>
    </div>

    <div class="rec-crop-card">
      <div class="crop-header">
        <span class="crop-emoji">${secondCrop.emoji}</span>
        <div>
          <div class="rec-rank">#2 Secondary Alternative (${secondCrop.match} Match)</div>
          <h4>${secondCrop.title}</h4>
        </div>
      </div>
      <p>${secondCrop.desc}</p>
    </div>

    <div class="rec-crop-card">
      <div class="crop-header">
        <span class="crop-emoji">${thirdCrop.emoji}</span>
        <div>
          <div class="rec-rank">#3 Tertiary Option (${thirdCrop.match} Match)</div>
          <h4>${thirdCrop.title}</h4>
        </div>
      </div>
      <p>${thirdCrop.desc}</p>
    </div>
  `;
}

// 5. Yield Calculator
const cropYieldMultipliers = {
  wheat: { basePerAcre: 3.8, mspPerQtl: 2275, name: 'Wheat' },
  rice: { basePerAcre: 4.9, mspPerQtl: 2200, name: 'Rice' },
  cotton: { basePerAcre: 1.4, mspPerQtl: 6620, name: 'Cotton' },
  sugarcane: { basePerAcre: 35.0, mspPerQtl: 315, name: 'Sugarcane' },
  tomato: { basePerAcre: 14.0, mspPerQtl: 1600, name: 'Tomato' },
  soybean: { basePerAcre: 1.8, mspPerQtl: 4600, name: 'Soybean' },
};

function updateYieldDefaults() {
  calculateYield(new Event('submit'));
}

function calculateYield(e) {
  if (e && e.preventDefault) e.preventDefault();

  const crop = document.getElementById('yieldCropSelect').value;
  const acres = parseFloat(document.getElementById('yieldLandSize').value) || 1;
  const irrigation = document.getElementById('yieldIrrigation').value;
  const fertilizer = document.getElementById('yieldFertilizer').value;

  const cropData = cropYieldMultipliers[crop] || cropYieldMultipliers.rice;

  let irrigMultiplier = 1.0;
  if (irrigation === 'drip') irrigMultiplier = 1.2;
  else if (irrigation === 'sprinkler') irrigMultiplier = 1.1;
  else if (irrigation === 'rainfed') irrigMultiplier = 0.82;

  let fertMultiplier = 1.0;
  if (fertilizer === 'balanced') fertMultiplier = 1.12;
  else if (fertilizer === 'pure_organic') fertMultiplier = 0.95;

  const yieldPerAcre = cropData.basePerAcre * irrigMultiplier * fertMultiplier;
  const totalTonnes = (yieldPerAcre * acres).toFixed(1);
  const totalQuintals = totalTonnes * 10;
  const grossRevenue = Math.round(totalQuintals * cropData.mspPerQtl);

  document.getElementById('resTotalYield').textContent = `${totalTonnes} Tonnes`;
  document.getElementById('resYieldPerAcre').textContent = `~${yieldPerAcre.toFixed(2)} Tonnes / Acre`;
  document.getElementById('resEstRevenue').textContent = `₹ ${grossRevenue.toLocaleString('en-IN')}`;
}

// 6. Market Mandi Search Filter
function filterMandiTable() {
  const input = document.getElementById('mandiSearch');
  const filter = input.value.toLowerCase();
  const table = document.getElementById('mandiTable');
  const tr = table.getElementsByTagName('tr');

  for (let i = 1; i < tr.length; i++) {
    const text = tr[i].textContent || tr[i].innerText;
    tr[i].style.display = text.toLowerCase().includes(filter) ? '' : 'none';
  }
}

// 7. Initializer
document.addEventListener('DOMContentLoaded', () => {
  initUserSession();

  // Check URL hash or query params to open specific feature
  const hash = window.location.hash.replace('#', '');
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab') || hash;

  const validTabs = ['disease', 'recommendation', 'yield', 'growth', 'market'];
  if (validTabs.includes(tab)) {
    showFeature(tab);
  } else {
    showFeature('disease');
  }

  // Auto-close sidebar when clicking anywhere on the right-side workspace
  const workspace = document.querySelector('.dash-workspace-panel');
  if (workspace) {
    workspace.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-open-pill-btn') && !e.target.closest('.dash-sidebar')) {
        toggleSidebar(false);
      }
    });
  }
});
