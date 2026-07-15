-- Run this in your Supabase SQL editor (same project as Document-Reviewer)
-- Adds a stable, human-readable sequence number to submissions for admin reference.

alter table grievability_submissions
  add column seq bigserial;
