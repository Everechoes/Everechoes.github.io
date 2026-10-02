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
  function renderTag(tag, link) {
    if (tag.toLowerCase() === 'link' && link) {
      return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="tag-link">${tag}</a>`;
    }
    return `<span>${tag}</span>`;
  }

  PROJECTS.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="card-idx mono">0${idx + 1}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-desc">${p.desc}</div>
      <div class="card-tags">
        ${p.tags.map(t => renderTag(t, p.link)).join('')}
      </div>
    `;

    card.addEventListener('click', (event) => {
      const linkEl = event.target.closest('.tag-link');
      if (linkEl) {
        event.preventDefault();
        event.stopPropagation();
        window.open(linkEl.href, '_blank', 'noopener,noreferrer');
        return;
      }
      openCard(p);
    });

    grid.appendChild(card);
  });

  // Modal
  const backdrop = document.getElementById('card-backdrop');
  const card = document.getElementById('card');
  const cardInner = document.getElementById('card-inner');

  function openCard(p) {
    const tagMarkup = p.tags.map(t => {
      const tag = String(t).toLowerCase();
      if (tag === 'link' && p.link) {
        return `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="tag-link">${t}</a>`;
      }
      return `<span>${t}</span>`;
    }).join('');

    cardInner.innerHTML = `
      <button class="card-close" id="card-close">&times;</button>
      <div class="card-idx mono">PROJECT 0${p.id}</div>
      <h2 style="margin:12px 0 16px; color:#fff;">${p.title}</h2>
      <p style="color:#aaa; line-height:1.8;">${p.detail}</p>
      <div class="card-tags" style="margin-top:24px;">
        ${tagMarkup}
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

// Video color sampler: samples the first frame of the hero video and updates CSS variables
(function() {
  const launch = document.getElementById('projects-launch');
  const transition = document.getElementById('project-transition');
  const archive = document.getElementById('project');
  if (!launch || !transition || !archive) return;

  launch.addEventListener('click', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      archive.scrollIntoView({ behavior: 'auto' });
      return;
    }

    transition.replaceChildren();
    transition.classList.add('is-active');
    for (let index = 0; index < 28; index++) {
      const square = document.createElement('span');
      const size = 22 + Math.random() * 74;
      square.className = 'transition-square';
      square.style.setProperty('--size', `${size}px`);
      square.style.setProperty('--left', `${Math.random() * 100}%`);
      square.style.setProperty('--top', `${Math.random() * 100}%`);
      square.style.setProperty('--from-x', `${Math.random() * 160 - 80}px`);
      square.style.setProperty('--from-y', `${Math.random() * 160 - 80}px`);
      square.style.setProperty('--to-x', `${Math.random() * 220 - 110}px`);
      square.style.setProperty('--to-y', `${Math.random() * 220 - 110}px`);
      square.style.setProperty('--delay', `${Math.random() * 180}ms`);
      transition.appendChild(square);
    }

    window.setTimeout(() => {
      transition.classList.remove('is-active');
      transition.replaceChildren();
      archive.scrollIntoView({ behavior: 'smooth' });
    }, 900);
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
  const closedCover = book?.querySelector('.book-closed');
  const arcTarget = book?.closest('.book-hover-target');
  const bookCaption = stage?.querySelector('#book-caption');

  if (!book) return;
  const bookCaptions = {
    'Pa Gur Yw Y Porthaur': 'My Profile',
    'Paradise Regained': 'My Education',
    'The Prisoner in the Cave': 'My Skill'
  };
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
  if (bookCaption && centerCover) {
    bookCaption.textContent = bookCaptions[centerCover.alt] || '';
  }

  function selectBook(sideBook) {
    if (!sideBook || isSelecting || book.classList.contains('is-open')) return;
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
      sideBooks.forEach(item => {
        item.setAttribute('aria-label', `Pilih ${item.querySelector('img').alt}`);
      });
      book.setAttribute('aria-label', `Buka ${incoming.title}`);
      renderBookContents(incoming.title);
      if (bookCaption) {
        bookCaption.textContent = bookCaptions[incoming.title] || '';
      }
    }

    isSelecting = true;
    sideBooks.forEach(item => item.setAttribute('aria-pressed', 'false'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      swapCovers();
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
      };
    };
  }

  function selectAdjacentBook(slot) {
    selectBook(sideBooks.find(sideBook => sideBook.dataset.slot === slot));
  }

  function openBook() {
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
    sideBook.addEventListener('click', () => selectBook(sideBook));
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