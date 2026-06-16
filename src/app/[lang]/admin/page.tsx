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

  return (
    <main className="pt-8 md:pt-12 relative min-h-screen">
      {/* Elementos Decorativos de Fondo (AIBAPT Brand) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10 pointer-events-none"></div>
      
      <AdminClient lang={validLang} />
    </main>
  );
}
