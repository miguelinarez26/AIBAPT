import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import ProfileClient from './ProfileClient';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  // Validar sesión del usuario usando el SSR client
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${validLang}/login?redirectTo=/${validLang}/dashboard/perfil`);
  }

  // Usar service role para fetch de perfil (bypass RLS)
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Fetch perfil del usuario
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const isProfileMissing = !profile || ((profileError as any) && ((profileError as any).code === 'PGRST116' || (profileError as any).code === '406'));

  // Si el perfil no se encuentra (PGRST116 o 406) o es null, redirigir a onboarding
  if (isProfileMissing) {
    await supabase.auth.signOut();
    redirect(`/${validLang}/login?error=profile_missing`);
  } else if (profileError) {
    console.error('Error crítico consultando el perfil en perfil:', profileError);
    await supabase.auth.signOut();
    redirect(`/${validLang}/login?error=critical_profile_error`);
  } else if (!profile || !profile.first_name || !profile.last_name || profile.first_name.trim() === '' || profile.last_name.trim() === '') {
    redirect(`/${validLang}/onboarding`);
  }

  return <ProfileClient profile={profile} lang={validLang as 'es' | 'pt'} />;
}
