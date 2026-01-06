-- Linear Survey Database Schema
-- Run this in your Supabase SQL Editor (or any PostgreSQL database)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  questions JSONB NOT NULL DEFAULT '[]',
  groups JSONB NOT NULL DEFAULT '[]',
  linear_config JSONB DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  linear_issue_id TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings table (app-level configuration)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);

-- Row Level Security (RLS)
-- For now, we enable RLS but allow all operations
-- You can customize these policies based on your auth requirements

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (customize for auth)
CREATE POLICY "Allow all survey operations" ON surveys
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all response operations" ON responses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all settings operations" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- Comments
COMMENT ON TABLE surveys IS 'Survey definitions with questions, groups, and Linear configuration';
COMMENT ON TABLE responses IS 'Survey responses submitted by users';
COMMENT ON TABLE settings IS 'App-level settings like Linear API key';
COMMENT ON COLUMN surveys.questions IS 'JSONB array of question objects';
COMMENT ON COLUMN surveys.groups IS 'JSONB array of question groups for multi-step forms';
COMMENT ON COLUMN surveys.linear_config IS 'Linear integration configuration (team_id, project_id, etc.)';
COMMENT ON COLUMN surveys.status IS 'Survey status: active or archived';
COMMENT ON COLUMN responses.answers IS 'JSONB object mapping question IDs to answer values';
COMMENT ON COLUMN responses.linear_issue_id IS 'Linear issue ID if response has been pushed';
COMMENT ON COLUMN settings.key IS 'Setting key (e.g., linear_api_key)';
COMMENT ON COLUMN settings.value IS 'Setting value as JSONB';

-- Migration helper: Add columns to existing tables if they don't exist
-- Run these if upgrading from an earlier version

DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'surveys' AND column_name = 'status') THEN
    ALTER TABLE surveys ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;
  
  -- Add groups column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'surveys' AND column_name = 'groups') THEN
    ALTER TABLE surveys ADD COLUMN groups JSONB NOT NULL DEFAULT '[]';
  END IF;
END $$;
