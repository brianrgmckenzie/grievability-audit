-- Fix: rls_enabled_no_policy (INFO) advisory, 08 Jul 2026.
-- grievability_submissions is intentionally service-role-only (public audit
-- form submits via the server-side admin client). Explicit deny-all documents
-- that the lack of a policy is intentional rather than an oversight.

create policy "Service role manages grievability_submissions"
  on grievability_submissions using (false);
