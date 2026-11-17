/**
 * HueMatch — main.js
 * Global utilities: navbar scroll effect, active nav link (scrollspy), scroll animations, initialization.
 */

/* ============================================================
   INIT DATA (SPA)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof loadMateri === 'function') {
    loadMateri('data/materi.xml', 'materi-content');
  }
  if (typeof initKuis === 'function') {
    initKuis('data/kuis.xml');
  }
});

/* ============================================================
   NAVBAR — Scrolled Class & Scrollspy
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Scrollspy logic
  const sections = document.querySelectorAll('div[id="beranda"], div[id="materi"], div[id="simulasi"], div[id="kuis"], section[id="fitur"]');
  const navLinks = document.querySelectorAll('.nav-link-neo, .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
})();

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */
function initAnimations() {
  const animatables = document.querySelectorAll('.animate-in');
  if (!animatables.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatables.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initAnimations);

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      
      // Close mobile menu if open
      const navbarCollapse = document.getElementById('navMenu');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

/* ============================================================
   PAGE TRANSITION — Fade in on load
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

/* ============================================================
   TOOLTIP INIT (Bootstrap tooltips if any)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  if (typeof bootstrap !== 'undefined' && tooltipEls.length) {
    tooltipEls.forEach(el => new bootstrap.Tooltip(el));
  }
});

/* ============================================================
   KEYBOARD ACCESSIBILITY — option-label Enter/Space support
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.option-label').forEach(label => {
    label.setAttribute('tabindex', '0');
    label.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
});

/* ============================================================
   Utility: console branding
   ============================================================ */
console.log(
  '%cHueMatch',
  'color: #FF6B35; font-size: 20px; font-weight: 900; font-family: sans-serif;'
);
console.log(
  '%cPlatform Edukasi Teori Warna Interaktif',
  'color: #A855F7; font-size: 12px; font-family: sans-serif;'
);
