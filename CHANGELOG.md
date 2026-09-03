# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-09-03

### Added

- **English/Turkish content, English by default.** A dependency-free
  `LanguageProvider` (`src/i18n/`) with a two-segment EN/TR switch in the navbar
  and mobile drawer. The choice persists in `localStorage` and drives
  `<html lang>`. The browser language is deliberately ignored so first-time
  visitors and crawlers always see the same page.
- Turkish dictionaries are annotated `typeof en`, so an untranslated key is a
  build error rather than a blank string in production.
- `VITE_BASE_PATH`, letting one source tree serve a root domain (Vercel) and a
  project sub-path (GitHub Pages) without forking the asset URLs.
- `.github/workflows/deploy-pages.yml` — builds and deploys GitHub Pages from
  CI, replacing the committed `dist/` that 1.0.0 removed.
- `LICENSE`: MIT for the source code, with the personal content (name,
  biography, `src/i18n/` copy, images in `public/`) explicitly excluded.

### Fixed

- **The whole site is now English.** Four project descriptions were Turkish
  only; they now exist in both languages, and the Turkish originals are kept as
  the Turkish entries rather than being machine-translated back.
- `KineticLetters` and the `Typewriter` in `Home.tsx` animated via an effect
  whose dependency array omitted the text, so a language switch left the old
  sentence on screen or faded in nothing at all.
- `contactInfo` was memoised with an empty dependency array, so contact labels
  would not have followed a language change.
- React keys in `Projects.tsx` used the project title, which changes with the
  language; they now use the stable slug.

### Changed

- `RAW_PROJECTS` holds only language-independent data (slug, images,
  technologies, URLs, `featured`); titles, categories and descriptions moved to
  `src/i18n/{en,tr}.projects.ts` keyed by the same slug.
- Project image paths lost their leading slash and are prefixed with
  `import.meta.env.BASE_URL`, which is what makes the sub-path deployment work.
- `public/manifest.json` uses relative URLs so one file is correct at both `/`
  and `/Portfolio/`.
- Default `VITE_SITE_URL` is now `https://ofthub.github.io/Portfolio` —
  `OFThub/Portfolio` is a project repository, so Pages never served it from the
  domain root as the old meta tags claimed.
- Bundle grew 240 kB → 263 kB (67 → 75 kB gzip): both dictionaries ship.

## [1.0.0] — 2026-09-03

First release audited for production. The site was generated from a Figma Make
export; this release removes that scaffolding and closes the defects it carried.

### Security

- **`.gitignore` only matched `*.env`**, so `.env.local` and `.env.production` —
  the files Vite actually reads — were never ignored. Replaced with explicit
  `.env` / `.env.*` rules plus a `!.env.example` exception.
