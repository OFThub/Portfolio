# CLAUDE.md

Guidance for Claude Code and any contributor working in this repository.

## What this is

A single-page portfolio site. **No backend, no router, no state library.** One
React tree, nine sections stacked in `src/app/App.tsx`, navigated by anchor
scrolling. The only global state is the language, held by `LanguageProvider`.
If a change seems to need routing or a state library, it is probably the wrong
change.

Stack: React 18 · TypeScript (strict) · Vite 6 · Tailwind CSS v4 · Motion ·
three.js (lazy) · anime.js.

## Before you claim anything works

```bash
npm run verify     # typecheck + lint + build
```

All three must pass. `npm run build` already runs `typecheck` first, so a green
build means types are green too. There is no test suite — this is presentational
code — so the browser is the last check: `npm run preview` and confirm the
console is clean.

## Rules that are not negotiable

1. **`src/services/github.ts` is the only untrusted-input boundary.** Anything
   arriving from the GitHub API is narrowed there — every field type-checked,
   and `homepage` rejected unless it is `http(s)` because it becomes an `href`.
   Add validation *there*, never at a call site.
2. **Never widen `VITE_*` to hold a secret.** Vite inlines these into the public
   bundle. The EmailJS key is public by design; anything else is a leak.
3. **Static data goes at module scope**, not inside a component. `RAW_PROJECTS`
   (Projects.tsx) and `links` (Navigation.tsx) live outside their components so
   `useMemo`/`useEffect` dependency arrays are truthful. Moving them back in
   silently breaks memoisation.
4. **Every animation respects `prefers-reduced-motion`.** `MotionConfig
   reducedMotion="user"` covers Motion; canvas effects check
   `window.matchMedia("(prefers-reduced-motion: reduce)")` and render one static
   frame; `src/styles/index.css` handles CSS animations *and* `scroll-behavior`.
5. **`dist/` is generated.** It is git-ignored and built by the host. Never
   commit it.
6. **`vercel.json` and `netlify.toml` carry the same headers.** Change one,
   change the other. The CSP names every allowed origin — adding a new external
   fetch, font, or image host means editing `connect-src` / `font-src` /
   `img-src` in both files or it will be blocked in production.
7. **No user-facing string is written in a component.** Everything a visitor
   reads lives in `src/i18n/`. `tr.ts` is annotated `typeof en`, so a key added
   in English without a Turkish translation is a build error — that type
   annotation is the whole safety net, never loosen it to `any` or
   `Partial<...>`.
8. **Anything in `public/` referenced from JS goes through
   `import.meta.env.BASE_URL`.** A bare `"/images/x.jpg"` works on Vercel and
   404s on the GitHub Pages sub-path. `Projects.tsx` stores paths without a
   leading slash and prefixes them with `BASE`.

## Conventions in this codebase

- **Comments explain *why*, not *what*.** Existing comments mark trade-offs and
  traps; match that register. Section dividers use `/* ─── Name ─── */`.
- **Components are self-contained.** Sub-components (`Particle`, `GlowCard`,
  `MagneticButton`) are defined in the file that uses them and deliberately
  duplicated across sections rather than shared — they drift by design.
- **`components/effects/` is for bespoke visual components** (canvas, SVG,
  cursor). It is not a shadcn/ui folder; the previous `ui/` directory held 48
  unused shadcn components and was removed. Do not reintroduce a component
  library for one button.
- **Styling is Tailwind utilities.** Design tokens live in
  `src/styles/theme.css` (`--primary`, `--card`, `--background`…). Component CSS
  files exist only for canvas layout (`Loading.css`, `Background.css`). Use the
  tokens, not raw hex, for anything themeable.
- **UI copy is English.** Some *project descriptions* are Turkish — that is the
  author's content, leave it. System messages, labels and errors are English.
- **Images:** `public/images/<name>-N.jpg`, long edge ≤ 1600px, JPEG quality
  ~82. `ImageWithFallback` renders a themed placeholder when one is missing.

## Translations

- Add the key to the English file first (`en.ts`, `en.projects.ts`,
  `en.contact.ts`), run `npm run typecheck`, and it will name the Turkish file
  that is now incomplete.
- Messages that interpolate a value are **functions**, not templates with
  tokens: `minChars: (n: number) => ...`. The signature is what stops a
  translation from silently dropping the number.
- Project copy is keyed by slug. `RAW_PROJECTS` in `Projects.tsx` holds images,
  URLs, technologies and `featured`; the words come from
  `{en,tr}.projects.ts` under the same key. Adding a project means adding both.
- Not translated: personal and company names, technology names, and the source
  code shown in the About terminal.
- Anything derived from `t` inside `useMemo`/`useEffect` must list `t` as a
  dependency, or it will not update when the language changes.
- Animations driven by an effect need the text in their dependency array —
  `KineticLetters` and the `Typewriter` in `Home.tsx` both had to be fixed for
  exactly this.

## The canonical URL

The production origin appears in six meta tags plus `sitemap.xml` and
`robots.txt`. It is **not** hard-coded — `VITE_SITE_URL` feeds the
`canonical-url` plugin in `vite.config.ts`, which stamps `%SITE_URL%` in
`index.html` and emits both files at build time. To change domains, change the
env var in the hosting dashboard. If you add a meta tag needing the origin, use
`%SITE_URL%`.

`VITE_BASE_PATH` is the matching setting for the *path*: unset (`/`) for
Vercel and Netlify, `/Portfolio/` for the GitHub Pages project site. The Pages
workflow sets both; they must agree or assets 404 while canonicals still claim
success.

## Licence

Code is MIT; the personal content (name, biography, `src/i18n/` copy, images in
`public/`) is explicitly excluded — see `LICENSE`. Do not widen the licence to
cover content, and do not narrow it to cover the code.

## Known gaps

- 42 of the 48 screenshots referenced in `RAW_PROJECTS` do not exist yet; those
  cards render the fallback placeholder. Adding the files fixes them, no code
  change needed.
- `src/app/components/Blog.tsx` renders `<ComingSoon/>` because `blogPosts` is
  empty. `FeaturedCard` and `ArticleCard` are written and typed but unused until
  a post is added.
- The GitHub Pages mirror cannot serve security headers; only the
  Vercel/Netlify deployment gets the CSP and HSTS.
- `t.errors.githubUnavailable` exists but nothing renders it — `Projects.tsx`
  ignores the hook's `error` and degrades to zero stars instead.
