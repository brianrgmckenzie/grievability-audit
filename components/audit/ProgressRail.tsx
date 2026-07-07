'use client';

interface Props {
  dimIndex: number;
  totalDims: number;
}

export default function ProgressRail({ dimIndex, totalDims }: Props) {
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
            <div
              key={i}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '999px',
                background: i <= dimIndex ? 'var(--amber)' : 'var(--border)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
