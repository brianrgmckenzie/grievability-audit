'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { sendGAEvent } from '@next/third-parties/google';
import { allScores, finalScore, radarPoints, radarSpokes } from '@/lib/scoring';
import type { Answers } from '@/lib/scoring';
import { useTranslation } from '@/context/LanguageContext';
import type { BandT } from '@/i18n/types';

interface Props {
  name: string;
  org: string;
  answers: Answers;
  narrative: string;
}

const BOARD_AUDIT_URL = process.env.NEXT_PUBLIC_BOARD_AUDIT_URL ?? '#';
const DIM_NUMS = ['01', '02', '03', '04', '05'];

function getBandT(score: number, bands: { loadBearing: BandT; heldInAffection: BandT; quietlyAtRisk: BandT; disappearing: BandT }): BandT {
  if (score >= 82) return bands.loadBearing;
  if (score >= 60) return bands.heldInAffection;
  if (score >= 38) return bands.quietlyAtRisk;
  return bands.disappearing;
}

export default function ResultsScreen({ name, org, answers, narrative }: Props) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    sendGAEvent('event', 'audit_completed', {
      score: finalScore(answers),
      band: getBandT(finalScore(answers), t.bands).name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function downloadPDF() {
    setDownloading(true);
    setPdfError(false);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, org, answers, narrative }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${org.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-grievability-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setPdfError(true);
    } finally {
      setDownloading(false);
    }
  }
  const scores = allScores(answers);
  const score = finalScore(answers);
  const bandInfo = getBandT(score, t.bands);

  const breakdownData = scores.map((s, i) => ({
    label: `${DIM_NUMS[i]} ${t.dims[i].name}`,
    score: s,
    rec: t.recs[i],
    isCore: i === 2,
  }));

  const lowestData = [...scores.map((s, i) => ({ i, s }))]
    .sort((a, b) => a.s - b.s)
    .slice(0, 2)
    .map(({ i, s }) => ({
      label: `${DIM_NUMS[i]} ${t.dims[i].name}`,
      score: s,
      rec: t.recs[i],
    }));

  const grid100 = radarPoints(answers, 1);
  const grid66 = radarPoints(answers, 0.66);
  const grid33 = radarPoints(answers, 0.33);
  const dataPoints = radarPoints(answers);
  const spokes = radarSpokes();

  const firstName = name.split(' ')[0];

  return (
    <div className="gv-fade" style={{ padding: '52px 0 80px' }}>

      {/* Identity header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '10px' }}>
          {org}{t.results.reportLabel}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(34px, 10vw, 52px)', lineHeight: 1.04, letterSpacing: '-0.015em', color: 'var(--cream)', margin: '0' }}>
          {firstName}{t.results.headline}
        </h1>
      </div>

      {/* Score + radar card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px 28px 24px', marginBottom: '28px' }}>

        <svg viewBox="-72 -52 304 264" style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '20px' }}>
          <polygon points={grid100} fill="none" stroke="var(--border)" strokeWidth="1" />
          <polygon points={grid66} fill="none" stroke="var(--border)" strokeWidth="0.75" />
          <polygon points={grid33} fill="none" stroke="var(--border)" strokeWidth="0.75" />
          {spokes.map((sp, i) => (
            <line key={i} x1="80" y1="80" x2={sp.x} y2={sp.y} stroke="var(--border)" strokeWidth="0.75" />
          ))}
          {t.dims.map((d, i) => {
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            const labelR = 80;
            const x = 80 + labelR * Math.cos(ang);
            const y = 80 + labelR * Math.sin(ang);
            const anchor = x < 75 ? 'end' : x > 85 ? 'start' : 'middle';
            const dy = y < 40 ? -5 : y > 100 ? 11 : 4;
            return (
              <text
                key={i}
                x={x}
                y={y + dy}
                textAnchor={anchor}
                fontSize="9"
                fill="var(--muted)"
                fontFamily="'Roboto', sans-serif"
                letterSpacing="0.06em"
              >
                {d.name.toUpperCase()}
              </text>
            );
          })}
          <polygon points={dataPoints} fill="var(--amber)" fillOpacity="0.22" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
          {scores.map((s, i) => {
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            const r = 62 * (s / 100);
            const cx = 80 + r * Math.cos(ang);
            const cy = 80 + r * Math.sin(ang);
            return <circle key={i} cx={cx} cy={cy} r="3.5" fill="var(--gold)" />;
          })}
        </svg>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div>
            <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '4px' }}>
              {t.results.scoreLabel}
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '64px', lineHeight: 1, color: 'var(--cream)' }}>
              {score}<span style={{ fontSize: '22px', color: 'var(--muted)', fontWeight: 400 }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '20px', color: 'var(--gold)', marginBottom: '6px' }}>
              {bandInfo.name}
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--secondary)', margin: 0 }}>
              {bandInfo.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Fable narrative */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
          {t.results.interpretation}
        </div>
        <div style={{ borderLeft: '2px solid var(--amber)', paddingLeft: '20px' }}>
          {narrative.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} style={{ fontSize: '18px', lineHeight: 1.75, color: 'var(--cream)', margin: i > 0 ? '18px 0 0' : '0' }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Dimension breakdown */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
          {t.results.fullBreakdown}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {breakdownData.map((bd, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
                  {bd.label}
                  {bd.isCore && (
                    <span style={{ color: 'var(--muted)', marginLeft: '8px', fontSize: '9px' }}>{t.results.weightedDouble}</span>
                  )}
                </span>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', color: 'var(--amber)', fontWeight: 500 }}>
                  {bd.score}<span style={{ color: 'var(--muted)', fontSize: '11px' }}>/100</span>
                </span>
              </div>
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ height: '100%', width: `${bd.score}%`, background: 'var(--amber)', borderRadius: '999px', transition: 'width 0.6s ease' }} />
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--secondary)', margin: 0 }}>
                {bd.rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two priorities */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
          {t.results.twoThings}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {lowestData.map((lo, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '17px', color: 'var(--cream)' }}>
                  {lo.label}
                </span>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', color: 'var(--amber)' }}>
                  {lo.score} / 100
                </span>
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--secondary)', margin: 0 }}>
                {lo.rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
          {t.results.deeper}
        </div>
        <p style={{ fontSize: '16px', lineHeight: 1.55, color: 'var(--secondary)', maxWidth: '42ch', margin: '0 0 20px' }}>
          {t.results.ctaBody.replace('{org}', org)}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
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
            {t.results.ctaButton}
          </a>
          <button
            onClick={downloadPDF}
            disabled={downloading}
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
              cursor: downloading ? 'default' : 'pointer',
              transition: 'border-color 0.18s ease',
              opacity: downloading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!downloading) e.currentTarget.style.borderColor = 'var(--amber)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; }}
          >
            {downloading ? 'Generating PDF…' : 'Download PDF report'}
          </button>
        </div>

        {pdfError && (
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.08em', color: '#C97A6A', margin: '10px 0 0' }}>
            PDF generation failed. Try again in a moment.
          </p>
        )}

        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 0' }}>
          {t.results.emailNote}
        </p>
      </div>

      {/* Report footer */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '28px', marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <a
          href="https://www.reframeconcepts.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', opacity: 0.6, transition: 'opacity 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        >
          <Image
            src="/reframe-logo.png"
            alt="Reframe Concepts"
            width={119}
            height={40}
            style={{ height: '40px', width: 'auto', display: 'block' }}
          />
        </a>
        <a
          href="/privacy"
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '10.5px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
            opacity: 0.7,
          }}
        >
          {t.gate.privacyLink}
        </a>
      </div>
    </div>
  );
}
