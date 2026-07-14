import { Resend } from 'resend';
import { render } from '@react-email/components';
import { getAdminClient } from '@/lib/supabase-admin';
import { allScores, lowestTwoIndices, type Answers } from '@/lib/scoring';
import { SEQUENCE_SLOTS, type SequenceContext, type BodyLine } from '@/lib/sequence';
import NurtureEmail from '@/emails/NurtureEmail';
import { FROM_EMAIL, INTERNAL_EMAIL, SITE_URL } from '@/lib/email';

function computeSendAt(dayOffset: number, baseline: Date, fast: boolean): Date {
  // Test mode: same relative spacing, minutes instead of days, so a 21-day
  // sequence lands in full within ~21 minutes.
  if (fast) {
    return new Date(baseline.getTime() + dayOffset * 60 * 1000);
  }
  const target = new Date(baseline);
  target.setUTCDate(target.getUTCDate() + dayOffset);
  target.setUTCHours(16, 0, 0, 0);
  return target;
}

function flattenLines(lines: BodyLine[], trailingLink?: string): string {
  const parts = lines.map((l) => (l.href ? `${l.text}${l.text ? ' ' : ''}${l.href}` : l.text));
  if (trailingLink) parts.push(trailingLink);
  return parts.join('\n\n');
}

function parseBodyText(body: string): BodyLine[] {
  return body
    .split('\n\n')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

async function renderAndSend(
  resend: Resend,
  recipientEmail: string,
  unsubscribeToken: string,
  subject: string,
  firstName: string,
  lines: BodyLine[],
  trailingLink: string | undefined,
  sendAt: Date
) {
  const html = await render(
    NurtureEmail({
      firstName,
      lines,
      trailingLink,
      unsubscribeUrl: `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`,
      recipientEmail,
    })
  );

  return resend.emails.send({
    from: FROM_EMAIL,
    to: recipientEmail,
    replyTo: INTERNAL_EMAIL,
    subject,
    html,
    scheduledAt: sendAt.toISOString(),
  });
}

export async function scheduleFullSequence(
  submissionId: string,
  recipientEmail: string,
  unsubscribeToken: string,
  ctx: SequenceContext,
  fast = false
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseline = new Date();
  const firstName = ctx.name.split(' ')[0];

  const results = await Promise.all(
    SEQUENCE_SLOTS.map(async (slot) => {
      const lines = slot.body(ctx);
      const trailingLink = slot.trailingLink?.(ctx);
      const subject = slot.subject(ctx);
      const sendAt = computeSendAt(slot.dayOffset, baseline, fast);

      const { data, error } = await renderAndSend(
        resend,
        recipientEmail,
        unsubscribeToken,
        subject,
        firstName,
        lines,
        trailingLink,
        sendAt
      );
      if (error) console.error(`[sequence] send failed for step ${slot.step}:`, error);

      return {
        submission_id: submissionId,
        step: slot.step,
        day_offset: slot.dayOffset,
        send_at: sendAt.toISOString(),
        subject,
        body: flattenLines(lines, trailingLink),
        resend_email_id: data?.id ?? null,
        status: error ? ('failed' as const) : ('scheduled' as const),
        used_fallback: false,
      };
    })
  );

  const { error } = await getAdminClient().from('grievability_sequence_emails').insert(results);
  if (error) console.error('[sequence] failed to persist sequence rows:', error);
}

export async function rescheduleSlot(
  sequenceRowId: string,
  opts: { regenerate: boolean; subject?: string; body?: string }
) {
  const client = getAdminClient();

  const { data: row, error: rowErr } = await client
    .from('grievability_sequence_emails')
    .select('*')
    .eq('id', sequenceRowId)
    .single();
  if (rowErr || !row) throw new Error('Sequence email not found');

  const { data: submission, error: subErr } = await client
    .from('grievability_submissions')
    .select('*')
    .eq('id', row.submission_id)
    .single();
  if (subErr || !submission) throw new Error('Submission not found');

  const slot = SEQUENCE_SLOTS.find((s) => s.step === row.step);
  if (!slot) throw new Error('Unknown sequence step');

  const scores = allScores(submission.answers as Answers);
  const ctx: SequenceContext = {
    name: submission.name,
    org: submission.org,
    scores,
    finalScore: submission.final_score,
    bandName: submission.band_name,
    lowestIdx: lowestTwoIndices(scores),
    lang: submission.lang ?? 'en',
  };
  const firstName = ctx.name.split(' ')[0];

  let subject: string;
  let lines: BodyLine[];
  let trailingLink: string | undefined;

  if (opts.subject !== undefined && opts.body !== undefined) {
    subject = opts.subject;
    lines = parseBodyText(opts.body);
    trailingLink = undefined;
  } else if (opts.regenerate) {
    subject = slot.subject(ctx);
    lines = slot.body(ctx);
    trailingLink = slot.trailingLink?.(ctx);
  } else {
    throw new Error('Nothing to update');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (row.resend_email_id) {
    const { error: cancelErr } = await resend.emails.cancel(row.resend_email_id);
    if (cancelErr) console.error('[sequence] cancel failed (may have already sent):', cancelErr);
  }

  const { data, error } = await renderAndSend(
    resend,
    submission.email,
    submission.unsubscribe_token,
    subject,
    firstName,
    lines,
    trailingLink,
    new Date(row.send_at)
  );
  if (error) console.error(`[sequence] resend failed for step ${row.step}:`, error);

  const { error: updateErr } = await client
    .from('grievability_sequence_emails')
    .update({
      subject,
      body: flattenLines(lines, trailingLink),
      resend_email_id: data?.id ?? null,
      status: error ? 'failed' : 'scheduled',
      used_fallback: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sequenceRowId);
  if (updateErr) console.error('[sequence] failed to update row after reschedule:', updateErr);
}
