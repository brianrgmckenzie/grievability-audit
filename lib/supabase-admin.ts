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

export type EmailTrackingStatus =
  | 'scheduled'
  | 'sent'
  | 'delivered'
  | 'bounced'
  | 'complained'
  | 'canceled'
  | 'failed';

export interface EmailTrackingFields {
  delivered_at: string | null;
  opened_at: string | null;
  open_count: number;
  clicked_at: string | null;
  click_count: number;
  bounced_at: string | null;
  bounce_reason: string | null;
  complained_at: string | null;
  last_event_type: string | null;
  last_event_at: string | null;
}

export interface SequenceEmail extends EmailTrackingFields {
  id: string;
  submission_id: string;
  step: number;
  day_offset: number;
  send_at: string;
  subject: string;
  body: string;
  resend_email_id: string | null;
  status: EmailTrackingStatus;
  used_fallback: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImmediateEmail extends EmailTrackingFields {
  id: string;
  submission_id: string;
  email_type: 'results' | 'lead';
  resend_email_id: string | null;
  status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'failed';
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
