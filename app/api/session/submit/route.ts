import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .select('id, status, student_id, started_at, score, correct_count, incorrect_count, unanswered_count')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    if (session.status === 'submitted') {
      // Already submitted - return existing result
      return NextResponse.json({
        alreadySubmitted: true,
        score: session.score ?? 0,
        correct: session.correct_count ?? 0,
        incorrect: session.incorrect_count ?? 0,
        unanswered: session.unanswered_count ?? 0,
        total: 50,
      });
    }

    if (session.status !== 'started') {
      return NextResponse.json({ error: `Cannot submit. Status: ${session.status}` }, { status: 409 });
    }

    // Fetch all assigned questions with answers
    const { data: assigned, error: aqError } = await supabaseAdmin
      .from('assigned_questions')
      .select('question_index, correct_answer')
      .eq('session_id', sessionId);

    if (aqError || !assigned) {
      return NextResponse.json({ error: 'Failed to fetch questions.' }, { status: 500 });
    }

    const { data: answers, error: ansError } = await supabaseAdmin
      .from('student_answers')
      .select('question_index, selected_answer')
      .eq('session_id', sessionId);

    if (ansError) {
      return NextResponse.json({ error: 'Failed to fetch answers.' }, { status: 500 });
    }

    const answerMap: Record<number, string | null> = {};
    (answers ?? []).forEach((a: any) => {
      answerMap[a.question_index] = a.selected_answer;
    });

    let correct = 0, incorrect = 0, unanswered = 0;
    (assigned ?? []).forEach((q: any) => {
      const given = answerMap[q.question_index];
      if (given === null || given === undefined) {
        unanswered++;
      } else if (given === q.correct_answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = correct; // 1 mark per correct answer, out of 50

    const { error: updateError } = await supabaseAdmin
      .from('exam_sessions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        score,
        correct_count: correct,
        incorrect_count: incorrect,
        unanswered_count: unanswered,
      })
      .eq('id', sessionId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to submit exam.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, score, correct, incorrect, unanswered, total: 50 });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
