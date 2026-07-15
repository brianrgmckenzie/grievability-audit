import Link from 'next/link';
import GrievabilityAudit from '@/components/audit/GrievabilityAudit';

export default function TestSequencePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '12px 32px' }}>
        <Link
          href="/admin"
          style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
        >
          ← Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: '560px', margin: '20px auto 0', padding: '0 24px' }}>
        <div
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '12px',
            lineHeight: 1.6,
            color: 'var(--secondary)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '14px 18px',
          }}
        >
          Fill this out with your own email to see the full sequence. The report sends
          instantly, then the day-offsets compress to minutes: Step 1 &asymp; 1 min, Step 2 &asymp; 4 min,
          Step 3 &asymp; 8 min, Step 4 &asymp; 14 min, Step 5 &asymp; 21 min. Whole sequence lands within
          about 21 minutes.
        </div>
      </div>
      <GrievabilityAudit testMode />
    </div>
  );
}
