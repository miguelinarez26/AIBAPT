import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { Database, Application } from '@/types/database';
import AdminClient from './AdminClient';

export type ApplicationWithDetails = Application & {
  accreditation_type_name: string;
  applicant_name: string;
  applicant_email: string;
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${validLang}/login?redirectTo=/${validLang}/admin`);
  }

  const userId = user.id;

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: profileData, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || profileData?.role !== 'admin') {
    // Si no es admin, lo expulsamos al dashboard
    redirect(`/${validLang}/dashboard`);
  }

  // Fetch all applications
  const { data: rawApplicationsData } = await supabaseAdmin
    .from('applications')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });
    
  const rawApplications = (rawApplicationsData || []) as Record<string, unknown>[];

  // Fetch accreditation types
  const { data: accTypesData } = await supabaseAdmin
    .from('accreditation_types')
    .select('*');
  const typesMap = new Map((accTypesData || []).map(t => [t.id, t.name]));

  const applications: ApplicationWithDetails[] = rawApplications.map(app => ({
    ...app,
    accreditation_type_name: typesMap.get(app.type_id) || 'Desconocido',
    applicant_name: app.profiles?.full_name || 'Sin nombre',
    applicant_email: app.profiles?.email || 'Sin correo',
  }));

  return (
    <AdminClient applications={applications} lang={validLang} />
  );
}
