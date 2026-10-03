(function() {
  const sketch = document.getElementById('architect-sketch');
  const video = document.getElementById('architecture-video');
  const sandbox = document.getElementById('sandbox');
  const status = document.getElementById('visual-settings-status');
  const choices = Array.from(document.querySelectorAll('.visual-choice'));
  if (!sketch || !video || !sandbox || !status || !choices.length) return;

  let modeRequest = 0;
  let playbackTimer;

  function updateControls(mode) {
    choices.forEach(choice => {
      const active = choice.dataset.visualMode === mode;
      const selectButton = choice.querySelector('.visual-choice-select');
      const toggleButton = choice.querySelector('.visual-slot-toggle');
      selectButton.setAttribute('aria-pressed', String(active));
      toggleButton.setAttribute('aria-pressed', String(active));
      toggleButton.setAttribute('aria-label', `${choice.querySelector('.visual-choice-select span').textContent} ${active ? 'ON' : 'OFF'}`);
      toggleButton.classList.toggle('burst', active);
    });
  }

  function setDraft(message = 'ARCHITECTURAL / ON', error) {
    ++modeRequest;
    window.clearTimeout(playbackTimer);
    video.pause();
    video.hidden = true;
    sketch.hidden = false;
    sandbox.classList.remove('is-video-mode');
    document.body.classList.remove('is-video-mode');
    updateControls('draft');
    status.textContent = message;
    if (error) console.error('Could not play architectural video:', error);
  }

  function setOff() {
    ++modeRequest;
    window.clearTimeout(playbackTimer);
    video.pause();
    video.hidden = true;
    sketch.hidden = true;
    sandbox.classList.remove('is-video-mode');
    document.body.classList.remove('is-video-mode');
    updateControls('off');
    status.textContent = 'VISUAL / OFF';
  }

  function selectMode(mode) {
    if (mode === 'off') {
      setOff();
      return;
    }

    if (mode === 'draft') {
      setDraft();
      return;
    }

    const request = ++modeRequest;
    window.clearTimeout(playbackTimer);
    updateControls(mode);
    sketch.hidden = true;
    video.hidden = false;
    sandbox.classList.add('is-video-mode');
    document.body.classList.add('is-video-mode');
    status.textContent = 'VIDEO / LOADING';
    playbackTimer = window.setTimeout(() => {
      if (request === modeRequest && !video.hidden) status.textContent = 'VIDEO / STILL LOADING';
    }, 15000);

    video.play().then(() => {
      if (request !== modeRequest || video.hidden) return;
      window.clearTimeout(playbackTimer);
      status.textContent = 'VIDEO / ON';
    }).catch(error => {
      if (request === modeRequest) setDraft('VIDEO / UNAVAILABLE', error);
    });
  }

  choices.forEach(choice => {
    const mode = choice.dataset.visualMode;
    choice.querySelector('.visual-choice-select').addEventListener('click', () => selectMode(mode));
    choice.querySelector('.visual-slot-toggle').addEventListener('click', event => {
      const isActive = event.currentTarget.getAttribute('aria-pressed') === 'true';
      if (!isActive) {
        selectMode(mode);
      } else if (mode === 'video') {
        selectMode('draft');
      } else {
        selectMode('off');
      }
    });
  });

  video.addEventListener('error', () => {
    if (!video.hidden) setDraft('VIDEO / FILE UNAVAILABLE', video.error);
  });

})();
