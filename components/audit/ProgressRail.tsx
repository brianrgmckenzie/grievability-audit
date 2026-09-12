'use client';

import type { Answers } from '@/lib/scoring';

interface Props {
  dimIndex: number;
  totalDims: number;
  answers: Answers;
}

export default function ProgressRail({ dimIndex, totalDims, answers }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        width: '100%',
        background: 'rgba(30,24,18,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '16px 24px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--secondary)',
            }}
          >
            Dimension {dimIndex + 1} of {totalDims}
          </span>
          <span
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            The Grievability Audit
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: totalDims }, (_, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div
                style={{
                  height: '3px',
                  borderRadius: '999px',
                  background: i <= dimIndex ? 'var(--amber)' : 'var(--border)',
                  transition: 'background 0.3s ease',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '6px', height: '16px' }}>
                {/* Only a record of completed dimensions -- the one currently
                    being answered stays empty until the user moves past it,
                    so this never needs to update live while they're clicking. */}
                {[0, 1, 2].map((sIdx) => {
                  const val = i < dimIndex ? answers[`${i}-${sIdx}`] : undefined;
                  return (
                    <div
                      key={sIdx}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '999px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: val ? '1px solid var(--gold)' : '1px solid var(--border)',
                        background: val ? 'var(--amber)' : 'transparent',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '9px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                      }}
                    >
                      {val ?? ''}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
