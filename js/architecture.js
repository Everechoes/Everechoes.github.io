(function() {
  const sketch = document.getElementById('architect-sketch');
  const stage = sketch && sketch.closest('.hero-sketch');
  const tooltip = document.getElementById('architecture-tooltip');
  if (!sketch || !stage || !tooltip) return;

  const labels = Array.from(sketch.querySelectorAll('.architecture-building-label[data-building]'));
  const descriptions = {
    villa: 'A low-rise residence with a broad roofline and a compact footprint. Height: 12.8 m.',
    'little-tower': 'A slender mid-rise block defined by repeated window bays. Height: 13.0 m.',
    'central-building': 'The eight-level centerpiece, with a glazed facade and stepped base. Overall height: 28.8 m.',
    business: 'A compact multi-level block with a regular gridded facade. Height: 12.0 m.',
    'package-yards': 'A low-rise yard building with a recessed, gridded facade. Height: 9.8 m.',
    tower: 'A six-level tower with repeated vertical bays. Height: 17.2 m.',
    home: 'A small residential-scale building with paired windows. Height: 7.0 m.'
  };
  const title = tooltip.querySelector('.architecture-tooltip-title');
  const description = tooltip.querySelector('.architecture-tooltip-description');

  function highlight(building) {
    const name = building.dataset.building;
    const label = labels.find(item => item.dataset.building === name);
    if (!label || !descriptions[name]) return;

    sketch.setAttribute('data-highlighted-building', name);
    title.textContent = label.textContent.trim();
    description.textContent = descriptions[name];
    tooltip.hidden = false;
    positionTooltip(label);
  }

  function positionTooltip(building) {
    const targetRect = building.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const gap = 14;
    const padding = 12;
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    let left = targetRect.right - stageRect.left + gap;

    if (left + width > stageRect.width - padding) {
      left = targetRect.left - stageRect.left - width - gap;
    }

    left = Math.max(padding, Math.min(left, stageRect.width - width - padding));
    const top = Math.max(
      padding,
      Math.min(
        targetRect.top - stageRect.top + (targetRect.height - height) / 2,
        stageRect.height - height - padding
      )
    );
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function isLabelActive(name) {
    const label = labels.find(item => item.dataset.building === name);
    return document.activeElement === label ||
      Boolean(label && label.matches(':hover'));
  }

  function clearHighlight(name) {
    if (isLabelActive(name)) return;
    if (sketch.dataset.highlightedBuilding === name) {
      sketch.removeAttribute('data-highlighted-building');
      tooltip.hidden = true;
    }
  }

  labels.forEach(label => {
    label.setAttribute('aria-describedby', tooltip.id);
    label.addEventListener('pointerenter', () => highlight(label));
    label.addEventListener('pointerleave', () => clearHighlight(label.dataset.building));
    label.addEventListener('focus', () => highlight(label));
    label.addEventListener('blur', () => clearHighlight(label.dataset.building));
  });
})();