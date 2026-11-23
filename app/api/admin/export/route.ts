import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdminToken } from '@/lib/auth';
import { getMemePerformance } from '@/lib/performance';
import * as XLSX from 'xlsx';

export interface StudentRow {
  sno: number;
  session_id: string;
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
  meme_message: string;
  submission_time: string;
}

export interface DashboardStats {
  totalRegistered: number;
  totalSubmissions: number;
  completedExams: number;
  avgMarks: string;
  highestMarks: number;
  lowestMarks: number;
}

async function fetchResults(): Promise<{ rows: StudentRow[]; stats: DashboardStats }> {
  // Fetch registered students count
  const { data: allStudents } = await supabaseAdmin
    .from('students')
    .select('id');
  const totalRegistered = Array.isArray(allStudents) ? allStudents.length : 0;

  // Fetch submitted exam sessions
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

  const rows: StudentRow[] = (submissions ?? []).map((row: any, idx: number) => {
    const marks = Number(row.score ?? 0);
    const total = 50;
    const correct = Number(row.correct_count ?? 0);
    const incorrect = Number(row.incorrect_count ?? 0);
    const unanswered = Number(row.unanswered_count ?? (total - correct - incorrect));
    const percentage = ((marks / 50) * 100).toFixed(2) + '%';
    const meme = getMemePerformance(marks);

    return {
      sno: idx + 1,
      session_id: row.id || '',
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
      status: meme.label,
      meme_message: meme.message,
      submission_time: row.submitted_at
        ? new Date(row.submitted_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : '',
    };
  });

  const totalSubmissions = rows.length;
  const completedExams = rows.length;
  const marksList = rows.map((r) => r.marks);
  const avgMarks = marksList.length > 0
    ? (marksList.reduce((acc, m) => acc + m, 0) / marksList.length).toFixed(1)
    : '0';
  const highestMarks = marksList.length > 0 ? Math.max(...marksList) : 0;
  const lowestMarks = marksList.length > 0 ? Math.min(...marksList) : 0;

  return {
    rows,
    stats: {
      totalRegistered: Math.max(totalRegistered, totalSubmissions),
      totalSubmissions,
      completedExams,
      avgMarks,
      highestMarks,
      lowestMarks,
    },
  };
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
    'Performance Category',
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
    const { rows, stats } = await fetchResults();

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

    if (format === 'excel' || format === 'xlsx') {
      const sheetData = rows.map((r) => ({
        'S.No': r.sno,
        'Student Name': r.student_name,
        'Department': r.department,
        'Roll Number': r.roll_number,
        'Email': r.email,
        'Total Questions': r.total_questions,
        'Correct': r.correct,
        'Incorrect': r.incorrect,
        'Unanswered': r.unanswered,
        'Marks / 50': r.marks,
        'Percentage': r.percentage,
        'Performance Category': r.status,
        'Submission Time (IST)': r.submission_time,
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'EduNet Exam Results');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="edunet-results.xlsx"',
        },
      });
    }

    return NextResponse.json({ data: rows, stats }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
