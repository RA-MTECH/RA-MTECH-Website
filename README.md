# RA&MTECH Website

Static site for [ra-mtech.com](https://ra-mtech.com), hosted on GitHub Pages. No build step — edit files and push.

## Structure

```
├── index.html              Home page
├── about/index.html        About page
├── contact/index.html      Book a Demo page
├── case-studies/index.html Case studies page
├── events/index.html       Events page
├── 404.html                Not-found page
├── assets/
│   ├── style.css           ALL styling (one file, table of contents at top)
│   ├── script.js           ALL shared behavior (nav, reveal animations, consent banner, email forms)
│   ├── consent.js          Google Consent Mode defaults + GA4 config (loaded in every <head>)
│   └── images/             Logos and headshots
├── sitemap.xml / robots.txt / CNAME
```

## How things work

**Header & footer** are inlined into each page (no JS component loading — faster, no flash, better SEO). If you change the nav or footer, apply the same edit to all 6 HTML pages; the markup is identical and marked with `NAVBAR` / `FOOTER` comment banners.

**Colors & fonts** are defined once as CSS variables at the top of `assets/style.css` (the `:root` block). Change `--accent`, `--bg`, etc. there to retheme the whole site.

**Email forms** — any `<form data-email-form>` is wired automatically by `script.js` (EmailJS sends a user + admin email, then fires a GA4 event). Attributes:

- `data-event` — GA4 event name (e.g. `waitlist_signup`, `demo_request`, `pilot_signup`)
- `data-success` — success message shown to the visitor

EmailJS keys live at the top of the "EMAIL FORMS" section in `script.js`.

**Cookie consent** — the banner is injected by `script.js` on every page until the visitor makes a choice; consent defaults are set early by `consent.js`.

**Scroll animations** — add class `reveal` to any element to fade it in when scrolled into view.

**Image slots** — `.hero-image`, `.about-image`, `.card-image`, and `.ai-image` are placeholder slots currently hidden with `display: none`. To use one, see the comments above each in `style.css`.

**Cache busting** — stylesheet links use `style.css?v=3`. Bump the number when shipping CSS changes.

## Local preview

Use VS Code Live Server (right-click `index.html` → "Open with Live Server") or:

```
python3 -m http.server 8000
```

All paths are relative, so the site works no matter which folder the server is rooted at. The one exception is `404.html`, which uses a couple of absolute links (`/contact/`) because GitHub Pages serves it from any URL depth — everything else on it will still look right locally.
