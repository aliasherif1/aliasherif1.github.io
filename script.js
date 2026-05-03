/* ============================================================
   script.js — Alia Sherif Portfolio
   Handles: scroll reveal, navbar scroll state, mobile menu,
            language bar animation, smooth interactions,
            parallax, cursor glow, counter animation
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll state ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ── Mobile menu ─────────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });
  }


  /* ── Scroll-reveal (Intersection Observer) ───────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        if (entry.target.classList.contains('languages-section')) {
          animateLangBars();
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const staggerGroups = [
    '.about-aside', '.impact-grid', '.skills-grid',
    '.travel-cards', '.presence-grid', '.conf-list'
  ];
  staggerGroups.forEach(selector => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    parent.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  revealEls.forEach(el => observer.observe(el));


  /* ── Language bar animation ──────────────────────────── */
  function animateLangBars() {
    document.querySelectorAll('.lang-fill').forEach((fill, i) => {
      setTimeout(() => {
        const targetWidth = fill.style.width;
        fill.style.width = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          fill.style.width = targetWidth;
        }));
      }, i * 140);
    });
  }

  const langSection = document.querySelector('.languages-section');
  if (langSection) {
    const langObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { animateLangBars(); langObs.disconnect(); }
    }, { threshold: 0.3 });
    langObs.observe(langSection);
  }


  /* ── Active nav highlight on scroll ─────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--olive)';
          }
        });
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));


  /* ── Hero stagger on load ────────────────────────────── */
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 150 + i * 180);
  });


  /* ── Parallax: topo lines ────────────────────────────── */
  const topoLines = document.querySelector('.topo-lines');
  window.addEventListener('scroll', () => {
    if (topoLines) topoLines.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }, { passive: true });


  /* ── Cursor glow on hero ─────────────────────────────── */
  const hero = document.getElementById('hero');
  if (hero && window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    hero.appendChild(glow);

    let mx = -300, my = -300, gx = -300, gy = -300;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => { mx = -300; my = -300; });

    (function loop() {
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }


  /* ── Stat counter animation ──────────────────────────── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, '');
      if (isNaN(num) || num === 0) return;
      const start = performance.now();
      const dur = 1400;
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * num) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

});


/* ── Close mobile menu ───────────────────────────────── */
function closeMobile() {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.nav-toggle');
  if (menu) menu.classList.remove('open');
  if (toggle) {
    toggle.setAttribute('aria-expanded', false);
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  }
}
