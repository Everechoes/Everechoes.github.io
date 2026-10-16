(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Top Scroll Progress Bar
  let progressBar = null;
  if (!prefersReducedMotion) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);
  }

  function updateProgressBar(scrollY) {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
    progressBar.style.width = `${progress}%`;
  }

  // 2. Lenis Smooth Scrolling
  let lenisInstance = null;
  if (typeof window.Lenis !== 'undefined' && !prefersReducedMotion) {
    try {
      lenisInstance = new window.Lenis({
        duration: 0.65,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.15,
        infinite: false
      });

      function raf(time) {
        if (lenisInstance) {
          lenisInstance.raf(time);
        }
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis could not be initialized:', e);
    }
  }

  // 3. Topbar Scrolled State
  const topbar = document.querySelector('.topbar');

  function handleScroll(scrollY) {
    updateProgressBar(scrollY);

    if (topbar) {
      topbar.classList.toggle('scrolled', scrollY > 20);
    }

    // Parallax update
    updateParallax(scrollY);

    // Eager reveal check while scrolling
    checkVisibleNow();

  }

  if (lenisInstance) {
    lenisInstance.on('scroll', (e) => {
      handleScroll(e.scroll);
    });
  }

  // Also bind native scroll as redundant guarantee
  window.addEventListener('scroll', () => {
    handleScroll(window.scrollY);
  }, { passive: true });

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (target) {
        event.preventDefault();
        if (lenisInstance) {
          const offset = hash === '#sandbox' ? 0 : -64;
          lenisInstance.scrollTo(target, { offset, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 5. Split-Text Helper
  function applySplitText(element) {
    if (!element || element.dataset.splitReady) return;
    element.dataset.splitReady = 'true';
    const text = element.textContent.trim();
    if (!text) return;

    element.innerHTML = `<span class="split-line"><span class="split-inner">${text}</span></span>`;
  }

  // Apply split text to section titles
  document.querySelectorAll('.sec-head .sec-name').forEach(applySplitText);

  // 6. Intersection Observer for Scroll Reveals
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        if (entry.target.dataset.countTo) {
          animateCounter(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  function observeTarget(el) {
    if (!el || el.dataset.scrollObserved) return;
    el.dataset.scrollObserved = 'true';
    revealObserver.observe(el);
  }

  function checkVisibleNow() {
    const vh = window.innerHeight;
    document.querySelectorAll('[data-scroll-observed]:not(.is-revealed)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh - 20) {
        el.classList.add('is-revealed');
        if (el.dataset.countTo) animateCounter(el);
      }
    });
  }

  // Initial elements to observe
  function observeAll() {
    const selectors = [
      '.sec-head',
      '.about-book-stage',
      '.project-intro',
      '.archive-grid',
      '.project-card',
      '.contact-intro',
      '.contact-grid',
      '.contact-card',
      '.footer',
      '[data-fade]',
      '[data-reveal]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(observeTarget);
    });

    checkVisibleNow();
  }

  observeAll();

  // Watch for dynamically rendered project cards in #archive-grid
  const archiveGrid = document.getElementById('archive-grid');
  if (archiveGrid) {
    const gridObserver = new MutationObserver(() => {
      archiveGrid.querySelectorAll('.project-card').forEach(card => {
        observeTarget(card);
      });
      if (archiveGrid.children.length > 0) {
        observeTarget(archiveGrid);
      }
      checkVisibleNow();
    });
    gridObserver.observe(archiveGrid, { childList: true });
  }

  // Re-check visibility when boot screen finishes
  const shortcut = document.getElementById('boot-home-shortcut');
  if (shortcut) {
    shortcut.addEventListener('click', () => {
      setTimeout(checkVisibleNow, 150);
      setTimeout(checkVisibleNow, 600);
    });
  }

  // Check periodically during page load & boot resolution
  window.addEventListener('load', () => {
    observeAll();
    setTimeout(checkVisibleNow, 500);
    setTimeout(checkVisibleNow, 1500);
  });

  const bodyObserver = new MutationObserver(() => {
    checkVisibleNow();
  });
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // 7. Parallax Effect on Scroll
  const parallaxTargets = [];
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    parallaxTargets.push({ element: el, speed, max: 120 });
  });

  function updateParallax(scrollY) {
    if (prefersReducedMotion || parallaxTargets.length === 0) return;
    parallaxTargets.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      if (rect.bottom >= -100 && rect.top <= window.innerHeight + 100) {
        const offset = Math.min(item.max, Math.max(-item.max, scrollY * item.speed));
        item.element.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }

  // 8. Number Counter Animation
  function animateCounter(el) {
    const targetVal = parseFloat(el.dataset.countTo);
    if (isNaN(targetVal)) return;

    const duration = 1200;
    const startVal = 0;
    const startTime = performance.now();
    const isDecimal = String(el.dataset.countTo).includes('.');
    const decimals = isDecimal ? String(el.dataset.countTo).split('.')[1].length : 0;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * ease;

      el.textContent = current.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = targetVal.toFixed(decimals);
      }
    }

    requestAnimationFrame(step);
  }

})();
