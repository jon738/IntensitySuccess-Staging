/* ===========================
   Intensity Success — script.js
   =========================== */

/* ---- Mobile Menu Toggle ---- */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

/* ---- Header "scrolled" state ---- */
(() => {
  const onScroll = () => {
    if (window.scrollY > 6) document.body.classList.add('scrolled');
    else document.body.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---- Footer year ---- */
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ---- Scroll reveal (.reveal -> .show) ---- */
(() => {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('show'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('show');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: reveal all
    revealEls.forEach(el => el.classList.add('show'));
  }
})();

/* ---- KPI counters (run when #outcomes visible) ---- */
/* Markup example:
   <span class="kpi-number" data-target="35" data-suffix="%">0</span>
*/
(() => {
  const outcomes = document.getElementById('outcomes');
  if (!outcomes) return;

  const startCounters = root => {
    root.querySelectorAll('.kpi-number').forEach(el => {
      // prevent double-run
      if (el.dataset.counted === '1') return;
      el.dataset.counted = '1';

      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const frames = 60; // ~1s
      const step = Math.max(1, Math.round(target / frames));

      const tick = () => {
        current += step;
        if (current < target) {
          el.textContent = current + suffix;
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + suffix;
        }
      };
      tick();
    });
  };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    startCounters(outcomes);
    return;
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          startCounters(outcomes);
          io.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );
  io.observe(outcomes);
})();

/* ---- Staggered reveal for FAQ items ---- */
(() => {
  const items = Array.from(document.querySelectorAll('#faq .faq.reveal'));
  if (items.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('show'));
    return;
  }

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = items.indexOf(entry.target);
          entry.target.style.transitionDelay = `${i * 90}ms`;
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(el => obs.observe(el));
})();
