(function () {
  'use strict';

  const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];
  const RARITY_WEIGHTS = { Common: 45, Uncommon: 35, Rare: 12, 'Very Rare': 6, Legendary: 2 };

  const SYMBOLS = ['⚔️', '🛡️', '💍', '🔮', '📜', '⚗️', '🗝️', '⭐', '💎', '🐉'];
  const SYMBOL_HEIGHT = 90;
  const FILLER_COUNT = 24;
  const WIN_CHANCE = 0.22;
  const REEL_DURATIONS = [1500, 1950, 2400];
  const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FLAVOR_LINES = [
    'A faint hum settles as your fingers close around it.',
    'It feels warmer than it has any right to be.',
    'Dust sloughs off it like it’s been waiting a very long time.',
    'Something in the reliquary seems almost relieved to be rid of it.',
    'It was easier to find than you expected. That’s rarely a good sign.',
    'The item all but leaps into your hand.',
    'You could swear it was watching you before you picked it up.'
  ];

  const LOSE_LINES = [
    'The reels clatter to a stop. Nothing lines up.',
    'Close, but the reliquary holds its secrets a while longer.',
    'The lever creaks back into place. Try again, adventurer.',
    'Not this time — the vault stays sealed.',
    'The symbols mock you in their mismatch.'
  ];

  const els = {
    checklist: document.getElementById('rarityChecklist'),
    spinButton: document.getElementById('spinButton'),
    lever: document.getElementById('slotLever'),
    reveal: document.getElementById('revealArea'),
    history: document.getElementById('rollHistory'),
    historyList: document.getElementById('rollHistoryList'),
    stats: document.getElementById('spinStats'),
    machine: document.querySelector('.slot-machine'),
    reels: [document.getElementById('reel0'), document.getElementById('reel1'), document.getElementById('reel2')]
  };

  const state = {
    included: new Set(RARITY_ORDER),
    history: [],
    items: [],
    spinning: false,
    pulls: 0,
    jackpots: 0
  };

  function titleCase(str) {
    return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  function rarityClass(rarity) {
    return 'rarity-' + rarity.toLowerCase().replace(/\s+/g, '-');
  }

  function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  function renderChecklist() {
    const present = RARITY_ORDER.filter(r => state.items.some(i => i.rarity === r));
    els.checklist.innerHTML = present.map(r => `
      <label>
        <input type="checkbox" value="${r}" ${state.included.has(r) ? 'checked' : ''}>
        <span class="tag ${rarityClass(r)}">${r}</span>
      </label>
    `).join('');

    els.checklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) state.included.add(cb.value);
        else state.included.delete(cb.value);
        updateSpinButton();
      });
    });
  }

  function updateSpinButton() {
    const pool = state.items.filter(i => state.included.has(i.rarity));
    els.spinButton.disabled = pool.length === 0 || state.spinning;
  }

  function rollItem() {
    const pool = state.items.filter(i => state.included.has(i.rarity));
    if (pool.length === 0) return null;

    const tiers = RARITY_ORDER.filter(r => state.included.has(r) && pool.some(i => i.rarity === r));
    const totalWeight = tiers.reduce((sum, r) => sum + RARITY_WEIGHTS[r], 0);
    let roll = Math.random() * totalWeight;
    let chosenTier = tiers[tiers.length - 1];
    for (const r of tiers) {
      roll -= RARITY_WEIGHTS[r];
      if (roll <= 0) { chosenTier = r; break; }
    }

    const tierItems = pool.filter(i => i.rarity === chosenTier);
    return tierItems[Math.floor(Math.random() * tierItems.length)];
  }

  function pickOutcomeSymbols() {
    if (Math.random() < WIN_CHANCE) {
      const symbol = randomSymbol();
      return { win: true, symbols: [symbol, symbol, symbol] };
    }
    let a = randomSymbol();
    let b = randomSymbol();
    let c = randomSymbol();
    while (a === b && b === c) {
      c = randomSymbol();
    }
    return { win: false, symbols: [a, b, c] };
  }

  function makeSymbolEl(symbol) {
    const div = document.createElement('div');
    div.className = 'slot-symbol';
    div.textContent = symbol;
    return div;
  }

  function buildReelStrip(strip, targetSymbol) {
    strip.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < FILLER_COUNT; i++) {
      frag.appendChild(makeSymbolEl(randomSymbol()));
    }
    frag.appendChild(makeSymbolEl(targetSymbol));
    strip.appendChild(frag);
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0)';
  }

  function spinReel(strip, duration) {
    const window_ = strip.parentElement;
    window_.classList.add('spinning');
    // force reflow so the transition:none reset above takes effect before animating
    void strip.offsetHeight;
    const height = strip.firstElementChild
      ? strip.firstElementChild.getBoundingClientRect().height
      : SYMBOL_HEIGHT;
    const easedDuration = REDUCED_MOTION ? Math.min(duration, 400) : duration;
    strip.style.transition = `transform ${easedDuration}ms cubic-bezier(0.12, 0.72, 0.28, 1)`;
    requestAnimationFrame(() => {
      strip.style.transform = `translateY(-${FILLER_COUNT * height}px)`;
    });
    setTimeout(() => window_.classList.remove('spinning'), Math.max(easedDuration - 200, 0));
    return easedDuration;
  }

  function renderReveal(item) {
    const flavor = FLAVOR_LINES[Math.floor(Math.random() * FLAVOR_LINES.length)];
    const effectHTML = item.effect ? `<p class="item-effect">${item.effect}</p>` : '';
    const linkHTML = item.url
      ? `<p class="item-source-link"><a href="${item.url}" target="_blank" rel="noopener">View source ↗</a></p>`
      : '';
    els.reveal.innerHTML = `
      <div class="reveal-card jackpot">
        <p class="jackpot-badge">&#10024; Jackpot! &#10024;</p>
        <h2 class="reveal-name">${item.name}</h2>
        <span class="tag ${rarityClass(item.rarity)}">${item.rarity}</span>
        <p class="reveal-flavor">${flavor}</p>
        ${effectHTML}
        ${linkHTML}
      </div>
    `;
  }

  function renderLose() {
    const line = LOSE_LINES[Math.floor(Math.random() * LOSE_LINES.length)];
    els.reveal.innerHTML = `
      <div class="reveal-card lose-card">
        <h2 class="reveal-name">No Match</h2>
        <p class="reveal-flavor">${line}</p>
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

  function renderStats() {
    els.stats.textContent = `Pulls: ${state.pulls} · Jackpots: ${state.jackpots}`;
  }

  function pullLever() {
    if (REDUCED_MOTION) return;
    els.lever.classList.add('pulled');
    setTimeout(() => els.lever.classList.remove('pulled'), 500);
  }

  function resolveSpin(win) {
    state.spinning = false;
    state.pulls += 1;

    if (win) {
      const item = rollItem();
      if (item) {
        state.jackpots += 1;
        state.history.unshift(item);
        renderReveal(item);
        renderHistory();
        if (els.machine && !REDUCED_MOTION) {
          els.machine.classList.add('win-glow');
          setTimeout(() => els.machine.classList.remove('win-glow'), 1600);
        }
      } else {
        renderLose();
      }
    } else {
      renderLose();
    }

    renderStats();
    updateSpinButton();
  }

  function spin() {
    if (state.spinning) return;
    const pool = state.items.filter(i => state.included.has(i.rarity));
    if (pool.length === 0) return;

    state.spinning = true;
    els.spinButton.disabled = true;
    pullLever();

    const outcome = pickOutcomeSymbols();
    let maxDuration = 0;
    els.reels.forEach((strip, i) => {
      buildReelStrip(strip, outcome.symbols[i]);
    });

    requestAnimationFrame(() => {
      els.reels.forEach((strip, i) => {
        const duration = spinReel(strip, REEL_DURATIONS[i]);
        maxDuration = Math.max(maxDuration, duration);
      });
      setTimeout(() => resolveSpin(outcome.win), maxDuration + 150);
    });
  }

  els.reels.forEach(strip => buildReelStrip(strip, randomSymbol()));
  els.spinButton.addEventListener('click', spin);

  fetch('js/magic_items.json')
    .then(r => r.json())
    .then(items => {
      state.items = items.map(i => ({ name: i.name, rarity: titleCase(i.rarity), effect: i.effect, url: i.url }));
      renderChecklist();
      updateSpinButton();
    })
    .catch(err => {
      console.error(err);
      els.reveal.innerHTML = `<p class="reveal-placeholder">The reliquary failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead.</p>`;
    });
})();
