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
   bundle. There is no backend and no third-party service, so the only
   variable that belongs here is `VITE_SITE_URL`. Anything secret is a leak.
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
6. **`vercel.json` is the only header config.** The CSP names every allowed
   origin — adding a new external fetch, font or image host means editing
   `connect-src` / `font-src` / `img-src` there, or it is blocked in production.
   Vercel is the only deployment target; do not reintroduce a second one.
7. **No user-facing string is written in a component.** Everything a visitor
   reads lives in `src/i18n/`. `tr.ts` is annotated `typeof en`, so a key added
   in English without a Turkish translation is a build error — that type
   annotation is the whole safety net, never loosen it to `any` or
   `Partial<...>`.
8. **Decorative animation must stop when nobody can see it.** Canvas loops
   check `document.hidden` (`Background.tsx`) or use an `IntersectionObserver`
   (`Hero3D`, `MatrixRain`, `FloatingPaths`, the project carousel). A new
   always-on `repeat: Infinity` animation needs the same treatment — there are
   already ~60 of them competing for the main thread.
9. **The project list is curated.** Nothing is surfaced from the GitHub API
   automatically; a project earns a card by being in `RAW_PROJECTS` with a
   reachable repository link. Broken links are worse than a shorter list.

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

On Vercel it resolves from `VERCEL_PROJECT_PRODUCTION_URL` automatically, so
only a custom domain needs the variable set.

## Licence

Code is MIT; the personal content (name, biography, `src/i18n/` copy, images in
`public/`) is explicitly excluded — see `LICENSE`. Do not widen the licence to
cover content, and do not narrow it to cover the code.

## Known gaps

- Only 2 of the 11 projects have screenshots (Sportify, the task manager). The
  other 9 carry `images: []` and render without a carousel — the missing paths
  were removed because they produced 40 console 404s on every visit. To add
  them: drop the files in `public/images/` and list them in that project's
  `images` array. `verifyReferencedImages` in `vite.config.ts` fails the build
  if the two ever disagree again.
- `src/app/components/Blog.tsx` renders `<ComingSoon/>` because `blogPosts` is
  empty. `FeaturedCard` and `ArticleCard` are written and typed but unused until
  a post is added.
- `t.errors.githubUnavailable` exists but nothing renders it — `Projects.tsx`
  ignores the hook's `error` and degrades to zero stars instead.
- The contact form opens the visitor's mail client rather than sending for
  them. That is the price of having no backend and no third-party sender.
- Eight projects were removed in 1.2.0 for unreachable repositories or being
  coursework; three of them (`alganChatbot`, `smashMateMinesweeper`,
  `smashMateFileManager`) are worth restoring if those repositories are made
  public again.
