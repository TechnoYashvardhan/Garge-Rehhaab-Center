import './style.css';
import { translations } from './translations.js';

// Mark body so CSS hides animate-on-scroll elements (fallback: visible without JS)
document.documentElement.classList.add('js-loaded');
if (document.body) {
  document.body.classList.add('js-ready');
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-ready');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('js-ready')) {
    document.body.classList.add('js-ready');
  }

  // ── i18n (Internationalization) ──
  const updateLanguage = (lang) => {
    const validLang = translations[lang] ? lang : 'en';
    document.documentElement.lang = validLang;
    
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[validLang]?.[key] !== undefined) {
        el.textContent = translations[validLang][key];
      }
    });

    const btnEn = document.getElementById('lang-en');
    const btnHi = document.getElementById('lang-hi');
    if (btnEn) btnEn.classList.toggle('active', validLang === 'en');
    if (btnHi) btnHi.classList.toggle('active', validLang === 'hi');

    try {
      localStorage.setItem('grc_lang', validLang);
    } catch {
      // localStorage may be disabled in private browsing
    }
  };

  const btnEn = document.getElementById('lang-en');
  const btnHi = document.getElementById('lang-hi');
  if (btnEn) btnEn.addEventListener('click', () => updateLanguage('en'));
  if (btnHi) btnHi.addEventListener('click', () => updateLanguage('hi'));

  // Load saved or default language
  let initialLang = 'en';
  try {
    const saved = localStorage.getItem('grc_lang');
    if (saved && (saved === 'en' || saved === 'hi')) initialLang = saved;
  } catch {
    // fallback to 'en'
  }
  updateLanguage(initialLang);

  // ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Hamburger mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
  };

  const toggleMobileMenu = () => {
    if (!mobileMenu || !hamburger) return;
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('menu-open', isOpen);
  };

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ── Counter animation ──
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    if (isNaN(target)) return;
    const duration = 1800;
    const intervalTime = target <= 10 ? 150 : target <= 20 ? 100 : 25;
    const increment = Math.max(1, Math.ceil(target / (duration / intervalTime)));
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

  // ── Keyboard support for certificate thumbnails ──
  document.querySelectorAll('.cert-thumb').forEach(thumb => {
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('role', 'button');
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.openLightbox(thumb);
      }
    });
  });
});

// ── Certificate Lightbox ── (global functions for inline onclick)
window.openLightbox = function(thumb) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  const thumbImg = thumb.querySelector('img');
  if (thumbImg) {
    img.src = thumbImg.src;
    img.alt = thumbImg.alt;
  }
  lb.classList.add('open');
  document.body.classList.add('lightbox-open');
};

window.closeLightbox = function() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.classList.remove('lightbox-open');
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLightbox();
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('menu-open');
    }
  }
});

