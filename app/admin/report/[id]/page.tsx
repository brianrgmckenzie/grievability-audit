export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminClient, type Submission, type SequenceEmail } from '@/lib/supabase-admin';
import ResultsScreen from '@/components/audit/ResultsScreen';
import { LanguageProvider } from '@/context/LanguageContext';
import type { Answers } from '@/lib/scoring';
import DeleteButton from '@/components/admin/DeleteButton';
import SequenceEmailPanel from '@/components/admin/SequenceEmailPanel';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = getAdminClient();
  const [{ data, error }, { data: sequenceData }] = await Promise.all([
    client.from('grievability_submissions').select('*').eq('id', id).single(),
    client.from('grievability_sequence_emails').select('*').eq('submission_id', id),
  ]);

  if (error || !data) notFound();

  const s = data as Submission;
  const sequenceEmails = (sequenceData ?? []) as SequenceEmail[];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Admin bar */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/admin"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
          >
            ← Dashboard
          </Link>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)' }}>
            #{s.seq}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {s.unsubscribed_at && (
            <span
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#C97A6A',
                border: '1px solid #C97A6A',
                borderRadius: '4px',
                padding: '2px 8px',
              }}
            >
              Unsubscribed{' '}
              {new Date(s.unsubscribed_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
            </span>
          )}
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {s.email}
          </span>
          <DeleteButton id={s.id} redirectTo="/admin" />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ paddingTop: '32px' }}>
          <SequenceEmailPanel emails={sequenceEmails} />
        </div>
        <LanguageProvider>
          <ResultsScreen
            name={s.name}
            org={s.org}
            answers={s.answers as Answers}
            narrative={s.narrative}
          />
        </LanguageProvider>
      </div>
    </div>
  );
}
