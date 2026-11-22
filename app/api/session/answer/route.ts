import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, questionIndex, selectedAnswer } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    if (questionIndex === undefined || questionIndex === null) {
      return NextResponse.json({ error: 'questionIndex is required.' }, { status: 400 });
    }

    const index = parseInt(String(questionIndex), 10);
    if (isNaN(index) || index < 0 || index > 49) {
      return NextResponse.json({ error: 'questionIndex must be between 0 and 49.' }, { status: 400 });
    }

    // Validate session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .select('id, status, current_question_index')
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
      session.status = 'started';
      await supabaseAdmin
        .from('exam_sessions')
        .update({ status: 'started', started_at: new Date().toISOString() })
        .eq('id', sessionId);
    } else if (session.status !== 'started') {
      return NextResponse.json(
        { error: `Exam is not in progress. Current status: ${session.status}.` },
        { status: 403 }
      );
    }

    // Upsert student answer (allow null for unanswered/timed-out)
    const { error: answerError } = await supabaseAdmin
      .from('student_answers')
      .upsert(
        {
          session_id: sessionId,
          question_index: index,
          selected_answer: selectedAnswer ?? null,
        },
        { onConflict: 'session_id,question_index' }
      );

    if (answerError) {
      console.error('Answer upsert error:', answerError);
      return NextResponse.json({ error: 'Failed to save answer.' }, { status: 500 });
    }

    // Advance current_question_index (never regress progress)
    const nextIndex = Math.max(session.current_question_index ?? 0, index + 1);
    const { error: updateError } = await supabaseAdmin
      .from('exam_sessions')
      .update({ current_question_index: nextIndex })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Session update error:', updateError);
      // Not fatal — answer was saved; warn but proceed
    }

    return NextResponse.json({ success: true, nextQuestionIndex: nextIndex });
  } catch (err) {
    console.error('Answer route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
