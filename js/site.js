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