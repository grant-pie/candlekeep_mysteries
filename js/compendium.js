(function () {
  'use strict';

  const PAGE_SIZE = 24;
  const EFFECT_TRUNCATE_LENGTH = 220;

  const state = {
    page: 1,
    items: []
  };

  const els = {
    grid: document.getElementById('itemGrid'),
    empty: document.getElementById('emptyState'),
    pagination: document.getElementById('pagination'),
    itemsTabBtn: document.getElementById('itemsTabBtn'),
    monstersTabBtn: document.getElementById('monstersTabBtn'),
    itemsView: document.getElementById('itemsView'),
    monstersView: document.getElementById('monstersView'),
    monsterSessions: document.getElementById('monsterSessions'),
    monsterEmpty: document.getElementById('monsterEmptyState')
  };

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

  function cardHTML(item) {
    const tags = [`<span class="tag">${item.type}</span>`];
    tags.push(`<span class="tag ${rarityClass(item.rarity)}">${item.rarity}</span>`);
    if (item.attuned) tags.push(`<span class="tag attunement-tag">Requires Attunement</span>`);
    if (item.source) tags.push(`<span class="tag">${item.source}</span>`);

    const linkHTML = item.url
      ? `<p class="item-source-link"><a href="${item.url}" target="_blank" rel="noopener">View source ↗</a></p>`
      : '';

    const imageHTML = item.image
      ? `<div class="item-image-wrap"><img class="item-image" src="${item.image}" alt="${item.name}" loading="lazy"></div>`
      : '';

    return `
      <article class="item-card${item.effect ? '' : ' unidentified'}">
        ${imageHTML}
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
    const totalPages = Math.max(1, Math.ceil(state.items.length / PAGE_SIZE));
    state.page = Math.min(Math.max(1, state.page), totalPages);

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = state.items.slice(start, start + PAGE_SIZE);

    els.grid.innerHTML = pageItems.map(cardHTML).join('');
    els.empty.hidden = state.items.length !== 0;
    els.grid.hidden = state.items.length === 0;
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

  function switchTab(tab) {
    const showItems = tab === 'items';
    els.itemsTabBtn.classList.toggle('active', showItems);
    els.monstersTabBtn.classList.toggle('active', !showItems);
    els.itemsTabBtn.setAttribute('aria-selected', String(showItems));
    els.monstersTabBtn.setAttribute('aria-selected', String(!showItems));
    els.itemsView.hidden = !showItems;
    els.monstersView.hidden = showItems;
  }

  els.itemsTabBtn.addEventListener('click', () => switchTab('items'));
  els.monstersTabBtn.addEventListener('click', () => switchTab('monsters'));

  function monsterCardHTML(monster) {
    const description = monster.description
      ? `<p class="item-description">${monster.description}</p>`
      : `<p class="item-description unset">Not yet catalogued — the archive's records on this creature are incomplete.</p>`;
    const info = monster.info ? `<p class="item-effect">${monster.info}</p>` : '';
    const imageHTML = monster.image
      ? `<img class="monster-image" src="${monster.image}" alt="${monster.name}" loading="lazy">`
      : '';

    const challengeHTML = monster.challenge
      ? `<div class="item-tags"><span class="tag">CR ${monster.challenge}</span></div>`
      : '';

    return `
      <article class="item-card monster-card${monster.description ? '' : ' unidentified'}">
        ${imageHTML}
        <div class="item-card-header">
          <h3 class="item-name">${monster.name}</h3>
        </div>
        ${challengeHTML}
        ${description}
        ${info}
      </article>
    `;
  }

  function renderMonsters(sessions) {
    let anyMonsters = false;
    els.monsterSessions.innerHTML = sessions.map(session => {
      if (!session.monsters.length) return '';
      anyMonsters = true;
      return `
        <section class="gallery-session">
          <h2 class="gallery-session-title">${session.title}</h2>
          <div class="item-grid">${session.monsters.map(monsterCardHTML).join('')}</div>
        </section>
      `;
    }).join('');
    els.monsterEmpty.hidden = anyMonsters;
  }

  fetch('js/monsters.json')
    .then(r => r.json())
    .then(sessions => renderMonsters(sessions))
    .catch(err => {
      console.error(err);
      els.monsterSessions.innerHTML = `<p class="empty-state">The monster archive failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead.</p>`;
    });

  Promise.all([
    fetch('js/magic_items.json').then(r => r.json()),
    fetch('js/party_items.json').then(r => r.json())
  ])
    .then(([items, partyItems]) => {
      const owned = new Map(partyItems.map(p => [p.name.toLowerCase(), p.image]));
      state.items = items
        .filter(i => owned.has(i.name.toLowerCase()))
        .map(i => ({ ...i, rarity: titleCase(i.rarity), image: owned.get(i.name.toLowerCase()) }))
        .sort((a, b) => a.name.localeCompare(b.name));
      renderGrid();
    })
    .catch(err => {
      console.error(err);
      els.grid.innerHTML = `<p class="empty-state">The compendium failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead.</p>`;
    });
})();
