import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('proximos_eventos').select('*').limit(1);
  const { data: cols } = await supabaseAdmin.rpc('get_tables_or_something'); // Or just raw sql, but we can't do raw sql easily.
  // Actually I can just query courses_accredited
  const { data: data2 } = await supabaseAdmin.from('courses_accredited').select('*').limit(1);
  return NextResponse.json({ eventos: data, courses: data2 });
}
