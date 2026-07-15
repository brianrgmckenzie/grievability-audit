import { createClient } from '@supabase/supabase-js';

export interface Submission {
  id: string;
  seq: number;
  created_at: string;
  name: string;
  email: string;
  org: string;
  city: string | null;
  province: string | null;
  answers: Record<string, number>;
  final_score: number;
  band_name: string;
  narrative: string;
  lang: string;
  unsubscribe_token: string;
  unsubscribed_at: string | null;
}

export interface SequenceEmail {
  id: string;
  submission_id: string;
  step: number;
  day_offset: number;
  send_at: string;
  subject: string;
  body: string;
  resend_email_id: string | null;
  status: 'scheduled' | 'sent' | 'canceled' | 'failed';
  used_fallback: boolean;
  created_at: string;
  updated_at: string;
}

export function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
