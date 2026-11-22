import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const SECTION_NAMES: Record<string, string> = {
  behavioral: 'BEHAVIORAL ASSESSMENT',
  situational: 'SITUATION-BASED ASSESSMENT',
  technical: 'TECHNICAL & PROFESSIONAL',
  career: 'CAREER READINESS',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const indexParam = searchParams.get('index');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    if (indexParam === null || indexParam === '') {
      return NextResponse.json({ error: 'index is required.' }, { status: 400 });
    }

    const index = parseInt(indexParam, 10);
    if (isNaN(index) || index < 0 || index > 49) {
      return NextResponse.json({ error: 'index must be a number between 0 and 49.' }, { status: 400 });
    }

    // Validate session and get student info
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .select('id, status, current_question_index, student_id, students(full_name, roll_number)')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error('Session lookup error:', sessionError);
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    if (session.status === 'registered') {
      // Auto-transition to started so mobile network race conditions don't block question 0
      await supabaseAdmin
        .from('exam_sessions')
        .update({ status: 'started', started_at: new Date().toISOString() })
        .eq('id', sessionId);
      session.status = 'started';
    } else if (session.status === 'submitted') {
      return NextResponse.json(
        { error: 'Exam already submitted.', status: 'submitted' },
        { status: 403 }
      );
    } else if (session.status !== 'started') {
      return NextResponse.json(
        { error: `Exam is not in progress. Current status: ${session.status}.` },
        { status: 403 }
      );
    }

    // Fetch the question (strip correct_answer)
    const { data: question, error: questionError } = await supabaseAdmin
      .from('assigned_questions')
      .select('question_index, question_id, section, topic, question_text, options')
      .eq('session_id', sessionId)
      .eq('question_index', index)
      .maybeSingle();

    if (questionError) {
      console.error('Question lookup error:', questionError);
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (!question) {
      return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
    }

    // Fetch any previously saved answer for this question
    const { data: savedAns } = await supabaseAdmin
      .from('student_answers')
      .select('selected_answer')
      .eq('session_id', sessionId)
      .eq('question_index', index)
      .maybeSingle();

    // Extract student info (Supabase join returns nested object or array)
    const rawStudent = session.students as unknown;
    const studentData = (Array.isArray(rawStudent) ? rawStudent[0] : rawStudent) as { full_name: string; roll_number: string } | null;

    return NextResponse.json({
      questionIndex: question.question_index,
      totalQuestions: 50,
      section: question.section,
      sectionName: SECTION_NAMES[question.section] ?? question.section,
      topic: question.topic,
      questionId: question.question_id,
      questionText: question.question_text,
      options: question.options,
      savedAnswer: savedAns?.selected_answer ?? null,
      studentName: studentData?.full_name ?? '',
      rollNumber: studentData?.roll_number ?? '',
      currentQuestionIndex: session.current_question_index ?? index,
    });
  } catch (err) {
    console.error('Question route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
