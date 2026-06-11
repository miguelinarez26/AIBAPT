import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminClient from './AdminClient';

export const metadata = {
  title: 'Panel Administrativo | AIBAPT',
  description: 'Panel de control administrativo de AIBAPT.',
};

export default async function AdminPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${validLang}/login?redirectTo=/${validLang}/admin`);
  }

  // Verificar si es administrador
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userProfile = profile as { role: string } | null;

  if (!userProfile || userProfile.role !== 'admin') {
    // Redirigir al dashboard normal si no es admin
    redirect(`/${validLang}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <AdminClient lang={validLang} />
    </div>
  );
}
