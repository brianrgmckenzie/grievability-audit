import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { getAdminClient } from '@/lib/supabase-admin';

type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data: {
    email_id?: string;
    bounce?: { message?: string };
    click?: { link?: string };
  };
};

type TrackedTable = 'grievability_sequence_emails' | 'grievability_immediate_emails';

const TRACKED_TABLES: TrackedTable[] = ['grievability_sequence_emails', 'grievability_immediate_emails'];

// Coarse ordering so an out-of-order or duplicate webhook delivery can't
// regress `status` backwards (e.g. a delayed 'sent' arriving after 'bounced').
// The granular *_at/*_count fields below are recorded regardless of rank —
// they're an append-only event history, not a single current state.
const STATUS_RANK: Record<string, number> = {
  scheduled: 0,
  sent: 1,
  delivered: 2,
  bounced: 3,
  complained: 3,
  canceled: 4,
  failed: 4,
};

async function applyEvent(
  client: ReturnType<typeof getAdminClient>,
  table: TrackedTable,
  emailId: string,
  event: ResendWebhookEvent,
  eventAt: string
): Promise<boolean> {
  const { data: row, error } = await client
    .from(table)
    .select('id, status, open_count, click_count, opened_at, clicked_at')
    .eq('resend_email_id', emailId)
    .maybeSingle();

  if (error) {
    console.error(`[resend-webhook] lookup failed for ${table}:`, error);
    return false;
  }
  if (!row) return false;

  const update: Record<string, unknown> = {
    last_event_type: event.type,
    last_event_at: eventAt,
    updated_at: new Date().toISOString(),
  };

  const setStatus = (status: string, rank: number) => {
    if (rank >= (STATUS_RANK[row.status as string] ?? 0)) update.status = status;
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

  const { error: updateErr } = await client.from(table).update(update).eq('id', row.id);
  if (updateErr) console.error(`[resend-webhook] update failed for ${table}/${row.id}:`, updateErr);

  return true;
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const payload = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  let event: ResendWebhookEvent;
  try {
    event = new Webhook(secret).verify(payload, svixHeaders) as ResendWebhookEvent;
  } catch (err) {
    console.error('[resend-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const emailId = event.data?.email_id;
  if (!emailId) return NextResponse.json({ received: true });

  const eventAt = event.created_at ?? new Date().toISOString();
  const client = getAdminClient();

  // The email could be a sequence step or one of the two immediate sends —
  // try each table's resend_email_id until one matches.
  for (const table of TRACKED_TABLES) {
    if (await applyEvent(client, table, emailId, event, eventAt)) break;
  }

  return NextResponse.json({ received: true });
}
