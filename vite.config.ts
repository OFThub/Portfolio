import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Canonical-URL plugin.
 *
 * The absolute site URL appears in six places in index.html plus robots.txt and
 * sitemap.xml. Hard-coding it in each meant a domain change silently broke
 * social previews and canonicals, so it lives in one env var and is stamped in
 * at build time. Set VITE_SITE_URL in the hosting dashboard; the default is the
 * address the site is served from today.
 */
function canonicalUrl(siteUrl: string): Plugin {
  return {
    name: 'canonical-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n` +
          `    <loc>${siteUrl}/</loc>\n` +
          `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>1.0</priority>\n` +
          `  </url>\n` +
          `</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Resolution order: an explicit VITE_SITE_URL wins; otherwise Vercel tells us
  // its own production hostname at build time (so a fresh import is correct
  // without configuring anything); otherwise the GitHub Pages project site.
  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
  const siteUrl = (
    env.VITE_SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : 'https://ofthub.github.io/Portfolio')
  ).replace(/\/+$/, '')

  // The public path the app is served from: '/' for a root domain (Vercel),
  // '/Portfolio/' for the GitHub Pages project site. Derived from the site URL
  // by default so setting one variable cannot desync the other; override only
  // when the two genuinely differ. Anything referencing a file in public/ from
  // JS must go through import.meta.env.BASE_URL, which Vite derives from this.
  const base = env.VITE_BASE_PATH || new URL(siteUrl + '/').pathname

  // The two settings describe the same address from different angles. If they
  // disagree the build still succeeds and the site still loads — only the
  // canonical, og:url and sitemap quietly point somewhere else, which is
  // exactly the kind of failure nobody notices for weeks.
  const sitePath = new URL(siteUrl + '/').pathname
  if (sitePath !== base) {
    console.warn(
      `[canonical-url] VITE_BASE_PATH is "${base}" but VITE_SITE_URL resolves to ` +
        `"${sitePath}". Assets will be served from one path while canonical URLs ` +
        `claim the other. Set both, or neither.`,
    )
  }

  return {
    base,
    plugins: [react(), tailwindcss(), canonicalUrl(siteUrl)],

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },

    // Raw-importable asset types. Never add .css, .tsx or .ts here.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    build: {
      // Never publish the original sources alongside the bundle.
      sourcemap: false,
      rollupOptions: {
        output: {
          // React and Motion change far less often than portfolio content, so
          // they get their own long-lived cache entries. three.js is left alone
          // on purpose — it already rides the lazy Hero3D chunk.
          manualChunks: {
            react: ['react', 'react-dom'],
            motion: ['motion'],
          },
        },
      },
      // three.js is ~500 kB and deliberately lazy-loaded; the default warning is
      // only noise here.
      chunkSizeWarningLimit: 600,
    },
  }
})
