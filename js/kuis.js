/**
 * HueMatch — kuis.js
 * Quiz engine: parses XML questions, manages state, renders options, and evaluates scores.
 */

/* ---------- State ---------- */
let kuisData = [];
let userAnswers = {};
let isSubmitted = false;

/* ---------- Initialization ---------- */
function initKuis(xmlUrl) {
  const loader = document.getElementById('kuis-loader');
  const area   = document.getElementById('kuis-area');

  loadKuisData(
    xmlUrl,
    (soalList) => {
      kuisData = soalList;
      if (loader) loader.style.display = 'none';
      if (area) area.style.display = 'block';
      renderSoal();
    }
  );
}

/* ---------- Render Questions ---------- */
function renderSoal() {
  const container = document.getElementById('questions-container');
  if (!container) return;

  let html = '';

  kuisData.forEach((soal, index) => {
    const num = index + 1;
    html += `
      <div class="quiz-box-card" id="q-card-${soal.id}" data-id="${soal.id}">
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="quiz-number-pill">${num}</div>
          <h5 class="m-0 fw-bold fs-5" style="color:var(--ink);">${escapeHTMLKuis(soal.pertanyaan)}</h5>
        </div>

        <div class="options-group d-flex flex-column" role="group" aria-label="Pilihan jawaban soal ${num}">
    `;

    const optionLabels = { a: 'A', b: 'B', c: 'C', d: 'D' };

    Object.entries(soal.pilihan).forEach(([key, value]) => {
      html += `
        <label
          class="quiz-option-btn"
          for="soal-${soal.id}-${key}"
          id="label-${soal.id}-${key}"
          onclick="selectOption('${soal.id}', '${key}', this)"
        >
          <input
            type="radio"
            name="soal-${soal.id}"
            id="soal-${soal.id}-${key}"
            value="${key}"
            style="display: none;"
          />
          <div class="quiz-bullet" id="bullet-${soal.id}-${key}">${optionLabels[key]}</div>
          <span class="fw-bold" style="color:var(--ink);">${escapeHTMLKuis(value)}</span>
        </label>
      `;
    });

    html += `
        </div>

        <div class="alert mt-4 mb-0 d-none" id="expl-${soal.id}" style="border: var(--border-thick); border-radius: var(--r-md); box-shadow: var(--shadow-sm);">
          <div class="d-flex gap-3 align-items-start">
            <span class="fs-4" id="expl-icon-${soal.id}"></span>
            <div id="expl-text-${soal.id}" class="fw-semibold" style="color:var(--ink);font-size:0.92rem;"></div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add keyboard accessibility
  document.querySelectorAll('.quiz-option-btn').forEach(label => {
    label.setAttribute('tabindex', '0');
    label.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  updateProgress();
}

/* ---------- Answer Selection ---------- */
function selectOption(soalId, key, clickedLabel) {
  if (isSubmitted) return;

  const changed = userAnswers[soalId] !== key;
  userAnswers[soalId] = key;

  const card = document.getElementById(`q-card-${soalId}`);
  if (!card) return;

  card.querySelectorAll('.quiz-option-btn').forEach(label => {
    label.classList.remove('selected');
    const input = label.querySelector('input[type="radio"]');
    if (input) input.checked = false;
  });

  clickedLabel.classList.add('selected');
  const radio = document.getElementById(`soal-${soalId}-${key}`);
  if (radio) radio.checked = true;

  if (changed) updateProgress();
}

/* ---------- Progress Bar ---------- */
function updateProgress() {
  const total = kuisData.length;
  const answered = Object.keys(userAnswers).length;
  const pct = total > 0 ? (answered / total) * 100 : 0;

  const bar = document.getElementById('progressBar');
  const progText = document.getElementById('progress-text');
  const answText = document.getElementById('answered-text');

  if (bar) bar.style.width = pct + '%';
  if (progText) progText.textContent = `Soal 1–${total}`;
  if (answText) answText.textContent = `${answered} dari ${total} Terjawab`;
}

/* ---------- Submit Quiz ---------- */
function submitKuis() {
  if (isSubmitted) return;

  const total = kuisData.length;
  const answered = Object.keys(userAnswers).length;

  if (answered < total) {
    const unanswered = total - answered;
    const confirm = window.confirm(
      `Masih ada ${unanswered} soal yang belum dijawab. Apakah Anda yakin ingin menyerahkan jawaban sekarang?`
    );
    if (!confirm) return;
  }

  isSubmitted = true;

  const submitSection = document.getElementById('submit-section');
  if (submitSection) submitSection.style.display = 'none';

  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  kuisData.forEach(soal => {
    const userAnswer = userAnswers[soal.id];
    if (!userAnswer) {
      skipped++;
      showExplanation(soal, null);
    } else if (userAnswer === soal.jawaban) {
      correct++;
      showExplanation(soal, true);
    } else {
      wrong++;
      showExplanation(soal, false);
    }
  });

  const score = Math.round((correct / total) * 100);
  showScoreCard(score, correct, wrong, skipped, total);

  setTimeout(() => {
    document.getElementById('scoreCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 250);
}

/* ---------- Feedback per Question ---------- */
function showExplanation(soal, isCorrect) {
  const card = document.getElementById(`q-card-${soal.id}`);
  const explBox = document.getElementById(`expl-${soal.id}`);
  const explText = document.getElementById(`expl-text-${soal.id}`);
  const explIcon = document.getElementById(`expl-icon-${soal.id}`);
  if (!card || !explBox) return;

  const userAns = userAnswers[soal.id];

  card.querySelectorAll('.quiz-option-btn').forEach(label => {
    const input = label.querySelector('input[type="radio"]');
    if (!input) return;
    const key = input.value;
    label.style.pointerEvents = 'none';

    if (key === soal.jawaban) {
      label.classList.add('correct');
      const bullet = label.querySelector('.quiz-bullet');
      if (bullet) bullet.innerHTML = '✓';
    } else if (key === userAns && userAns !== soal.jawaban) {
      label.classList.add('incorrect');
      const bullet = label.querySelector('.quiz-bullet');
      if (bullet) bullet.innerHTML = '✗';
    }
  });

  if (isCorrect === null) {
    explBox.className = 'alert mt-4 mb-0 d-block';
    explBox.style.backgroundColor = 'var(--clay-wheat-light)';
    explIcon.innerHTML = '⚠️';
    explText.innerHTML = `<strong>Dilewat.</strong> Jawaban benar: <strong>${soal.jawaban.toUpperCase()}</strong>.<br>${escapeHTMLKuis(soal.penjelasan)}`;
  } else if (isCorrect) {
    explBox.className = 'alert mt-4 mb-0 d-block';
    explBox.style.backgroundColor = 'var(--clay-sage-light)';
    explIcon.innerHTML = '🎉';
    explText.innerHTML = `<strong>Hebat, Benar!</strong><br>${escapeHTMLKuis(soal.penjelasan)}`;
  } else {
    explBox.className = 'alert mt-4 mb-0 d-block';
    explBox.style.backgroundColor = 'var(--clay-coral-light)';
    explIcon.innerHTML = '❌';
    explText.innerHTML = `Jawaban Anda <strong>(${(userAns || '—').toUpperCase()})</strong> salah. Jawaban tepat: <strong>${soal.jawaban.toUpperCase()}</strong>.<br>${escapeHTMLKuis(soal.penjelasan)}`;
  }
}

/* ---------- Score Summary Card ---------- */
function showScoreCard(score, correct, wrong, skipped) {
  const card = document.getElementById('scoreCard');
  if (!card) return;

  let emoji = '🏆';
  let message = '';

  if (score === 100) {
    emoji = '🌟';
    message = 'Luar Biasa Sempurna! Anda menguasai seluruh konsep teori warna layaknya desainer profesional!';
  } else if (score >= 80) {
    emoji = '🎉';
    message = 'Hebat Sekali! Pemahaman teori warna Anda sudah sangat matang!';
  } else if (score >= 60) {
    emoji = '🎨';
    message = 'Bagus! Dasar pengetahuan warna Anda cukup kuat. Baca kembali materi untuk mempertajam intuisi!';
  } else {
    emoji = '💪';
    message = 'Tetap semangat! Pelajari kembali materi warna primer, sekunder, dan harmoni lalu coba lagi!';
  }

  document.getElementById('scoreEmoji').textContent = emoji;
  document.getElementById('scoreNumber').textContent = score;
  document.getElementById('correct-count').textContent = correct;
  document.getElementById('wrong-count').textContent = wrong;
  document.getElementById('skip-count').textContent = skipped;
  document.getElementById('score-message').textContent = message;

  card.style.display = 'block';
}

/* ---------- Reset / Restart ---------- */
function ulangiKuis() {
  isSubmitted = false;
  userAnswers = {};

  const scoreCard = document.getElementById('scoreCard');
  const submitSection = document.getElementById('submit-section');

  if (scoreCard) scoreCard.style.display = 'none';
  if (submitSection) submitSection.style.display = 'block';

  renderSoal();
  document.getElementById('kuis-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHTMLKuis(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