- Added `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, COOP and CORP via `vercel.json` and `netlify.toml`. The
  CSP allow-lists only `fonts.googleapis.com`, `fonts.gstatic.com`,
  `api.github.com` and `api.emailjs.com`.
- Hardened `src/services/github.ts` into a real trust boundary: every API field
  is narrowed, `homepage` is rejected unless `http(s)` before it can reach an
  `href`, the cached copy is re-validated on read, and requests carry a 10s
  timeout.
- The contact form no longer echoes raw EmailJS provider errors to visitors;
  the detail is logged and the visitor gets a working fallback address.
- `npm audit`: **0 vulnerabilities**, production and development. Previously 8
  (1 critical, 6 high), including a production-tree `lodash` advisory reaching
  the app through an unused `recharts` dependency.
- Build no longer emits sourcemaps.

### Fixed

- **`react` and `react-dom` were declared only as optional `peerDependencies`.**
  A clean `npm ci` did not install them and the build failed. Moved to
  `dependencies`.
- **All six "shine sweep" animations were broken** — the keyframe start value
  used U+2212 MINUS SIGN (`−100%`) instead of a hyphen, an invalid CSS length.
  Affected Home, Contact, Footer, Navigation and Projects.
- **Project screenshots never shipped.** `images/` sat outside `public/`, so no
  build ever included it. Moved to `public/images/` and switched to
  root-relative paths.
- **Space Grotesk was downloaded on every visit but never applied** — nothing
  set a `font-family`. Bound to Tailwind's `--font-sans`; added weight 700, which
  `font-bold` had been faking.
- **The intro loader had no styles at all.** `.loader-wrapper`, `.loader-canvas`
  and `.explosion-canvas` were undefined and `.fade-out` was a no-op, so the
  loader snapped away instead of fading. Added the overlay CSS.
- **`Blog.tsx` ran an 80 ms `setInterval` forever**, re-rendering the section
  ~12×/second to compute a scrambled string that was never rendered.
- The contact form called `emailjs.send(undefined, …)` when its environment
  variables were absent. It now degrades to a disabled state and shows the
  direct e-mail address.
- `useGitHubRepos` had no cleanup and could set state after unmount; it now
  aborts in flight.
- `MagneticBtn` in `Home.tsx` accepted a `variant` prop it never applied.
- `Background.tsx` registered a `mouseenter` listener whose only effect was
  writing a flag nothing read.
- `Footer.tsx` defined `CornerDeco` and never rendered it.
- CSS `prefers-reduced-motion` did not disable `scroll-behavior: smooth`.
- Contact form inputs had no `autocomplete` attributes (WCAG 2.2 §1.3.5).

### Added

- `tsconfig.json` with `strict`, `noUnusedLocals`, `noUnusedParameters` — the
  project previously had **no TypeScript configuration and no type checking at
  all**. The first run surfaced 36 errors; all are fixed.
- ESLint flat config with `typescript-eslint` and `react-hooks` rules.
- `npm run typecheck`, `lint`, `preview` and `verify` scripts.
- GitHub Actions CI: typecheck, lint, build and a production `npm audit` on
  every push and pull request.
- `VITE_SITE_URL` and a `canonical-url` Vite plugin that stamps the origin into
  `index.html` and generates `robots.txt` and `sitemap.xml` at build time.
- `sitemap.xml`, `robots.txt`, `canonical`, `og:image` dimensions, Twitter card
  alt text, and JSON-LD `Person` structured data.
- `.env.example`.
- Vendor chunk splitting: `react` and `motion` now cache independently of app
  code.
- `noscript` fallback with contact details.
- PWA icons at 192px and 180px; manifest now matches the real icon sizes.

### Changed

- **Removed 48 unused shadcn/ui components**, trimming `dependencies` from 45
  packages to 7 (`recharts`, `embla-carousel-react`, `cmdk`, `vaul`,
  `react-day-picker`, `input-otp`, `react-hook-form`, `sonner`, 25 Radix
  packages, `tw-animate-css` and others went with them). Only three files in
  that directory were ever imported; they moved to
  `src/app/components/effects/` as `FloatingPaths`, `MatrixRain` and
  `Spotlight`.
- Dropped the `figma/` directory; `ImageWithFallback` moved up and its
  light-grey error state was rethemed for the dark palette.
- Hoisted `RAW_PROJECTS` and `links` to module scope so `useMemo`/`useEffect`
  dependency lists are correct.
- Package renamed from `@figma/my-make-file` to `omerfaruk-portfolio`; removed
  the stale `pnpm.overrides` pin that contradicted the declared Vite version.
- `<html lang>` corrected from `tr` to `en`; user-facing form and error strings
  normalised to English.
- Asset weight: favicon **1111 kB → 17 kB**, social image **1458 kB → 90 kB**
  (PNG → JPEG at 1200×630), screenshots **1103 kB → 339 kB**. CSS
  **131.9 kB → 62.2 kB**.
- `dist/` is no longer committed — the host builds it.
- Deleted the Figma Make `guidelines/Guidelines.md` template and the empty
  `postcss.config.mjs`.
