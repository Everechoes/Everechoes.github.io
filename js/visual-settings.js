(function() {
  'use strict';

  const sketch = document.getElementById('architect-sketch');
  const invitation = document.getElementById('archival-invitation');
  const heroSketch = document.querySelector('.hero-sketch');
  const video = document.getElementById('architecture-video');
  const sandbox = document.getElementById('sandbox');
  const page = document.getElementById('page');
  const status = document.getElementById('visual-settings-status');
  const choices = Array.from(document.querySelectorAll('.visual-choice'));
  if (!sketch || !invitation || !video || !sandbox || !page || !status || !choices.length) return;

  const body = document.body;
  body.classList.add('theme-default');

  // Create ambient shimmer overlay element if not present
  let shimmer = document.querySelector('.visual-transition-shimmer');
  if (!shimmer) {
    shimmer = document.createElement('div');
    shimmer.className = 'visual-transition-shimmer';
    shimmer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(shimmer);
  }

  let modeRequest = 0;
  let currentMode = 'draft';
  let playbackTimer;
  let transitionTimer;

  function getSketch(mode) {
    return mode === 'invitation' ? invitation : sketch;
  }

  function clearTransition() {
    window.clearTimeout(transitionTimer);
    transitionTimer = undefined;
    body.classList.remove('is-switching-visual', 'to-ancient', 'to-default');
    if (video) video.classList.remove('is-animating');
    sketch.classList.remove('is-animating');
    invitation.classList.remove('is-animating');
  }

  function updateControls(mode) {
    choices.forEach(choice => {
      const active = choice.dataset.visualMode === mode;
      const selectButton = choice.querySelector('.visual-choice-select');
      const toggleButton = choice.querySelector('.visual-slot-toggle');
      const name = selectButton.querySelector('span').textContent;
      selectButton.setAttribute('aria-pressed', String(active));
      toggleButton.setAttribute('aria-pressed', String(active));
      toggleButton.setAttribute('aria-label', `Select ${name} visual`);
      toggleButton.classList.toggle('burst', active);
    });
  }

  function setDraft(mode = 'draft', message = mode === 'invitation' ? 'ARCHIVAL INVITATION / ON' : 'ARCHITECTURAL STUDY / ON') {
    const isCurrentlyVideo = body.classList.contains('is-video-mode') || body.classList.contains('theme-ancient');
    const targetSketch = getSketch(mode);
    const request = ++modeRequest;
    window.clearTimeout(playbackTimer);
    updateControls(mode);

    if (!isCurrentlyVideo && currentMode === mode) {
      status.textContent = message;
      return;
    }

    clearTransition();

    const previousSketch = currentMode === 'video' ? null : getSketch(currentMode);
    if (previousSketch && previousSketch !== targetSketch) {
      previousSketch.hidden = true;
      previousSketch.setAttribute('aria-hidden', 'true');
    }

    targetSketch.classList.add('is-animating');
    targetSketch.hidden = false;
    targetSketch.removeAttribute('aria-hidden');

    video.classList.add('is-animating');

    // 2. Add transition classes
    body.classList.add('is-switching-visual', 'to-default');
    status.textContent = mode === 'invitation' ? 'SWITCHING TO ARCHIVAL INVITATION...' : 'SWITCHING TO ARCHITECTURAL STUDY...';

    requestAnimationFrame(() => {
      sandbox.classList.remove('is-video-mode');
      body.classList.remove('is-video-mode', 'theme-ancient');
      body.classList.add('theme-default');
    });
    currentMode = mode;

    transitionTimer = window.setTimeout(() => {
      if (request !== modeRequest) return;
      video.pause();
      video.hidden = true;
      video.classList.remove('is-animating');
      targetSketch.classList.remove('is-animating');
      body.classList.remove('is-switching-visual', 'to-default');
      status.textContent = message;
      if (mode === 'invitation' && typeof window.replayWelcomeWriting === 'function') {
        window.replayWelcomeWriting();
      }
    }, 850);
  }

  function setAncient(message = 'ANCIENT / ON') {
    const isAlreadyVideo = body.classList.contains('is-video-mode') && body.classList.contains('theme-ancient');
    const previousMode = currentMode;
    const request = ++modeRequest;
    window.clearTimeout(playbackTimer);
    updateControls('video');

    if (isAlreadyVideo) {
      status.textContent = message;
      return;
    }

    clearTransition();

    // 1. Prepare video and sketch for crossfade
    video.classList.add('is-animating');
    video.hidden = false;
    const previousSketch = previousMode === 'video' ? null : getSketch(previousMode);
    if (previousSketch) previousSketch.classList.add('is-animating');

    // 2. Add transition classes
    body.classList.add('is-switching-visual', 'to-ancient');
    status.textContent = 'SWITCHING TO ANCIENT...';

    video.play().then(() => {
      if (request === modeRequest && !video.hidden) {
        status.textContent = message;
      }
    }).catch(err => {
      console.warn('Video auto-playback deferred:', err);
      if (request === modeRequest && !video.hidden) {
        setDraft('draft', 'VIDEO / PLAYBACK UNAVAILABLE');
      }
    });

    requestAnimationFrame(() => {
      sandbox.classList.add('is-video-mode');
      body.classList.add('is-video-mode', 'theme-ancient');
      body.classList.remove('theme-default');
    });
    currentMode = 'video';

    transitionTimer = window.setTimeout(() => {
      if (request !== modeRequest) return;
      if (previousSketch) {
        previousSketch.setAttribute('aria-hidden', 'true');
        previousSketch.hidden = true;
        previousSketch.classList.remove('is-animating');
      }
      video.classList.remove('is-animating');
      body.classList.remove('is-switching-visual', 'to-ancient');
      if (!video.paused) {
        status.textContent = message;
      }
    }, 850);
  }

  function selectMode(mode) {
    if (mode === 'draft') {
      setDraft();
    } else if (mode === 'invitation') {
      setDraft('invitation');
    } else {
      setAncient();
    }
  }

  choices.forEach(choice => {
    const mode = choice.dataset.visualMode;
    choice.querySelector('.visual-choice-select').addEventListener('click', () => selectMode(mode));
    choice.querySelector('.visual-slot-toggle').addEventListener('click', event => {
      const isActive = event.currentTarget.getAttribute('aria-pressed') === 'true';
      if (!isActive) selectMode(mode);
    });
  });

  video.addEventListener('error', () => {
    if (!video.hidden) setDraft('draft', 'VIDEO / FILE UNAVAILABLE');
  });

})();
