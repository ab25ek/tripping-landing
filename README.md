# Am I Tripping?! — Landing Page

A standalone static landing page for the **Tripping** iOS app. Plain HTML/CSS/JS —
no framework, no backend, no build step. Open `index.html` and it runs.

> **This site never calls the Tripping Worker/API.** Every demo consult is
> pre-scripted and baked in. The only external requests are the Google Font
> (Instrument Serif) and — on demand, only when someone clicks the waitlist
> button — the Tally form embed.

---

## What's here

| File | What it does |
|------|--------------|
| `index.html` | Page structure, SEO/OpenGraph/Twitter meta, favicon links |
| `styles.css` | All styling; matches the app's identity + responsive/mobile + reduced-motion |
| `config.js`  | **The one file you edit on launch day** — the two CTA buttons |
| `script.js`  | Looping demo consults, the fly-to-stack choreography, and the judges coverflow |
| `assets/`    | Wordmark, app-icon favicons, judge avatar thumbnails, OG image |

---

## Launch-day switches (edit `config.js`)

Everything about the buttons is driven from three constants at the top of `config.js`:

```js
APP_STORE_URL: ""   // empty  -> primary button = "Waitlist now" (opens Tally)
                    // set    -> primary button = "Get the app" (links to App Store)

BETA_URL: ""        // empty  -> the "Try the Beta" button does NOT render at all
                    // set    -> "Try the Beta" appears, linking to your TestFlight invite

TALLY_FORM_URL: "https://tally.so/r/vG1Pol"   // the waitlist form (already set)
```

- **On App Store launch:** paste your App Store product URL into `APP_STORE_URL`.
  The primary button flips to "Get the app" automatically.
- **When TestFlight external testing clears review:** paste the public invite link
  into `BETA_URL` and the "Try the Beta" button appears.
- No other file needs to change.

### The waitlist form (Tally)

The waitlist button opens the Tally form in a modal. It's already wired to
`https://tally.so/r/vG1Pol`. If you ever need to recreate it:

1. Go to [tally.so](https://tally.so), **+ New form → Start from blank**.
2. Add one **Email** block, mark it **Required**.
3. **Publish**, copy the share link (`https://tally.so/r/xxxxxx`).
4. Paste it into `TALLY_FORM_URL` in `config.js`.

The code turns the `/r/` share link into a `/embed/` link automatically.

---

## Deploy to GitHub Pages

**Option A — its own repo (simplest):**

1. Create a new **public** repo on GitHub, e.g. `tripping-landing`.
2. Push these files to it:
   ```bash
   cd tripping-landing
   git init
   git add .
   git commit -m "Tripping landing page"
   git branch -M main
   git remote add origin https://github.com/<you>/tripping-landing.git
   git push -u origin main
   ```
   (Or add/commit/push with GitHub Desktop.)
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → Branch: `main` / `(root)` → Save.**
4. Wait ~1 minute. Your page is live at
   `https://<you>.github.io/tripping-landing/`.

**Option B — a path on your existing site:**

Drop this folder as `/tripping` inside your `ab25ek.github.io` repo and push.
It'll be live at `https://ab25ek.github.io/tripping/`.

---

## Image slots — what to name your files

All images are **drop-in slots**: put a file at the exact path below and the page
picks it up automatically. No code changes, ever.

### Judge card art (the carousel) → `assets/judges/<id>.jpg`

Cards are 250×380 on screen — export **500×760** (2× retina, 2:3 portrait),
JPEG quality ~85, ideally under ~150 KB each. Keep faces in the upper half; the
bottom ~35% gets a dark scrim for the name/hook text. `.png` also works if a
card needs transparency, but prefer `.jpg` for weight. Missing file = the
gradient + monogram fallback (never broken).

| File name | Judge |
|---|---|
| `assets/judges/aurelius.jpg` | Aurelius *(example art already in place — overwrite it)* |
| `assets/judges/marcus.jpg` | Marcus |
| `assets/judges/starcrossed.jpg` | The Ghosts |
| `assets/judges/cats.jpg` | The Council |
| `assets/judges/inventors.jpg` | The Creatives |
| `assets/judges/redflags.jpg` | The Red Flags |
| `assets/judges/boys.jpg` | The Boys |
| `assets/judges/vera.jpg` | T.R.I.P.P. |
| `assets/judges/rhea.jpg` | Trisha Scott |
| `assets/judges/oldcouple.jpg` | Mr. & Mrs. Scott |
| `assets/judges/girls.jpg` | The Girls |
| `assets/judges/dogcouple.jpg` | Peanut & Butter |

(The ids match the iOS repo's frozen cardIDs, same as the `party-*` assets.)

### Other slots

| File | Used for | Size |
|---|---|---|
| `assets/avatars/trisha.jpg` | Trisha's chat bubble + card seal | 160×160 square |
| `assets/avatars/marcus.jpg` | Marcus's chat bubble + card seal | 160×160 square |
| `assets/avatars/girls.jpg` | The Girls' card seal | 160×160 square |
| `assets/og-image.png` | Social share preview | 1200×630 exactly |
| `assets/icon-32/180/192/512.png` | Favicons (all from the app icon) | those sizes |

## Things to supply / replace before the real launch

- **`assets/og-image.png`** — a branded 1200×630 placeholder is included so social
  shares don't look broken. Swap it for a designed share image when you have one
  (same filename, same dimensions — nothing else to change).
- **App Store URL** — set `APP_STORE_URL` in `config.js` on launch day (see above).

## Notes

- **Judge avatars** on the demo verdict cards (Trisha, Marcus, The Girls) are small
  cropped thumbnails from the app's hero art, converted to lightweight JPEGs.
- **Footer links:** Privacy Policy + Support point to
  `https://ab25ek.github.io/tripping-support/`; Instagram to
  `https://instagram.com/amitripping.app`.
- **Reduced motion:** if the visitor has "reduce motion" on, cards crossfade into
  the stack instead of flying, and bubbles appear without animation.
- **Page weight:** well under 1 MB (all assets combined are ~200 KB).
