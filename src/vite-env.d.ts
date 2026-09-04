/// <reference types="vite/client" />

/**
 * Build-time environment contract.
 *
 * Everything here is inlined into the public bundle by Vite, so only values
 * that are safe to publish belong in this list. The site has no backend and no
 * third-party service keys — nothing secret should ever be added here.
 */
interface ImportMetaEnv {
  /** Canonical origin. Falls back to Vercel's own production hostname. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
