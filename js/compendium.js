(function () {
  'use strict';

  const PAGE_SIZE = 24;
  const EFFECT_TRUNCATE_LENGTH = 220;

  const state = {
    search: '',
    type: '',
    rarity: '',
    attunedOnly: false,
    page: 1,
    items: []
  };

  const els = {
    search: document.getElementById('searchInput'),
    type: document.getElementById('typeFilter'),
    rarity: document.getElementById('rarityFilter'),
    attunedOnly: document.getElementById('attunementFilter'),
    grid: document.getElementById('itemGrid'),
    empty: document.getElementById('emptyState'),
    count: document.getElementById('resultCount'),
    pagination: document.getElementById('pagination')
  };

  const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'];

  function titleCase(str) {
    return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  function rarityClass(rarity) {
    return 'rarity-' + rarity.toLowerCase().replace(/\s+/g, '-');
  }

  function truncateAtWord(text, limit) {
    const cut = text.slice(0, limit);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  }

  function effectHTML(item) {
    if (!item.effect) {
      return `<p class="item-description unset">Not yet catalogued — the archive's records on this item are incomplete.</p>`;
    }
    if (item.effect.length <= EFFECT_TRUNCATE_LENGTH) {
      return `<p class="item-effect">${item.effect}</p>`;
    }
    const short = truncateAtWord(item.effect, EFFECT_TRUNCATE_LENGTH);
    return `
      <p class="item-effect" data-expanded="false">
        <span class="item-effect-short">${short}&hellip;</span><span class="item-effect-full" hidden>${item.effect}</span>
        <button type="button" class="effect-toggle">Read more...</button>
      </p>
    `;
  }

  function renderFilterOptions() {
    const types = [...new Set(state.items.map(i => i.type))].sort();
    const rarities = [...new Set(state.items.map(i => i.rarity))];
    rarities.sort((a, b) => RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b));

    els.type.innerHTML = '<option value="">All types</option>' +
      types.map(t => `<option value="${t}">${t}</option>`).join('');
    els.rarity.innerHTML = '<option value="">All rarities</option>' +
      rarities.map(r => `<option value="${r}">${r}</option>`).join('');
  }

  function filteredItems() {
    const query = state.search.trim().toLowerCase();
    return state.items.filter(i => {
      if (query && !i.name.toLowerCase().includes(query)) return false;
      if (state.type && i.type !== state.type) return false;
      if (state.rarity && i.rarity !== state.rarity) return false;
      if (state.attunedOnly && !i.attuned) return false;
      return true;
    });
  }

  function cardHTML(item) {
    const tags = [`<span class="tag">${item.type}</span>`];
    tags.push(`<span class="tag ${rarityClass(item.rarity)}">${item.rarity}</span>`);
    if (item.attuned) tags.push(`<span class="tag attunement-tag">Requires Attunement</span>`);
    if (item.source) tags.push(`<span class="tag">${item.source}</span>`);

    const linkHTML = item.url
      ? `<p class="item-source-link"><a href="${item.url}" target="_blank" rel="noopener">View source ↗</a></p>`
      : '';

    return `
      <article class="item-card${item.effect ? '' : ' unidentified'}">
        <div class="item-card-header">
          <h3 class="item-name">${item.name}</h3>
        </div>
        <div class="item-tags">${tags.join('')}</div>
        ${effectHTML(item)}
        ${linkHTML}
      </article>
    `;
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      els.pagination.innerHTML = '';
      return;
    }

    const page = state.page;
    const pageBtn = (p, label = p) => `<button class="page-btn${p === page ? ' active' : ''}" data-page="${p}" type="button">${label}</button>`;

    let pages = [];
    pages.push(pageBtn(1));
    if (page > 3) pages.push('<span class="page-ellipsis">…</span>');
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(pageBtn(p));
    }
    if (page < totalPages - 2) pages.push('<span class="page-ellipsis">…</span>');
    if (totalPages > 1) pages.push(pageBtn(totalPages));

    els.pagination.innerHTML = `
      <button class="page-btn page-nav" data-page="${page - 1}" type="button" ${page === 1 ? 'disabled' : ''}>‹ Prev</button>
      ${pages.join('')}
      <button class="page-btn page-nav" data-page="${page + 1}" type="button" ${page === totalPages ? 'disabled' : ''}>Next ›</button>
    `;

    els.pagination.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.page = parseInt(btn.dataset.page, 10);
        renderGrid();
        els.grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function renderGrid() {
    const allMatches = filteredItems();
    const totalPages = Math.max(1, Math.ceil(allMatches.length / PAGE_SIZE));
    state.page = Math.min(Math.max(1, state.page), totalPages);

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = allMatches.slice(start, start + PAGE_SIZE);

    if (allMatches.length === 0) {
      els.count.textContent = `Showing 0 of ${state.items.length} items`;
    } else {
      els.count.textContent = `Showing ${start + 1}–${start + pageItems.length} of ${allMatches.length} items`;
    }
    els.grid.innerHTML = pageItems.map(cardHTML).join('');
    els.empty.hidden = allMatches.length !== 0;
    els.grid.hidden = allMatches.length === 0;
    renderPagination(totalPages);
  }

  els.grid.addEventListener('click', e => {
    const btn = e.target.closest('.effect-toggle');
    if (!btn) return;
    const wrapper = btn.closest('.item-effect');
    const expand = wrapper.dataset.expanded !== 'true';
    wrapper.dataset.expanded = String(expand);
    wrapper.querySelector('.item-effect-short').hidden = expand;
    wrapper.querySelector('.item-effect-full').hidden = !expand;
    btn.textContent = expand ? 'Read less' : 'Read more...';
  });

  els.search.addEventListener('input', () => {
    state.search = els.search.value;
    state.page = 1;
    renderGrid();
  });
  els.type.addEventListener('change', () => {
    state.type = els.type.value;
    state.page = 1;
    renderGrid();
  });
  els.rarity.addEventListener('change', () => {
    state.rarity = els.rarity.value;
    state.page = 1;
    renderGrid();
  });
  els.attunedOnly.addEventListener('change', () => {
    state.attunedOnly = els.attunedOnly.checked;
    state.page = 1;
    renderGrid();
  });

  Promise.all([
    fetch('js/magic_items.json').then(r => r.json()),
    fetch('js/party_items.json').then(r => r.json())
  ])
    .then(([items, partyItemNames]) => {
      const owned = new Set(partyItemNames.map(n => n.toLowerCase()));
      state.items = items
        .filter(i => owned.has(i.name.toLowerCase()))
        .map(i => ({ ...i, rarity: titleCase(i.rarity) }))
        .sort((a, b) => a.name.localeCompare(b.name));
      renderFilterOptions();
      renderGrid();
    })
    .catch(err => {
      console.error(err);
      els.grid.innerHTML = `<p class="empty-state">The compendium failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead.</p>`;
    });
})();
