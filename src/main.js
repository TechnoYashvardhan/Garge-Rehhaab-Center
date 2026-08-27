import { translations } from './translations.js';

// Mark body so CSS hides animate-on-scroll elements (fallback: visible without JS)
document.documentElement.classList.add('js-loaded');
document.body.classList.add('js-ready');


document.addEventListener('DOMContentLoaded', () => {

  // ── i18n ──
  const updateLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang]?.[key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-hi').classList.toggle('active', lang === 'hi');
  };
  document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));
  document.getElementById('lang-hi').addEventListener('click', () => updateLanguage('hi'));
  updateLanguage('en');

  // ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Hamburger mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ── Counter animation ──
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 1800;
    const intervalTime = target <= 10 ? 150 : target <= 20 ? 100 : 25;
    const increment = Math.ceil(target / (duration / intervalTime));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, intervalTime);
  };

  // ── Intersection Observer ──
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const counter = entry.target.querySelector?.('.counter:not(.counted)');
      if (counter) {
        animateCounter(counter);
        counter.classList.add('counted');
      }
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // ── Year ──
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ── Certificate Lightbox ── (global functions for inline onclick)
window.openLightbox = function(thumb) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = thumb.querySelector('img').src;
  img.alt = thumb.querySelector('img').alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeLightbox = function() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeLightbox();
});
