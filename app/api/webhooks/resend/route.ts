import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { getAdminClient } from '@/lib/supabase-admin';
import { computeEventUpdate, type ResendWebhookEvent } from '@/lib/email-tracking';

type TrackedTable = 'grievability_sequence_emails' | 'grievability_immediate_emails';

const TRACKED_TABLES: TrackedTable[] = ['grievability_sequence_emails', 'grievability_immediate_emails'];

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

  const update = {
    ...computeEventUpdate(row, event, eventAt),
    updated_at: new Date().toISOString(),
  };

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
