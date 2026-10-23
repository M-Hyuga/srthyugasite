(() => {
  const livros = window.LIVROS || [];
  const norm = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const card = livro => `<article class="book-card" data-title="${livro.titulo}" data-author="${livro.autor}" data-category="${livro.categoria}">
    <a class="book-cover cover-${livro.id}" href="livro.html?id=${encodeURIComponent(livro.id)}" aria-label="Ver detalhes de ${livro.titulo}"><span class="cover-ornament">❧</span><small>${livro.selo}</small><strong>${livro.titulo}</strong><i>${livro.autor}</i><span class="cover-bottom">SRT. HYUGA · BIBLIOTECA</span></a>
    <div class="book-info"><p class="book-category">${livro.categoria} <span>·</span> ${livro.ano}</p><h3><a href="livro.html?id=${encodeURIComponent(livro.id)}">${livro.titulo}</a></h3><p>${livro.descricao}</p><a class="read-link" href="livro.html?id=${encodeURIComponent(livro.id)}">Ver obra <span aria-hidden="true">→</span></a></div>
  </article>`;
  const grid = document.getElementById('book-grid');
  if (grid) {
    const search = document.getElementById('book-search');
    const category = document.getElementById('book-category');
    const sort = document.getElementById('book-sort');
    const count = document.getElementById('book-count');
    const empty = document.getElementById('book-empty');
    const categories = [...new Set(livros.map(l => l.categoria))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    categories.forEach(c => { const opt = document.createElement('option'); opt.value=c; opt.textContent=c; category.appendChild(opt); });
    const authorParam = new URLSearchParams(location.search).get('autor');
    if (authorParam) search.value = authorParam;
    function render() {
      const q = norm(search.value.trim()), cat = category.value;
      let list = livros.filter(l => (!cat || l.categoria===cat) && (!q || norm([l.titulo,l.autor,l.categoria,l.descricao,l.selo].join(' ')).includes(q)));
      if (sort.value === 'titulo') list.sort((a,b)=>a.titulo.localeCompare(b.titulo,'pt-BR'));
      if (sort.value === 'autor') list.sort((a,b)=>a.autor.localeCompare(b.autor,'pt-BR') || a.titulo.localeCompare(b.titulo,'pt-BR'));
      if (sort.value === 'ano') list.sort((a,b)=>Number(a.ano)-Number(b.ano));
      grid.innerHTML = list.map(card).join(''); count.textContent = `${list.length} ${list.length===1?'obra encontrada':'obras encontradas'}`; empty.hidden = list.length>0;
    }
    [search,category,sort].forEach(el=>el.addEventListener('input',render)); render();
  }
  const featured = document.getElementById('featured-books');
  if (featured) featured.innerHTML = livros.filter(l=>l.destaque).slice(0,3).map(card).join('');
  const detail = document.getElementById('book-detail');
  if (detail) {
    const id = new URLSearchParams(location.search).get('id');
    const livro = livros.find(l=>l.id===id);
    if (!livro) { detail.innerHTML = '<div class="library-empty"><h1>Obra não encontrada</h1><p>Este livro não está no catálogo inicial.</p><a class="button-link" href="index.html">Voltar à biblioteca</a></div>'; return; }
    document.title = `${livro.titulo} — Biblioteca Virtual | Srt. Hyuga`;
    detail.innerHTML = `<div class="detail-cover cover-${livro.id}"><span class="cover-ornament">❧</span><small>${livro.selo}</small><strong>${livro.titulo}</strong><i>${livro.autor}</i><span class="cover-bottom">SRT. HYUGA · BIBLIOTECA</span></div><div class="detail-copy"><p class="eyebrow rust">DETALHES DA OBRA</p><p class="book-category">${livro.categoria} · ${livro.ano}</p><h1>${livro.titulo}</h1><p class="detail-author">por ${livro.autor}</p><p>${livro.descricao}</p><dl class="book-metadata"><div><dt>Idioma</dt><dd>${livro.idioma}</dd></div><div><dt>Fonte indicada</dt><dd>${livro.fonte}</dd></div><div><dt>Publicação original</dt><dd>${livro.ano}</dd></div></dl><div class="rights-note"><strong>Nota sobre direitos autorais</strong><p>A obra original pode estar em domínio público, mas traduções, prefácios, notas, ilustrações e edições específicas podem ter direitos próprios. Confira os dados da edição antes de baixar, republicar ou distribuir.</p></div><a class="button-link" href="${livro.urlFonte}" target="_blank" rel="noopener noreferrer">Localizar obra na fonte indicada ↗</a><p class="source-caption">A fonte abre em outra página. O catálogo não hospeda nem redistribui arquivos de livros nesta etapa.</p></div>`;
  }
  const authorList = document.getElementById('author-list');
  if (authorList) {
    const authors = [...new Set(livros.map(l=>l.autor))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    authorList.innerHTML = authors.map(author => `<article class="author-card"><span aria-hidden="true">✧</span><div><h2>${author}</h2><p>${livros.filter(l=>l.autor===author).map(l=>l.titulo).join(' · ')}</p><a href="index.html?autor=${encodeURIComponent(author)}">Ver obras no acervo →</a></div></article>`).join('');
  }

})();
