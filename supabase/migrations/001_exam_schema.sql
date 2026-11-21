-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam sessions table
CREATE TABLE IF NOT EXISTS exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  status TEXT NOT NULL DEFAULT 'registered', -- registered | started | submitted
  current_question_index INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  score INTEGER,
  correct_count INTEGER,
  incorrect_count INTEGER,
  unanswered_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assigned questions table
CREATE TABLE IF NOT EXISTS assigned_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES exam_sessions(id),
  question_index INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  section TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  UNIQUE(session_id, question_index)
);

-- Student answers table
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES exam_sessions(id),
  question_index INTEGER NOT NULL,
  selected_answer TEXT,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_index)
);

-- App settings table (for exam_enabled toggle etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default exam_enabled = false
INSERT INTO app_settings (key, value) VALUES ('exam_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

-- Add missing columns to exam_sessions if upgrading existing DB
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS correct_count INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS incorrect_count INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS unanswered_count INTEGER;
