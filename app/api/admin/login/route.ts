import { NextResponse } from 'next/server';
import { validateAdmin, signAdminToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    const admin = validateAdmin(email, password);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const token = signAdminToken({ email: admin.email, name: admin.name });
    return NextResponse.json({ token, name: admin.name, email: admin.email });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
