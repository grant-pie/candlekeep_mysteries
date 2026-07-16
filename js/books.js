(function () {
  'use strict';

  const CONTENTS_TRUNCATE_LENGTH = 260;

  const state = {
    books: []
  };

  const els = {
    grid: document.getElementById('bookGrid'),
    empty: document.getElementById('emptyState'),
    count: document.getElementById('resultCount')
  };

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

  function coverHTML(book) {
    if (book.image) {
      return `
        <div class="book-cover-wrap">
          <img class="book-cover" src="${escapeHTML(book.image)}" alt="${escapeHTML(book.name)}" loading="lazy"
               onerror="this.hidden=true; this.nextElementSibling.hidden=false;">
          <div class="book-cover-placeholder" hidden aria-hidden="true">&#128213;</div>
        </div>
      `;
    }
    return `<div class="book-cover-wrap"><div class="book-cover-placeholder" aria-hidden="true">&#128213;</div></div>`;
  }

  function contentsBodyHTML(book) {
    const contents = book.contents || '';
    const notes = book.notes && book.notes.length ? book.notes : null;
    const needsTruncate = contents.length > CONTENTS_TRUNCATE_LENGTH;
    const contentsClass = contents ? 'book-contents' : 'book-contents unset';
    const shortText = contents
      ? escapeHTML(needsTruncate ? truncateAtWord(contents, CONTENTS_TRUNCATE_LENGTH) : contents) + (needsTruncate ? '&hellip;' : '')
      : 'No one has yet puzzled out what this book contains.';

    if (!needsTruncate && !notes) {
      return `<p class="${contentsClass}">${shortText}</p>`;
    }

    const fullSpan = needsTruncate ? `<span class="book-contents-full" hidden>${escapeHTML(contents)}</span>` : '';
    const notesList = notes ? `<ul class="book-notes" hidden>${notes.map(n => `<li>${escapeHTML(n)}</li>`).join('')}</ul>` : '';

    return `
      <div class="book-contents-wrap" data-expanded="false">
        <p class="${contentsClass}">
          <span class="book-contents-short">${shortText}</span>${fullSpan}
          <button type="button" class="effect-toggle">Read more...</button>
        </p>
        ${notesList}
      </div>
    `;
  }

  function cardHTML(book) {
    return `
      <article class="book-card">
        ${coverHTML(book)}
        <h3 class="book-name">${escapeHTML(book.name)}</h3>
        ${book.physical ? `<p class="book-physical">${escapeHTML(book.physical)}</p>` : ''}
        ${contentsBodyHTML(book)}
      </article>
    `;
  }

  function renderGrid() {
    els.count.textContent = `Showing ${state.books.length} books`;
    els.grid.innerHTML = state.books.map(cardHTML).join('');
    els.empty.hidden = state.books.length !== 0;
    els.grid.hidden = state.books.length === 0;
  }

  els.grid.addEventListener('click', e => {
    const btn = e.target.closest('.effect-toggle');
    if (!btn) return;
    const wrapper = btn.closest('.book-contents-wrap');
    const expand = wrapper.dataset.expanded !== 'true';
    wrapper.dataset.expanded = String(expand);

    const fullSpan = wrapper.querySelector('.book-contents-full');
    if (fullSpan) {
      wrapper.querySelector('.book-contents-short').hidden = expand;
      fullSpan.hidden = !expand;
    }

    const notesList = wrapper.querySelector('.book-notes');
    if (notesList) notesList.hidden = !expand;

    btn.textContent = expand ? 'Read less' : 'Read more...';
  });

  fetch('js/books.json')
    .then(r => r.json())
    .then(books => {
      state.books = books.sort((a, b) => a.name.localeCompare(b.name));
      renderGrid();
    })
    .catch(err => {
      console.error(err);
      els.grid.innerHTML = `<p class="empty-state">The library failed to load: ${err.message}. If you opened this page directly as a file, try serving it from a local web server instead.</p>`;
    });
})();
