-- Adds delivery/engagement tracking driven by Resend webhook events
-- (email.sent, email.delivered, email.delivered_delayed, email.bounced,
-- email.complained, email.opened, email.clicked).

alter table grievability_sequence_emails
  drop constraint grievability_sequence_emails_status_check,
  add constraint grievability_sequence_emails_status_check
    check (status in ('scheduled', 'sent', 'delivered', 'bounced', 'complained', 'canceled', 'failed')),
  add column delivered_at timestamptz,
  add column opened_at timestamptz,
  add column open_count integer not null default 0,
  add column clicked_at timestamptz,
  add column click_count integer not null default 0,
  add column bounced_at timestamptz,
  add column bounce_reason text,
  add column complained_at timestamptz,
  add column last_event_type text,
  add column last_event_at timestamptz;

create index grievability_sequence_emails_resend_email_id_idx
  on grievability_sequence_emails (resend_email_id)
  where resend_email_id is not null;

-- The two immediate sends (scored-results email + internal lead notification)
-- had no persisted row at all before this — nothing to correlate webhook
-- events against. This table gives them the same tracking as sequence steps.
create table grievability_immediate_emails (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid not null references grievability_submissions(id) on delete cascade,
  email_type text not null check (email_type in ('results', 'lead')),
  resend_email_id text,
  status text not null default 'sent'
    check (status in ('sent', 'delivered', 'bounced', 'complained', 'failed')),
  delivered_at timestamptz,
  opened_at timestamptz,
  open_count integer not null default 0,
  clicked_at timestamptz,
  click_count integer not null default 0,
  bounced_at timestamptz,
  bounce_reason text,
  complained_at timestamptz,
  last_event_type text,
  last_event_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table grievability_immediate_emails enable row level security;
create policy "Service role manages grievability_immediate_emails" on grievability_immediate_emails using (false);

create index grievability_immediate_emails_resend_email_id_idx
  on grievability_immediate_emails (resend_email_id)
  where resend_email_id is not null;

create index grievability_immediate_emails_submission_id_idx
  on grievability_immediate_emails (submission_id);
