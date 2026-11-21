import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  const { data } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'exam_enabled')
    .maybeSingle();
  // Default to true so students can take the exam immediately unless explicitly disabled
  const enabled = data?.value !== undefined ? data.value === 'true' : true;
  return NextResponse.json({ enabled });
}

export async function POST(request: NextRequest) {
  try {
    verifyAdminToken(request);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { enabled } = await request.json();
  await supabaseAdmin
    .from('app_settings')
    .upsert({ key: 'exam_enabled', value: String(enabled) });
  return NextResponse.json({ enabled });
}
