import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "./en";
import { tr } from "./tr";

export type Language = "en" | "tr";

/**
 * The English dictionary is the source of truth: `tr.ts` is annotated with this
 * type, so a missing or misspelled key is a build error rather than a blank
 * string discovered in production.
 */
export type Dictionary = typeof en;

const DICTIONARIES: Record<Language, Dictionary> = { en, tr };
const STORAGE_KEY = "portfolio_lang";
const DEFAULT_LANGUAGE: Language = "en";

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "tr";
}

/**
 * English is the default on purpose — the browser's language is deliberately
 * *not* consulted, so a first-time visitor always sees the same page as the
 * one search engines and social crawlers index.
 */
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    // storage disabled (private mode, blocked cookies) — fall through
  }
  return DEFAULT_LANGUAGE;
}

type I18nValue = {
  lang: Language;
  t: Dictionary;
  setLang: (lang: Language) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(initialLanguage);

  useEffect(() => {
    // Keep the document in sync so screen readers and translation tools pick
    // the right pronunciation and offer the right prompts.
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // preference simply will not persist — not worth failing a render over
    }
  }, [lang]);

  const value = useMemo<I18nValue>(() => ({ lang, t: DICTIONARIES[lang], setLang }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
