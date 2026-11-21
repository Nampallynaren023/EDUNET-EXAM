import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdminToken } from '@/lib/auth';

interface StudentRow {
  sno: number;
  student_name: string;
  department: string;
  roll_number: string;
  email: string;
  total_questions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  marks: number;
  percentage: string;
  status: string;
  submission_time: string;
}

async function fetchResults(): Promise<StudentRow[]> {
  const { data: submissions, error } = await supabaseAdmin
    .from('exam_sessions')
    .select(`
      id,
      submitted_at,
      correct_count,
      incorrect_count,
      unanswered_count,
      score,
      students (
        full_name,
        department,
        roll_number,
        email
      )
    `)
    .eq('status', 'submitted')
    .order('submitted_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (submissions ?? []).map((row: any, idx: number) => {
    const marks = row.score ?? 0;
    const total = 50;
    const correct = row.correct_count ?? 0;
    const incorrect = row.incorrect_count ?? 0;
    const unanswered = row.unanswered_count ?? (total - correct - incorrect);
    const percentage = ((marks / 50) * 100).toFixed(2) + '%';
    const status =
      marks >= 45 ? 'Outstanding' :
      marks >= 40 ? 'Excellent' :
      marks >= 35 ? 'Very Good' :
      marks >= 30 ? 'Good' :
      marks >= 20 ? 'Average' :
      marks >= 10 ? 'Below Average' :
      'Needs Improvement';

    return {
      sno: idx + 1,
      student_name: row.students?.full_name ?? '',
      department: row.students?.department ?? '',
      roll_number: row.students?.roll_number ?? '',
      email: row.students?.email ?? '',
      total_questions: total,
      correct,
      incorrect,
      unanswered,
      marks,
      percentage,
      status,
      submission_time: row.submitted_at
        ? new Date(row.submitted_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : '',
    };
  });
}

function toCSV(rows: StudentRow[]): string {
  const headers = [
    'S.No',
    'Student Name',
    'Department',
    'Roll Number',
    'Email',
    'Total Questions',
    'Correct',
    'Incorrect',
    'Unanswered',
    'Marks/50',
    'Percentage',
    'Status',
    'Submission Time',
  ];

  const escape = (v: string | number) => {
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        r.sno,
        r.student_name,
        r.department,
        r.roll_number,
        r.email,
        r.total_questions,
        r.correct,
        r.incorrect,
        r.unanswered,
        r.marks,
        r.percentage,
        r.status,
        r.submission_time,
      ]
        .map(escape)
        .join(',')
    ),
  ];

  return lines.join('\n');
}

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') ?? 'json';

  try {
    const rows = await fetchResults();

    if (format === 'csv') {
      const csv = toCSV(rows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="edunet-results.csv"',
        },
      });
    }

    // json and pdf both return JSON (PDF is generated client-side)
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
