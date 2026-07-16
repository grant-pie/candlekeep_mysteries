const NAV_ITEMS = [
  { href: "index.html", label: "Merchant Ledger" },
  { href: "handouts/index.html", label: "Handouts" },
  { href: "books.html", label: "Books" },
  { href: "candlekeep.html", label: "Candlekeep" },
];

/*
  { href: "slotmachine.html", label: "Spin to Win!" },
  { href: "roller.html", label: "Item Roller" },
  { href: "compendium.html", label: "Magic Item Compendium" },
*/

(function renderSiteNav() {
  const container = document.getElementById("site-nav");
  if (!container) return;

  const base = container.dataset.base || "";
  const path = window.location.pathname;
  const inHandouts = /\/handouts\/?($|\/)/.test(path);
  const currentFile = path.split("/").pop() || "index.html";

  container.innerHTML = NAV_ITEMS.map(({ href, label }) => {
    const isActive = href === "handouts/index.html"
      ? inHandouts
      : !inHandouts && currentFile === href;
    const cls = "site-nav-link" + (isActive ? " active" : "");
    return `<a class="${cls}" href="${base}${href}">${label}</a>`;
  }).join("\n");
})();
