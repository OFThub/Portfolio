# Ömer Faruk Türkdoğdu — Portfolio

Single-page developer portfolio. React 18 + TypeScript on Vite 6, Tailwind CSS v4,
canvas/WebGL background work, English/Turkish content, and a Projects section that
pulls live star and fork counts from the GitHub API.

**Live:** https://portfolio-orcin-zeta-8tbk5l20gi.vercel.app &nbsp;·&nbsp; **Contact:** oturkdogdu1@gmail.com

---

## Quick start

```bash
npm ci                 # exact versions from package-lock.json
cp .env.example .env    # optional — only the contact form needs it
npm run dev             # http://localhost:5173
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-checks, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run typecheck` | `tsc --noEmit`, strict mode |
| `npm run lint` | ESLint (flat config, react-hooks rules) |
| `npm run verify` | typecheck + lint + build — run this before pushing |

## Environment

Every `VITE_*` value is **inlined into the public bundle**. Never put a real
secret here. See [`.env.example`](.env.example).

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | no | Canonical origin, stamped into `og:url`, `canonical`, `sitemap.xml` and `robots.txt`. On Vercel it is filled in from the deployment's own hostname, so it only needs setting for a custom domain |

That is the entire list. The site has no backend and no third-party service, so
there is nothing else to configure and no key to leak.

## Project structure

```
index.html                    meta, JSON-LD, %SITE_URL% placeholders
vite.config.ts                build config + canonical-url plugin
tsconfig.json                 strict TS, no emit
eslint.config.js              flat config
vercel.json                   security headers + cache policy
.github/workflows/ci.yml      typecheck · lint · build · prod audit

public/
  images/                     project screenshots (.jpg)
  favicon.png  icon-192.png  apple-touch-icon.png  og-image.jpg
  manifest.json

src/
  main.tsx                    React root
  i18n/
    index.tsx                 LanguageProvider + useI18n
    en.ts  en.projects.ts  en.contact.ts     English (source of truth)
    tr.ts  tr.projects.ts  tr.contact.ts     Turkish (typed against English)
  app/
    App.tsx                   loader gate, skip link, section order
    components/
      Navigation Home About Skills Experience Projects Blog Contact Footer
      Background.tsx          full-page ember canvas
      Hero3D.tsx              three.js hero (lazy-loaded)
      Kinetic.tsx             letter/number animations (anime.js)
      Loading.tsx             intro canvas sequence
      ImageWithFallback.tsx   <img> with themed placeholder
      effects/                FloatingPaths · MatrixRain · Spotlight
  hooks/useGitHubRepos.ts     abortable fetch + loading/error state
  services/github.ts          GitHub API trust boundary
  styles/                     index · theme (design tokens) · tailwind · component CSS
```

## Architecture notes

- **One untrusted input.** `src/services/github.ts` is the only place external
  data enters. It narrows every response field and rejects any `homepage` that
  is not `http(s)` before it can become an `href`. Nothing downstream re-checks.
- **Static data lives at module scope.** Project and navigation arrays sit
  outside their components so `useMemo`/`useEffect` dependency lists are honest.
- **Heavy things are lazy.** `Hero3D` (three.js, ~517 kB) is a dynamic import;
  React and Motion are split into their own long-lived cache chunks.
- **Motion respects the user.** `MotionConfig reducedMotion="user"` plus a CSS
  `prefers-reduced-motion` block that also disables smooth scrolling; every
  canvas effect checks the media query and renders one static frame.
- **The canonical URL exists once.** `VITE_SITE_URL` feeds the meta tags,
  `sitemap.xml` and `robots.txt` through a small Vite plugin.
- **Translations are type-checked, not hoped for.** `tr.ts` is annotated
  `typeof en`, so a key added in English without a Turkish translation fails
  `npm run typecheck`. There is no runtime fallback because there is no runtime
  gap.
- **Nothing leaves the page on its own.** The contact form hands the message to
  the visitor's mail client via `mailto:`; the only network call the site makes
  is the GitHub API for star counts.
- **Always-on animation is gated.** Canvas loops stop when the tab is hidden or
  the section scrolls away, and the hero's 72 animated SVG paths fall back to a
  static frame off-screen.

## Internationalisation

English is the default and is what crawlers index; the browser language is
deliberately not consulted. A visitor's choice is stored in `localStorage`
(`portfolio_lang`) and applied to `<html lang>`.

Everything a visitor reads lives in `src/i18n/`. To add a string:

1. Add the key to the English file (`en.ts`, `en.projects.ts` or `en.contact.ts`).
2. Run `npm run typecheck` — it will name the Turkish file missing the key.
3. Add the translation there.

Not translated on purpose: personal and company names, technology names, and
the source code shown in the About terminal.

Project copy is keyed by slug: `RAW_PROJECTS` in `Projects.tsx` holds the images,
repository URLs and technology lists, and the words come from
`src/i18n/{en,tr}.projects.ts` under the same key.

## Deployment

Both configs assume a static build of `dist/` and ship the same header set:
CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, COOP/CORP, plus immutable caching for `/assets/*` and
`no-cache` for `index.html`.

**Vercel** — import the repo and it deploys on every push to `main`;
`vercel.json` supplies the build command, output directory and headers. The
canonical URL resolves from Vercel's own production hostname, so a fresh import
needs no environment variables at all.

Attaching a custom domain is the only case that needs configuration: set
`VITE_SITE_URL` to it in the Vercel dashboard so the canonical URL, Open Graph
tags and sitemap follow.

`dist/` is generated, git-ignored, and built by the host on every deploy — do not
commit it.

## Adding a project

1. Save screenshots as `public/images/<name>-1.jpg` (long edge ≤ 1600px). Only
   list paths whose file exists — the build fails otherwise, on purpose.
2. Add an entry to `RAW_PROJECTS` in `src/app/components/Projects.tsx` (slug,
   images, technologies, URLs) and the matching slug in
   `src/i18n/en.projects.ts` **and** `src/i18n/tr.projects.ts`.
3. Star and fork counts fill in automatically when `github` points at a repo
   under the account in `src/services/github.ts`; the response is cached in
   `localStorage` for 24h.

The project list is curated by hand. Repositories are not surfaced
automatically: a project earns a card by being added to `RAW_PROJECTS` with a
reachable repository link.

## Accessibility

Skip link, keyboard `:focus-visible` rings, `autocomplete` tokens on the contact
form, `aria-label` on decorative canvases, and a full `prefers-reduced-motion`
path. Worth re-checking with axe or Lighthouse after any layout change.

## License

Source code is MIT — see [LICENSE](LICENSE). The licence explicitly does **not**
cover the personal content: the name and biography, the written copy in
`src/i18n/`, and the images in `public/`. Take the code, bring your own content.

Third-party credits are in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
