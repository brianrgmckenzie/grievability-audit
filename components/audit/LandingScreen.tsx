'use client';

import { useTranslation } from '@/context/LanguageContext';

interface Props {
  onBegin: () => void;
}

export default function LandingScreen({ onBegin }: Props) {
  const { t } = useTranslation();
  return (
    <div
      className="gv-fade flex flex-1 flex-col justify-center min-h-screen"
      style={{ padding: '64px 0 56px' }}
    >
      <a
        href="https://www.reframeconcepts.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', marginBottom: '28px' }}
      >
        <img
          src="/reframe-logo.png"
          alt="Reframe Concepts"
          style={{ height: '56px', width: 'auto', display: 'block', opacity: 0.9 }}
        />
      </a>

      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--amber)',
          marginBottom: '28px',
        }}
      >
        <a
          href="https://www.reframeconcepts.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Reframe Concepts
        </a>
        {' · '}{t.landing.eyebrow.split(' · ').slice(1).join(' · ')}
      </div>

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 500,
          fontSize: 'clamp(40px, 12vw, 68px)',
          lineHeight: 1.02,
          letterSpacing: '-0.015em',
          margin: '0 0 28px',
          color: 'var(--cream)',
        }}
      >
        {t.landing.titleBefore}
        <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.landing.titleItalic}</span>
        {t.landing.titleAfter}
      </h1>

      <p
        style={{
          fontSize: '17px',
          lineHeight: 1.6,
          color: 'var(--secondary)',
          maxWidth: '44ch',
          margin: '0 0 12px',
        }}
      >
        {t.landing.body1}
      </p>

      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: 'var(--secondary)',
          maxWidth: '44ch',
          margin: '0 0 40px',
        }}
      >
        {t.landing.body2}
      </p>

      <button
        onClick={onBegin}
        style={{
          alignSelf: 'flex-start',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--ink)',
          background: 'var(--gold)',
          border: 'none',
          borderRadius: '999px',
          padding: '17px 34px',
          cursor: 'pointer',
          transition: 'opacity 0.18s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {t.landing.cta}
      </button>

      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '10.5px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginTop: '44px',
        }}
      >
        {t.landing.tagline}
      </div>

      <a
        href="/privacy"
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '10.5px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          textDecoration: 'none',
          marginTop: '10px',
          display: 'inline-block',
          opacity: 0.7,
        }}
      >
        {t.gate.privacyLink}
      </a>
    </div>
  );
}
