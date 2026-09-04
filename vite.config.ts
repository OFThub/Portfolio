import { defineConfig, loadEnv, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Fails the build when the bundle references an image that is not shipped.
 *
 * Project screenshots are plain strings in RAW_PROJECTS, so nothing type-checks
 * them; a missing file used to surface only as dozens of 404s in a visitor's
 * console, quietly replaced by placeholders. This walks the emitted JS instead
 * of the source, so it sees exactly what the browser will ask for.
 */
function verifyReferencedImages(outDir: string): Plugin {
  return {
    name: 'verify-referenced-images',
    apply: 'build',
    closeBundle() {
      const assetsDir = path.join(outDir, 'assets')
      if (!fs.existsSync(assetsDir)) return

      const referenced = new Set<string>()
      for (const file of fs.readdirSync(assetsDir)) {
        if (!file.endsWith('.js')) continue
        const code = fs.readFileSync(path.join(assetsDir, file), 'utf8')
        for (const m of code.matchAll(/["'`]\/?(images\/[^"'`]+)["'`]/g)) referenced.add(m[1])
      }

      const missing = [...referenced].filter((rel) => !fs.existsSync(path.join(outDir, rel)))
      if (missing.length > 0) {
        this.error(
          `${missing.length} image(s) referenced by the bundle are not in the build output:\n` +
            missing.map((m) => `  - ${m}`).join('\n') +
            `\nAdd the files under public/ or remove the references.`,
        )
      }
    },
  }
}

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
  // An explicit VITE_SITE_URL wins (custom domain); otherwise Vercel tells us
  // its own production hostname at build time, so a fresh import needs no
  // configuration at all. The localhost fallback only matters for `vite build`
  // run by hand.
  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
  const siteUrl = (
    env.VITE_SITE_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:4173')
  ).replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), canonicalUrl(siteUrl), verifyReferencedImages('dist')],

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
