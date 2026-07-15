# Candlekeep Mysteries — Handout Gallery

A tiny static site: an index page listing all handout images, and a single
templated page (`image.html`) that displays whichever image is referenced
by its URL — so each image gets its own shareable link without needing a
separate HTML file per image.

## Adding an image

1. Drop the image file into `images/`.
2. Add an entry to `js/images-data.js`:

   ```js
   {
     id: "unique-id",           // used in the URL, no spaces
     title: "Display Title",
     file: "images/yourfile.jpg",
     caption: "Optional flavor text shown under the image."
   }
   ```

That's it — it'll show up on the index page, and its page will be
`image.html?id=unique-id`.

## Viewing locally

Just open `index.html` in a browser (double-click it). Everything is
plain files, no server or build step required.

## Deploying (so you can send links to players)

**GitHub Pages**
1. Push this folder to a GitHub repo.
2. In repo Settings → Pages, set source to the `main` branch, root folder.
3. Your site will be at `https://<username>.github.io/<repo>/`.
   Share links like `https://<username>.github.io/<repo>/image.html?id=unique-id`.

**Netlify / Vercel**
- Drag-and-drop this folder onto Netlify's deploy page, or connect the repo.
  No build command needed — it's a static site.

## Revealing images to players (Firebase)

Images are hidden by default. Reveal state lives in a Firebase Realtime
Database, so toggling it updates every open player tab live — no redeploy
needed.

- **`dm.html`** — your control panel. One row per image with a toggle switch
  and a "view" link. Flip a switch to reveal/hide that image for everyone.
- **`index.html`** — players only ever see revealed images here.
- **`image.html?id=...`** — shows "not revealed yet" until you flip its
  toggle, then updates live.

### One-time Firebase setup

Config already lives in `js/firebase-config.js`, pointed at the
`candlekeep-mysteries` project. You still need to set the Realtime Database
security rules once: in the Firebase Console → Realtime Database → Rules,
paste:

```json
{
  "rules": {
    "revealed": {
      ".read": true,
      ".write": true
    }
  }
}
```

This keeps reads/writes scoped to only the `revealed` node (everything else
denied by default). Note this is convenience-level security, not lockdown —
anyone with your site's URL could technically flip a toggle via the browser
console. Fine for a home game; if you ever want it hardened (e.g. requiring
sign-in on `dm.html`), that's a follow-up, not a rebuild.

## Notes

- The starter `js/images-data.js` includes an example entry — delete it once
  you've added your own images.
- Image IDs must be unique; they become the `?id=` value in shared URLs.
- Don't share `dm.html`'s link with players — only share `index.html` or
  individual `image.html?id=...` links.
