/* Srt. Hyuga — interações sem dependências externas */
(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('srt-hyuga-theme');
  if (storedTheme === 'light') root.dataset.theme = 'light';
  updateThemeButton();

  function updateThemeButton() {
    if (!themeButton) return;
    const isLight = root.dataset.theme === 'light';
    themeButton.textContent = isLight ? '☀' : '☾';
    themeButton.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
    themeButton.title = isLight ? 'Ativar tema escuro' : 'Ativar tema claro';
  }
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('srt-hyuga-theme', root.dataset.theme);
    updateThemeButton();
  });

  const searchInputs = [...document.querySelectorAll('#global-search')];
  const searchableItems = [...document.querySelectorAll('.searchable')];
  const feedback = document.getElementById('search-feedback');
  const emptyState = document.getElementById('empty-state');
  function runSearch(value) {
    const query = value.trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    searchableItems.forEach(item => {
      const text = `${item.dataset.title || ''} ${item.dataset.category || ''} ${item.dataset.description || ''} ${item.textContent}`.toLocaleLowerCase('pt-BR');
      const match = !query || text.includes(query);
      item.hidden = !match;
      if (match) visible++;
    });
    if (feedback) feedback.textContent = query ? `${visible} resultado(s) para “${value.trim()}”.` : '';
    if (emptyState) emptyState.hidden = visible !== 0;
  }
  searchInputs.forEach(input => {
    input.addEventListener('input', () => runSearch(input.value));
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const target = document.querySelector('.searchable:not([hidden]) a[href]');
        if (target) window.location.href = target.href;
      }
    });
  });

  const saveButton = document.getElementById('save-post');
  if (saveButton) {
    const key = 'srt-hyuga-saved-posts';
    const slug = 'nao-sou-uma-pessoa-tranquila';
    const getSaved = () => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
    function refreshSaved() {
      const saved = getSaved().includes(slug);
      saveButton.setAttribute('aria-pressed', String(saved));
      saveButton.innerHTML = `${saved ? '♥' : '♧'} <span>${saved ? 'Salvo' : 'Salvar'}</span>`;
    }
    saveButton.addEventListener('click', () => {
      let saved = getSaved();
      saved = saved.includes(slug) ? saved.filter(item => item !== slug) : [...saved, slug];
      localStorage.setItem(key, JSON.stringify(saved));
      refreshSaved();
    });
    refreshSaved();
  }

  const prose = document.getElementById('prose');
  if (prose) {
    let fontSize = Number(localStorage.getItem('srt-hyuga-font-size')) || 19;
    function applyFont() { prose.style.fontSize = `${fontSize}px`; }
    document.querySelectorAll('[data-font]').forEach(button => button.addEventListener('click', () => {
      const action = button.dataset.font;
      if (action === 'up') fontSize = Math.min(25, fontSize + 1);
      else if (action === 'down') fontSize = Math.max(16, fontSize - 1);
      else fontSize = 19;
      localStorage.setItem('srt-hyuga-font-size', String(fontSize));
      applyFont();
    }));
    applyFont();
  }
})();
