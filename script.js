const THEME_KEY = 'portfolio-theme';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  const themeColor = theme === 'dark' ? '#070b12' : '#f5f7fb';
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor);
  }
}

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  applyTheme(getPreferredTheme());

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const nav = navToggle?.closest('.nav');
  if (!navToggle || !mobileNav) return;

  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileNav.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    mobileNav.classList.add('open');
    document.body.classList.add('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });

  mobileNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth >= 860) return;
      closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth >= 860) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!mobileNav.contains(target) && !nav?.contains(target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) {
      closeMenu();
    }
  });
}

function initRevealAnimations() {
  const fadeEls = Array.from(document.querySelectorAll('.fade-in'));
  if (!fadeEls.length) return;

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    fadeEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.01, rootMargin: '0px 0px -10% 0px' }
  );

  fadeEls.forEach((el) => observer.observe(el));
}

function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    },
    { passive: true }
  );

  window.addEventListener('resize', updateProgress);
  updateProgress();
}

function initActiveNavLinks() {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"]'));
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const id = link.getAttribute('href');
    if (!id) return;
    const section = document.querySelector(id);
    if (!section) return;

    if (!sectionMap.has(id)) {
      sectionMap.set(id, { id, section, links: [] });
    }

    sectionMap.get(id).links.push(link);
  });

  const sections = Array.from(sectionMap.values());

  if (!sections.length) return;

  const setActiveLink = (id) => {
    sections.forEach(({ links, section }) => {
      const isActive = `#${section.id}` === id;
      links.forEach((link) => {
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  };

  let ticking = false;

  const updateActive = () => {
    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight : 0;
    const marker = window.scrollY + headerOffset + window.innerHeight * 0.22;

    let current = sections[0];
    sections.forEach((item) => {
      const top = item.section.offsetTop;
      if (top <= marker) {
        current = item;
      }
    });

    setActiveLink(`#${current.section.id}`);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActive);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  onScroll();
}

function initLoadTime() {
  const el = document.getElementById('loadTime');
  const valueEl = document.getElementById('loadTimeValue');
  if (!el || !valueEl) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      const ms = perf ? Math.round(perf.loadEventEnd - perf.startTime) : Math.round(performance.now());

      valueEl.textContent = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
      el.classList.add('visible');
    }, 0);
  });
}

function initYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function init() {
  initThemeToggle();
  initMobileNav();
  initRevealAnimations();
  initScrollProgress();
  initActiveNavLinks();
  initLoadTime();
  initYear();
}

init();
