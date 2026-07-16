(function () {
  'use strict';

  const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];
  const RARITY_WEIGHTS = { Common: 45, Uncommon: 35, Rare: 12, 'Very Rare': 6, Legendary: 2 };

  const FLAVOR_LINES = [
    'A faint hum settles as your fingers close around it.',
    'It feels warmer than it has any right to be.',
    'Dust sloughs off it like it’s been waiting a very long time.',
    'Something in the reliquary seems almost relieved to be rid of it.',
    'It was easier to find than you expected. That’s rarely a good sign.',
    'The item all but leaps into your hand.',
    'You could swear it was watching you before you picked it up.'
  ];

  const els = {
    rarityChecklist: document.getElementById('rarityChecklist'),
    typeChecklist: document.getElementById('typeChecklist'),
    rollButton: document.getElementById('rollButton'),
    reveal: document.getElementById('revealArea'),
    history: document.getElementById('rollHistory'),
    historyList: document.getElementById('rollHistoryList')
  };

  const state = {
    includedRarities: new Set(RARITY_ORDER),
    includedTypes: new Set(),
    history: [],
    items: []
  };

  function titleCase(str) {
    return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  function rarityClass(rarity) {
    return 'rarity-' + rarity.toLowerCase().replace(/\s+/g, '-');
  }

  function renderRarityChecklist() {
    const present = RARITY_ORDER.filter(r => state.items.some(i => i.rarity === r));
    els.rarityChecklist.innerHTML = present.map(r => `
      <label>
        <input type="checkbox" value="${r}" ${state.includedRarities.has(r) ? 'checked' : ''}>
        <span class="tag ${rarityClass(r)}">${r}</span>
      </label>
    `).join('');

    els.rarityChecklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) state.includedRarities.add(cb.value);
        else state.includedRarities.delete(cb.value);
        updateRollButton();
      });
    });
  }

  function renderTypeChecklist() {
    const present = [...new Set(state.items.map(i => i.type))].filter(Boolean).sort();
    els.typeChecklist.innerHTML = present.map(t => `
      <label>
        <input type="checkbox" value="${t}" ${state.includedTypes.has(t) ? 'checked' : ''}>
        <span class="tag">${t}</span>
      </label>
    `).join('');

    els.typeChecklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) state.includedTypes.add(cb.value);
        else state.includedTypes.delete(cb.value);
        updateRollButton();
      });
    });
  }

  function pool() {
    return state.items.filter(i => state.includedRarities.has(i.rarity) && state.includedTypes.has(i.type));
  }

  function updateRollButton() {
    els.rollButton.disabled = pool().length === 0;
  }

  function rollItem() {
    const items = pool();
    if (items.length === 0) return null;

    const tiers = RARITY_ORDER.filter(r => state.includedRarities.has(r) && items.some(i => i.rarity === r));
    const totalWeight = tiers.reduce((sum, r) => sum + RARITY_WEIGHTS[r], 0);
    let roll = Math.random() * totalWeight;
    let chosenTier = tiers[tiers.length - 1];
    for (const r of tiers) {
      roll -= RARITY_WEIGHTS[r];
      if (roll <= 0) { chosenTier = r; break; }
    }

    const tierItems = items.filter(i => i.rarity === chosenTier);
    return tierItems[Math.floor(Math.random() * tierItems.length)];
  }

  function renderReveal(item) {
    const flavor = FLAVOR_LINES[Math.floor(Math.random() * FLAVOR_LINES.length)];
    const effectHTML = item.effect ? `<p class="item-effect">${item.effect}</p>` : '';
    const linkHTML = item.url
      ? `<p class="item-source-link"><a href="${item.url}" target="_blank" rel="noopener">View source ↗</a></p>`
      : '';
    els.reveal.innerHTML = `
      <div class="reveal-card">
        <h2 class="reveal-name">${item.name}</h2>
        <span class="tag ${rarityClass(item.rarity)}">${item.rarity}</span>
        <span class="tag">${item.type}</span>
        <p class="reveal-flavor">${flavor}</p>
        ${effectHTML}
        ${linkHTML}
      </div>
    `;
  }

  function renderHistory() {
    if (state.history.length === 0) {
      els.history.hidden = true;
      return;
    }
    els.history.hidden = false;
    els.historyList.innerHTML = state.history.slice(0, 8).map(item => `
      <li><span>${item.name}</span><span class="tag ${rarityClass(item.rarity)}">${item.rarity}</span></li>
    `).join('');
  }

  els.rollButton.addEventListener('click', () => {
    const item = rollItem();
    if (!item) return;
    state.history.unshift(item);
    renderReveal(item);
    renderHistory();
  });

  fetch('js/magic_items.json')
    .then(r => r.json())
    .then(items => {
      state.items = items.map(i => ({
        name: i.name,
        rarity: titleCase(i.rarity),
        type: i.type,
        effect: i.effect,
        url: i.url
      }));
      state.includedTypes = new Set(state.items.map(i => i.type).filter(Boolean));
      renderRarityChecklist();
      renderTypeChecklist();
      updateRollButton();
    })
    .catch(err => {
      console.error(err);
      els.reveal.innerHTML = `<p class="reveal-placeholder">The reliquary failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead.</p>`;
    });
})();
