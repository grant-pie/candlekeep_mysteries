(function () {
  'use strict';

  const ALL_ID = '__all__';
  const ALL_MERCHANT = {
    id: ALL_ID,
    name: 'The Full Ledger',
    keeper: 'Every stall, table, and cart',
    icon: '📖',
    blurb: 'Every merchant’s wares, laid out side by side. Handy for comparison shopping, if you don’t mind the walk between stalls.'
  };

  const state = {
    merchant: ALL_ID,
    search: '',
    category: '',
    rarity: '',
    saleOnly: false
  };

  let MERCHANTS = [];
  let INVENTORY = [];

  const els = {
    tabs: document.getElementById('merchantTabs'),
    banner: document.getElementById('merchantBanner'),
    search: document.getElementById('searchInput'),
    category: document.getElementById('categoryFilter'),
    rarity: document.getElementById('rarityFilter'),
    saleOnly: document.getElementById('saleOnlyFilter'),
    grid: document.getElementById('itemGrid'),
    empty: document.getElementById('emptyState'),
    count: document.getElementById('resultCount')
  };

  function rarityClass(rarity) {
    if (!rarity) return '';
    return 'rarity-' + rarity.toLowerCase().replace(/\s+/g, '-');
  }

  function titleCase(str) {
    return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  function salePrice(item) {
    const match = item.price.match(/^(\d+)(\D+)$/);
    const value = parseInt(match[1], 10);
    const unit = match[2];
    return `${Math.round(value * (1 - item.salePercent / 100))}${unit}`;
  }

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function loadData() {
    const [merchants, inventory, magicScraped, gear] = await Promise.all([
      fetch('js/merchants.json').then(r => r.json()),
      fetch('js/inventory.json').then(r => r.json()),
      fetch('js/magic_items.json').then(r => r.json()),
      fetch('js/adventuring_gear.json').then(r => r.json())
    ]);

    const magicCatalog = new Map();
    magicScraped.forEach(item => magicCatalog.set(item.name, item));
    const gearCatalog = new Map();
    gear.forEach(item => gearCatalog.set(item.name, item));
    const merchantByCategory = new Map();
    merchants.forEach(m => merchantByCategory.set(m.category, m));

    // Maps a magic_items.json `type` to the merchant category that sells it.
    const TYPE_TO_CATEGORY = {
      Potion: 'Potions',
      Wand: 'Wands and Scrolls',
      Scroll: 'Wands and Scrolls',
      Weapon: 'Weapons and Armor',
      Armor: 'Weapons and Armor',
      Ammunition: 'Weapons and Armor'
    };

    MERCHANTS = merchants;
    INVENTORY = [];

    inventory.forEach(entry => {
      // Inventory entries only carry a name (plus basePrice/salePercent). Which
      // merchant sells an item, and its type/rarity/effect, are both derived
      // by finding the item in adventuring_gear.json or magic_items.json.
      const gearItem = gearCatalog.get(entry.name);
      const magicItem = magicCatalog.get(entry.name);

      let category, catalogItem;
      if (gearItem) {
        category = 'Adventuring Gear';
        catalogItem = gearItem;
      } else if (magicItem) {
        category = TYPE_TO_CATEGORY[magicItem.type] || null;
        catalogItem = magicItem;
      } else {
        console.warn(`"${entry.name}" was not found in adventuring_gear.json or magic_items.json — skipping.`);
        return;
      }

      const merchant = category ? merchantByCategory.get(category) : null;
      if (!merchant) {
        console.warn(`No merchant stocks "${category}" for item "${entry.name}" (type: ${catalogItem.type || 'gear'}) — skipping.`);
        return;
      }

      INVENTORY.push({
        id: `${merchant.id}-${slugify(entry.name)}`,
        name: entry.name,
        category: catalogItem.type || 'Adventuring Gear',
        merchant: merchant.id,
        price: entry.basePrice || null,
        qty: typeof entry.qty === 'number' ? entry.qty : null,
        salePercent: typeof entry.salePercent === 'number' ? entry.salePercent : null,
        rarity: catalogItem.rarity ? titleCase(catalogItem.rarity) : null,
        effect: catalogItem.effect || null,
        description: catalogItem.description || null
      });
    });
  }

  function merchantById(id) {
    if (id === ALL_ID) return ALL_MERCHANT;
    return MERCHANTS.find(m => m.id === id);
  }

  function itemsForMerchant(id) {
    return id === ALL_ID ? INVENTORY : INVENTORY.filter(i => i.merchant === id);
  }

  function renderTabs() {
    const all = [ALL_MERCHANT, ...MERCHANTS];
    els.tabs.innerHTML = all.map(m => `
      <button class="merchant-tab${m.id === state.merchant ? ' active' : ''}" data-id="${m.id}" type="button">
        <span class="tab-icon">${m.icon}</span><span>${m.name}</span>
      </button>
    `).join('');

    els.tabs.querySelectorAll('.merchant-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        state.merchant = btn.dataset.id;
        state.category = '';
        state.rarity = '';
        els.search.value = '';
        state.search = '';
        renderAll();
      });
    });
  }

  function renderBanner() {
    const m = merchantById(state.merchant);
    els.banner.innerHTML = `
      <div class="banner-icon">${m.icon}</div>
      <div class="banner-text">
        <h2>${m.name}</h2>
        <p class="banner-keeper">Proprietor: ${m.keeper}</p>
        <p class="banner-blurb">${m.blurb}</p>
      </div>
    `;
  }

  function renderFilterOptions() {
    const items = itemsForMerchant(state.merchant);
    const categories = [...new Set(items.map(i => i.category))].sort();
    const rarities = [...new Set(items.map(i => i.rarity).filter(Boolean))];
    const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];
    rarities.sort((a, b) => rarityOrder.indexOf(a) - rarityOrder.indexOf(b));

    const prevCategory = state.category;
    const prevRarity = state.rarity;

    els.category.innerHTML = '<option value="">All categories</option>' +
      categories.map(c => `<option value="${c}">${c}</option>`).join('');
    els.rarity.innerHTML = '<option value="">All rarities</option>' +
      rarities.map(r => `<option value="${r}">${r}</option>`).join('');

    if (categories.includes(prevCategory)) els.category.value = prevCategory;
    else state.category = '';
    if (rarities.includes(prevRarity)) els.rarity.value = prevRarity;
    else state.rarity = '';
  }

  function filteredItems() {
    const query = state.search.trim().toLowerCase();
    return itemsForMerchant(state.merchant).filter(i => {
      if (query && !i.name.toLowerCase().includes(query)) return false;
      if (state.category && i.category !== state.category) return false;
      if (state.rarity && i.rarity !== state.rarity) return false;
      if (state.saleOnly && !i.salePercent) return false;
      return true;
    });
  }

  function cardHTML(item) {
    const hasDetail = item.price || item.rarity || item.effect || item.description;
    let priceHTML;
    if (item.salePercent && item.price) {
      priceHTML = `<span class="item-price-wrap">
        <span class="item-price-original">${item.price}</span>
        <span class="item-price on-sale">${salePrice(item)}</span>
      </span>`;
    } else if (item.price) {
      priceHTML = `<span class="item-price">${item.price}</span>`;
    } else {
      priceHTML = `<span class="item-price unknown">price unknown</span>`;
    }

    const tags = [`<span class="tag">${item.category}</span>`];
    if (item.rarity) tags.push(`<span class="tag ${rarityClass(item.rarity)}">${item.rarity}</span>`);
    if (item.salePercent) tags.push(`<span class="tag sale-tag">${item.salePercent}% off</span>`);
    if (item.qty !== null) {
      tags.push(item.qty > 0
        ? `<span class="tag qty-tag">×${item.qty} in stock</span>`
        : `<span class="tag qty-tag out-of-stock">Out of stock</span>`);
    }

    const effectHTML = item.effect ? `<p class="item-effect">${item.effect}</p>` : '';
    const descriptionHTML = item.description
      ? `<p class="item-description">${item.description}</p>`
      : (!hasDetail ? `<p class="item-description unset">Not yet catalogued — ask the merchant directly.</p>` : '');

    return `
      <article class="item-card${hasDetail ? '' : ' unidentified'}${item.salePercent ? ' on-sale' : ''}${item.qty === 0 ? ' out-of-stock' : ''}">
        <div class="item-card-header">
          <h3 class="item-name">${item.name}</h3>
          ${priceHTML}
        </div>
        <div class="item-tags">${tags.join('')}</div>
        ${effectHTML}
        ${descriptionHTML}
      </article>
    `;
  }

  function renderGrid() {
    const items = filteredItems();
    els.count.textContent = `Showing ${items.length} of ${itemsForMerchant(state.merchant).length} wares`;
    els.grid.innerHTML = items.map(cardHTML).join('');
    els.empty.hidden = items.length !== 0;
    els.grid.hidden = items.length === 0;
  }

  function renderAll() {
    renderTabs();
    renderBanner();
    renderFilterOptions();
    renderGrid();
  }

  els.search.addEventListener('input', () => {
    state.search = els.search.value;
    renderGrid();
  });
  els.category.addEventListener('change', () => {
    state.category = els.category.value;
    renderGrid();
  });
  els.rarity.addEventListener('change', () => {
    state.rarity = els.rarity.value;
    renderGrid();
  });
  els.saleOnly.addEventListener('change', () => {
    state.saleOnly = els.saleOnly.checked;
    renderGrid();
  });

  loadData()
    .then(renderAll)
    .catch(err => {
      console.error(err);
      els.grid.innerHTML = `<p class="empty-state">The ledger failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead (fetch() can't read local JSON over file://).</p>`;
    });
})();
