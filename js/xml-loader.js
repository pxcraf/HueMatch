/**
 * HueMatch — xml-loader.js
 * Handles fetching, parsing, and rendering XML data with embedded fallback support.
 * Guaranteed 100% load reliability even under local file:// protocol.
 */

/* ── EMBEDDED XML FALLBACK DATA ── */
const EMBEDDED_MATERI_XML = `<?xml version="1.0" encoding="UTF-8"?>
<materi>
  <section id="pengantar">
    <judul>Apa Itu Teori Warna?</judul>
    <deskripsi>Teori warna adalah sekumpulan panduan tentang cara warna berinteraksi satu sama lain. Dikembangkan oleh ilmuwan dan seniman selama berabad-abad, teori ini menjadi fondasi dalam desain grafis, seni, arsitektur, dan komunikasi visual.</deskripsi>
    <fakta>Lebih dari 10 juta warna berbeda dapat dideteksi oleh mata manusia normal!</fakta>
  </section>

  <section id="primer">
    <judul>Warna Primer</judul>
    <deskripsi>Warna primer adalah warna dasar murni yang tidak dapat dibuat dengan mencampurkan warna lain. Dalam model warna pigmen seni (RYB), terdapat 3 warna primer yang menjadi sumber seluruh warna lainnya.</deskripsi>
    <warna>
      <item>
        <nama>Merah</nama>
        <hex>#FF2D2D</hex>
        <deskripsi>Warna energi, gairah, dan ketegasan. Merah memiliki panjang gelombang terpanjang dan paling cepat menarik fokus pandangan manusia.</deskripsi>
        <simbolisme>Gairah, Keberanian, Energi, Bahaya</simbolisme>
      </item>
      <item>
        <nama>Kuning</nama>
        <hex>#FFD700</hex>
        <deskripsi>Warna keceriaan, optimisme, dan intelektualitas. Kuning adalah warna paling cerah yang dapat ditangkap retina mata kita.</deskripsi>
        <simbolisme>Kebahagiaan, Optimisme, Kreativitas, Hangat</simbolisme>
      </item>
      <item>
        <nama>Biru</nama>
        <hex>#1E90FF</hex>
        <deskripsi>Warna ketenangan, kedalaman, dan stabilitas. Biru adalah warna paling disukai di seluruh dunia karena asosiasinya dengan langit dan laut.</deskripsi>
        <simbolisme>Kepercayaan, Damai, Kestabilan, Profesional</simbolisme>
      </item>
    </warna>
  </section>

  <section id="sekunder">
    <judul>Warna Sekunder</judul>
    <deskripsi>Warna sekunder lahir dari perpaduan dua warna primer dalam proporsi seimbang 50:50. Tiga warna ini menyempurnakan struktur lingkaran warna dasar.</deskripsi>
    <warna>
      <item>
        <nama>Oranye</nama>
        <hex>#FF8C00</hex>
        <campuran>Merah + Kuning</campuran>
        <deskripsi>Oranye memancarkan kehangatan dan antusiasme tinggi. Kombinasi energi merah dengan keceriaan kuning membuatnya sangat menggugah selera.</deskripsi>
      </item>
      <item>
        <nama>Hijau</nama>
        <hex>#22C55E</hex>
        <campuran>Kuning + Biru</campuran>
        <deskripsi>Hijau identik dengan alam, kesegaran, dan pertumbuhan. Spektrum ini memberikan efek relaksasi paling tinggi bagi mata manusia.</deskripsi>
      </item>
      <item>
        <nama>Ungu</nama>
        <hex>#8B00FF</hex>
        <campuran>Merah + Biru</campuran>
        <deskripsi>Ungu melambangkan kemewahan, imajinasi, dan misteri. Menyeimbangkan stabilitas dingin biru dengan intensitas hangat merah.</deskripsi>
      </item>
    </warna>
  </section>

  <section id="tersier">
    <judul>Warna Tersier</judul>
    <deskripsi>Warna tersier dihasilkan dari campuran satu warna primer dengan satu warna sekunder yang bersebelahan pada roda warna, menghasilkan 6 nuansa transisi kaya karakter.</deskripsi>
    <warna>
      <item>
        <nama>Merah-Oranye</nama>
        <hex>#FF4500</hex>
        <campuran>Merah + Oranye</campuran>
      </item>
      <item>
        <nama>Kuning-Oranye</nama>
        <hex>#FFA500</hex>
        <campuran>Kuning + Oranye</campuran>
      </item>
      <item>
        <nama>Kuning-Hijau</nama>
        <hex>#9ACD32</hex>
        <campuran>Kuning + Hijau</campuran>
      </item>
      <item>
        <nama>Biru-Hijau</nama>
        <hex>#00CED1</hex>
        <campuran>Biru + Hijau</campuran>
      </item>
      <item>
        <nama>Biru-Ungu</nama>
        <hex>#6A0DAD</hex>
        <campuran>Biru + Ungu</campuran>
      </item>
      <item>
        <nama>Merah-Ungu</nama>
        <hex>#C71585</hex>
        <campuran>Merah + Ungu</campuran>
      </item>
    </warna>
  </section>

  <section id="rgbcmyk">
    <judul>Model Warna: RGB vs CMYK</judul>
    <deskripsi>Dua sistem warna utama yang digunakan untuk dua medium yang sangat berbeda: layar elektronik pencahayaan dan cetak fisik pigmen tinta.</deskripsi>
    <rgbcmyk>
      <item type="rgb">
        <nama>RGB (Red, Green, Blue)</nama>
        <deskripsi>Sistem warna aditif berbasis berkas cahaya. Digunakan pada layar monitor, HP, TV, dan LED. Penggabungan ketiga cahaya dengan intensitas 100% menghasilkan cahaya putih murni.</deskripsi>
      </item>
      <item type="cmyk">
        <nama>CMYK (Cyan, Magenta, Yellow, Black)</nama>
        <deskripsi>Sistem warna substraktif berbasis pigmen tinta cetak fisik. Tinta menyerap cahaya pantul. Penggabungan tinta menyerap spektrum dan menghasilkan warna gelap pekat (Black/K).</deskripsi>
      </item>
    </rgbcmyk>
  </section>

  <section id="suhu">
    <judul>Suhu Warna: Hangat vs Dingin</judul>
    <deskripsi>Pembagian psikologis roda warna berdasarkan sensasi temperatur visual dan mood emosional yang ditimbulkan pada manusia.</deskripsi>
    <suhu>
      <item type="hot">
        <nama>Warna Hangat (Warm Colors)</nama>
        <deskripsi>Kelompok warna dari merah hingga kuning. Memberikan kesan dinamis, intim, energik, dan tampak bergerak mendekati mata penonton.</deskripsi>
      </item>
      <item type="cold">
        <nama>Warna Dingin (Cool Colors)</nama>
        <deskripsi>Kelompok warna dari biru, hijau hingga ungu muda. Memberikan efek menenangkan, luas, damai, dan tampak mundur ke latar belakang.</deskripsi>
      </item>
    </suhu>
  </section>

  <section id="harmoni">
    <judul>Harmoni Warna Desain</judul>
    <deskripsi>Skema kombinasi warna matematis yang terbukti menghasilkan keseimbangan estetika visual profesional dalam desain grafis dan seni rupa.</deskripsi>
    <kombinasi>
      <item>
        <nama>Komplementer</nama>
        <warna1>#FF2D2D</warna1>
        <warna2>#22C55E</warna2>
        <deskripsi>Dua warna yang tepat berseberangan di roda warna. Menghasilkan kontras paling dramatis dan daya tarik visual tinggi.</deskripsi>
      </item>
      <item>
        <nama>Analogus</nama>
        <warna1>#FF2D2D</warna1>
        <warna2>#FF8C00</warna2>
        <deskripsi>Warna-warna yang bertetangga berdampingan di roda warna. Menciptakan suasana visual yang tenang, serasi, dan harmonis.</deskripsi>
      </item>
      <item>
        <nama>Triadik</nama>
        <warna1>#FF2D2D</warna1>
        <warna2>#FFD700</warna2>
        <deskripsi>Tiga warna berjarak sama 120° di roda warna. Memberikan warna-warni yang kaya dan ceria namun tetap seimbang.</deskripsi>
      </item>
      <item>
        <nama>Tetradik (Segi Empat)</nama>
        <warna1>#FF2D2D</warna1>
        <warna2>#1E90FF</warna2>
        <deskripsi>Empat warna yang membentuk persegi panjang di roda warna. Menawarkan variasi palet melimpah untuk proyek kompleks.</deskripsi>
      </item>
      <item>
        <nama>Monokromatik</nama>
        <warna1>#1E90FF</warna1>
        <warna2>#9EC9E2</warna2>
        <deskripsi>Satu warna dasar dengan berbagai variasi tingkat kecerahan (tint) dan kegelapan (shade). Memberikan kesan elegan dan bersih.</deskripsi>
      </item>
      <item>
        <nama>Split Komplementer</nama>
        <warna1>#FF2D2D</warna1>
        <warna2>#00CED1</warna2>
        <deskripsi>Satu warna dasar dipadukan dengan dua warna yang bersebelahan dengan warna komplemennya. Kontras kuat tanpa kesan agresif.</deskripsi>
      </item>
    </kombinasi>
  </section>
</materi>`;

