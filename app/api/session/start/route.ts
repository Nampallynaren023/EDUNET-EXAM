import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    // Validate session exists
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .select('id, status')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error('Session lookup error:', sessionError);
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    if (session.status === 'started') {
      return NextResponse.json({ success: true, totalQuestions: 50, message: 'Exam in progress.' });
    }

    if (session.status !== 'registered') {
      return NextResponse.json(
        { error: `Cannot start exam. Current status: ${session.status}.` },
        { status: 409 }
      );
    }

    // Update status to started
    const { error: updateError } = await supabaseAdmin
      .from('exam_sessions')
      .update({ status: 'started', started_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Session update error:', updateError);
      return NextResponse.json({ error: 'Failed to start session.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, totalQuestions: 50 });
  } catch (err) {
    console.error('Session start error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
