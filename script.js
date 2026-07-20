/* ============================================================
   script.js — Alia Sherif Portfolio
   Navbar state, mobile menu, scroll reveal, active nav link,
   language bars, journey line draw, contact form (mailto).
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme toggle (light/dark) ── */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      }
    });
  }

  /* ── Navbar shadow on scroll ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const [bar1, bar2] = toggle.querySelectorAll('span');
      bar1.style.transform = isOpen ? 'translateY(3.5px) rotate(45deg)' : '';
      bar2.style.transform = isOpen ? 'translateY(-3.5px) rotate(-45deg)' : '';
    });
  }

  /* ── Scroll reveal ── */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealItems.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.07}s`;
    revealObserver.observe(el);
  });

  /* ── Journey line: draw on scroll into view ── */
  const journeyLine = document.querySelector('.journey-line');
  if (journeyLine) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          journeyLine.classList.add('visible');
          lineObserver.disconnect();
        }
      });
    }, { threshold: 0.15 });
    lineObserver.observe(journeyLine);
  }

  /* ── Language bars: animate on scroll ── */
  const langBars = document.querySelectorAll('.lang-fill');
  if (langBars.length) {
    const langObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        langBars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width;
          }, i * 120);
        });
        langObserver.disconnect();
      });
    }, { threshold: 0.4 });
    langObserver.observe(langBars[0].closest('.lang-card'));
  }

  /* ── Active nav link highlight ── */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ── Stat / number counters ── */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, '');
      if (isNaN(num) || num === 0) return;

      const duration = 1200;
      const start = performance.now();
      (function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(performance.now());

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ── Contact form: deliver straight to Alia's inbox via Web3Forms ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        return;
      }

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim() || 'New message from your website';
      const message = form.message.value.trim();
      const msg = document.getElementById('formMsg');
      const submitBtn = form.querySelector('button[type="submit"]');
      const accessKeyInput = form.querySelector('input[name="access_key"]');
      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

      // Once a real Web3Forms access key is set, send the message directly by email.
      if (accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        try {
          if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ access_key: accessKey, name, email, subject, message })
          });
          const data = await res.json();

          if (data.success) {
            form.reset();
            if (msg) msg.classList.add('show');
          } else {
            throw new Error(data.message || 'Submission failed');
          }
        } catch (err) {
          alert("Sorry, something went wrong sending your message. Please email aliasherif164@gmail.com directly.");
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
        }
        return;
      }

      // Fallback while no access key is configured yet: open the visitor's email client.
      const body = `${message}\n\n— ${name} (${email})`;
      const mailtoLink = `mailto:aliasherif164@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (msg) msg.classList.add('show');
    });
  }

});

/* ── Close mobile menu (used inline in HTML) ── */
function closeMobile() {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.nav-toggle');
  if (menu) menu.classList.remove('open');
  if (toggle) {
    toggle.setAttribute('aria-expanded', false);
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  }
}
