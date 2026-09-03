/// <reference types="vite/client" />

/**
 * Build-time environment contract.
 *
 * Everything here is inlined into the public bundle by Vite — only values that
 * are safe to publish belong in this list. The EmailJS public key is designed
 * for browser use; the service is protected by domain allow-listing in the
 * EmailJS dashboard, not by secrecy of this key.
 */
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
