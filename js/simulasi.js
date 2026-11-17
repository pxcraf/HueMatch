/**
 * HueMatch — simulasi.js
 * Logic for the color mixing simulator.
 * Algorithm: Average RGB values of Color A and Color B.
 */

/* ---------- State ---------- */
let mixHistory = [];

/* ---------- Init: Live HEX display on input change ---------- */
document.addEventListener('DOMContentLoaded', function () {
  const colorA = document.getElementById('colorA');
  const colorB = document.getElementById('colorB');
  const hexA   = document.getElementById('hexA');
  const hexB   = document.getElementById('hexB');

  if (!colorA || !colorB) return;

  colorA.addEventListener('input', () => {
    hexA.textContent = colorA.value.toUpperCase();
    hexA.style.color = getContrastColor(colorA.value);
    hexA.style.background = colorA.value;
    hexA.style.borderColor = colorA.value;
    if (window.hue3D && window.hue3D.updateMixerColors) {
      window.hue3D.updateMixerColors(colorA.value, colorB.value, null, false);
    }
  });

  colorB.addEventListener('input', () => {
    hexB.textContent = colorB.value.toUpperCase();
    hexB.style.color = getContrastColor(colorB.value);
    hexB.style.background = colorB.value;
    hexB.style.borderColor = colorB.value;
    if (window.hue3D && window.hue3D.updateMixerColors) {
      window.hue3D.updateMixerColors(colorA.value, colorB.value, null, false);
    }
  });

  // Initialize display colors
  updateHexDisplay(colorA, hexA);
  updateHexDisplay(colorB, hexB);


});

function updateHexDisplay(input, display) {
  display.textContent = input.value.toUpperCase();
  display.style.color = getContrastColor(input.value);
  display.style.background = input.value;
  display.style.borderColor = input.value;
}

/* ---------- Core Mixing Logic ---------- */

/**
 * Parse HEX color string to RGB object.
 * @param {string} hex - e.g. "#FF6B35"
 * @returns {{r: number, g: number, b: number}}
 */
function hexToRGB(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Convert RGB values to HEX string.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} e.g. "#FF6B35"
 */
