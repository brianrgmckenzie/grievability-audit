'use client';

import { useTranslation } from '@/context/LanguageContext';
import { type Answers } from '@/lib/scoring';

interface Props {
  dimIndex: number;
  answers: Answers;
  onAnswer: (dimIndex: number, stmtIndex: number, value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ScoringScreen({ dimIndex, answers, onAnswer, onNext, onBack }: Props) {
  const { t } = useTranslation();
  const dim = t.dims[dimIndex];
  const dimNum = ['01', '02', '03', '04', '05'][dimIndex];
  const isCore = dimIndex === 2;
  const canAdvance = [0, 1, 2].every((s) => answers[`${dimIndex}-${s}`]);
  const isLast = dimIndex === 4;

  return (
    <div
      className="gv-fade-fast flex flex-1 flex-col"
      style={{ padding: '36px 0 40px' }}
      key={`d${dimIndex}`}
    >
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--amber)',
          marginBottom: '14px',
        }}
      >
        {dimNum} · {dim.name} · {dim.tie}
      </div>

      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 500,
          fontSize: 'clamp(30px, 8vw, 42px)',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          margin: '0 0 12px',
          color: 'var(--cream)',
        }}
      >
        {dim.name}
      </h2>

      <p
        style={{
          fontSize: '15.5px',
          lineHeight: 1.55,
          color: 'var(--secondary)',
          margin: '0 0 6px',
        }}
      >
        {dim.desc}
      </p>

      <div style={{ height: isCore ? 'auto' : '30px', marginBottom: '30px' }}>
        {isCore && (
          <div
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            {t.scoring.coreDimension}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {dim.statements.map((text, sIdx) => {
          const cur = answers[`${dimIndex}-${sIdx}`];
          return (
            <div
              key={sIdx}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '22px 20px 20px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.45,
                  color: 'var(--cream)',
                  margin: '0 0 20px',
                }}
              >
                {text}
              </p>

              <div
                role="radiogroup"
                aria-label={text}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {[1, 2, 3, 4, 5].map((v) => {
                  const sel = cur === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      aria-label={v === 1 ? `1 of 5, ${t.scoring.disagree}` : v === 5 ? `5 of 5, ${t.scoring.agree}` : `${v} of 5`}
                      onClick={() => onAnswer(dimIndex, sIdx, v)}
                      style={{
                        width: '44px',
                        height: '44px',
                        flexShrink: 0,
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '13px',
                        transition: 'all 0.15s ease',
                        border: sel ? '1px solid var(--gold)' : '1px solid var(--border)',
                        background: sel ? 'var(--amber)' : 'transparent',
                        color: sel ? 'var(--ink)' : 'var(--muted)',
                        fontWeight: sel ? 600 : 400,
                        transform: sel ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}
                >
                  {t.scoring.disagree}
                </span>
                <span
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}
                >
                  {t.scoring.agree}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '34px' }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--secondary)',
            background: 'none',
            border: 'none',
            padding: '14px 6px',
            cursor: 'pointer',
          }}
        >
          {t.scoring.back}
        </button>

        <button
          onClick={onNext}
          disabled={!canAdvance}
          style={{
            flex: 1,
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '999px',
            padding: '16px 28px',
            border: 'none',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            background: canAdvance ? 'var(--gold)' : 'var(--card)',
            color: canAdvance ? 'var(--ink)' : '#5E6A6C',
            transition: 'all 0.18s ease',
          }}
        >
          {isLast ? t.scoring.seeResult : t.scoring.next}
        </button>
      </div>
    </div>
  );
}
