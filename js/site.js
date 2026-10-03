(function() {
  const dustLayer = document.getElementById('dust-layer');
  if (dustLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const particleCount = window.innerWidth < 700 ? 14 : 28;

    for (let index = 0; index < particleCount; index++) {
      const particle = document.createElement('span');
      particle.style.setProperty('--size', `${1 + Math.random() * 2}px`);
      particle.style.setProperty('--left', `${Math.random() * 100}%`);
      particle.style.setProperty('--top', `${Math.random() * 100}%`);
      particle.style.setProperty('--drift', `${Math.random() * 90 - 45}px`);
      particle.style.setProperty('--duration', `${18 + Math.random() * 24}s`);
      particle.style.setProperty('--delay', `${-Math.random() * 36}s`);
      dustLayer.appendChild(particle);
    }

    document.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;

      for (let index = 0; index < 9; index++) {
        const square = document.createElement('span');
        const angle = (Math.PI * 2 * index) / 9 + Math.random() * 0.35;
        const distance = 18 + Math.random() * 30;
        square.className = 'click-square';
        square.style.setProperty('--size', `${4 + Math.random() * 5}px`);
        square.style.setProperty('--left', `${event.clientX}px`);
        square.style.setProperty('--top', `${event.clientY}px`);
        square.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        square.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
        square.style.setProperty('--rotation', `${Math.random() * 150 - 75}deg`);
        dustLayer.appendChild(square);
        square.addEventListener('animationend', () => square.remove(), { once: true });
      }
    });
  }

  // Clock
  function updateClock() {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const clockEl = document.querySelector('.time') || document.getElementById('clock');
    if (clockEl) {
      clockEl.textContent = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Render Projects
  const grid = document.getElementById('archive-grid');
  function projectSketch(type) {
    const drawings = {
      data: '<path d="M17 19h46M17 31h46M17 43h46M17 55h46M17 19v36M31 19v36M45 19v36M63 19v36"/><path d="M17 15h46M17 59h46M68 23h14M68 31h10M68 39h16M68 47h12M68 55h8"/>',
      layout: '<path d="M15 16h68v43H15zM15 27h68M37 27v32M60 27v32M15 42h22M37 42h23M60 47h23"/><path d="M20 21h22M44 21h18M66 21h12M21 33h10M43 33h12M66 33h11M20 50h11M43 51h12M66 54h11"/>',
      interaction: '<path d="M15 51h18V33h18V18h20M58 18h13v13"/><circle cx="15" cy="51" r="3"/><circle cx="33" cy="33" r="3"/><circle cx="51" cy="18" r="3"/><circle cx="71" cy="18" r="3"/><path d="M19 63h55M75 59v8M19 59v8"/>'
    };
    return `<svg class="project-sketch" viewBox="0 0 96 76" aria-hidden="true" focusable="false"><path class="sketch-frame" d="M7 8h82v60H7z"/><g class="sketch-drawing">${drawings[type] || drawings.data}</g><path class="sketch-cross" d="M3 38h5M88 38h5M48 4v5M48 67v5"/></svg>`;
  }

  PROJECTS.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <button class="project-card-main" type="button" aria-label="View ${p.title} project notes">
        <div class="project-preview">
          ${projectSketch(p.visual)}
          <span class="preview-label mono">FIG. 0${idx + 1}</span>
          <span class="preview-scale mono">STUDY / 0${idx + 1}</span>
        </div>
        <div class="project-card-copy">
          <div class="project-card-meta">
            <span class="card-idx mono">0${idx + 1} / PROJECT</span>
            <span class="project-status mono">${p.status}</span>
          </div>
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.desc}</p>
        </div>
      </button>
      <div class="project-card-footer">
        <div class="card-tags">${p.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
        ${p.link
          ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link">Repository <span aria-hidden="true">↗</span></a>`
          : '<span class="project-link project-link-pending">Preview pending <span aria-hidden="true">—</span></span>'}
      </div>
    `;

    card.querySelector('.project-card-main').addEventListener('click', () => openCard(p));

    grid.appendChild(card);
  });

  // Modal
  const backdrop = document.getElementById('card-backdrop');
  const card = document.getElementById('card');
  const cardInner = document.getElementById('card-inner');

  function openCard(p) {
    const tagMarkup = p.tags.map(tag => `<span>${tag}</span>`).join('');

    cardInner.innerHTML = `
      <div class="project-modal-head">
        <span class="card-idx mono">PROJECT FILE <i> / </i> 0${p.id}</span>
        <button class="card-close" id="card-close" type="button" aria-label="Close project details">&times;</button>
      </div>
      <h2 class="project-modal-title">${p.title}</h2>
      <p class="project-modal-status mono">${p.status}</p>
      <div class="project-modal-rule" aria-hidden="true"></div>
      <p class="project-modal-detail">${p.detail}</p>
      <div class="project-modal-footer">
        <div class="project-modal-stack">
          <span class="project-modal-label mono">BUILT WITH</span>
          <div class="card-tags project-modal-tags">${tagMarkup}</div>
        </div>
        ${p.link ? `<a class="project-modal-link" href="${p.link}" target="_blank" rel="noopener noreferrer">Open repository <span aria-hidden="true">↗</span></a>` : '<span class="project-modal-pending mono">PREVIEW IN DEVELOPMENT</span>'}
      </div>
    `;
    backdrop.classList.add('open');
    card.classList.add('open');
    document.getElementById('card-close').addEventListener('click', closeCard);
  }

  function closeCard() {
    backdrop.classList.remove('open');
    card.classList.remove('open');
  }

  backdrop.addEventListener('click', closeCard);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCard();
  });
})();

// Interactive 3D Book Controller (About Section)
(function() {
  const book = document.getElementById('book-3d');
  const opened = document.getElementById('book-opened');
  const closeBtn = document.getElementById('book-close-btn');
  const stage = book?.closest('.about-book-stage');
  const sideBooks = stage ? [...stage.querySelectorAll('.book-side-book')] : [];
  const bookNavigation = stage ? [...stage.querySelectorAll('.book-nav-button')] : [];
  const centerCover = book?.querySelector('.book-cover-img');
  const centerCoverFrame = book?.querySelector('.book-cover');
  const closedCover = book?.querySelector('.book-closed');
  const arcTarget = book?.closest('.book-hover-target');
  const bookCaption = stage?.querySelector('#book-caption');
  const lockNotice = stage?.parentElement?.querySelector('.book-lock-notice');

  if (!book) return;
  const bookCaptions = {
    'Pa Gur Yw Y Porthaur': 'My Profile',
    'Paradise Regained': 'My Education',
    'The Prisoner in the Cave': 'My Skill'
  };
  const lockedBookMessages = {
    'Paradise Regained': 'Will be Unlocked in 1.5',
    'The Prisoner in the Cave': 'Will be Unlocked in 1.7'
  };
  let lockNoticeTimeout;
  let lockNoticeHideTimeout;
  const bookContents = {
    'Pa Gur Yw Y Porthaur': {
      chapter: 'Chapter 1: Pa Gur yv y Porthaur?',
      pages: [
        {
          heading: 'My Journey',
          paragraphs: [
            'I’m Yericho, known online as Everechoes, from Banjarbaru, South Kalimantan, Indonesia. I’m studying Software Engineering at SMK Telkom Banjarbaru, where my curiosity about how software shapes everyday life continues to grow.',
            'I see coding as a creative craft—a way to turn ideas into useful applications. Every project teaches me something new, challenges me to solve problems, and helps me explore technologies, from software architecture to new tools.',
            'My goal is to build meaningful digital experiences and keep growing as a developer.'
          ]
        },
        {
          heading: '',
          profile: [
            ['Name', 'Yericho aka Everechoes'],
            ['School', 'Smk Telkom Banjarbaru'],
            ['Major', 'Software Engineering'],
            ['City', 'Banjarbaru'],
            ['Province', 'South Borneo'],
            ['Country', 'Indonesia']
          ]
        }
      ]
    },
    'The Prisoner in the Cave': {
      chapter: 'Chapter 3: The Prisoner In the Cave',
      pages: [
        {
          heading: 'Echoes of Innovation',
          paragraphs: [
            'My development stack is built upon a foundation of continuous learning and practical application. From crafting user interfaces in Figma to deploying backend logic with Laragon and PHP, every tool I use plays a crucial role in bringing ideas to life.',
            'By combining structural web fundamentals (HTML, CSS, JavaScript) with efficient database design (MySQL) and reliable version control (Git & GitHub), I aim to construct software that is efficient, scalable, and meaningful.'          
          ]
        },
        {
          heading: 'Beyond the Stone',
          paragraphs: [
            'Following the marks, the prisoner found a hidden passage that rose toward the surface. The climb was difficult, but the sound of wind grew clearer with every step, until the cave opened onto the world.'
          ]
        }
      ]
    },
    'Paradise Regained': {
      chapter: 'Chapter 2: Paradise Regained',
      pages: [
        {
          heading: 'Roots of Knowledge',
          paragraphs: [
            'My academic journey began at SDN 1 Guntung Payung Banjarbaru, where I built my fundamental knowledge, developed early curiosity, and learned the value of discipline and teamwork. Those elementary school years laid a solid foundation for my personal growth and passion for learning.',
            'Moving forward, I continued my studies at SMP Negeri 9 Banjarbaru. During my junior high school years, my perspective broadened significantly as I explored new interests, engaged in collaborative activities, and discovered my growing fascination with modern technology and problem-solving.',
            'Today, I am proud to be a student at SMK Telkom Banjarbaru, specializing in Software Engineering. Immersed in a dynamic and technology-driven environment, I am continuously honing my technical skills in coding, software development, and digital innovation. This step marks a crucial chapter in my life as I prepare to turn my passion for technology into a meaningful career.'
          ]
        },
      ]
    }
  };

  const paradiseGalleryItems = [
    { src: 'assets/school-pic1.webp', text: 'SDN 1 Guntung Payung Banjarbaru' },
    { src: 'assets/school-pic2.jpg', text: 'Smp Negeri 9 Banjarbaru' },
    { src: 'assets/school-pic3.jpg', text: 'Smk Telkom Banjarbaru' }
  ];

  const skillGroups = [
    {
      title: 'Web Development',
      description: 'Build websites and web applications.',
      items: [
        { name: 'HTML', src: 'assets/Skill-1.png' },
        { name: 'CSS', src: 'assets/Skill-2.png' },
        { name: 'JavaScript', src: 'assets/Skills-10.png' },
        { name: 'PHP', src: 'assets/Skills-3.png' },
        { name: 'Laragon', src: 'assets/Skill-4.webp' }
      ]
    },
    {
      title: 'UI/UX Design',
      description: 'Design clear, user-friendly experiences.',
      items: [
        { name: 'Figma', src: 'assets/Skill-5.png' }
      ]
    },
    {
      title: 'Database',
      description: 'Manage and organize data efficiently.',
      items: [
        { name: 'MySQL', src: 'assets/Skill-6.webp' }
      ]
    },
    {
      title: 'Tools & Others',
      description: 'Support workflow and productivity.',
      items: [
        { name: 'VS Code', src: 'assets/Skill-7.png' },
        { name: 'GitHub', src: 'assets/Skill-9.webp' },
        { name: 'Git', src: 'assets/Skill-8.png' }
      ]
    }
  ];

  function renderBookContents(title) {
    const content = bookContents[title];
    if (!content || !opened) return;

    opened.querySelectorAll('.book-page').forEach((page, index) => {
      const pageContent = content.pages[index];
      const ornament = page.querySelector('.page-ornament');
      const heading = page.querySelector('.page-heading');
      const paragraphs = page.querySelector('.page-paragraphs');
      const footer = page.querySelector('.page-footer');
      page.classList.remove('book-page-skills');
      heading.hidden = false;

      if (title === 'The Prisoner in the Cave' && index === 1) {
        page.classList.add('book-page-skills');
        ornament.textContent = 'CHAPTER 3: THE PRISONER IN THE CAVE';
        heading.hidden = true;
        footer.textContent = `~ 0${index + 1} ~`;
        paragraphs.replaceChildren();

        const groups = document.createElement('div');
        groups.className = 'page-skills';

        skillGroups.forEach(({ title: groupTitle, description, items }) => {
          const group = document.createElement('section');
          group.className = 'page-skill-group';

          const title = document.createElement('h4');
          title.className = 'page-skill-title';
          title.textContent = groupTitle;

          const summary = document.createElement('p');
          summary.className = 'page-skill-description';
          summary.textContent = description;

          const tools = document.createElement('ul');
          tools.className = 'page-skill-tools';

          items.forEach(({ name, src, mark }) => {
            const item = document.createElement('li');
            item.className = 'page-skill-tool';

            if (src) {
              const logo = document.createElement('img');
              logo.className = 'page-skill-logo';
              if (name === 'MySQL') logo.classList.add('page-skill-logo-mysql');
              logo.src = src;
              logo.alt = '';
              item.appendChild(logo);
            } else {
              const markElement = document.createElement('span');
              markElement.className = 'page-skill-mark';
              markElement.textContent = mark;
              item.appendChild(markElement);
            }

            const label = document.createElement('span');
            label.textContent = name;
            item.appendChild(label);
            tools.appendChild(item);
          });

          group.append(title, summary, tools);
          groups.appendChild(group);
        });

        paragraphs.appendChild(groups);
        return;
      }

      if (title === 'Paradise Regained' && index === 1) {
        ornament.textContent = 'CHAPTER 2: PARADISE REGAINED';
        heading.textContent = '';
        footer.textContent = `~ 0${index + 1} ~`;
        paragraphs.replaceChildren();

        const gallery = document.createElement('div');
        gallery.className = 'page-photo-gallery';

        paradiseGalleryItems.forEach(({ src, text }) => {
          const frame = document.createElement('figure');
          frame.className = 'page-photo-frame';

          const image = document.createElement('img');
          image.src = src;
          image.alt = text;
          image.loading = 'lazy';

          const caption = document.createElement('figcaption');
          caption.className = 'page-photo-caption';
          caption.textContent = text;

          frame.appendChild(image);
          frame.appendChild(caption);
          gallery.appendChild(frame);
        });

        paragraphs.appendChild(gallery);
        return;
      }

      ornament.textContent = content.chapter;
      heading.textContent = pageContent.heading;

      paragraphs.replaceChildren();
      if (pageContent.profile) {
        const imageFrame = document.createElement('div');
        imageFrame.className = 'page-profile-image-frame';
        const image = document.createElement('img');
        image.className = 'page-profile-image';
        image.src = 'assets/profile-pic.png';
        image.alt = 'Profile picture of Yericho';
        imageFrame.appendChild(image);
        paragraphs.appendChild(imageFrame);

        const profileDetails = document.createElement('dl');
        profileDetails.className = 'page-profile-details';
        pageContent.profile.forEach(([label, value]) => {
          const row = document.createElement('div');
          row.className = 'page-profile-row';
          const term = document.createElement('dt');
          term.textContent = `${label}:`;
          const description = document.createElement('dd');
          description.textContent = value;
          row.append(term, description);
          profileDetails.appendChild(row);
        });
        paragraphs.appendChild(profileDetails);
      } else {
        pageContent.paragraphs.forEach(text => {
          const paragraph = document.createElement('p');
          paragraph.className = 'page-paragraph';
          paragraph.textContent = text;
          paragraphs.appendChild(paragraph);
        });
      }

      footer.textContent = `~ 0${index + 1} ~`;
    });
  }

  let isSelecting = false;
  let pointerStart = null;
  let suppressOpenClick = false;

  renderBookContents(centerCover?.alt);
  syncLockedState();
  if (bookCaption && centerCover) {
    bookCaption.textContent = bookCaptions[centerCover.alt] || '';
  }

  function syncLockedState() {
    const isCenterLocked = Object.hasOwn(lockedBookMessages, centerCover?.alt);
    book.classList.toggle('is-locked', isCenterLocked);
    centerCoverFrame?.classList.toggle('is-locked', isCenterLocked);
    book.setAttribute('aria-disabled', String(isCenterLocked));
    book.setAttribute('aria-label', isCenterLocked ? `${centerCover.alt}, Locked` : `Buka ${centerCover?.alt || 'buku'}`);

    sideBooks.forEach(sideBook => {
      const image = sideBook.querySelector('img');
      const isLocked = Object.hasOwn(lockedBookMessages, image?.alt);
      sideBook.classList.toggle('is-locked', isLocked);
      sideBook.setAttribute('aria-label', `Pilih ${image?.alt || 'buku'}${isLocked ? ', Locked' : ''}`);
    });
  }

  function showLockedNotice(title = centerCover?.alt) {
    if (!lockNotice) return;
    const message = lockedBookMessages[title];
    if (!message) return;
    window.clearTimeout(lockNoticeTimeout);
    window.clearTimeout(lockNoticeHideTimeout);
    lockNotice.textContent = message;
    lockNotice.classList.remove('is-visible');
    lockNotice.hidden = true;
    void lockNotice.offsetWidth;
    lockNotice.hidden = false;
    lockNotice.classList.add('is-visible');
    lockNoticeTimeout = window.setTimeout(() => {
      if (!closedCover?.matches(':hover')) hideLockedNotice();
    }, 2800);
  }

  function hideLockedNotice() {
    if (!lockNotice) return;
    window.clearTimeout(lockNoticeTimeout);
    window.clearTimeout(lockNoticeHideTimeout);
    lockNotice.classList.remove('is-visible');
    lockNoticeHideTimeout = window.setTimeout(() => {
      lockNotice.hidden = true;
    }, 240);
  }

  closedCover?.addEventListener('pointerenter', () => {
    if (!lockNotice || lockNotice.hidden) return;
    window.clearTimeout(lockNoticeTimeout);
    window.clearTimeout(lockNoticeHideTimeout);
    lockNotice.classList.add('is-visible');
  });

  closedCover?.addEventListener('pointerleave', hideLockedNotice);

  function selectBook(sideBook) {
    if (!sideBook || isSelecting || book.classList.contains('is-open')) return;
    hideLockedNotice();
    const leftBook = sideBooks.find(item => item.dataset.slot === 'left');
    const rightBook = sideBooks.find(item => item.dataset.slot === 'right');
    const leftCover = leftBook?.querySelector('img');
    const rightCover = rightBook?.querySelector('img');
    if (!centerCover || !closedCover || !leftCover || !rightCover) return;

    const direction = sideBook.dataset.slot === 'right' ? 1 : -1;
    const readCover = image => ({ src: image.getAttribute('src'), title: image.alt });
    const previousLeft = readCover(leftCover);
    const previousCenter = readCover(centerCover);
    const previousRight = readCover(rightCover);
    const incoming = direction > 0 ? previousRight : previousLeft;
    const shift = -direction * 96;
    const rotation = direction * -26;
    const travel = distance => `translate(calc(-50% ${distance >= 0 ? '+' : '-'} ${Math.abs(distance)}px), -50%)`;

    function setCover(image, cover) {
      image.setAttribute('src', cover.src);
      image.alt = cover.title;
    }

    function swapCovers() {
      if (direction > 0) {
        setCover(leftCover, previousCenter);
        setCover(centerCover, previousRight);
        setCover(rightCover, previousLeft);
      } else {
        setCover(leftCover, previousRight);
        setCover(centerCover, previousLeft);
        setCover(rightCover, previousCenter);
      }
      syncLockedState();
      renderBookContents(incoming.title);
      if (bookCaption) {
        bookCaption.textContent = bookCaptions[incoming.title] || '';
      }
    }

    isSelecting = true;
    sideBooks.forEach(item => item.setAttribute('aria-pressed', 'false'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      swapCovers();
      showLockedNotice(centerCover.alt);
      isSelecting = false;
      return;
    }

    if (arcTarget) {
      arcTarget.style.setProperty('--arc-sweep-start', `${direction * -190}px`);
      arcTarget.style.setProperty('--arc-sweep-end', `${direction * 190}px`);
      arcTarget.classList.add('is-arc-shifting');
    }

    const bookShadow = 'drop-shadow(0 14px 28px rgba(0,0,0,0.65))';
    const exitAnimation = closedCover.animate([
      { transform: 'translate(-50%, -50%) rotateY(0deg) scale(1)', opacity: 1, filter: `brightness(1) blur(0) ${bookShadow}` },
      { offset: .48, transform: `${travel(shift * .38)} rotateY(${rotation * .65}deg) scale(.96)`, opacity: .82, filter: `brightness(1.45) blur(1px) ${bookShadow}` },
      { transform: `${travel(shift)} rotateY(${rotation}deg) scale(.84)`, opacity: 0, filter: `brightness(2) blur(5px) ${bookShadow}` }
    ], { duration: 420, easing: 'cubic-bezier(.65, 0, .88, .18)', fill: 'forwards' });

    exitAnimation.onfinish = () => {
      swapCovers();
      exitAnimation.cancel();

      const enterAnimation = closedCover.animate([
        { transform: `${travel(-shift)} rotateY(${-rotation}deg) scale(.84)`, opacity: 0, filter: `brightness(2) blur(5px) ${bookShadow}` },
        { offset: .62, transform: `${travel(-shift * .18)} rotateY(${-rotation * .3}deg) scale(1.035)`, opacity: 1, filter: `brightness(1.3) blur(.5px) ${bookShadow}` },
        { transform: 'translate(-50%, -50%) rotateY(0deg) scale(1)', opacity: 1, filter: `brightness(1) blur(0) ${bookShadow}` }
      ], { duration: 600, easing: 'cubic-bezier(.16, 1, .3, 1)' });

      enterAnimation.onfinish = () => {
        enterAnimation.cancel();
        arcTarget?.classList.remove('is-arc-shifting');
        arcTarget?.style.removeProperty('--arc-sweep-start');
        arcTarget?.style.removeProperty('--arc-sweep-end');
        isSelecting = false;
        showLockedNotice(centerCover.alt);
      };
    };
  }

  function selectAdjacentBook(slot) {
    const sideBook = sideBooks.find(item => item.dataset.slot === slot);
    selectBook(sideBook);
  }

  function openBook() {
    if (book.classList.contains('is-locked')) {
      showLockedNotice(centerCover?.alt);
      return;
    }
    if (isSelecting) return;
    book.classList.add('is-open');
    book.setAttribute('aria-expanded', 'true');
    if (opened) {
      opened.querySelectorAll('.book-page').forEach(page => { page.scrollTop = 0; });
      opened.setAttribute('aria-hidden', 'false');
      opened.style.opacity = '1';
      const revealPage = function(event) {
        if (event.propertyName !== 'transform') return;
        opened.removeEventListener('transitionend', revealPage);
      };
      opened.addEventListener('transitionend', revealPage);
    }
  }

  function closeBook() {
    book.classList.remove('is-open');
    book.setAttribute('aria-expanded', 'false');
    if (opened) {
      opened.setAttribute('aria-hidden', 'true');
      opened.style.removeProperty('opacity');
    }
    sideBooks.forEach(sideBook => {
      sideBook.classList.remove('is-selected');
      sideBook.setAttribute('aria-pressed', 'false');
    });
  }

  sideBooks.forEach(sideBook => {
    sideBook.addEventListener('click', () => selectAdjacentBook(sideBook.dataset.slot));
  });

  bookNavigation.forEach(button => {
    button.addEventListener('click', () => selectAdjacentBook(button.dataset.direction));
  });

  if (stage) {
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.book-side-book, .book-close-btn') || book.classList.contains('is-open')) return;
      pointerStart = { x: event.clientX, y: event.clientY };
    });

    stage.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

      suppressOpenClick = true;
      window.setTimeout(() => { suppressOpenClick = false; }, 500);
      selectAdjacentBook(deltaX < 0 ? 'right' : 'left');
    });

    stage.addEventListener('pointercancel', () => { pointerStart = null; });
  }

  // Click on book opens it if closed
  book.addEventListener('click', function(e) {
    if (suppressOpenClick) return;
    if (e.target.closest('.book-close-btn')) return;
    if (!book.classList.contains('is-open')) {
      openBook();
    }
  });

  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeBook();
    });
  }

  // Keyboard accessibility: Enter or Space opens when focused, Escape closes
  book.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!book.classList.contains('is-open')) {
        e.preventDefault();
        openBook();
      }
    } else if (e.key === 'Escape' && book.classList.contains('is-open')) {
      e.preventDefault();
      closeBook();
    }
  });

  // Escape key globally closes
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && book.classList.contains('is-open')) {
      closeBook();
    }
  });

  // Clicking outside closes the opened book
  document.addEventListener('pointerdown', function(e) {
    if (book.classList.contains('is-open') && !book.contains(e.target)) {
      closeBook();
    }
  });
})();