export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminClient, type Submission } from '@/lib/supabase-admin';
import ResultsScreen from '@/components/audit/ResultsScreen';
import { LanguageProvider } from '@/context/LanguageContext';
import type { Answers } from '@/lib/scoring';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await getAdminClient()
    .from('grievability_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) notFound();

  const s = data as Submission;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Admin bar */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          href="/admin"
          style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
        >
          ← Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {s.email}
          </span>
          <DeleteButton id={s.id} redirectTo="/admin" />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
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
