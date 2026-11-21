import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get('rollNumber');

    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required.' }, { status: 400 });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();

    // Find student
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, full_name, roll_number, department, email')
      .eq('roll_number', cleanRoll)
      .maybeSingle();

    if (studentError) {
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (!student) {
      return NextResponse.json({ error: 'No student found with this Roll Number.' }, { status: 404 });
    }

    // Find their exam session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .select('id, status, score, correct_count, incorrect_count, unanswered_count, submitted_at')
      .eq('student_id', student.id)
      .maybeSingle();

    if (sessionError) {
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (!session || session.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Examination has not been submitted yet for this Roll Number.' },
        { status: 404 }
      );
    }

    const score = session.score ?? 0;
    const total = 50;
    const percentage = ((score / total) * 100).toFixed(1);

    const getPerformanceLabel = (s: number) => {
      if (s >= 45) return 'Outstanding';
      if (s >= 40) return 'Excellent';
      if (s >= 35) return 'Very Good';
      if (s >= 30) return 'Good';
      if (s >= 20) return 'Average';
      if (s >= 10) return 'Below Average';
      return 'Needs Improvement';
    };

    return NextResponse.json({
      studentName: student.full_name,
      rollNumber: student.roll_number,
      department: student.department,
      score,
      total,
      percentage,
      performance: getPerformanceLabel(score),
      correct: session.correct_count ?? 0,
      incorrect: session.incorrect_count ?? 0,
      unanswered: session.unanswered_count ?? (total - (session.correct_count ?? 0) - (session.incorrect_count ?? 0)),
      submittedAt: session.submitted_at,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
