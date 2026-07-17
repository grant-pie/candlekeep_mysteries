const NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "candlekeep.html", label: "Candlekeep" },
  { href: "ledger.html", label: "Merchant Ledger" },
  { href: "characters/index.html", label: "Characters" },
  { href: "handouts/index.html", label: "Handouts" },
  { href: "books.html", label: "Books" },
  { href: "compendium.html", label: "Wondrous Item Compendium" },
];

/*
  { href: "slotmachine.html", label: "Spin to Win!" },
  { href: "roller.html", label: "Item Roller" },
*/

(function renderSiteNav() {
  const container = document.getElementById("site-nav");
  if (!container) return;

  const base = container.dataset.base || "";
  const path = window.location.pathname;
  const inHandouts = /\/handouts\/?($|\/)/.test(path);
  const currentFile = path.split("/").pop() || "index.html";

  const links = NAV_ITEMS.map(({ href, label }) => {
    const isActive = href === "handouts/index.html"
      ? inHandouts
      : !inHandouts && currentFile === href;
    const cls = "site-nav-link" + (isActive ? " active" : "");
    return `<a class="${cls}" href="${base}${href}">${label}</a>`;
  }).join("\n");

  container.innerHTML = `
    <button type="button" class="site-nav-toggle" id="site-nav-toggle" aria-expanded="false" aria-controls="site-nav-links">
      <span class="site-nav-toggle-icon" aria-hidden="true">&#9776;</span> Menu
    </button>
    <div class="site-nav-links" id="site-nav-links">${links}</div>
  `;

  const toggle = document.getElementById("site-nav-toggle");
  const linksPanel = document.getElementById("site-nav-links");
  toggle.addEventListener("click", () => {
    const isOpen = linksPanel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
})();