function rgbToHex(r, g, b) {
  const toHex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Mix two colors by averaging their RGB values.
 * @param {string} hexA
 * @param {string} hexB
 * @returns {{hex: string, r: number, g: number, b: number}}
 */
function mixColors(hexA, hexB) {
  const a = hexToRGB(hexA);
  const b = hexToRGB(hexB);
  const r = (a.r + b.r) / 2;
  const g = (a.g + b.g) / 2;
  const bl = (a.b + b.b) / 2;
  return {
    hex: rgbToHex(r, g, bl),
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(bl),
  };
}

/**
 * Calculate perceived brightness (0-255).
 * Uses the luminance formula.
 */
function getBrightness(r, g, b) {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

/**
 * Return white or dark color for contrast against a background.
 */
function getContrastColor(hex) {
  try {
    const { r, g, b } = hexToRGB(hex);
    return getBrightness(r, g, b) > 128 ? '#0D0D1A' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
}

/**
 * Classify a color by its hue category.
 */
function classifyColor(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = getBrightness(r, g, b);

  // Achromatic check
  if (max - min < 20) {
    if (brightness < 40) return 'Hitam';
    if (brightness > 215) return 'Putih';
    return 'Abu-abu';
  }

  // Determine dominant hue
  let h = 0;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  if (h < 15 || h >= 345) return 'Merah';
  if (h < 40) return 'Merah-Oranye';
  if (h < 65) return 'Oranye';
  if (h < 80) return 'Kuning-Oranye';
  if (h < 100) return 'Kuning';
  if (h < 130) return 'Kuning-Hijau';
  if (h < 165) return 'Hijau';
  if (h < 195) return 'Hijau-Cyan';
  if (h < 225) return 'Cyan / Biru-Hijau';
  if (h < 255) return 'Biru';
  if (h < 280) return 'Biru-Ungu';
  if (h < 320) return 'Ungu / Violet';
  if (h < 345) return 'Merah-Ungu / Magenta';
  return 'Merah';
}



/* ---------- Main Action: campurkanWarna() ---------- */

/**
 * Main function called when user clicks "Campurkan!".
 */
function campurkanWarna() {
  const colorA = document.getElementById('colorA');
  const colorB = document.getElementById('colorB');
  const resultArea = document.getElementById('resultArea');

  if (!colorA || !colorB) return;

  const hexA = colorA.value;
  const hexB = colorB.value;

  // Mix
  const mixed = mixColors(hexA, hexB);
  const { hex: mixedHex, r, g, b } = mixed;
  const brightness = getBrightness(r, g, b);
  const brightnessLabel = brightness < 85 ? `Gelap (${brightness})` : brightness < 170 ? `Sedang (${brightness})` : `Terang (${brightness})`;
  const category = classifyColor(r, g, b);
  const textColor = getContrastColor(mixedHex);

  // Update Real 3D Mixer Canvas
  if (window.hue3D && window.hue3D.updateMixerColors) {
    window.hue3D.updateMixerColors(hexA, hexB, mixedHex, true);
  }

  // Update result preview
  document.getElementById('resultPreview').style.background = mixedHex;
  const hexLabel = document.getElementById('resultHexLabel');
  hexLabel.textContent = mixedHex;

  // Dinamis: warna kotak berubah jadi hitam atau putih sesuai tingkat kecerahan warna yang didapat
  if (brightness < 128) {
    // Warna hasil GELAP -> Kotak jadi PUTIH, tulisan HITAM
    hexLabel.style.backgroundColor = '#FFFFFF';
    hexLabel.style.color = '#18181B';
    hexLabel.style.borderColor = '#18181B';
    hexLabel.style.boxShadow = '3px 3px 0 #18181B';
  } else {
    // Warna hasil TERANG -> Kotak jadi HITAM, tulisan PUTIH
    hexLabel.style.backgroundColor = '#18181B';
    hexLabel.style.color = '#FFFFFF';
    hexLabel.style.borderColor = '#FFFFFF';
    hexLabel.style.boxShadow = '3px 3px 0 rgba(0,0,0,0.35)';
  }

  // Update info rows
  document.getElementById('result-hex').textContent = mixedHex;
  document.getElementById('result-rgb').textContent = `rgb(${r}, ${g}, ${b})`;
  document.getElementById('result-brightness').textContent = brightnessLabel;
  document.getElementById('result-category').textContent = category;


  // Show result area
  resultArea.style.display = 'block';
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Store current result for copy
  window._lastMixedHex = mixedHex;



  // Animate mix icon
  const icon = document.getElementById('mix-icon');
  if (icon) {
    icon.style.transform = 'scale(1.5) rotate(180deg)';
    setTimeout(() => {
      icon.style.transition = 'transform 0.5s ease';
      icon.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  }
}

/* ---------- Preset Colors ---------- */
function setPreset(hexA, hexB) {
  const inputA = document.getElementById('colorA');
  const inputB = document.getElementById('colorB');
  const dispA  = document.getElementById('hexA');
  const dispB  = document.getElementById('hexB');

  if (!inputA || !inputB) return;

  inputA.value = hexA;
  inputB.value = hexB;

  updateHexDisplay(inputA, dispA);
  updateHexDisplay(inputB, dispB);

  // Auto mix after a short delay for effect
  setTimeout(() => campurkanWarna(), 200);
}

/* ---------- Random Colors ---------- */
function randomColors() {
  const randomHex = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return rgbToHex(r, g, b);
  };

  const inputA = document.getElementById('colorA');
  const inputB = document.getElementById('colorB');
  const dispA  = document.getElementById('hexA');
  const dispB  = document.getElementById('hexB');

  if (!inputA || !inputB) return;

  inputA.value = randomHex();
  inputB.value = randomHex();
  updateHexDisplay(inputA, dispA);
  updateHexDisplay(inputB, dispB);

  setTimeout(() => campurkanWarna(), 200);
}

/* ---------- Copy HEX Code ---------- */
function copyHexCode() {
  const hex = window._lastMixedHex;
  if (!hex) return;

  const btn = document.getElementById('btn-copy-hex');
  navigator.clipboard.writeText(hex).then(() => {
    if (btn) {
      btn.textContent = 'Tersalin!';
      btn.style.color = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-clipboard"></i> Salin HEX';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    }
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('input');
    el.value = hex;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (btn) {
      btn.textContent = 'Tersalin!';
      setTimeout(() => { btn.innerHTML = '<i class="fi fi-sr-copy"></i> Salin Kode HEX'; }, 2000);
    }
  });
}


