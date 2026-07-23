'use client';

import { useState, FormEvent } from 'react';
import { useTranslation } from '@/context/LanguageContext';

interface Props {
  onSubmit: (name: string, email: string, org: string, city: string, province: string) => Promise<void>;
}

export default function GateScreen({ onSubmit }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = name.trim().length > 0 && validEmail && org.trim().length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || sending) return;
    setSending(true);
    setError('');
    try {
      await onSubmit(name.trim(), email.trim(), org.trim(), city.trim(), province.trim());
    } catch {
      setError(t.gate.error);
      setSending(false);
    }
  }

  const inputStyle = {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: '16px',
    color: 'var(--cream)',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '17px 18px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s ease',
  };

  function focusStyle(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = 'var(--amber)';
  }
  function blurStyle(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = 'var(--border)';
  }

  return (
    <div
      className="gv-fade flex flex-1 flex-col justify-center min-h-screen"
      style={{ padding: '56px 0' }}
    >
      <div style={{ position: 'relative' }}>
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.14,
            filter: 'blur(7px)',
            pointerEvents: 'none',
          }}
        >
          <polygon points="120,44 186,96 160,178 80,178 54,96" fill="none" stroke="var(--amber)" strokeWidth="3" />
          <polygon points="120,74 158,104 142,158 96,160 78,108" fill="var(--amber)" fillOpacity="0.4" stroke="var(--gold)" strokeWidth="2" />
        </svg>

        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '18px' }}>
            {t.gate.eyebrow}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(32px, 9vw, 46px)', lineHeight: 1.05, letterSpacing: '-0.01em', margin: '0 0 14px', color: 'var(--cream)' }}>
            {t.gate.titleBefore}<span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{t.gate.titleItalic}</span>{t.gate.titleAfter}
          </h2>

          <p style={{ fontSize: '18px', lineHeight: 1.65, color: 'var(--secondary)', maxWidth: '40ch', margin: '0 0 32px' }}>
            {t.gate.body}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.gate.namePlaceholder}
              aria-label={t.gate.namePlaceholder}
              autoComplete="name"
              disabled={sending}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder={t.gate.orgPlaceholder}
              aria-label={t.gate.orgPlaceholder}
              autoComplete="organization"
              disabled={sending}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t.gate.cityPlaceholder}
                aria-label={t.gate.cityPlaceholder}
                autoComplete="address-level2"
                disabled={sending}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder={t.gate.provincePlaceholder}
                aria-label={t.gate.provincePlaceholder}
                autoComplete="address-level1"
                disabled={sending}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.gate.emailPlaceholder}
              aria-label={t.gate.emailPlaceholder}
              inputMode="email"
              autoComplete="email"
              disabled={sending}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />

            {error && (
              <p style={{ fontSize: '14px', color: '#ff8a80', fontFamily: "'Roboto', sans-serif" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || sending}
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '14px',
                padding: '18px 28px',
                border: 'none',
                marginTop: '4px',
                cursor: canSubmit && !sending ? 'pointer' : 'not-allowed',
                background: canSubmit && !sending ? 'var(--gold)' : 'var(--card)',
                color: canSubmit && !sending ? 'var(--ink)' : '#5E6A6C',
                transition: 'all 0.18s ease',
              }}
            >
              {sending ? t.gate.ctaLoading : t.gate.cta}
            </button>
          </form>

          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', margin: '14px 0 0' }}>
            {t.gate.footer}
          </p>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', lineHeight: 1.55, color: 'var(--muted)', textAlign: 'center', margin: '10px 0 0', maxWidth: '38ch', marginLeft: 'auto', marginRight: 'auto' }}>
            {t.gate.privacyNote}{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
              {t.gate.privacyLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
