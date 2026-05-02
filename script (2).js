/* ============================================================
   script.js — Alia Sherif Portfolio
   Handles: scroll reveal, navbar scroll state, mobile menu,
            language bar animation, smooth interactions
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
      // Animate hamburger → X
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

  // Stagger children within same parent by a tiny offset
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);

        // Trigger language bars when skills section visible
        if (entry.target.classList.contains('languages-section')) {
          animateLangBars();
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  // Add staggered delay to sibling reveals
  const staggerGroups = [
    '.about-aside',
    '.impact-grid',
    '.skills-grid',
    '.travel-cards',
    '.presence-grid',
    '.conf-list'
  ];
  staggerGroups.forEach(selector => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    const children = parent.querySelectorAll('.reveal');
    children.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  revealEls.forEach(el => observer.observe(el));


  /* ── Language bar animation ──────────────────────────── */
  function animateLangBars() {
    const fills = document.querySelectorAll('.lang-fill');
    fills.forEach((fill, i) => {
      setTimeout(() => {
        // The width is already set inline in HTML
        const targetWidth = fill.style.width;
        fill.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = targetWidth;
          });
        });
      }, i * 120);
    });
  }

  // Also trigger if already in view on load
  const langSection = document.querySelector('.languages-section');
  if (langSection) {
    const langObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateLangBars();
        langObs.disconnect();
      }
    }, { threshold: 0.3 });
    langObs.observe(langSection);
  }


  /* ── Smooth active nav highlight on scroll ───────────── */
  const sections = document.querySelectorAll('section[id]');
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

  sections.forEach(s => sectionObserver.observe(s));


  /* ── Hero stagger on load ────────────────────────────── */
  const heroReveal = document.querySelectorAll('#hero .reveal');
  heroReveal.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 200);
  });

});


/* ── Close mobile menu (called from onclick in HTML) ─── */
function closeMobile() {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.nav-toggle');
  if (menu) menu.classList.remove('open');
  if (toggle) {
    toggle.setAttribute('aria-expanded', false);
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
}
