(function() {
  const settings = document.querySelector('.sound-settings');
  const settingsToggle = document.getElementById('sound-settings-toggle');
  const panel = document.getElementById('sound-panel');
  const status = document.getElementById('sound-status');
  const choices = Array.from(document.querySelectorAll('#sound-tab-panel .sound-choice'));
  const tabs = Array.from(document.querySelectorAll('.settings-tab'));
  const tabPanels = Array.from(document.querySelectorAll('.settings-tab-panel'));
  if (!settings || !settingsToggle || !panel || !status || !choices.length) return;

  const closeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380;
  const tracks = choices.map(choice => ({
    name: choice.dataset.name,
    file: choice.dataset.file,
    audio: new Audio()
  }));
  let activeIndex = -1;
  let panelCloseTimer;
  let gearCloseTimer;

  tracks.forEach(track => {
    track.audio.loop = true;
    track.audio.preload = 'none';
  });

  function closePanel() {
    window.clearTimeout(panelCloseTimer);
    window.clearTimeout(gearCloseTimer);
    settingsToggle.setAttribute('aria-expanded', 'false');
    settingsToggle.setAttribute('aria-label', 'Open system settings');
    settingsToggle.classList.remove('is-open');
    settingsToggle.classList.add('is-closing');
    gearCloseTimer = window.setTimeout(() => settingsToggle.classList.remove('is-closing'), closeDuration);
    panel.classList.remove('is-open');
    if (!panel.hidden) {
      panelCloseTimer = window.setTimeout(() => {
        if (settingsToggle.getAttribute('aria-expanded') === 'false') panel.hidden = true;
      }, closeDuration);
    }
  }

  function openPanel() {
    window.clearTimeout(panelCloseTimer);
    window.clearTimeout(gearCloseTimer);
    panel.hidden = false;
    settingsToggle.setAttribute('aria-expanded', 'true');
    settingsToggle.setAttribute('aria-label', 'Close system settings');
    settingsToggle.classList.remove('is-closing');
    settingsToggle.classList.add('is-open');
    window.requestAnimationFrame(() => {
      if (settingsToggle.getAttribute('aria-expanded') === 'true') panel.classList.add('is-open');
    });
  }

  function selectSettingsTab(tab) {
    tabs.forEach(candidate => {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });
    tabPanels.forEach(tabPanel => {
      tabPanel.hidden = tabPanel.id !== tab.getAttribute('aria-controls');
    });
  }

  function stopActive() {
    if (activeIndex < 0) return;
    const activeTrack = tracks[activeIndex];
    activeTrack.audio.pause();
    activeTrack.audio.currentTime = 0;
    const button = choices[activeIndex].querySelector('.sound-slot-toggle');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Play ${activeTrack.name}`);
    activeIndex = -1;
  }

  function playingStatus(track) {
    return `PLAYING ${track.file.split('/').pop().toUpperCase()}`;
  }

  function selectTrack(index) {
    if (activeIndex !== index) stopActive();
    choices.forEach((choice, choiceIndex) => {
      choice.querySelector('.sound-choice-select').setAttribute('aria-pressed', String(choiceIndex === index));
    });
    status.textContent = activeIndex === index ? playingStatus(tracks[index]) : 'SOUND OFF';
  }

  async function toggleTrack(index, button) {
    if (activeIndex === index) {
      stopActive();
      status.textContent = 'SOUND OFF';
      return;
    }

    stopActive();
    selectTrack(index);
    const track = tracks[index];
    track.audio.src = track.file;

    try {
      await track.audio.play();
      activeIndex = index;
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', `Stop ${track.name}`);
      button.classList.remove('burst');
      void button.offsetWidth;
      button.classList.add('burst');
      button.addEventListener('animationend', () => button.classList.remove('burst'), { once: true });
      status.textContent = playingStatus(track);
    } catch (error) {
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Play ${track.name}`);
      status.textContent = `ADD FILE: ${track.file}`;
    }
  }

  settingsToggle.addEventListener('click', () => {
    const isOpen = settingsToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closePanel();
    else openPanel();
  });

  choices.forEach((choice, index) => {
    choice.querySelector('.sound-choice-select').addEventListener('click', () => selectTrack(index));
    choice.querySelector('.sound-slot-toggle').addEventListener('click', event => toggleTrack(index, event.currentTarget));
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSettingsTab(tab));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
      selectSettingsTab(nextTab);
      nextTab.focus();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePanel();
  });

  document.addEventListener('click', event => {
    if (settingsToggle.getAttribute('aria-expanded') === 'true' && !settings.contains(event.target)) {
      closePanel();
    }
  });
})();