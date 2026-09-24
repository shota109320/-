(() => {
  const storageKey = 'miuraya-text-size';
  const toggle = document.querySelector('.text-size-toggle');
  if (!toggle) return;

  const selectors = 'h1,h2,h3,h4,p,a,button,label,span,dt,dd,li,.brand,.title,.subtitle,.tag-text,.notice-title,.notice-text,.notice-meta,.notice-header,.price,.seasonal-price,.meta,.note,.value,.label,.section-heading,.category-title';
  const elements = [...document.querySelectorAll(selectors)].filter(element => element !== toggle);
  const originalSizes = new Map(elements.map(element => [element, element.style.fontSize]));
  const normalSizes = new Map(elements.map(element => [element, parseFloat(getComputedStyle(element).fontSize)]));

  function setTextSize(state) {
    const isLarge = state === 'large';
    elements.forEach(element => {
      element.style.fontSize = isLarge
        ? `${normalSizes.get(element) * 1.22}px`
        : originalSizes.get(element);
    });
    toggle.textContent = isLarge ? '文字を標準に戻す' : '文字を大きく';
    toggle.setAttribute('aria-pressed', String(isLarge));
    localStorage.setItem(storageKey, state);
  }

  toggle.addEventListener('click', () => {
    setTextSize(localStorage.getItem(storageKey) === 'large' ? 'normal' : 'large');
  });

  setTextSize(localStorage.getItem(storageKey) === 'large' ? 'large' : 'normal');
})();