const EMBEDDED_KUIS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<kuis>
  <metadata>
    <judul>Kuis Teori Warna — HueMatch</judul>
    <total_soal>10</total_soal>
  </metadata>
  <soal>
    <item id="1">
      <pertanyaan>Warna apa saja yang termasuk dalam kelompok warna PRIMER dalam model warna pigmen RYB?</pertanyaan>
      <pilihan>
        <a>Merah, Hijau, Biru</a>
        <b>Merah, Kuning, Biru</b>
        <c>Merah, Oranye, Ungu</c>
        <d>Cyan, Magenta, Kuning</d>
      </pilihan>
      <jawaban>b</jawaban>
      <penjelasan>Dalam model pigmen lukis tradisional RYB (Red, Yellow, Blue), tiga warna primer murni adalah Merah, Kuning, dan Biru. Warna ini tidak dapat dibentuk dari campuran warna lain.</penjelasan>
    </item>
    <item id="2">
      <pertanyaan>Apa warna yang dihasilkan dari percampuran seimbang warna Merah dan Kuning?</pertanyaan>
      <pilihan>
        <a>Ungu</a>
        <b>Hijau</b>
        <c>Oranye</c>
        <d>Cokelat</d>
      </pilihan>
      <jawaban>c</jawaban>
      <penjelasan>Merah + Kuning = Oranye. Oranye merupakan salah satu dari tiga warna sekunder dasar.</penjelasan>
    </item>
    <item id="3">
      <pertanyaan>Berapa jumlah total warna TERSIER yang ada pada roda warna standar 12 nada?</pertanyaan>
      <pilihan>
        <a>3 Warna</a>
        <b>4 Warna</b>
        <c>6 Warna</c>
        <d>12 Warna</d>
      </pilihan>
      <jawaban>c</jawaban>
      <penjelasan>Terdapat 6 warna tersier: Merah-Oranye, Kuning-Oranye, Kuning-Hijau, Biru-Hijau, Biru-Ungu, dan Merah-Ungu. Masing-masing dibuat dari campuran 1 primer + 1 sekunder berdampingan.</penjelasan>
    </item>
    <item id="4">
      <pertanyaan>Apa yang dimaksud dengan skema warna KOMPLEMENTER?</pertanyaan>
      <pilihan>
        <a>Warna-warna yang saling berdekatan pada roda warna</a>
        <b>Dua warna yang saling berseberangan langsung pada roda warna</b>
        <c>Kombinasi warna dari gradasi gelap terang satu warna</c>
        <d>Tiga warna berjarak 120° membentuk segitiga</d>
      </pilihan>
      <jawaban>b</jawaban>
      <penjelasan>Warna komplementer berada tepat berseberangan di roda warna (seperti Merah &amp; Hijau, atau Biru &amp; Oranye), menciptakan kontras visual tertinggi.</penjelasan>
    </item>
    <item id="5">
      <pertanyaan>Warna apa yang terbentuk jika warna Biru dicampur dengan Kuning dalam model seni pigmen?</pertanyaan>
      <pilihan>
        <a>Ungu</a>
        <b>Oranye</b>
        <c>Hijau</c>
        <d>Abu-abu</d>
      </pilihan>
      <jawaban>c</jawaban>
      <penjelasan>Biru + Kuning menghasilkan warna Hijau, yang merupakan warna sekunder berkarakter alami dan menyejukkan.</penjelasan>
    </item>
    <item id="6">
      <pertanyaan>Skema warna ANALOGUS adalah kombinasi warna yang posisinya...</pertanyaan>
      <pilihan>
        <a>Tepat berseberangan secara diagonal</a>
        <b>Membentuk pola persegi empat</b>
        <c>Saling berdampingan / bertetangga di roda warna</c>
        <d>Berasal dari layar monitor RGB</d>
      </pilihan>
      <jawaban>c</jawaban>
      <penjelasan>Skema analogus menggunakan 3 hingga 4 warna yang terletak berdampingan di roda warna (misalnya Kuning, Kuning-Hijau, dan Hijau), memberi kesan serasi dan tenang.</penjelasan>
    </item>
    <item id="7">
      <pertanyaan>Dalam sistem pencahayaan digital RGB, penggabungan cahaya Merah, Hijau, dan Biru secara maksimal menghasilkan warna...</pertanyaan>
      <pilihan>
        <a>Hitam Pekat</a>
        <b>Cokelat Gelap</b>
        <c>Abu-abu Netral</c>
        <d>Putih Murni</d>
      </pilihan>
      <jawaban>d</jawaban>
      <penjelasan>RGB adalah sistem warna aditif (cahaya). Ketika seluruh berkas warna primer cahaya digabungkan dengan kekuatan penuh, terciptalah cahaya Putih.</penjelasan>
    </item>
    <item id="8">
      <pertanyaan>Warna SEKUNDER apa yang didapatkan dari perpaduan warna Merah dan Biru?</pertanyaan>
      <pilihan>
        <a>Oranye</a>
        <b>Hijau</b>
        <c>Ungu / Violet</c>
        <d>Nila</d>
      </pilihan>
      <jawaban>c</jawaban>
      <penjelasan>Merah + Biru menghasilkan warna Ungu (Violet), melambangkan kemewahan, imajinasi, dan misteri.</penjelasan>
    </item>
    <item id="9">
      <pertanyaan>Apa yang dimaksud dengan palet warna MONOKROMATIK?</pertanyaan>
      <pilihan>
        <a>Kombinasi banyak warna acak</a>
        <b>Variasi tingkat kecerahan (tint), kejenuhan (tone), dan kegelapan (shade) dari satu warna dasar</b>
        <c>Penggunaan warna hitam dan putih saja</c>
        <d>Perpaduan warna dingin dan hangat secara seimbang</d>
      </pilihan>
      <jawaban>b</jawaban>
      <penjelasan>Monokromatik memanfaatkan satu warna acuan (single hue) yang dieksplorasi nilai terangnya (tint) atau gelapnya (shade), menghasilkan desain yang elegan dan bersih.</penjelasan>
    </item>
    <item id="10">
      <pertanyaan>Dalam psikologi warna, warna manakah yang paling kuat diasosiasikan dengan rasa percaya, profesionalitas, dan ketenangan?</pertanyaan>
      <pilihan>
        <a>Merah</a>
        <b>Kuning</b>
        <c>Biru</c>
        <d>Oranye</d>
      </pilihan>
      <jawaban>c</jawaban>
      <penjelasan>Warna Biru secara universal membangkitkan rasa aman, stabilitas, dan kepercayaan. Itulah alasan institusi finansial dan platform digital terkemuka kerap memilih biru.</penjelasan>
    </item>
  </soal>
