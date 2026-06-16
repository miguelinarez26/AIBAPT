'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { translations } from '@/i18n/translations';
import { MembershipBadge } from '@/components/dashboard/MembershipBadge';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function DashboardClient({ profile: initialProfile, applications: initialApplications = [], lang }: any) {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const t = translations[lang as 'es' | 'pt'] as Record<string, string>;
  const [credits, setCredits] = useState<any[]>([]);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [profile, setProfile] = useState<any>(initialProfile);
  const [applications, setApplications] = useState<any[]>(initialApplications);

  useEffect(() => {
    setMounted(true);

    const loadData = async () => {
      const { createBrowserSupabaseClient } = await import('@/lib/supabase/client');
      const supabase = createBrowserSupabaseClient();

      // Auth guard
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        router.push(`/${lang}/login?redirectTo=/${lang}/dashboard`);
        return;
      }

      // Fetch profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      const profileData = data as any;

      if (!profileData || !profileData.first_name?.trim()) {
        router.push(`/${lang}/onboarding`);
        return;
      }
      setProfile(profileData);

      // Fetch applications
      const { data: appsData } = await supabase
        .from('applications')
        .select('*, accreditation_types(name)')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (appsData) {
        const mapped = appsData.map((app: any) => ({
          ...app,
          accreditation_type_name: app.accreditation_types?.name || 'Desconocido',
        }));
        setApplications(mapped);
      }

      // Fetch credits
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('*')
        .order('created_at', { ascending: false });
      if (!creditsError && creditsData) {
        setCredits(creditsData);
      }
      setIsLoadingCredits(false);
    };

    loadData();
  }, []);

  const bags = useMemo(() => {
    let emdr = 0;
    let psicotrauma = 0;
    const today = new Date();
    credits.forEach((c) => {
      const isExpired = new Date(c.expiry_date) < today;
      if (!isExpired) {
        if (c.category === 'EMDR') emdr += c.amount;
        if (c.category === 'Psicotrauma') psicotrauma += c.amount;
      }
    });
    return { emdr, psicotrauma };
  }, [credits]);

  const isMember = profile?.is_member ?? false;
  
  const displayName = useMemo(() => {
    const rawMetaName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    if (rawMetaName) {
      return rawMetaName.split(' ')[0];
    }
    const rawName = profile?.first_name || '';
    return rawName.split(' ')[0] || 'Usuario';
  }, [user, profile]);

  const expiryDisplay = useMemo(() => {
    if (profile?.membership_expiry) {
      return formatDate(profile.membership_expiry);
    }
    return isMember ? 'Activa' : 'Inactiva';
  }, [profile?.membership_expiry, isMember]);

  if (!mounted) return null;

  const TRAMITE_NAMES: Record<string, string> = {
    'Certificacion_EMDR': t["tramite.name.certificacion"],
    'Eventos_Conferencia': t["tramite.name.conferencia"],
    'Eventos_Workshop': t["tramite.name.workshop"],
    'Eventos_Congreso': t["tramite.name.congreso"],
    'Emision_CCA': t["tramite.name.emision_cca"],
    'Renovacion_CCA': t["tramite.name.renovacion_cca"],
    'EMDR_Psicoterapeuta': t["tramite.name.emdr_psico"],
    'EMDR_Supervisor': t["tramite.name.emdr_sup"],
    'Equivalencia_EMDR': t["tramite.name.emdr_equiv"],
    'Psicotrauma_Individual': t["tramite.name.trauma_ind"],
    'Psicotrauma_Programa': t["tramite.name.trauma_prog"],
  };
  const formatTypeName = (name: string) => TRAMITE_NAMES[name] || name.replace(/_/g, ' ');

  const handleSignOut = async () => {
    const { createBrowserSupabaseClient } = await import('@/lib/supabase/client');
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push(`/${lang}/auth/login`);
    router.refresh();
  };

  return (
    <main className="pt-8 md:pt-12 min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Organic Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10 pointer-events-none"></div>

      {/* Dashboard Header Banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row justify-between items-start text-text-light dark:text-white relative z-10">
        <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">
              {t["dashboard.hello"]}, <span className="font-light italic text-primary">{displayName}</span>
            </h1>
            <div className="flex items-center gap-3 mt-2 mb-2 flex-wrap">
              {profile?.member_number && (
                <span className="bg-white dark:bg-surface-dark text-text-light dark:text-white px-3 py-1.5 rounded-full text-[11px] font-bold border border-secondary/20 flex items-center gap-1.5 shadow-sm uppercase">
                  <span className="material-icons-round text-[14px] text-primary">badge</span>
                  {t["dashboard.membership.id"]}: <span className="text-primary">{profile.member_number}</span>
                </span>
              )}
              <MembershipBadge isMember={isMember} lang={lang} />
            </div>
          </div>
        </div>

      {/* Dashboard Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === Columna Izquierda (Contenido Principal) === */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Banner de Modo Gestión para Admins */}
            {profile?.role === 'admin' ? (
              <div className="bg-text-light dark:bg-surface-dark p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 group-hover:bg-primary/30 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light/10 rounded-full blur-[60px] -translate-x-1/3 translate-y-1/3 group-hover:bg-accent-light/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner backdrop-blur-sm">
                      <span className="material-icons-round text-primary">admin_panel_settings</span>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-2">
                        {t["dashboard.staff_mode"]}
                      </h2>
                      <p className="text-white/80 font-light max-w-md leading-relaxed text-sm">
                        {t["dashboard.staff_desc"]}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/${lang}/admin`}
                    className="flex-shrink-0 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 flex items-center gap-2"
                  >
                    {t["dashboard.go_to_panel"]}
                    <span className="material-icons-round text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ) : !isMember && (
              <div className="bg-gradient-to-br from-primary/15 to-secondary/5 dark:from-primary/20 dark:to-surface-dark p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-primary/20 dark:border-primary/10 text-text-light relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 group-hover:bg-secondary/20 transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner text-primary border border-primary/20">
                      <span className="material-icons-round">waving_hand</span>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-light dark:text-white tracking-tight mb-2">
                        {t["dashboard.welcome.aibapt"]}
                      </h2>
                      <p className="text-text-dark dark:text-gray-400 font-light max-w-md leading-relaxed text-sm">
                        {t["dashboard.welcome.new_account"]}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/${lang}/afiliacion`}
                    className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 flex items-center gap-2"
                  >
                    {t["dashboard.start_affiliation"] || "Comenzar Afiliación"}
                    <span className="material-icons-round text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Mi Banco de Créditos */}
            <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-secondary/20 dark:border-gray-800 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold font-serif text-xl text-text-light dark:text-white flex items-center gap-2 mb-6">
                <span className="material-icons-round text-primary flex items-center">analytics</span>
                {t["dashboard.credits.title"] || "Mi Banco de Créditos"}
              </h3>

              {isLoadingCredits ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Contadores Visuales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Bolsa EMDR */}
                    <div className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                          {t["dashboard.credits.emdr"] || "Bolsa EMDR"}
                        </span>
                        <span className="text-3xl font-black text-text-light dark:text-white">
                          {bags.emdr} <span className="text-sm font-medium text-text-dark">CCA</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        {/* Barra de progreso visual (máximo recomendado por normativa ej: 24 como meta) */}
                        <div className="w-full bg-gray-100 dark:bg-gray-850 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((bags.emdr / 24) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-text-dark dark:text-gray-400 mt-1.5 block text-right font-medium">
                          {bags.emdr} / 24 {t["dashboard.credits.goal"] || "créditos meta"}
                        </span>
                      </div>
                    </div>

                    {/* Bolsa Psicotrauma */}
                    <div className="bg-gradient-to-br from-secondary/10 to-transparent p-6 rounded-2xl border border-secondary/20 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                          {t["dashboard.credits.psicotrauma"] || "Bolsa Psicotrauma"}
                        </span>
                        <span className="text-3xl font-black text-text-light dark:text-white">
                          {bags.psicotrauma} <span className="text-sm font-medium text-text-dark">CCA</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-100 dark:bg-gray-855 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-secondary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((bags.psicotrauma / 24) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-text-dark dark:text-gray-400 mt-1.5 block text-right font-medium">
                          {bags.psicotrauma} / 24 {t["dashboard.credits.goal"] || "créditos meta"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Últimos Créditos Obtenidos */}
                  <div className="border-t border-secondary/10 dark:border-gray-800 pt-6">
                    <h4 className="font-bold text-sm text-text-light dark:text-white mb-4">
                      {t["dashboard.credits.history"] || "Últimos créditos obtenidos"}
                    </h4>
                    {credits.length > 0 ? (
                      <ul className="space-y-3">
                        {credits.slice(0, 3).map((credit) => {
                          const expired = new Date(credit.expiry_date) < new Date();
                          return (
                            <li key={credit.id} className="flex justify-between items-center text-sm p-3 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-secondary/5 dark:border-gray-850">
                              <div className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full ${expired ? 'bg-red-400' : 'bg-green-400'}`}></span>
                                <span className="font-bold text-text-light dark:text-white">
                                  {credit.amount} CCA
                                </span>
                                <span className="text-xs text-text-dark dark:text-gray-400 bg-secondary/10 px-2 py-0.5 rounded">
                                  {credit.category}
                                </span>
                              </div>
                              <span className="text-xs text-text-dark dark:text-gray-400 font-medium">
                                {expired 
                                  ? `${t["dashboard.credits.expired"] || "Expirado el"} ${formatDate(credit.expiry_date)}`
                                  : `${t["dashboard.credits.expires"] || "Vence el"} ${formatDate(credit.expiry_date)}`
                                }
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-xs text-text-dark/80 dark:text-gray-500 italic">
                        {t["dashboard.credits.empty"] || "Aún no has acumulado créditos académicos."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tabla de Trámites Recientes */}
            <div className="bg-white dark:bg-surface-dark rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-secondary/20 dark:border-gray-800 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="px-8 py-6 border-b border-secondary/20 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
                <h3 className="font-bold font-serif text-xl text-text-light dark:text-white flex items-center gap-2">
                  <span className="material-icons-round text-primary">folder_open</span>
                  {t["dashboard.my_applications"]}
                </h3>
              </div>

              {applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-secondary/20 dark:border-gray-700 text-xs uppercase tracking-wider text-text-dark font-bold">
                        <th className="py-4 px-8">{t["dashboard.table.id"]}</th>
                        <th className="py-4 px-4">{t["dashboard.table.type"]}</th>
                        <th className="py-4 px-4 hidden md:table-cell">{t["dashboard.table.date"]}</th>
                        <th className="py-4 px-4">{t["dashboard.table.status"]}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10 dark:divide-gray-800">
                      {applications.slice(0, 5).map((app: any) => (
                        <tr key={app.id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => router.push(`/${lang}/dashboard/tramites/${app.id}`)}>
                          <td className="py-5 px-8 font-mono text-sm font-bold text-primary">
                            #{app.id.substring(0, 8)}
                          </td>
                          <td className="py-5 px-4">
                            <span className="font-medium text-text-light dark:text-gray-200">
                              {formatTypeName(app.accreditation_type_name)}
                            </span>
                          </td>
                          <td className="py-5 px-4 text-text-dark dark:text-gray-400 hidden md:table-cell font-medium text-sm">
                            {formatDate(app.created_at)}
                          </td>
                          <td className="py-5 px-4">
                            <ApplicationStatusBadge status={app.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-gray-50 dark:bg-white/5 rounded-b-[32px] border-t border-dashed border-secondary/40 dark:border-gray-700">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-icons-round text-3xl text-secondary">inbox</span>
                  </div>
                  <div>
                    <p className="text-base text-text-light dark:text-gray-300 font-bold">
                      {t["dashboard.no_applications"]}
                    </p>
                    <p className="text-sm text-text-dark/80 dark:text-gray-500 max-w-sm mt-1 font-light">
                      {t["dashboard.no_app_desc"]}
                    </p>
                  </div>
                  <Link
                    href={`/${lang}/formaciones`}
                    className="mt-4 text-sm font-bold text-primary bg-primary/10 px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    {t["dashboard.explore"]}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* === Columna Derecha (Sidebar) === */}
          <div className="space-y-8">

            {/* Card de Membresía */}
            <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] shadow-[0_8px_30px_rgba(33,150,83,0.06)] border border-secondary/20 dark:border-gray-800 flex flex-col gap-5 transition-all duration-500 hover:border-primary/30">
              <h3 className="font-bold font-serif text-xl text-text-light dark:text-white border-b border-secondary/20 dark:border-gray-700 pb-4 flex items-center gap-2">
                <span className="material-icons-round text-primary">card_membership</span>
                {t["dashboard.membership_status"]}
              </h3>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-text-dark font-medium dark:text-gray-400">{t["dashboard.status_label"]}</span>
                <MembershipBadge isMember={isMember} lang={lang} />
              </div>
              <div className="flex justify-between items-center text-sm py-3 bg-primary/5 dark:bg-primary/10 px-4 rounded-2xl border border-primary/10">
                <span className="text-primary font-bold">{t["dashboard.membership.id"]}</span>
                <span className="font-mono font-bold text-primary text-base">
                  {isMember && profile?.member_number ? profile.member_number : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2">
                <span className="text-text-dark font-medium dark:text-gray-400">{t["dashboard.expiry"]}</span>
                <span className="font-bold text-text-light dark:text-white">{expiryDisplay}</span>
              </div>
            </div>

            {/* Identidad Profesional */}
            <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-secondary/20 dark:border-gray-800 flex flex-col transition-all duration-500 hover:border-primary/30">
              <h3 className="font-bold font-serif text-xl text-text-light dark:text-white border-b border-secondary/20 dark:border-gray-700 pb-4 mb-4 flex items-center gap-2">
                <span className="material-icons-round text-primary">fingerprint</span>
                {t["dashboard.identity.professional"]}
              </h3>

              <Link
                href={`/${lang}/dashboard/perfil?tab=personal`}
                className="group flex items-center gap-4 p-4 text-sm text-text-light dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/5 rounded-2xl transition-colors font-bold border border-transparent hover:border-primary/20 dark:hover:border-gray-700 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-icons-round text-primary text-[20px]">manage_accounts</span>
                </div>
                {t["dashboard.personal_data"]}
              </Link>
              <Link
                href={`/${lang}/dashboard/perfil?tab=profesional`}
                className="group flex items-center gap-4 p-4 text-sm text-text-light dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/5 rounded-2xl transition-colors font-bold border border-transparent hover:border-primary/20 dark:hover:border-gray-700 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-icons-round text-primary text-[20px]">verified</span>
                </div>
                {t["dashboard.cv_directory"]}
              </Link>

              <div className="h-px w-full bg-secondary/20 dark:bg-gray-700 my-3"></div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 p-4 text-sm font-bold text-accent hover:bg-accent/5 rounded-2xl transition-colors border border-transparent hover:border-accent/20"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="material-icons-round text-accent text-[20px]">logout</span>
                </div>
                {lang === 'es' ? 'Cerrar Sesión' : 'Sair'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
