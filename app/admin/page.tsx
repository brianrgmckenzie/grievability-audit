export const dynamic = 'force-dynamic';

import { getAdminClient, type Submission } from '@/lib/supabase-admin';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';

function bandColor(band: string): string {
  if (band.toLowerCase().includes('load')) return '#7EBF8E';
  if (band.toLowerCase().includes('affection')) return '#F5B040';
  if (band.toLowerCase().includes('risk')) return '#E0943A';
  return '#C97A6A';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const BANDS = ['Load bearing', 'Held in affection', 'Quietly at risk', 'Disappearing in plain sight'];
const BAND_COLORS = ['#7EBF8E', '#F5B040', '#E0943A', '#C97A6A'];
const DIM_NAMES = ['01 Attunement', '02 Relevance', '03 Indispensability', '04 Story', '05 Durability'];

function dimScore(answers: Record<string, number>, d: number): number {
  const vals = [0, 1, 2].map((s) => answers[`${d}-${s}`] ?? 0);
  if (vals.some((v) => v === 0)) return 0;
  return Math.round(((vals.reduce((a, b) => a + b, 0) - 3) / 12) * 100);
}

export default async function AdminDashboard() {
  const client = getAdminClient();
  const [{ data, error }, { data: analyticsRaw }] = await Promise.all([
    client
      .from('grievability_submissions')
      .select('id, created_at, name, email, org, city, province, final_score, band_name')
      .order('created_at', { ascending: false }),
    client
      .from('grievability_submissions')
      .select('final_score, band_name, answers, province'),
  ]);

  const submissions = (data ?? []) as Pick<Submission, 'id' | 'created_at' | 'name' | 'email' | 'org' | 'city' | 'province' | 'final_score' | 'band_name'>[];
  const allRows = (analyticsRaw ?? []) as Pick<Submission, 'final_score' | 'band_name' | 'answers' | 'province'>[];

  const total = allRows.length;
  const avgScore = total > 0 ? Math.round(allRows.reduce((sum, r) => sum + r.final_score, 0) / total) : 0;

  const bandCounts = BANDS.map((b) => allRows.filter((r) => r.band_name === b).length);

  const dimAvgs = [0, 1, 2, 3, 4].map((d) => {
    const scores = allRows.map((r) => dimScore(r.answers as Record<string, number>, d)).filter((s) => s > 0);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  });

  const regionCounts: Record<string, number> = {};
  allRows.forEach((r) => {
    if (r.province) regionCounts[r.province] = (regionCounts[r.province] ?? 0) + 1;
  });
  const topRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top bar */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber)' }}>
            Reframe Concepts
          </span>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginLeft: '12px' }}>
            / Grievability Audit
          </span>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Sign out
          </button>
        </form>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '36px', color: 'var(--cream)', margin: '0 0 28px' }}>
          Overview
        </h1>

        {total > 0 && (
          <>
            {/* Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total submissions', value: total },
                { label: 'Average score', value: `${avgScore} / 100` },
                { label: 'Top band', value: BANDS[bandCounts.indexOf(Math.max(...bandCounts))] },
              ].map((m) => (
                <div key={m.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                  <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>{m.label}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '24px', color: 'var(--cream)' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Band breakdown + Dimension averages side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: topRegions.length > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: '16px', marginBottom: '36px' }}>

              {/* Bands */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Score bands</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {BANDS.map((b, i) => (
                    <div key={b}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: BAND_COLORS[i] }}>{b}</span>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'var(--muted)' }}>{bandCounts[i]}</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${total > 0 ? (bandCounts[i] / total) * 100 : 0}%`, background: BAND_COLORS[i], borderRadius: '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimension averages */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Dimension averages</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {DIM_NAMES.map((name, i) => (
                    <div key={name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'var(--secondary)' }}>{name}</span>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'var(--amber)' }}>{dimAvgs[i]}</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${dimAvgs[i]}%`, background: 'var(--amber)', borderRadius: '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top regions */}
              {topRegions.length > 0 && (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                  <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Top regions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {topRegions.map(([region, count]) => (
                      <div key={region} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px', color: 'var(--secondary)' }}>{region}</span>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px', color: 'var(--muted)', background: 'var(--bg)', borderRadius: '6px', padding: '2px 8px' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '24px', color: 'var(--cream)', margin: 0 }}>
            Submissions
          </h2>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', color: 'var(--muted)' }}>
            {submissions.length} total
          </span>
        </div>

        {error && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px', color: 'var(--secondary)' }}>
            Could not load submissions. Check that NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
          </div>
        )}

        {!error && submissions.length === 0 && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center', color: 'var(--secondary)', fontFamily: "'Roboto', sans-serif", fontSize: '14px' }}>
            No submissions yet.
          </div>
        )}

        {submissions.length > 0 && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 90px 160px 200px', padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              {['Name', 'Organization', 'Email', 'Score', 'Band', ''].map((h) => (
                <span key={h} style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {submissions.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 90px 160px 200px',
                  padding: '16px 24px',
                  borderBottom: i < submissions.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', fontWeight: 500, color: 'var(--cream)' }}>{s.name}</div>
                  <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{formatDate(s.created_at)}</div>
                </div>
                <div style={{ paddingRight: '16px', overflow: 'hidden' }}>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: 'var(--secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.org}</div>
                  {(s.city || s.province) && (
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                      {[s.city, s.province].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px', color: 'var(--secondary)', paddingRight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 500, color: 'var(--gold)' }}>{s.final_score}</div>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: bandColor(s.band_name), letterSpacing: '0.05em' }}>{s.band_name}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <Link
                    href={`/admin/report/${s.id}`}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--amber)',
                      textDecoration: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      display: 'inline-block',
                    }}
                  >
                    View
                  </Link>
                  <DeleteButton id={s.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
