(function() {
  const sketch = document.getElementById('architect-sketch');
  if (!sketch) return;

  const labels = Array.from(sketch.querySelectorAll('.architecture-building-label[data-building]'));

  function highlight(label) {
    sketch.setAttribute('data-highlighted-building', label.dataset.building);
  }

  function clearHighlight(label) {
    if (document.activeElement === label || label.matches(':hover')) return;
    if (sketch.dataset.highlightedBuilding === label.dataset.building) {
      sketch.removeAttribute('data-highlighted-building');
    }
  }

  labels.forEach(label => {
    label.addEventListener('pointerenter', () => highlight(label));
    label.addEventListener('pointerleave', () => clearHighlight(label));
    label.addEventListener('focus', () => highlight(label));
    label.addEventListener('blur', () => clearHighlight(label));
  });
})();