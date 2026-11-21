import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateExamForStudent } from '@/lib/questions';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, department, rollNumber, email } = body;

    // Validate required fields
    if (!fullName || !department || !rollNumber || !email) {
      return NextResponse.json(
        { error: 'All fields are required: fullName, department, rollNumber, email.' },
        { status: 400 }
      );
    }

    if (typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (typeof rollNumber !== 'string' || rollNumber.trim().length < 1) {
      return NextResponse.json({ error: 'Roll number is required.' }, { status: 400 });
    }

    // Check if exam is enabled
    const { data: setting } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'exam_enabled')
      .maybeSingle();
    const isExamEnabled = setting?.value !== undefined ? setting.value === 'true' : true;
    if (!isExamEnabled) {
      return NextResponse.json({ error: 'Examination is currently not available. Please wait for the administrator to enable it.' }, { status: 403 });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanDept = department.trim();

    // Check for duplicate roll number
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('roll_number', cleanRoll)
      .maybeSingle();

    if (lookupError) {
      console.error('Roll number lookup error:', lookupError);
      return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Roll number already registered. Each student can attempt the exam only once.' },
        { status: 409 }
      );
    }

    // Insert student
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        full_name: cleanName,
        department: cleanDept,
        roll_number: cleanRoll,
        email: cleanEmail,
      })
      .select('id, full_name')
      .single();

    if (studentError || !student) {
      console.error('Student insert error:', studentError);
      return NextResponse.json({ error: 'Failed to register student. Please try again.' }, { status: 500 });
    }

    // Generate 50 questions
    const questions = generateExamForStudent();

    // Create exam session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('exam_sessions')
      .insert({
        student_id: student.id,
        status: 'registered',
        current_question_index: 0,
        warning_count: 0,
      })
      .select('id')
      .single();

    if (sessionError || !session) {
      console.error('Session insert error:', sessionError);
      // Rollback student
      await supabaseAdmin.from('students').delete().eq('id', student.id);
      return NextResponse.json({ error: 'Failed to create exam session. Please try again.' }, { status: 500 });
    }

    // Insert assigned questions
    const assignedRows = questions.map((q, index) => ({
      session_id: session.id,
      question_index: index,
      question_id: q.id,
      section: q.section,
      topic: q.topic,
      question_text: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
    }));

    const { error: questionsError } = await supabaseAdmin
      .from('assigned_questions')
      .insert(assignedRows);

    if (questionsError) {
      console.error('Questions insert error:', questionsError);
      await supabaseAdmin.from('exam_sessions').delete().eq('id', session.id);
      await supabaseAdmin.from('students').delete().eq('id', student.id);
      return NextResponse.json({ error: 'Failed to assign questions. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(
      { sessionId: session.id, studentName: student.full_name },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
