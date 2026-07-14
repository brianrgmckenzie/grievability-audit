import { Resend } from 'resend';
import { render } from '@react-email/components';
import Anthropic from '@anthropic-ai/sdk';
import { getAdminClient } from '@/lib/supabase-admin';
import { allScores, band, lowestTwoIndices, type Answers } from '@/lib/scoring';
import {
  SEQUENCE_SLOTS,
  generateSequenceEmail,
  type SequenceContext,
} from '@/lib/sequence';
import NurtureEmail from '@/emails/NurtureEmail';
import { FROM_EMAIL, INTERNAL_EMAIL, BOARD_AUDIT_URL, SITE_URL } from '@/lib/email';

const CTA_LABEL = 'Book the board audit';

function computeSendAt(dayOffset: number, baseline: Date): Date {
  if (dayOffset === 0) {
    return new Date(baseline.getTime() + 6 * 60 * 60 * 1000);
  }
  const target = new Date(baseline);
  target.setUTCDate(target.getUTCDate() + dayOffset);
  target.setUTCHours(16, 0, 0, 0);
  return target;
}

async function renderAndSend(
  resend: Resend,
  recipientEmail: string,
  unsubscribeToken: string,
  subject: string,
  body: string[],
  org: string,
  sendAt: Date
) {
  const html = await render(
    NurtureEmail({
      org,
      paragraphs: body,
      ctaUrl: BOARD_AUDIT_URL,
      ctaLabel: CTA_LABEL,
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
  anthropic: Anthropic,
  submissionId: string,
  recipientEmail: string,
  unsubscribeToken: string,
  ctx: SequenceContext
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseline = new Date();

  const results = await Promise.all(
    SEQUENCE_SLOTS.map(async (slot) => {
      const generated = await generateSequenceEmail(anthropic, slot, ctx);
      const usedFallback = generated === null;
      const body = generated ?? slot.fallbackBody(ctx);
      const subject = slot.subject(ctx);
      const sendAt = computeSendAt(slot.dayOffset, baseline);

      const { data, error } = await renderAndSend(
        resend,
        recipientEmail,
        unsubscribeToken,
        subject,
        body,
        ctx.org,
        sendAt
      );
      if (error) console.error(`[sequence] send failed for step ${slot.step}:`, error);

      return {
        submission_id: submissionId,
        step: slot.step,
        day_offset: slot.dayOffset,
        send_at: sendAt.toISOString(),
        subject,
        body: body.join('\n\n'),
        resend_email_id: data?.id ?? null,
        status: error ? ('failed' as const) : ('scheduled' as const),
        used_fallback: usedFallback,
      };
    })
  );

  const { error } = await getAdminClient().from('grievability_sequence_emails').insert(results);
  if (error) console.error('[sequence] failed to persist sequence rows:', error);
}

export async function rescheduleSlot(
  anthropic: Anthropic,
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
    answers: submission.answers as Answers,
    scores,
    finalScore: submission.final_score,
    bandName: submission.band_name,
    bandDesc: band(submission.final_score).desc,
    lowestIdx: lowestTwoIndices(scores),
    lang: submission.lang ?? 'en',
  };

  let subject: string;
  let body: string[];
  let usedFallback = false;

  if (opts.subject !== undefined && opts.body !== undefined) {
    subject = opts.subject;
    body = opts.body.split('\n\n').map((p) => p.trim()).filter(Boolean);
  } else if (opts.regenerate) {
    const generated = await generateSequenceEmail(anthropic, slot, ctx);
    usedFallback = generated === null;
    body = generated ?? slot.fallbackBody(ctx);
    subject = slot.subject(ctx);
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
    body,
    ctx.org,
    new Date(row.send_at)
  );
  if (error) console.error(`[sequence] resend failed for step ${row.step}:`, error);

  const { error: updateErr } = await client
    .from('grievability_sequence_emails')
    .update({
      subject,
      body: body.join('\n\n'),
      resend_email_id: data?.id ?? null,
      status: error ? 'failed' : 'scheduled',
      used_fallback: usedFallback,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sequenceRowId);
  if (updateErr) console.error('[sequence] failed to update row after reschedule:', updateErr);
}
