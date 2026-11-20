(function() {
  const list = document.getElementById('mail-list');
  const title = document.getElementById('mail-message-title');
  if (!list || !title) return;

  const messages = [
    {
      id: 'parcel',
      title: 'A Parcel Left at Dusk',
      sender: 'From: The North Station Desk',
      date: '13 NOV 2026',
      expiry: '29 days remaining',
      body: 'A small parcel was found beside the station clock. It has been kept safe for you; please collect it before the winter archive closes.',
      attachment: 'Station token',
      note: 'SEALED / 01 ITEM',
      unread: true,
      claimed: false
    },
    {
      id: 'postcard',
      title: 'Postcard from the Coast',
      sender: 'From: Mara, Lighthouse Keeper',
      date: '09 NOV 2026',
      expiry: 'Filed in your archive',
      body: 'The tide brought this card back to shore. The ink has faded, but the little sketch on the reverse is still bright enough to remember.',
      attachment: 'Coastal sketch',
      note: 'COLLECTED / 01 ITEM',
      unread: true,
      claimed: true
    },
    {
      id: 'invitation',
      title: 'An Evening in the Conservatory',
      sender: 'From: The Glasshouse Society',
      date: '06 NOV 2026',
      expiry: '12 days remaining',
      body: 'You are invited to a quiet gathering beneath the old glass roof. Bring a warm coat; the winter roses have begun to bloom.',
      attachment: 'Garden invitation',
      note: 'SEALED / 01 ITEM',
      unread: true,
      claimed: false
    },
    {
      id: 'edition',
      title: 'The Winter Edition',
      sender: 'From: The Reading Room',
      date: '05 NOV 2026',
      expiry: 'Filed in your archive',
      body: 'Our latest edition is ready. This issue gathers small observations from the season and a map of the quiet streets around the old library.',
      attachment: 'Printed journal',
      note: 'COLLECTED / 01 ITEM',
      unread: true,
      claimed: true
    },
    {
      id: 'garden',
      title: 'A Note from the Garden',
      sender: 'From: The Groundskeeper',
      date: '02 NOV 2026',
      expiry: 'Filed in your archive',
      body: 'The greenhouse is closed for the season. I left one pressed leaf between the pages of the register for you to find.',
      attachment: 'Pressed leaf',
      note: 'COLLECTED / 01 ITEM',
      unread: false,
      claimed: true
    },
    {
      id: 'ledger',
      title: 'Your Archive Ledger',
      sender: 'From: Records and Returns',
      date: '30 OCT 2026',
      expiry: 'Filed in your archive',
      body: 'The latest ledger has been balanced and placed in your records. Thank you for helping us keep the archive in order.',
      attachment: 'Ledger copy',
      note: 'COLLECTED / 01 ITEM',
      unread: false,
      claimed: true
    }
  ];

  const total = document.getElementById('mail-total');
  const sidebar = document.querySelector('.mail-sidebar');
  const unread = document.getElementById('mail-unread');
  const sender = document.getElementById('mail-sender');
  const date = document.getElementById('mail-date');
  const expiry = document.getElementById('mail-expiry');
  const body = document.getElementById('mail-message-body');
  const attachment = document.getElementById('mail-attachment-name');
  const attachmentNote = document.getElementById('mail-attachment-note');
  const collectButton = document.getElementById('mail-collect');
  const claimAllButton = document.getElementById('mail-claim-all');
  const deleteReadButton = document.getElementById('mail-delete-read');
  const cassetteButton = document.getElementById('mail-cassette-action');
  const nextLetterButton = document.getElementById('mail-next-action');
  const letterContent = document.getElementById('mail-letter-content');
  const musicCard = document.getElementById('music-card-content');
  const musicCardSettings = document.getElementById('music-card-settings');
  const status = document.getElementById('mail-live-status');
  let selectedId = 'postcard';
  let activeView = 'letter';
  const actionMotionTimers = new WeakMap();

  function getSelectedMessage() {
    return messages.find(message => message.id === selectedId) || null;
  }

  function renderList() {
    list.replaceChildren();

    messages.forEach(message => {
      const item = document.createElement('li');
      item.className = 'mail-list-item';

      const button = document.createElement('button');
      button.className = 'mail-row';
      button.type = 'button';
      button.setAttribute('aria-pressed', String(message.id === selectedId));
      button.setAttribute('aria-label', `${message.title}, ${message.date}${message.unread ? ', unread' : ''}`);

      const icon = document.createElement('span');
      icon.className = 'mail-row-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.insertAdjacentHTML('beforeend', `
        <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
          <path class="mail-icon-frame" d="M5.5 9.5h37v29h-37z"/>
          <path class="mail-icon-envelope" d="M9 15h30v18H9zM9.5 16l14.5 11L38.5 16"/>
          <path class="mail-icon-spark" d="M7 5v4m-2-2h4M40 38v4m-2-2h4"/>
        </svg>`);

      const copy = document.createElement('span');
      copy.className = 'mail-row-copy';

      const messageTitle = document.createElement('span');
      messageTitle.className = 'mail-row-title';
      messageTitle.textContent = message.title;

      const meta = document.createElement('span');
      meta.className = 'mail-row-meta';

      const messageDate = document.createElement('span');
      messageDate.textContent = message.date;
      meta.appendChild(messageDate);

      if (message.unread) {
        const unreadDot = document.createElement('span');
        unreadDot.className = 'mail-row-unread';
        unreadDot.setAttribute('aria-label', 'Unread');
        meta.appendChild(unreadDot);
      }

      copy.append(messageTitle, meta);
      button.append(icon, copy);
      button.addEventListener('click', () => selectMessage(message.id));
      item.appendChild(button);
      list.appendChild(item);
    });

    total.textContent = `${String(messages.length).padStart(2, '0')} / 100`;
    unread.textContent = String(messages.filter(message => message.unread).length).padStart(2, '0');
    claimAllButton.disabled = !messages.some(message => !message.claimed);
    deleteReadButton.disabled = !messages.some(message => !message.unread);
    nextLetterButton.disabled = messages.length < 2;
  }

  function renderMessage() {
    const message = getSelectedMessage();

    if (!message) {
      letterContent.querySelectorAll(
        '.mail-message-header, .mail-message-rule, .mail-message-body, .mail-attachment, .mail-live-status'
      ).forEach(element => { element.hidden = true; });
      if (!letterContent.querySelector('.mail-empty-state')) {
        const empty = document.createElement('div');
        empty.className = 'mail-empty-state';
        const emptyTitle = document.createElement('span');
        emptyTitle.className = 'mail-empty-state-title';
        emptyTitle.textContent = 'No messages remain';
        const emptyNote = document.createElement('span');
        emptyNote.className = 'mail-empty-state-note';
        emptyNote.textContent = 'THE ARCHIVE IS CLEAR';
        empty.append(emptyTitle, emptyNote);
        letterContent.appendChild(empty);
      }
      collectButton.disabled = true;
      return;
    }

    letterContent.querySelector('.mail-empty-state')?.remove();
    letterContent.querySelectorAll(
      '.mail-message-header, .mail-message-rule, .mail-message-body, .mail-attachment, .mail-live-status'
    ).forEach(element => { element.hidden = false; });
    title.textContent = message.title;
    sender.textContent = message.sender;
    date.textContent = message.date;
    expiry.textContent = message.expiry;
    body.textContent = message.body;
    attachment.textContent = message.attachment;
    attachmentNote.textContent = message.claimed ? 'COLLECTED / 01 ITEM' : message.note;
    collectButton.textContent = message.claimed ? 'Collected' : 'Collect item ↗';
    collectButton.disabled = message.claimed;
    collectButton.setAttribute('aria-label', `${message.claimed ? 'Already collected' : 'Collect'} ${message.attachment}`);
  }

  function renderActiveView() {
    const showMusicCard = activeView === 'music';
    letterContent.hidden = showMusicCard;
    musicCard.hidden = !showMusicCard;
    sidebar.classList.toggle('is-music-view', showMusicCard);
    sidebar.setAttribute('aria-hidden', String(showMusicCard));
    cassetteButton.classList.toggle('is-selected', showMusicCard);
    cassetteButton.setAttribute('aria-pressed', String(showMusicCard));
    cassetteButton.setAttribute('aria-label', showMusicCard ? 'Return to letters' : 'Open Music Card');
    cassetteButton.title = showMusicCard ? 'Return to letters' : 'Open Music Card';
    document.getElementById('mail-reading-pane').setAttribute(
      'aria-label',
      showMusicCard ? 'Music Card' : 'Selected message'
    );
  }

  function selectMessage(id) {
    const message = messages.find(item => item.id === id);
    if (!message) return;
    if (id === selectedId && activeView === 'letter') return;

    selectedId = id;
    activeView = 'letter';
    message.unread = false;
    status.textContent = '';
    renderList();
    renderMessage();
    renderActiveView();

    const readingPane = document.getElementById('mail-reading-pane');
    readingPane.classList.remove('mail-message-changing');
    void readingPane.offsetWidth;
    readingPane.classList.add('mail-message-changing');
  }

  function playActionMotion(button) {
    button.classList.remove('is-activating');
    void button.offsetWidth;
    button.classList.add('is-activating');
    window.clearTimeout(actionMotionTimers.get(button));
    const timer = window.setTimeout(() => {
      button.classList.remove('is-activating');
      actionMotionTimers.delete(button);
    }, 520);
    actionMotionTimers.set(button, timer);
  }

  cassetteButton.addEventListener('click', () => {
    playActionMotion(cassetteButton);
    if (activeView === 'music' && !selectedId && messages.length) {
      selectMessage(messages[0].id);
      return;
    }

    activeView = activeView === 'music' ? 'letter' : 'music';
    status.textContent = '';
    renderActiveView();
    const readingPane = document.getElementById('mail-reading-pane');
    readingPane.classList.remove('mail-message-changing');
    void readingPane.offsetWidth;
    readingPane.classList.add('mail-message-changing');
  });

  nextLetterButton.addEventListener('click', () => {
    if (messages.length < 2) return;

    const currentIndex = messages.findIndex(message => message.id === selectedId);
    const nextMessage = messages[(currentIndex + 1 + messages.length) % messages.length];
    playActionMotion(nextLetterButton);
    selectMessage(nextMessage.id);
  });

  claimAllButton.addEventListener('click', () => {
    messages.forEach(message => {
      message.claimed = true;
      message.expiry = 'Filed in your archive';
    });
    status.textContent = 'All archive items have been collected.';
    renderList();
    renderMessage();
  });

  deleteReadButton.addEventListener('click', () => {
    const remaining = messages.filter(message => message.unread);
    messages.splice(0, messages.length, ...remaining);
    if (!messages.some(message => message.id === selectedId)) {
      selectedId = messages[0]?.id || null;
      if (selectedId) messages[0].unread = false;
    }
    status.textContent = `${remaining.length === 0 ? 'Archive cleared.' : 'Read messages removed.'}`;
    renderList();
    renderMessage();
  });

  collectButton.addEventListener('click', () => {
    const message = getSelectedMessage();
    if (!message || message.claimed) return;

    message.claimed = true;
    message.expiry = 'Filed in your archive';
    status.textContent = `${message.attachment} added to your archive.`;
    renderList();
    renderMessage();
  });

  musicCardSettings.addEventListener('click', () => {
    document.getElementById('sound-settings-toggle').click();
  });

  renderList();
  renderMessage();
  renderActiveView();
})();
