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
      <GrievabilityAudit testMode />
    </div>
  );
}
