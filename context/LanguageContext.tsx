'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Lang, Translations } from '@/i18n/types';
import { translations } from '@/i18n';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'ga-lang';
const VALID_LANGS: Lang[] = ['en', 'fr', 'es', 'de'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Read the stored choice after mount only, so the server render and the
  // first client render match (no hydration mismatch) -- this is also what
  // lets a language picked on one page (e.g. the homepage) carry into the
  // next (e.g. /start), since each page mounts its own LanguageProvider.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Syncing from localStorage after mount is exactly this: a one-time
      // read from an external system that can't be reached during SSR, not
      // state that should have been derived during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored && (VALID_LANGS as string[]).includes(stored)) setLangState(stored as Lang);
    } catch {
      // localStorage can throw (private browsing, disabled storage) -- fall back to 'en'.
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore -- language switch still works for this page view
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation outside LanguageProvider');
  return ctx;
}
