import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAdminClient } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const redirectUrl = new URL('/unsubscribed', req.url);

  if (!token) {
    redirectUrl.searchParams.set('status', 'invalid');
    return NextResponse.redirect(redirectUrl);
  }

  const client = getAdminClient();

  const { data: submission, error } = await client
    .from('grievability_submissions')
    .select('id, unsubscribed_at')
    .eq('unsubscribe_token', token)
    .single();

  if (error || !submission) {
    redirectUrl.searchParams.set('status', 'invalid');
    return NextResponse.redirect(redirectUrl);
  }

  if (!submission.unsubscribed_at) {
    await client
      .from('grievability_submissions')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('id', submission.id);

    const { data: pending } = await client
      .from('grievability_sequence_emails')
      .select('id, resend_email_id')
      .eq('submission_id', submission.id)
      .eq('status', 'scheduled');

    if (pending && pending.length > 0) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await Promise.all(
        pending.map(async (row) => {
          if (!row.resend_email_id) return;
          const { error: cancelErr } = await resend.emails.cancel(row.resend_email_id);
          if (cancelErr) {
            console.error(`[unsubscribe] cancel failed for ${row.resend_email_id}:`, cancelErr);
            return;
          }
          await client
            .from('grievability_sequence_emails')
            .update({ status: 'canceled' })
            .eq('id', row.id);
        })
      );
    }
  }

  redirectUrl.searchParams.delete('status');
  return NextResponse.redirect(redirectUrl);
}
