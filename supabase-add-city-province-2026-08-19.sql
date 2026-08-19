-- Reconciliation only: city/province have been live in production since
-- before this repo tracked schema changes as files (added directly via the
-- Supabase dashboard), but no migration file ever captured them. app code
-- (app/api/submit/route.ts, app/admin/page.tsx, lib/supabase-admin.ts) has
-- depended on both columns existing all along.
--
-- IF NOT EXISTS makes this safe to run against the existing production
-- database (a no-op there) while still making a from-scratch Supabase
-- project built from these files match reality.

alter table grievability_submissions
  add column if not exists city text,
  add column if not exists province text;
