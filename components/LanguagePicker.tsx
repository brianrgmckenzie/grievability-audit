'use client';

import { useTranslation } from '@/context/LanguageContext';
import type { Lang } from '@/i18n/types';

const LANGS: Lang[] = ['en', 'fr', 'es', 'de'];

export default function LanguagePicker() {
  const { lang, setLang } = useTranslation();
  return (
    <div style={{ display: 'flex', gap: '18px', justifyContent: 'flex-end', padding: '16px 0 0' }}>
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: lang === l ? 'var(--gold)' : 'var(--muted)',
            background: 'none',
            border: 'none',
            cursor: lang === l ? 'default' : 'pointer',
            padding: 0,
            transition: 'color 0.15s ease',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
