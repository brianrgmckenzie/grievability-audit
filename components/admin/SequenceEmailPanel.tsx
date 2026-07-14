'use client';

import { useState, useTransition } from 'react';
import type { SequenceEmail } from '@/lib/supabase-admin';
import { regenerateSequenceEmail, updateSequenceEmail } from '@/app/admin/actions';

const ANGLES: Record<number, string> = {
  1: 'The pattern in your lowest score',
  2: 'Case study: Trinity United',
  3: 'The board audit pitch',
  4: 'Industry stat',
  5: 'The close',
};

function formatSendAt(sendAt: string, status: SequenceEmail['status']): string {
  const target = new Date(sendAt);
  const now = new Date();

  if (status === 'canceled') return 'Canceled';
  if (status === 'failed') return 'Failed to schedule';
  if (target <= now) return `Sent ${target.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}`;

  const days = Math.round((target.getTime() - now.getTime()) / 86_400_000);
  if (days <= 0) return `Sends today, ${target.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' })}`;
  if (days === 1) return 'Sends tomorrow';
  return `Sends in ${days} days`;
}

function Row({ email }: { email: SequenceEmail }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [subjectDraft, setSubjectDraft] = useState(email.subject);
  const [bodyDraft, setBodyDraft] = useState(email.body);

  const labelStyle = {
    fontFamily: "'Roboto', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  };

  const btnStyle = {
    ...labelStyle,
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '5px 10px',
    background: 'none',
    cursor: isPending ? 'wait' : 'pointer',
    color: 'var(--muted)',
  };

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ ...labelStyle, color: 'var(--amber)' }}>Step {email.step}</span>
            <span style={{ ...labelStyle, color: 'var(--muted)' }}>{ANGLES[email.step]}</span>
          </div>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: 'var(--cream)' }}>
            {email.subject}
          </div>
          <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
            {formatSendAt(email.send_at, email.status)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button type="button" style={btnStyle} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Hide' : 'View'}
          </button>
          <button
            type="button"
            disabled={isPending || email.status === 'canceled'}
            style={btnStyle}
            onClick={() => {
              setEditing((v) => !v);
              setExpanded(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            disabled={isPending || email.status === 'canceled'}
            style={{ ...btnStyle, color: 'var(--amber)' }}
            onClick={() => {
              startTransition(async () => {
                await regenerateSequenceEmail(email.id, email.submission_id);
              });
            }}
          >
            {isPending ? 'Working…' : 'Reset to default'}
          </button>
        </div>
      </div>

      {expanded && !editing && (
        <div
          style={{
            marginTop: '12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '14px 16px',
            fontSize: '13.5px',
            lineHeight: 1.6,
            color: 'var(--secondary)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {email.body}
        </div>
      )}

      {expanded && editing && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            value={subjectDraft}
            onChange={(e) => setSubjectDraft(e.target.value)}
            placeholder="Subject"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '14px',
              color: 'var(--cream)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <textarea
            value={bodyDraft}
            onChange={(e) => setBodyDraft(e.target.value)}
            rows={8}
            placeholder="Body (separate paragraphs with a blank line)"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: 'var(--secondary)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 12px',
              resize: 'vertical' as const,
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={isPending}
              style={{ ...btnStyle, color: 'var(--amber)', borderColor: 'var(--amber)' }}
              onClick={() => {
                startTransition(async () => {
                  await updateSequenceEmail(email.id, email.submission_id, subjectDraft, bodyDraft);
                  setEditing(false);
                });
              }}
            >
              {isPending ? 'Saving…' : 'Save & reschedule'}
            </button>
            <button
              type="button"
              disabled={isPending}
              style={btnStyle}
              onClick={() => {
                setSubjectDraft(email.subject);
                setBodyDraft(email.body);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SequenceEmailPanel({ emails }: { emails: SequenceEmail[] }) {
  const sorted = [...emails].sort((a, b) => a.step - b.step);

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px' }}>
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: '4px',
        }}
      >
        Nurture sequence
      </div>
      {sorted.length === 0 ? (
        <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: 'var(--secondary)', padding: '12px 0' }}>
          No sequence scheduled for this submission.
        </div>
      ) : (
        sorted.map((email) => <Row key={email.id} email={email} />)
      )}
    </div>
  );
}