</kuis>`;

/* ── XML FETCHER WITH INSTANT FALLBACK ── */
async function fetchXMLSafe(url, fallbackString, onSuccess) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    if (xmlDoc.querySelector('parsererror')) throw new Error('Parse error');
    onSuccess(xmlDoc);
  } catch (err) {
    console.info(`[HueMatch Loader] Menggunakan data terintegrasi untuk ${url}:`, err.message);
    const parser = new DOMParser();
    const fallbackDoc = parser.parseFromString(fallbackString, 'text/xml');
    onSuccess(fallbackDoc);
  }
}

function xmlText(parent, tag) {
  const el = parent.querySelector(tag);
  return el ? el.textContent.trim() : '';
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ════════════════════════════════════════════
   MATERI RENDERER
════════════════════════════════════════════ */
function loadMateri(url, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetchXMLSafe(url, EMBEDDED_MATERI_XML, (xmlDoc) => {
    renderMateri(xmlDoc, container);
  });
}

function renderMateri(xmlDoc, container) {
  const sections = xmlDoc.querySelectorAll('section');
  let html = '';

  const sectionMeta = {
    pengantar: { icon: 'bi-book-half',          badge: 'Pengantar' },
    primer:    { icon: 'bi-circle-fill',        badge: 'Primer' },
    sekunder:  { icon: 'bi-palette-fill',       badge: 'Sekunder' },
    tersier:   { icon: 'bi-rainbow',            badge: 'Tersier' },
    rgbcmyk:   { icon: 'bi-display',            badge: 'RGB & CMYK' },
    suhu:      { icon: 'bi-thermometer-half',   badge: 'Suhu Warna' },
    harmoni:   { icon: 'bi-stars',              badge: 'Harmoni' },
  };

  sections.forEach((section) => {
    const id = section.getAttribute('id') || '';
    const judul = xmlText(section, 'judul');
    const deskripsi = xmlText(section, 'deskripsi');
    const fakta = xmlText(section, 'fakta');
    const meta = sectionMeta[id] || { icon: 'bi-palette-fill', badge: id.toUpperCase() };

    html += `
      <div class="materi-block" id="section-${id}">
        <div class="text-center mb-4 pb-2 animate-in">
          <div class="title-pill mb-2">
            <i class="bi ${meta.icon} me-1" style="color:var(--clay-terracotta);"></i>
            ${meta.badge}
          </div>
          <h2 class="section-headline mb-3">${escapeHTML(judul)}</h2>
          <p class="fw-semibold mx-auto" style="max-width:680px;font-size:1.02rem;color:var(--ink-secondary);line-height:1.7;">
            ${escapeHTML(deskripsi)}
          </p>
          ${fakta ? `
            <div class="d-inline-flex align-items-center gap-2 py-2 px-3 mt-3 text-start"
                 style="background:var(--bg-card);border:var(--border-mid);border-radius:var(--r-pill);box-shadow:var(--shadow-xs);">
              <i class="bi bi-lightbulb-fill" style="color:var(--clay-terracotta);font-size:1rem;"></i>
              <span class="small fw-bold" style="color:var(--ink);"><strong>Fakta Menarik:</strong> ${escapeHTML(fakta)}</span>
            </div>
          ` : ''}
        </div>
    `;

    // Render contents
    const warnaItems = section.querySelectorAll('warna > item');
    if (warnaItems.length > 0) {
      html += renderColorCards(warnaItems, id);
    }

    const rgbcmykItems = section.querySelectorAll('rgbcmyk > item');
    if (rgbcmykItems.length > 0) {
      html += renderRgbCmyk(rgbcmykItems);
    }

    const suhuItems = section.querySelectorAll('suhu > item');
    if (suhuItems.length > 0) {
      html += renderSuhu(suhuItems);
    }

    const harmoniItems = section.querySelectorAll('kombinasi > item');
    if (harmoniItems.length > 0) {
      html += renderHarmoni(harmoniItems);
    }

    html += `</div>`;
  });

  container.innerHTML = html;

  requestAnimationFrame(() => {
    if (typeof initAnimations === 'function') initAnimations();
  });
}

/* ── Color Swatch Cards (Primer, Sekunder, Tersier) ── */
function renderColorCards(items, sectionId) {
  // Tersier gets a generous 3-col grid (2 rows of 3) so chips have ample width
  const colClass = (sectionId === 'tersier') ? 'col-12 col-md-6 col-lg-4' : 'col-md-4';
  let html = `<div class="row g-4 justify-content-center">`;

  items.forEach((item) => {
    const nama = xmlText(item, 'nama');
    const hex = xmlText(item, 'hex');
    const desc = xmlText(item, 'deskripsi');
    const campuran = xmlText(item, 'campuran');
    const simbolisme = xmlText(item, 'simbolisme');

    html += `
      <div class="${colClass} animate-in">
        <div class="color-item-card">
          <div class="color-swatch-box" style="background:${escapeHTML(hex)};">
            <span class="dish-pill-badge">${escapeHTML(hex)}</span>
            ${campuran ? `<span class="dish-pill-badge" style="background:#FFFFFF;color:var(--ink);">${escapeHTML(campuran)}</span>` : ''}
          </div>
          <div class="color-item-body">
            <h5>${escapeHTML(nama)}</h5>
            ${desc ? `<p class="mb-3">${escapeHTML(desc)}</p>` : ''}
            ${simbolisme ? `
              <div class="mt-auto pt-2 border-top">
                <span class="dish-pill-badge" style="background:var(--bg-sunken);font-size:0.74rem;">
                  <i class="bi bi-tag-fill me-1" style="color:var(--clay-terracotta);"></i>${escapeHTML(simbolisme)}
                </span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

/* ── RGB vs CMYK (Clean 3D Clay Strip — Label Dibawah & Operator Polos) ── */
function renderRgbCmyk(items) {
  let html = `<div class="row g-4 justify-content-center mb-2">`;

  items.forEach((item) => {
    const nama = xmlText(item, 'nama');
    const desc = xmlText(item, 'deskripsi');
    const type = item.getAttribute('type') || '';

    let visual = '';
    if (type === 'rgb') {
      visual = `
        <div class="clay-stage-box">
          <!-- 3D Clay Row Formula (Label di Bawah & Operator Polos) -->
          <div class="clay-formula-strip">
            <!-- Red -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-red" title="Red (Merah)"></div>
              <span class="clay-item-label">Red</span>
            </div>

            <span class="clay-plain-op">+</span>

            <!-- Green -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-green" title="Green (Hijau)"></div>
              <span class="clay-item-label">Green</span>
            </div>

            <span class="clay-plain-op">+</span>

            <!-- Blue -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-blue" title="Blue (Biru)"></div>
              <span class="clay-item-label">Blue</span>
            </div>

            <span class="clay-plain-op">=</span>

            <!-- White Result -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-white" title="White (Putih)"></div>
              <span class="clay-item-label">White</span>
            </div>
          </div>

          <!-- Tactile Info Badges -->
          <div class="d-flex gap-2 flex-wrap justify-content-center">
            <span class="dish-pill-badge" style="background:#FFFFFF;border-color:var(--ink);">
              <i class="bi bi-display me-1 text-primary"></i>Layar Digital
            </span>
            <span class="dish-pill-badge" style="background:#FFFFFF;border-color:var(--ink);">
              R + G + B = Putih (Aditif)
            </span>
          </div>
        </div>
      `;
    } else {
      visual = `
        <div class="clay-stage-box">
          <!-- 3D Clay Row Formula (Label di Bawah & Operator Polos) -->
          <div class="clay-formula-strip">
            <!-- Cyan -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-cyan" title="Cyan"></div>
              <span class="clay-item-label">Cyan</span>
            </div>

            <span class="clay-plain-op">+</span>

            <!-- Magenta -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-magenta" title="Magenta"></div>
              <span class="clay-item-label">Magenta</span>
            </div>

            <span class="clay-plain-op">+</span>

            <!-- Yellow -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-yellow" title="Yellow"></div>
              <span class="clay-item-label">Yellow</span>
            </div>

            <span class="clay-plain-op">=</span>

            <!-- Black (K) Result -->
            <div class="clay-item-col">
              <div class="clay-sphere clay-black" title="Black (Hitam)"></div>
              <span class="clay-item-label">Black (K)</span>
            </div>
          </div>

          <!-- Tactile Info Badges -->
          <div class="d-flex gap-2 flex-wrap justify-content-center">
            <span class="dish-pill-badge" style="background:#FFFFFF;border-color:var(--ink);">
              <i class="bi bi-printer-fill me-1 text-danger"></i>Tinta Cetak Fisik
            </span>
            <span class="dish-pill-badge" style="background:#FFFFFF;border-color:var(--ink);">
              C + M + Y = Hitam (Substraktif)
            </span>
          </div>
        </div>
      `;
    }

    html += `
      <div class="col-md-6 animate-in">
        <div class="color-item-card p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0 d-flex align-items-center gap-2">
              <span class="bento-icon-well mb-0" style="width:42px;height:42px;font-size:1.15rem;">
                <i class="bi ${type === 'rgb' ? 'bi-display' : 'bi-printer-fill'}"></i>
              </span>
              ${escapeHTML(nama)}
            </h5>
            <span class="dish-pill-badge">${type.toUpperCase()}</span>
          </div>
          ${visual}
          <p class="small fw-semibold mb-0 mt-3 pt-3 border-top" style="color:var(--ink-secondary);">${escapeHTML(desc)}</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

/* ── Suhu Warna ── */
function renderSuhu(items) {
  let html = `<div class="row g-4 justify-content-center mb-2">`;

  items.forEach((item) => {
    const nama = xmlText(item, 'nama');
    const desc = xmlText(item, 'deskripsi');
    const type = item.getAttribute('type') || '';

    let gradient, swatches, icon;
    if (type === 'hot') {
      icon = 'bi-fire text-danger';
      gradient = `conic-gradient(#EF4444 0deg 30deg, #F97316 30deg 60deg, #FACC15 60deg 90deg, #84CC16 90deg 120deg, #CBD5E1 120deg 270deg, #D946EF 270deg 300deg, #EC4899 300deg 330deg, #EF4444 330deg 360deg)`;
      swatches = `
        <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">
          <span class="dish-pill-badge" style="background:#EF4444;color:#FFFFFF;">Merah</span>
          <span class="dish-pill-badge" style="background:#F97316;color:#FFFFFF;">Oranye</span>
          <span class="dish-pill-badge" style="background:#FACC15;color:#18181B;">Kuning</span>
        </div>
      `;
    } else {
      icon = 'bi-snow text-primary';
      gradient = `conic-gradient(#CBD5E1 0deg 120deg, #22C55E 120deg 150deg, #06B6D4 150deg 180deg, #3B82F6 180deg 210deg, #6366F1 210deg 240deg, #8B5CF6 240deg 270deg, #CBD5E1 270deg 360deg)`;
      swatches = `
        <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">
          <span class="dish-pill-badge" style="background:#3B82F6;color:#FFFFFF;">Biru</span>
          <span class="dish-pill-badge" style="background:#22C55E;color:#FFFFFF;">Hijau</span>
          <span class="dish-pill-badge" style="background:#8B5CF6;color:#FFFFFF;">Ungu</span>
        </div>
      `;
    }

    html += `
      <div class="col-md-6 animate-in">
        <div class="color-item-card p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0 d-flex align-items-center gap-2">
              <span class="bento-icon-well mb-0" style="width:42px;height:42px;font-size:1.15rem;">
                <i class="bi ${icon}"></i>
              </span>
              ${escapeHTML(nama)}
            </h5>
            <span class="dish-pill-badge">${type === 'hot' ? 'WARM' : 'COOL'}</span>
          </div>
          <div class="d-flex justify-content-center my-3">
            <div class="position-relative" style="width:140px;height:140px;">
              <div class="rounded-circle w-100 h-100" style="background:${gradient};border:var(--border-thick);box-shadow:var(--shadow-sm);"></div>
              <div class="position-absolute bg-white rounded-circle border border-2 border-dark" style="width:48px;height:48px;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:var(--shadow-xs);"></div>
            </div>
          </div>
          ${swatches}
          <p class="small fw-semibold mb-0 border-top pt-3 mt-3" style="color:var(--ink-secondary);">${escapeHTML(desc)}</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

/* ── Harmoni ── */
function renderHarmoni(items) {
  const getHarmonySVG = (type) => {
    const cx = 40, cy = 40, r = 26;
    const dot = (deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      return `<circle cx="${cx + r * Math.cos(rad)}" cy="${cy + r * Math.sin(rad)}" r="3.5" fill="white" stroke="#18181B" stroke-width="2"/>`;
    };
    const line = (d1, d2) => {
      const r1 = (d1 - 90) * Math.PI / 180, r2 = (d2 - 90) * Math.PI / 180;
      return `<line x1="${cx + r * Math.cos(r1)}" y1="${cy + r * Math.sin(r1)}" x2="${cx + r * Math.cos(r2)}" y2="${cy + r * Math.sin(r2)}" stroke="#18181B" stroke-width="2"/>`;
    };
    const toCenter = (deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      return `<line x1="40" y1="40" x2="${cx + r * Math.cos(rad)}" y2="${cy + r * Math.sin(rad)}" stroke="#18181B" stroke-width="2"/>`;
    };
    const centerDot = `<circle cx="40" cy="40" r="3.5" fill="white" stroke="#18181B" stroke-width="2"/>`;

    let shapes = '';
    if (type.includes('split'))          shapes = toCenter(0)+toCenter(150)+toCenter(210)+line(150,210)+centerDot+dot(0)+dot(150)+dot(210);
    else if (type.includes('komplementer')) shapes = toCenter(0)+toCenter(180)+centerDot+dot(0)+dot(180);
    else if (type.includes('analog'))    shapes = line(330,0)+line(0,30)+toCenter(0)+centerDot+dot(0)+dot(30)+dot(330);
    else if (type.includes('triadik'))   shapes = line(0,120)+line(120,240)+line(240,0)+dot(0)+dot(120)+dot(240);
    else if (type.includes('tetradik') || type.includes('segi')) shapes = line(0,90)+line(90,180)+line(180,270)+line(270,0)+dot(0)+dot(90)+dot(180)+dot(270);
    else if (type.includes('monokromatik')) shapes = `<line x1="40" y1="40" x2="40" y2="14" stroke="#18181B" stroke-width="2"/>${centerDot}<circle cx="40" cy="27" r="3.5" fill="white" stroke="#18181B" stroke-width="2"/><circle cx="40" cy="14" r="3.5" fill="white" stroke="#18181B" stroke-width="2"/>`;
    else shapes = toCenter(0)+centerDot+dot(0);

    return `<svg width="80" height="80" class="position-absolute top-0 start-0" style="pointer-events:none;"><g transform="rotate(15,40,40)">${shapes}</g></svg>`;
  };

  let html = `<div class="row g-4 justify-content-center">`;

  items.forEach((item) => {
    const nama = xmlText(item, 'nama');
    const desc = xmlText(item, 'deskripsi');
    const warna1 = xmlText(item, 'warna1');
    const warna2 = xmlText(item, 'warna2');

    html += `
      <div class="col-md-6 col-lg-4 animate-in">
        <div class="color-item-card p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="position-relative" style="width:76px;height:76px;flex-shrink:0;">
              <div class="split-wheel" style="width:76px;height:76px;box-shadow:none;animation:none;"></div>
              ${getHarmonySVG(nama.toLowerCase())}
            </div>
            <div>
              <h5 class="mb-2" style="font-size:1.05rem;">${escapeHTML(nama)}</h5>
              <div class="d-flex gap-2">
                ${warna1 ? `<div class="rounded-circle" style="width:26px;height:26px;background:${escapeHTML(warna1)};border:var(--border-mid);box-shadow:var(--shadow-xs);"></div>` : ''}
                ${warna2 ? `<div class="rounded-circle" style="width:26px;height:26px;background:${escapeHTML(warna2)};border:var(--border-mid);box-shadow:var(--shadow-xs);"></div>` : ''}
                ${warna1 && warna2 ? `<div class="rounded-circle" style="width:26px;height:26px;background:linear-gradient(135deg,${escapeHTML(warna1)},${escapeHTML(warna2)});border:var(--border-mid);box-shadow:var(--shadow-xs);"></div>` : ''}
              </div>
            </div>
          </div>
          <p class="small fw-semibold mb-0 border-top pt-3" style="color:var(--ink-secondary);">${escapeHTML(desc)}</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

/* ════════════════════════════════════════════
   KUIS XML PARSER
════════════════════════════════════════════ */
function loadKuisData(url, onSuccess) {
  fetchXMLSafe(url, EMBEDDED_KUIS_XML, (xmlDoc) => {
    const soalList = [];
    xmlDoc.querySelectorAll('soal > item').forEach((item) => {
      const id = item.getAttribute('id') || '';
      const pertanyaan = xmlText(item, 'pertanyaan');
      const jawaban = xmlText(item, 'jawaban');
      const penjelasan = xmlText(item, 'penjelasan');

      const pilihanEl = item.querySelector('pilihan');
      const pilihan = {};
      if (pilihanEl) {
        ['a', 'b', 'c', 'd'].forEach(k => {
          const el = pilihanEl.querySelector(k);
          if (el) pilihan[k] = el.textContent.trim();
        });
      }

      soalList.push({ id, pertanyaan, pilihan, jawaban, penjelasan });
    });

    onSuccess(soalList);
  });
}
