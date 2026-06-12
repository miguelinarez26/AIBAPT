import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import MembersClient from './MembersClient';
import { translations } from '@/i18n/translations';

// Incremental Static Regeneration: Revalidar cada hora
export const revalidate = 3600;

export default async function MembersDirectoryPage({
  params,
}: {
  params: Promise<{ lang: 'es' | 'pt' }>;
}) {
  const { lang } = await params;

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Log de diagnóstico: Contar perfiles totales
  const { count: totalProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  console.log(`[Directorio] Perfiles totales en DB: ${totalProfiles}`);

  // 2. Query principal
  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_member', true)
    .eq('is_public', true)
    .not('member_number', 'is', null)
    .order('last_name', { ascending: true });

  if (error) {
    console.error('[Directorio] Error fetching members:', error);
  }

  console.log(`[Directorio] Miembros encontrados (is_member=true, is_public=true): ${members?.length || 0}`);


  const t = translations[lang];

  return (
    <div className="min-h-screen bg-accent/5 dark:bg-background-dark pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-text-main dark:text-white mb-4 tracking-tight">
            {t["members.title"]}
          </h1>
          <p className="text-lg text-text-muted dark:text-gray-400 max-w-2xl mx-auto">
            {t["members.desc"]}
          </p>
        </div>

        <MembersClient initialMembers={members || []} lang={lang} />
      </div>
    </div>
  );
}
