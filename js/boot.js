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
    const chronoStage = document.getElementById('chrono-stage');
    const oscCanvas = document.getElementById('boot-oscilloscope');
    const epochTracker = document.getElementById('epoch-live-tracker');
    const hudFlux = document.getElementById('hud-flux');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // 1. INVERTED RAIN STREAKS & SPARKS
    const rainStreaks = [];
    if (rain && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let index = 0; index < 150; index++) {
        const streak = document.createElement('span');
        streak.style.setProperty('--left', `${Math.random() * 100}%`);
        streak.style.setProperty('--width', `${1 + Math.random() * 1.2}px`);
        streak.style.setProperty('--height', `${30 + Math.random() * 55}px`);
        streak.style.setProperty('--opacity', `${0.4 + Math.random() * 0.3}`);
        streak.style.setProperty('--fall-speed', `${8 + Math.random() * 6}`);
        streak.style.setProperty('--drift', `${Math.random() * 60 - 30}px`);
        streak.style.setProperty('--slant', `${Math.random() * 10 - 5}deg`);
        streak.style.setProperty('--delay', `${-Math.random() * 6}s`);
        rain.appendChild(streak);
        rainStreaks.push(streak);
      }
    }

    function createRainSparks() {
      if (!rain || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      for (let index = 0; index < 24; index++) {
        const spark = document.createElement('i');
        spark.className = 'rain-spark';
        spark.style.setProperty('--left', `${Math.random() * 100}%`);
        spark.style.setProperty('--bottom', `${10 + Math.random() * 80}%`);
        spark.style.setProperty('--spark-drift', `${Math.random() * 50 - 25}px`);
        spark.style.setProperty('--spark-delay', `${Math.random() * 1.5}s`);
        rain.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove(), { once: true });
      }
    }

    // 2. OSCILLOSCOPE WAVEFORM ENGINE
    let oscCtx = null;
    let oscFrameId = null;
    let wavePhase = 0;

    if (oscCanvas && oscCanvas.getContext) {
      oscCtx = oscCanvas.getContext('2d');
    }

    function drawOscilloscope() {
      if (!oscCtx || !oscCanvas) return;
      const w = oscCanvas.width;
      const h = oscCanvas.height;
      const cy = h / 2;

      oscCtx.clearRect(0, 0, w, h);

      const isStorm = boot.classList.contains('storm-approaching');
      const isResolution = boot.classList.contains('resolution-phase') || boot.classList.contains('resolution-still');

      oscCtx.beginPath();
      oscCtx.lineWidth = isStorm ? 2 : 1.5;

      if (isStorm) {
        oscCtx.strokeStyle = '#ff4d6d';
        wavePhase += 0.28;
      } else if (isResolution) {
        oscCtx.strokeStyle = '#a7f3d0';
        wavePhase += 0.05;
      } else {
        oscCtx.strokeStyle = '#dfbb73';
        wavePhase += 0.08;
      }

      for (let x = 0; x < w; x++) {
        const norm = x / w;
        let y = cy;

        if (isStorm) {
          // Turbulent harmonic glitch wave with erratic spikes
          const noise = (Math.random() - 0.5) * 8;
          y += Math.sin(norm * 18 + wavePhase) * 9 + Math.cos(norm * 42 - wavePhase * 1.5) * 5 + noise;
        } else if (isResolution) {
          // Serene harmonic golden standing wave
          y += Math.sin(norm * 8 + wavePhase) * 3.5;
        } else {
          // Steady calibration sine wave
          y += Math.sin(norm * 12 + wavePhase) * 6 + Math.sin(norm * 24 + wavePhase * 0.5) * 2;
        }

        if (x === 0) oscCtx.moveTo(x, y);
        else oscCtx.lineTo(x, y);
      }

      oscCtx.stroke();
      oscFrameId = requestAnimationFrame(drawOscilloscope);
    }

    if (oscCtx) {
      drawOscilloscope();
    }

    // 3. GYROSCOPIC MOUSE / POINTER PARALLAX
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let parallaxFrameId = null;

    function onPointerMove(e) {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetTiltY = nx * 14; // Horizontal tilt
      targetTiltX = -ny * 14; // Vertical tilt
    }

    function updateParallax() {
      if (chronoStage) {
        currentTiltX += (targetTiltX - currentTiltX) * 0.08;
        currentTiltY += (targetTiltY - currentTiltY) * 0.08;
        chronoStage.style.setProperty('--tilt-x', `${currentTiltX.toFixed(2)}deg`);
        chronoStage.style.setProperty('--tilt-y', `${currentTiltY.toFixed(2)}deg`);
      }
      parallaxFrameId = requestAnimationFrame(updateParallax);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    updateParallax();

    // 4. TIMELINE & REVERSE: 1999 STORM CUTSCENE
    const steps = [
      { pct: 0,   text: 'INITIALIZING ARCHIVE' },
      { pct: 25,  text: 'LOADING COLLECTIONS' },
      { pct: 50,  text: 'PREPARING INTERFACE' },
      { pct: 75,  text: 'SYNCHRONIZING CONTENT' },
      { pct: 100, text: 'ARCHIVE READY' }
    ];

    const historicalEpochs = [
      '1999.12.31 // 23:59:59',
      '1985.10.26 // 01:21:00',
      '1966.07.16 // ERA DISSOLVING',
      '1945.05.08 // TIMELINE COLLAPSE',
      '1929.10.24 // BLACK THURSDAY',
      '1914.06.28 // ARCHDUKE FALL',
      '1888.11.08 // LONDON FOG',
      '1789.07.14 // BASTILLE FALL'
    ];

    let i = 0;
    let timeoutId = null;
    let bootComplete = false;
    let isStalling = false;
    let resolutionPhaseActive = false;
    let stormInterval = null;
    let stormStartedAt = null;
    let currentRainDensity = 0;
    let epochIndex = 0;

    function setRainDensity(density) {
      currentRainDensity = Math.max(0, Math.min(density, 1));
      const amount = currentRainDensity * rainStreaks.length;
      rainStreaks.forEach((streak, index) => {
        const opacity = Math.max(0, Math.min(amount - index, 1));
        streak.style.setProperty('--rain-amount', opacity.toFixed(3));
      });
    }

    function updateStormSpeed() {
      if (!stormStartedAt) return;
      const elapsed = performance.now() - stormStartedAt;
      const progress = Math.min(elapsed / 16000, 1);

      // Decelerates hand speed duration (meaning spins FASTER: 2.0s down to 0.16s)
      const duration = 2.0 - progress * 1.84;
      boot.style.setProperty('--storm-rev-speed', `${Math.max(duration, 0.16).toFixed(3)}s`);
      boot.style.setProperty('--glitch-speed', `${(0.4 - progress * 0.32).toFixed(3)}s`);
      setRainDensity(Math.min(elapsed / 8000, 1));

      // Cycle rapidly backwards through historical eras
      if (epochTracker) {
        epochIndex = (epochIndex + 1) % historicalEpochs.length;
        epochTracker.textContent = `EPOCH: ${historicalEpochs[epochIndex]}`;
      }

      if (hudFlux) {
        hudFlux.textContent = `FLUX: ${(0.002 + Math.random() * 0.98).toFixed(4)} Δt`;
      }
    }

    function stopStorm() {
      if (stormInterval) {
        clearInterval(stormInterval);
        stormInterval = null;
      }
      boot.classList.remove('storm-approaching', 'storm-gathering');
      boot.style.removeProperty('--storm-rev-speed');
      boot.style.removeProperty('--glitch-speed');
    }

    function updateStatus(text, pct) {
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

      if (pct === 80) {
        boot.classList.add('storm-gathering');
      }

      if (pct >= 85 && pct < 95) {
        if (!boot.classList.contains('storm-approaching')) {
          stormStartedAt = performance.now();
          boot.style.setProperty('--storm-rev-speed', '2.0s');
          boot.style.setProperty('--glitch-speed', '0.4s');
          setRainDensity(0);
          boot.classList.remove('storm-gathering');
          boot.classList.add('storm-approaching');
          createRainSparks();
          stormInterval = setInterval(updateStormSpeed, 120);
        }
      }

      if (pct >= 95) {
        stopStorm();
        boot.classList.add('storm-clearing');
        setRainDensity(0.1);
        if (epochTracker) {
          epochTracker.textContent = 'EPOCH: 1999.12.31 // RE-SYNCHRONIZED';
        }
        if (hudFlux) {
          hudFlux.textContent = 'FLUX: 0.0000 Δt (STABLE)';
        }
      }
    }

    function enterResolutionPhase() {
      resolutionPhaseActive = true;
      stopStorm();
      setRainDensity(0);

      boot.classList.remove('storm-clearing', 'storm-gathering', 'storm-approaching');
      boot.classList.add('resolution-phase');

      status.textContent = 'Archive Ready.';
      value.textContent = '100%';
      bar.style.width = '100%';

      let subText = document.getElementById('boot-subtext');
      if (!subText) {
        subText = document.createElement('div');
        subText.id = 'boot-subtext';
        subText.className = 'boot-subtext mono';
        subText.textContent = 'Welcome to the archive.';
        const readout = document.querySelector('.boot-readout');
        if (readout && readout.parentNode) {
          readout.parentNode.insertBefore(subText, readout.nextSibling);
        }
      }

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        boot.classList.add('resolution-still');

        timeoutId = setTimeout(() => {
          resetHomePosition();
          page.classList.add('ready');
          requestAnimationFrame(() => {
            boot.classList.add('is-leaving');

            setTimeout(() => {
              boot.style.display = 'none';
              document.body.classList.remove('no-scroll');
              if (oscFrameId) cancelAnimationFrame(oscFrameId);
              if (parallaxFrameId) cancelAnimationFrame(parallaxFrameId);
              window.removeEventListener('pointermove', onPointerMove);
            }, prefersReducedMotion ? 0 : 1400);
          });
        }, 1200);
      }, 2600);
    }

    function finishBoot() {
      if (bootComplete) return;
      bootComplete = true;
      if (timeoutId) clearTimeout(timeoutId);
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

      if (s.pct === 100) {
        bootComplete = true;
        return;
      }

      i++;

      if (s.pct === 95) {
        timeoutId = setTimeout(next, 2600);
      } else if (s.pct >= 95) {
        timeoutId = setTimeout(next, 700);
      } else if (s.pct >= 85) {
        timeoutId = setTimeout(next, 2200);
      } else if (s.pct >= 80) {
        timeoutId = setTimeout(next, 1200);
      } else {
        timeoutId = setTimeout(next, 450);
      }
    }

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
      if (oscFrameId) cancelAnimationFrame(oscFrameId);
      if (parallaxFrameId) cancelAnimationFrame(parallaxFrameId);
      window.removeEventListener('pointermove', onPointerMove);
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
      if (event.key === 'Escape' || event.code === 'Space') {
        skipToHome();
      } else if (event.target !== homeShortcut) {
        skipBoot();
      }
    });

    next();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBoot);
  } else {
    initBoot();
  }
})();