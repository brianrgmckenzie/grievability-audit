'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSubmission } from '@/app/admin/actions';

export default function DeleteButton({ id, redirectTo }: { id: string; redirectTo?: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const baseStyle = {
    fontFamily: "'Roboto', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '5px 10px',
    background: 'none',
    cursor: 'pointer',
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        style={{ ...baseStyle, color: '#C97A6A' }}
      >
        Delete
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await deleteSubmission(id);
            if (redirectTo) router.push(redirectTo);
          });
        }}
        style={{ ...baseStyle, color: '#C97A6A', borderColor: '#C97A6A', cursor: isPending ? 'wait' : 'pointer' }}
      >
        {isPending ? 'Deleting…' : 'Confirm'}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setConfirming(false)}
        style={{ ...baseStyle, color: 'var(--muted)' }}
      >
        Cancel
      </button>
    </div>
  );
}
