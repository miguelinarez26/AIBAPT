import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AfiliacionInfoClient from './AfiliacionInfoClient';
import AfiliacionPortalClient from './AfiliacionPortalClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Afiliação | AIBAPT' : 'Afiliación | AIBAPT',
    description: lang === 'pt'
      ? 'Junte-se à AIBAPT como Membro Pleno, Institucional ou Benfeitor. Conheça os requisitos e inicie sua afiliação.'
      : 'Únete a AIBAPT como Miembro Pleno, Institucional o Bienhechor. Conoce los requisitos e inicia tu afiliación.',
  };
}

export default async function AfiliacionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  // Verificar sesión — el portal interactivo requiere autenticación
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${validLang}/registro?redirectTo=/${validLang}/afiliacion`);
  }

  return (
    <main className="min-h-screen pt-24">
      {/* Sección 1: Información de Tipos de Membresía (componente de la compañera) */}
      <AfiliacionInfoClient />

      {/* Sección 2: Portal Interactivo — Selector + Stepper */}
      <AfiliacionPortalClient lang={validLang as 'es' | 'pt'} />
    </main>
  );
}
