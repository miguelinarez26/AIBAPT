import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { Database, Profile, Application, AccreditationType } from '@/types/database';
import DashboardClient from './DashboardClient';

// Tipo para la aplicación con el nombre del tipo de acreditación unido
export type ApplicationWithType = Application & {
  accreditation_type_name: string;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  // Crear cliente Supabase SSR que lee las cookies de sesión
  const supabase = await createServerSupabaseClient();

  // Validar sesión del usuario contra los servidores de Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Si no hay sesión válida, redirigir a login
  if (userError || !user) {
    redirect(`/${validLang}/login?redirectTo=/${validLang}/dashboard`);
  }

  const userId = user.id;

  // Para la carga del dashboard usamos el service role para garantizar acceso
  // al perfil y las aplicaciones (bypass de RLS para joins complejos)
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Fetch perfil del usuario
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Lógica segura para determinar si falta el perfil vs. un error real
  const isProfileMissing = !profileData && profileError && (profileError.code === 'PGRST116' || profileError.code === '406');

  const profile = profileData as Profile | null;

  if (isProfileMissing) {
    // Si el perfil no existe físicamente en la BD, es una anomalía de seguridad.
    // Forzamos el cierre de sesión y redirigimos.
    await supabase.auth.signOut();
    redirect(`/${validLang}/login?error=profile_missing`);
  } else if (profileError) {
    // Si es otro tipo de error (ej. timeout de BD), lo registramos pero redirigimos a login
    // para evitar un bucle de /dashboard -> /onboarding infinito.
    console.error('Error crítico consultando el perfil:', profileError);
    await supabase.auth.signOut();
    redirect(`/${validLang}/login?error=critical_profile_error`);
  } else if (
    !profile ||
    !profile.first_name ||
    !profile.last_name ||
    profile.first_name.trim() === '' ||
    profile.last_name.trim() === ''
  ) {
    // Failsafe o perfil incompleto (nombre o apellido vacíos)
    redirect(`/${validLang}/onboarding`);
  }

  // Fetch aplicaciones del usuario con el nombre del tipo de acreditación
  const { data: rawApplicationsData } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  const rawApplications = (rawApplicationsData || []) as Application[];

  // Fetch tipos de acreditación para unir nombres
  const { data: accTypesData } = await supabaseAdmin
    .from('accreditation_types')
    .select('*');
  const accreditationTypes = (accTypesData || []) as AccreditationType[];

  // Unir manualmente el nombre del tipo a cada aplicación
  const typesMap = new Map(
    accreditationTypes.map(t => [t.id, t.name])
  );

  const applications: ApplicationWithType[] = rawApplications.map(app => ({
    ...app,
    accreditation_type_name: typesMap.get(app.type_id) || 'Desconocido',
  }));

  return (
    <DashboardClient
      profile={profile}
      applications={applications}
      lang={validLang as 'es' | 'pt'}
    />
  );
}
