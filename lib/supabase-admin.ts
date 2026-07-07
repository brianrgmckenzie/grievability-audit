import { createClient } from '@supabase/supabase-js';

export interface Submission {
  id: string;
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
}

export function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
