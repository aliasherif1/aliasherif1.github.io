/* ============================================================
   script.js — Alia Sherif Portfolio
   Handles: navbar scroll state, mobile menu, scroll reveal,
            language bars, active nav highlight, parallax,
            cursor glow, stat counter animation
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar: add shadow when user scrolls down ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ── Mobile menu: hamburger toggle ── */
  const toggle     = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);

      // Animate hamburger bars into an X
      const [bar1, bar2] = toggle.querySelectorAll('span');
      if (isOpen) {
        bar1.style.transform = 'rotate(45deg) translate(4px, 4px)';
        bar2.style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        bar1.style.transform = '';
        bar2.style.transform = '';
      }
    });
  }


  /* ── Scroll reveal: fade elements in as they enter the viewport ── */
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);

      // Trigger language bars when that section appears
      if (entry.target.classList.contains('languages-section')) {
        animateLangBars();
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Stagger children inside grid/list sections
  const staggerSelectors = [
    '.about-aside', '.impact-grid', '.skills-grid',
    '.travel-cards', '.presence-grid', '.conf-list'
  ];
  staggerSelectors.forEach(selector => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    parent.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  revealItems.forEach(el => revealObserver.observe(el));


  /* ── Language bars: animate widths on scroll into view ── */
  function animateLangBars() {
    document.querySelectorAll('.lang-fill').forEach((bar, i) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          bar.style.width = targetWidth;
        }));
      }, i * 140);
    });
  }

  // Also trigger via its own observer (in case it's not a .reveal target)
  const langSection = document.querySelector('.languages-section');
  if (langSection) {
    const langObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateLangBars();
        langObserver.disconnect();
      }
    }, { threshold: 0.3 });
    langObserver.observe(langSection);
  }


  /* ── Active nav link: highlight the current section ── */
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--olive)';
        }
      });
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));


  /* ── Hero: stagger text reveals on page load ── */
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 150 + i * 180);
  });


  /* ── Parallax: topo lines drift slightly on scroll ── */
  const topoLines = document.querySelector('.topo-lines');
  window.addEventListener('scroll', () => {
    if (topoLines) {
      topoLines.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }
  }, { passive: true });


  /* ── Cursor glow: soft light follows the mouse over the hero ── */
  const hero = document.getElementById('hero');
  if (hero && window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    hero.appendChild(glow);

    let mouseX = -300, mouseY = -300;
    let glowX  = -300, glowY  = -300;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      mouseX = -300;
      mouseY = -300;
    });

    // Smoothly interpolate glow position each frame
    (function loop() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }


  /* ── Stat counters: animate numbers when they scroll into view ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, '');

      if (isNaN(num) || num === 0) return;

      const duration  = 1400;
      const startTime = performance.now();

      (function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(performance.now());

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

});


/* ── Close mobile menu (called from inline onclick in HTML) ── */
function closeMobile() {
  const menu   = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.nav-toggle');
  if (menu)   menu.classList.remove('open');
  if (toggle) {
    toggle.setAttribute('aria-expanded', false);
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  }
}
