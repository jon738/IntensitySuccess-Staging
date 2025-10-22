/* ===========================
   Intensity Success — script.js
   =========================== */

/* ---- Mobile Menu Toggle + Close-on-click ---- */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  const setExpanded = (open) => toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    setExpanded(open);
  });

  // Close the panel when a nav link is clicked (mobile)
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      setExpanded(false);
    }
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

/* ---- Smooth scroll for same-page anchors (offset for fixed header) ---- */
(() => {
  const header = document.querySelector('.site-header');
  const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);

  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"], a[href^="/#"]');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    const id = href.replace('/#', '').replace('#', '');
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight() - 8);
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', `#${id}`);
  };

  document.addEventListener('click', onClick);
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
    revealEls.forEach(el => el.classList.add('show'));
  }
})();

/* ---- Scroll-aware nav highlight (Services / Results / FAQ / Contact) ---- */
(() => {
  const navLinks = document.querySelectorAll('.site-nav a[href^="/#"], .site-nav a[href^="#"]');
  const sectionIds = ['services', 'outcomes', 'faq', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      const targetId = href.replace('/#', '').replace('#', '');
      a.classList.toggle('active', targetId === id);
    });
  };

  // Observe sections entering viewport
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach(sec => io.observe(sec));
  }

  // Update highlight when hash changes (e.g., back/forward)
  window.addEventListener('hashchange', () => {
    const id = (location.hash || '').replace('#', '');
    if (sectionIds.includes(id)) setActive(id);
  });

  // Click -> immediate highlight (nice UX)
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href') || '';
      const id = href.replace('/#', '').replace('#', '');
      if (sectionIds.includes(id)) setActive(id);
    });
  });
})();

/* ---- Page-aware nav highlight for Blog / Videos / News ---- */
(() => {
  const path = window.location.pathname;
  const mark = (id, test) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (test) el.classList.add('active'); else el.classList.remove('active');
  };
  mark('nav-blog',   path.startsWith('/blog')   || path.includes('/blog/'));
  mark('nav-videos', path.startsWith('/videos') || path.includes('/videos/'));
  mark('nav-news',   path.startsWith('/news')   || path.includes('/news/'));
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
      if (el.dataset.counted === '1') return; // prevent double-run
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
