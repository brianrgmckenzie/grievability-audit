'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';
import { getAdminClient } from '@/lib/supabase-admin';
import { verifySessionToken } from '@/lib/admin-auth';
import { rescheduleSlot } from '@/lib/schedule-sequence';

async function requireAdmin() {
  const password = process.env.ADMIN_PASSWORD;
  const session = (await cookies()).get('admin_session');

  if (!password || !session || !(await verifySessionToken(session.value, password))) {
    throw new Error('Unauthorized');
  }
}

export async function deleteSubmission(id: string) {
  await requireAdmin();

  const { error } = await getAdminClient()
    .from('grievability_submissions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath(`/admin/report/${id}`);
}

export async function regenerateSequenceEmail(sequenceRowId: string, submissionId: string) {
  await requireAdmin();

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  await rescheduleSlot(anthropic, sequenceRowId, { regenerate: true });

  revalidatePath(`/admin/report/${submissionId}`);
}

export async function updateSequenceEmail(
  sequenceRowId: string,
  submissionId: string,
  subject: string,
  body: string
) {
  await requireAdmin();

  if (!subject.trim() || !body.trim()) throw new Error('Subject and body are required.');

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  await rescheduleSlot(anthropic, sequenceRowId, {
    regenerate: false,
    subject: subject.trim(),
    body: body.trim(),
  });

  revalidatePath(`/admin/report/${submissionId}`);
}
