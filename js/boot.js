(function() {
  document.body.classList.add('no-scroll');

  function initBoot() {
    const boot = document.getElementById('boot');
    const bar = document.getElementById('boot-bar');
    const status = document.getElementById('boot-status');
    const value = document.getElementById('boot-value');
    const page = document.getElementById('page');
    const rain = document.getElementById('boot-rain');
    const homeShortcut = document.getElementById('boot-home-shortcut');
    const rainStreaks = [];

    if (!boot || !bar || !status || !value || !page) return;

    function resetHomePosition() {
      if (window.location.hash) {
        window.history.replaceState(
          window.history.state,
          '',
          `${window.location.pathname}${window.location.search}`
        );
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    resetHomePosition();

    if (rain && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let index = 0; index < 170; index++) {
        const streak = document.createElement('span');
        streak.style.setProperty('--left', `${Math.random() * 100}%`);
        streak.style.setProperty('--width', `${1 + Math.random() * 0.9}px`);
        streak.style.setProperty('--height', `${24 + Math.random() * 52}px`);
        streak.style.setProperty('--opacity', `${0.38 + Math.random() * 0.24}`);
        streak.style.setProperty('--fall-speed', `${9 + Math.random() * 6}`);
        streak.style.setProperty('--drift', `${Math.random() * 64 - 32}px`);
        streak.style.setProperty('--slant', `${Math.random() * 12 - 6}deg`);
        streak.style.setProperty('--delay', `${-Math.random() * 6}s`);
        rain.appendChild(streak);
        rainStreaks.push(streak);
      }
    }

    const steps = [
  { pct: 0,   text: 'INITIATING ST. PAVLOV OS' },
  { pct: 10,  text: 'CONNECTING ARCHIVE SERVER' },
  { pct: 20,  text: 'DECODING ARCANUM INDEX' },
  { pct: 32,  text: 'CALIBRATING ISOLATION BARRIER' },
  { pct: 44,  text: 'ESTABLISHING RESONANCE MATRIX' },
  { pct: 56,  text: 'STRENGTHENING LAPIDARY SHIELD' },
  { pct: 68,  text: 'SYNCHRONIZING REGULUS SIGNAL' },
  { pct: 80,  text: 'SCANNING CHRONO-DISRUPTION' },
  { pct: 81,  text: 'CLOUD FRONT APPROACHING' },
  { pct: 82,  text: 'ATMOSPHERIC PRESSURE SHIFTING' },
  { pct: 83,  text: 'TEMPORAL PRECIPITATION DETECTED' },
  { pct: 84,  text: 'CHRONO-STORM IMMINENT' },
  { pct: 85,  text: 'Warning: The Rain Reversing' },
  { pct: 91,  text: 'Warning: The Rain Reversing' },
  { pct: 92,  text: 'Warning: The Rain Reversing'},
  { pct: 93,  text: 'Warning: The Rain Reversing' },
  { pct: 94,  text: 'Warning: The Rain Reversing' },
  { pct: 95,  text: 'Warning: The Rain Reversing' },
  { pct: 96,  text: 'Reconnecting Signal...' },
  { pct: 97,  text: 'Reconnecting Signal...' },
  { pct: 98,  text: 'Reconnecting Signal...' },
  { pct: 99,  text: 'Reconnecting Signal...' },
  { pct: 100, text: 'Welcome Back, Architect.' }
];
    let i = 0;
    let timeoutId = null;
    let bootComplete = false;
    let isStalling = false;
    let currentPct = 0;
    let resolutionPhaseActive = false;
    let stormInterval = null;
    let stormStartedAt = null;
    let rainClearInterval = null;
    let currentRainDensity = 0;

    function setRainDensity(density) {
      currentRainDensity = Math.max(0, Math.min(density, 1));
      const amount = currentRainDensity * rainStreaks.length;
      rainStreaks.forEach((streak, index) => {
        const opacity = Math.max(0, Math.min(amount - index, 1));
        streak.style.setProperty('--rain-amount', opacity.toFixed(3));
      });
    }

    function createRainSparks() {
      if (!rain || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      for (let index = 0; index < 26; index++) {
        const spark = document.createElement('i');
        spark.className = 'rain-spark';
        spark.style.setProperty('--left', `${Math.random() * 100}%`);
        spark.style.setProperty('--top', `${20 + Math.random() * 80}%`);
        spark.style.setProperty('--spark-drift', `${Math.random() * 56 - 28}px`);
        spark.style.setProperty('--spark-delay', `${Math.random() * 1.2}s`);
        rain.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove(), { once: true });
      }
    }

    function updateStormSpeed() {
      const elapsed = performance.now() - stormStartedAt;
      const progress = Math.min(elapsed / 20000, 1);
      const duration = 0.5 - progress * 0.44;
      boot.style.setProperty('--glitch-speed', `${duration.toFixed(3)}s`);
      setRainDensity(Math.min(elapsed / 12000, 1));
    }

    function stopStorm() {
      if (stormInterval) {
        clearInterval(stormInterval);
        stormInterval = null;
      }
      boot.classList.remove('storm-approaching');
      boot.style.removeProperty('--glitch-speed');
    }

    function beginRainClearing() {
      stopStorm();
      boot.classList.remove('storm-gathering');
      boot.classList.add('storm-clearing');
      const clearingStartedAt = performance.now();
      const startingDensity = currentRainDensity;

      rainClearInterval = setInterval(() => {
        const progress = Math.min((performance.now() - clearingStartedAt) / 2600, 1);
        setRainDensity(startingDensity * (1 - progress));

        if (progress >= 1) {
          clearInterval(rainClearInterval);
          rainClearInterval = null;
          setRainDensity(0);
        }
      }, 100);
    }

    function finishRainClearing() {
      if (rainClearInterval) {
        clearInterval(rainClearInterval);
        rainClearInterval = null;
      }
      setRainDensity(0);
    }

    function updateStormClearColor(pct) {
      const progress = Math.min(Math.max((pct - 95) / 4, 0), 1);
      const start = [119, 123, 125];
      const end = [244, 244, 240];
      const channels = start.map((channel, index) => Math.round(channel + (end[index] - channel) * progress));
      boot.style.backgroundColor = `rgb(${channels.join(', ')})`;
    }

    function updateStatus(text, pct) {
      currentPct = pct;
      
      // Handle 100% resolution phase
      if (pct === 100 && !resolutionPhaseActive) {
        enterResolutionPhase();
        return;
      }

      status.classList.remove('status-fade');
      void status.offsetWidth;
      status.classList.add('status-fade');
      status.textContent = text;
      value.textContent = String(pct).padStart(3, '0') + '%';
      bar.style.width = pct + '%';

      if (pct === 80) boot.classList.add('storm-gathering');

      if (pct >= 85 && pct < 95) {
        if (!boot.classList.contains('storm-approaching')) {
          stormStartedAt = performance.now();
          boot.style.setProperty('--glitch-speed', '0.5s');
          setRainDensity(0);
          boot.classList.remove('storm-gathering');
          boot.classList.add('storm-approaching', 'storm-text-lift');
          createRainSparks();
          stormInterval = setInterval(updateStormSpeed, 100);
        }
      }

      if (pct === 95) {
        beginRainClearing();
      }
      if (pct >= 95 && pct < 100) updateStormClearColor(pct);
      if (pct === 99) finishRainClearing();
    }

    function enterResolutionPhase() {
      resolutionPhaseActive = true;

      updateStormClearColor(100);
      if (rainClearInterval) finishRainClearing();
      const wasStorming = boot.classList.contains('storm-approaching');
      stopStorm();
      boot.classList.remove('storm-text-lift');
      if (wasStorming) boot.classList.add('storm-clearing');

      // 2. Change main text and percentage
      status.classList.remove('status-fade');
      void status.offsetWidth;
      status.classList.add('status-fade');
      status.textContent = 'Welcome Back, Architect.';
      value.textContent = '100%';
      bar.style.width = '100%';

      // 3. Create and add subtitle element for resolution phase
      let subText = document.getElementById('boot-subtext');
      if (!subText) {
        subText = document.createElement('div');
        subText.id = 'boot-subtext';
        subText.className = 'boot-subtext mono';
        subText.textContent = 'The rain has stopped. The world is still.';
        
        // Insert after boot-readout
        const readout = document.querySelector('.boot-readout');
        if (readout && readout.parentNode) {
          readout.parentNode.insertBefore(subText, readout.nextSibling);
        }
      }
      subText.classList.add('fade-in-resolution');

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      boot.classList.remove('whiteout', 'whiteout-exit');

      function showClearSky() {
        boot.classList.remove('storm-clearing');
        boot.classList.add('resolution-phase', 'resolution-flash');

        timeoutId = setTimeout(() => {
          boot.classList.remove('resolution-flash');
          boot.classList.add('resolution-still');

          timeoutId = setTimeout(() => {
            boot.style.transition = 'opacity 1s ease-out, transform 1.3s cubic-bezier(.2,.7,.2,1)';
            boot.style.opacity = '0';
            boot.style.transform = 'scale(1.035)';
            resetHomePosition();
            page.classList.add('ready');

            setTimeout(() => {
              boot.style.display = 'none';
              document.body.classList.remove('no-scroll');
            }, 1000);
          }, 1000);
        }, 7000);
      }

      if (!wasStorming) {
        setRainDensity(0);
        showClearSky();
        return;
      }

      const clearingStartedAt = performance.now();
      const clearingDuration = 3200;
      function clearRain() {
        const progress = Math.min((performance.now() - clearingStartedAt) / clearingDuration, 1);
        setRainDensity(1 - progress);

        if (progress < 1) {
          timeoutId = setTimeout(clearRain, 100);
          return;
        }

        setRainDensity(0);
        timeoutId = setTimeout(showClearSky, 1800);
      }
      clearRain();
    }

    function finishBoot() {
      if (bootComplete) return;

      bootComplete = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Skip to resolution phase directly if resolution not already active
      if (!resolutionPhaseActive) {
        enterResolutionPhase();
      }
    }

    function next() {
      if (bootComplete) return;

      if (i >= steps.length) {
        timeoutId = setTimeout(finishBoot, 400);
        return;
      }

      const s = steps[i];
      updateStatus(s.text, s.pct);

      // If we just hit 100%, the resolution phase is now active
      if (s.pct === 100) {
        bootComplete = true;
        return;
      }

      i++;

      // Spread the storm sequence across 20 seconds, with progressively faster glitching.
      if (s.pct === 95) {
        timeoutId = setTimeout(next, 2700);
      } else if (s.pct >= 95) {
        timeoutId = setTimeout(next, 650);
      } else if (s.pct >= 85) {
        timeoutId = setTimeout(next, 2000);
      } else if (s.pct >= 80) {
        timeoutId = setTimeout(next, 1200);
      } else {
        timeoutId = setTimeout(next, 500);
      }
    }

    // Skip animation with click or keydown
    function skipBoot() {
      if (!bootComplete && !isStalling) {
        finishBoot();
      }
    }

    function skipToHome() {
      if (bootComplete && boot.style.display === 'none') return;

      bootComplete = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (stormInterval) clearInterval(stormInterval);
      if (rainClearInterval) clearInterval(rainClearInterval);
      resetHomePosition();
      boot.style.display = 'none';
      page.classList.add('ready');
      document.body.classList.remove('no-scroll');
    }

    if (homeShortcut) {
      homeShortcut.addEventListener('click', event => {
        event.stopPropagation();
        skipToHome();
      });
    }

    boot.addEventListener('click', skipBoot);
    document.addEventListener('keydown', event => {
      if (event.target !== homeShortcut) skipBoot();
    });

    next();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBoot);
  } else {
    initBoot();
  }
})();