# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static landing page for **BTS Protege** (security & LGPD compliance service), deployed on **Azure Static Web Apps**. No build step, no package manager, no tests. Push to `main` → Azure auto-deploys.

## Local development

Open `index.html` directly in a browser, or serve with any static server:

```
npx serve .
# or
python -m http.server 8080
```

The `demo/` sub-app must be served from the root (not opened as a file) so its iframe `src="/demo/index.html"` resolves correctly.

## Architecture

### Main site (`index.html` + `css/styles.css` + `js/script.js`)

Single-file landing page. All sections are inline in `index.html`. No framework, no bundler.

**CSS** (`css/styles.css`) is one file with a clear section structure (marked with `══` comments). Design tokens are in `:root` — always use variables, never hardcode colors or sizes. Key tokens: `--ink`, `--blue-mid`, `--sky`, `--green`, `--gray-*`, `--r-*` (border radius), `--shadow-*`.

Section background variants: `.section--dark` (dark navy), `.section--gray` (light gray), default (white).

**JS** (`js/script.js`) has two logical parts:
1. **Lines 1–141** — core behaviors: navbar scroll/toggle, progress bar, `.reveal` IntersectionObserver, counter animation, FAQ accordion, contact form → WhatsApp, active nav link highlight, card hover glow.
2. **Lines 142–346** — conversion IIFE: announcement bar, smart WhatsApp button (switches to demo mode when user scrolls past `#score`), sticky CTA bar.

Contact form has no backend — on submit it builds a pre-filled `wa.me` URL and opens WhatsApp in a new tab.

### Demo app (`demo/`)

Pre-built React/Vite bundle (the BTS Protege Score dashboard). Entry point is `demo/index.html`, which loads `demo/assets/index-CHvp4YRA.js`. **Do not edit the bundle directly.** It is embedded in the main site as an `<iframe src="/demo/index.html">` inside the `#score` section.

### Routing (`staticwebapp.config.json`)

- `/demo` and `/demo/*` are served as static files (bypassing SPA fallback).
- All other routes fall back to `/index.html` (SPA-style).
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.) are applied globally.

## Key conventions

- **Scroll animations**: add class `reveal` to any element — the IntersectionObserver in `script.js` adds `.visible` when it enters the viewport.
- **Counter animations**: add `data-target="<number>"` and optionally `data-suffix` / `data-prefix` to any `.metric-val` element.
- **Section headers**: use `.section-eyebrow` + `.section-title` + `.section-desc` pattern, consistent across all sections.
- **Select placeholder styling**: selects use the JS-driven `.is-placeholder` class (toggled on change) — do not use CSS `:valid`/`:invalid` for this.
- **WhatsApp links**: all CTAs point to `https://wa.me/5561983158515` with URL-encoded `text=` parameters.
