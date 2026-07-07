'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/supabase-admin';
import { verifySessionToken } from '@/lib/admin-auth';

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
