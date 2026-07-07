'use client';

import { useTranslation } from '@/context/LanguageContext';

export default function CalculatingScreen() {
  const { t } = useTranslation();
  return (
    <div
      className="gv-fade flex flex-1 flex-col items-center justify-center min-h-screen text-center"
    >
      <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '40px' }}>
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          style={{ position: 'absolute', inset: 0 }}
        >
          <circle cx="75" cy="75" r="64" fill="none" stroke="var(--border)" strokeWidth="2" />
          <circle
            cx="75"
            cy="75"
            r="64"
            fill="none"
            stroke="var(--amber)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="402"
            transform="rotate(-90 75 75)"
            style={{ animation: 'gv-ringdraw 1.6s ease-in-out infinite alternate' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, var(--gold) 0%, var(--amber) 70%)',
              animation: 'gv-pulse 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '26px',
          color: 'var(--cream)',
          marginBottom: '10px',
        }}
      >
        {t.calculating.headline}
      </div>

      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--secondary)',
        }}
      >
        {t.calculating.body}
      </div>
    </div>
  );
}
