export type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data: {
    email_id?: string;
    bounce?: { message?: string };
    click?: { link?: string };
  };
};

export type TrackedRowSnapshot = {
  status: string;
  open_count: number;
  click_count: number;
  opened_at: string | null;
  clicked_at: string | null;
};

// Coarse ordering so an out-of-order or duplicate webhook delivery can't
// regress `status` backwards (e.g. a delayed 'sent' arriving after 'bounced').
// The granular *_at/*_count fields are recorded regardless of rank — they're
// an append-only event history, not a single current state.
export const STATUS_RANK: Record<string, number> = {
  scheduled: 0,
  sent: 1,
  delivered: 2,
  bounced: 3,
  complained: 3,
  canceled: 4,
  failed: 4,
};

export function computeEventUpdate(
  row: TrackedRowSnapshot,
  event: ResendWebhookEvent,
  eventAt: string
): Record<string, unknown> {
  const update: Record<string, unknown> = {
    last_event_type: event.type,
    last_event_at: eventAt,
  };

  const setStatus = (status: string, rank: number) => {
    if (rank >= (STATUS_RANK[row.status] ?? 0)) update.status = status;
  };

  switch (event.type) {
    case 'email.sent':
      setStatus('sent', 1);
      break;
    case 'email.delivered':
      update.delivered_at = eventAt;
      setStatus('delivered', 2);
      break;
    case 'email.delivered_delayed':
      // Informational only — last_event_type/last_event_at above already record it.
      break;
    case 'email.bounced':
      update.bounced_at = eventAt;
      update.bounce_reason = event.data.bounce?.message ?? null;
      setStatus('bounced', 3);
      break;
    case 'email.complained':
      update.complained_at = eventAt;
      setStatus('complained', 3);
      break;
    case 'email.opened':
      update.open_count = (row.open_count ?? 0) + 1;
      if (!row.opened_at) update.opened_at = eventAt;
      break;
    case 'email.clicked':
      update.click_count = (row.click_count ?? 0) + 1;
      if (!row.clicked_at) update.clicked_at = eventAt;
      break;
    default:
      break;
  }

  return update;
}
