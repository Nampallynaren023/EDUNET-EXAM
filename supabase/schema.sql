-- EduNet Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- TABLE: admin_users
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: exam_config
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO exam_config (is_active) VALUES (TRUE) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- TABLE: students
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: exam_sessions
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered'
    CHECK (status IN ('registered','started','completed','auto_submitted')),
  current_question_index INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  submission_reason TEXT,
  total_questions INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: assigned_questions
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assigned_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  section TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,          -- [{id, text}, ...]
  correct_answer TEXT NOT NULL,    -- option id (never sent to client)
  UNIQUE (session_id, question_index)
);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: student_answers
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  selected_answer TEXT,            -- null = unanswered
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, question_index)
);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: exam_results
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL UNIQUE REFERENCES exam_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL DEFAULT 50,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  incorrect_answers INTEGER NOT NULL DEFAULT 0,
  unanswered INTEGER NOT NULL DEFAULT 0,
  marks_obtained INTEGER NOT NULL DEFAULT 0,
  max_marks INTEGER NOT NULL DEFAULT 50,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  behavioral_score INTEGER DEFAULT 0,
  situational_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  career_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: warning_logs
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS warning_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  warning_number INTEGER NOT NULL,
  reason TEXT NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE warning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_config ENABLE ROW LEVEL SECURITY;

-- Allow service role (server-side API) full access — public access is blocked
-- Students interact only via API routes (server-side) which use the service role key

-- Public (anon) cannot read anything sensitive
CREATE POLICY "No public read on students" ON students FOR SELECT USING (FALSE);
CREATE POLICY "No public read on exam_sessions" ON exam_sessions FOR SELECT USING (FALSE);
CREATE POLICY "No public read on assigned_questions" ON assigned_questions FOR SELECT USING (FALSE);
CREATE POLICY "No public read on student_answers" ON student_answers FOR SELECT USING (FALSE);
CREATE POLICY "No public read on exam_results" ON exam_results FOR SELECT USING (FALSE);
CREATE POLICY "No public read on warning_logs" ON warning_logs FOR SELECT USING (FALSE);
CREATE POLICY "No public read on admin_users" ON admin_users FOR SELECT USING (FALSE);

-- ─────────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_assigned_session_id ON assigned_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON student_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON exam_results(student_id);
