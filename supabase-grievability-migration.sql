-- Run this in your Supabase SQL editor (same project as Document-Reviewer)

CREATE TABLE grievability_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  org TEXT NOT NULL,
  answers JSONB NOT NULL,
  final_score INTEGER NOT NULL,
  band_name TEXT NOT NULL,
  narrative TEXT NOT NULL
);

-- Block public access; service role key (used server-side) bypasses RLS
ALTER TABLE grievability_submissions ENABLE ROW LEVEL SECURITY;
