-- Run this in your Supabase SQL editor (same project as Document-Reviewer)
-- Adds support for the 6-email nurture sequence and CASL-compliant unsubscribe.

alter table grievability_submissions
  add column lang text not null default 'en',
  add column unsubscribe_token uuid not null default gen_random_uuid(),
  add column unsubscribed_at timestamptz;

create unique index grievability_submissions_unsubscribe_token_idx
  on grievability_submissions (unsubscribe_token);

create table grievability_sequence_emails (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid not null references grievability_submissions(id) on delete cascade,
  step smallint not null,
  day_offset smallint not null,
  send_at timestamptz not null,
  subject text not null,
  body text not null,
  resend_email_id text,
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'canceled', 'failed')),
  used_fallback boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Block public access; service role key (used server-side) bypasses RLS
alter table grievability_sequence_emails enable row level security;

create policy "Service role manages grievability_sequence_emails"
  on grievability_sequence_emails using (false);
