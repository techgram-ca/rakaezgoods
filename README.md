# RAKAEZ GOODS WHOLESALERS L.L.C — Website

Single-page static website for RAKAEZ GOODS WHOLESALERS L.L.C, a Dubai-based
importer and wholesaler of fresh fruit &amp; vegetables.

## About the business
- **Company:** RAKAEZ GOODS WHOLESALERS L.L.C
- **Address:** Plot No. 187-0, The Exchange Tower, Business Bay, Dubai, 0000, Dubai, UAE
- **Call / WhatsApp:** +971 56 622 4523
- **Services:** Air & container importation of fresh fruit, vegetables and dry
  shipments from around the world, GCC re-exports, and direct bulk food supply
  to restaurants across the UAE.

## Sections
Premium single-page layout with: cinematic hero slider (Ken Burns crossfade),
Who We Are, Mission & Vision, Our Growth (animated stat counters), Facilities &
Operations, Quality & Compliance, Global Sourcing (animated air/sea route map +
country list), Partners & Clients (segments + logo marquee), and Contact — plus
a sticky header with scroll progress bar, mobile drawer menu, floating WhatsApp
button, scroll-reveal animations, and footer.

## Tech
Plain static **HTML + CSS + JavaScript** — no build step or dependencies.
Fonts: Fraunces (serif display) + Inter (UI), loaded from Google Fonts.

## Customisation notes
- **Client logos:** the marquee in the Partners & Clients section uses
  placeholder names. Replace them (in `script.js`, `logosTrack`) with your
  actual authorised client logos/names.
- **Images:** hero and section images load from Unsplash. Swap the URLs in
  `index.html` for your own brand photography for production.
- **Sourcing map:** origins are defined in the `origins` array in `script.js`.

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files
- `index.html` — page markup and content
- `styles.css` — styling and responsive layout
- `script.js` — hero slider, mobile nav, contact-to-WhatsApp

## Deploy
Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3).
No server or build required.
