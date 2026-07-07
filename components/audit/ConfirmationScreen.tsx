'use client';

import { useState } from 'react';

interface Props {
  email: string;
  onResend: () => Promise<void>;
}

const BOARD_AUDIT_URL = process.env.NEXT_PUBLIC_BOARD_AUDIT_URL ?? '#';

export default function ConfirmationScreen({ email, onResend }: Props) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    if (resending || resent) return;
    setResending(true);
    try {
      await onResend();
      setResent(true);
    } finally {
      setResending(false);
    }
  }

  return (
    <div
      className="gv-fade flex flex-1 flex-col justify-center min-h-screen"
      style={{ padding: '56px 0' }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '999px',
          border: '1.5px solid var(--amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '26px',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 6l-11 9L4 11" />
        </svg>
      </div>

      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--amber)',
          marginBottom: '16px',
        }}
      >
        Sent
      </div>

      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 500,
          fontSize: 'clamp(32px, 9vw, 46px)',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          margin: '0 0 20px',
          color: 'var(--cream)',
        }}
      >
        Check your <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>inbox</span>.
      </h2>

      <p
        style={{
          fontSize: '16.5px',
          lineHeight: 1.6,
          color: 'var(--secondary)',
          maxWidth: '44ch',
          margin: '0 0 8px',
        }}
      >
        Your Grievability Score and full breakdown are on their way to
      </p>

      <p
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '14px',
          letterSpacing: '0.04em',
          color: 'var(--cream)',
          margin: '0 0 22px',
          wordBreak: 'break-all',
        }}
      >
        {email}
      </p>

      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: 'var(--secondary)',
          maxWidth: '44ch',
          margin: '0 0 4px',
        }}
      >
        It can take a minute. If you do not see it, check your spam or promotions folder.
      </p>

      <div style={{ margin: '6px 0 40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleResend}
          disabled={resending || resent}
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            color: resent ? 'var(--muted)' : 'var(--gold)',
            background: 'none',
            border: 'none',
            padding: '6px 0',
            cursor: resent ? 'default' : 'pointer',
            textDecoration: resent ? 'none' : 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          {resending ? 'Resending…' : resent ? 'Resent' : 'Resend the email'}
        </button>
        {resent && (
          <span
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '10.5px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Resent
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <div
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '10.5px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '12px',
          }}
        >
          While you wait
        </div>

        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.55,
            color: 'var(--secondary)',
            maxWidth: '42ch',
            margin: '0 0 20px',
          }}
        >
          This same audit runs deeper in the room. Bring it to your full board and work through
          the hard answers together.
        </p>

        <a
          href={BOARD_AUDIT_URL}
          style={{
            display: 'inline-block',
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--cream)',
            background: 'none',
            border: '1px solid var(--muted)',
            borderRadius: '999px',
            padding: '14px 28px',
            textDecoration: 'none',
            transition: 'border-color 0.18s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--amber)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--muted)')}
        >
          Book the live board audit
        </a>
      </div>
    </div>
  );
}
