(function () {
  'use strict';

  const OVERVIEW_TRUNCATE_LENGTH = 280;

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function truncateAtWord(text, limit) {
    const cut = text.slice(0, limit);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  }

  function renderOverview() {
    const overviewEl = document.getElementById('overviewText');
    const text = CANDLEKEEP.description;

    if (text.length <= OVERVIEW_TRUNCATE_LENGTH) {
      overviewEl.textContent = text;
      return;
    }

    const short = truncateAtWord(text, OVERVIEW_TRUNCATE_LENGTH);
    overviewEl.dataset.expanded = 'false';
    overviewEl.innerHTML = `
      <span class="caption-short">${escapeHTML(short)}&hellip;</span><span class="caption-full" hidden>${escapeHTML(text)}</span>
      <button type="button" class="effect-toggle">Read more...</button>
    `;

    overviewEl.addEventListener('click', e => {
      const btn = e.target.closest('.effect-toggle');
      if (!btn) return;
      const expand = overviewEl.dataset.expanded !== 'true';
      overviewEl.dataset.expanded = String(expand);
      overviewEl.querySelector('.caption-short').hidden = expand;
      overviewEl.querySelector('.caption-full').hidden = !expand;
      btn.textContent = expand ? 'Read less' : 'Read more...';
    });
  }

  function locationHTML(location) {
    return `
      <details class="location-entry">
        <summary class="location-name">${escapeHTML(location.name)}</summary>
        <p class="location-description">${escapeHTML(location.description)}</p>
      </details>
    `;
  }

  function wardHTML(ward) {
    return `
      <section class="ward-section">
        <h2 class="ward-title">${escapeHTML(ward.name)}</h2>
        <div class="location-list">
          ${ward.locations.map(locationHTML).join('')}
        </div>
      </section>
    `;
  }

  const mapImage = document.getElementById('mapImage');
  mapImage.onload = () => { mapImage.hidden = false; };
  mapImage.onerror = () => { mapImage.nextElementSibling.hidden = false; };
  mapImage.src = CANDLEKEEP.map;
  renderOverview();
  document.getElementById('wards').innerHTML = CANDLEKEEP.wards.map(wardHTML).join('');
})();
