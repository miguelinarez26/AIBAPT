"use client";

import Link from "next/link";
import { Profile } from "@/types/database";
import { ApplicationStatusBadge } from "@/components/dashboard/ApplicationStatusBadge";
import { MembershipBadge } from "@/components/dashboard/MembershipBadge";
import type { ApplicationWithType } from "./page";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { translations } from "@/i18n/translations";

interface DashboardClientProps {
  profile: Profile | null;
  applications: ApplicationWithType[];
  lang: 'es' | 'pt';
}

export default function DashboardClient({ profile, applications, lang }: DashboardClientProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push(`/${lang}/login`);
  };

  const t = translations[lang] as Record<string, string>;
  const isMember = profile?.is_member ?? false;
  const displayName = profile?.full_name || profile?.email || t["dashboard.hello"] === 'Hola' ? 'Usuario' : 'Usuário';
  const roleLabel = profile?.role === 'admin'
    ? t["dashboard.role.admin"]
    : t["dashboard.role.member"];

  // Formatear fecha de vencimiento
  const expiryDisplay = profile?.membership_expiry
    ? new Date(profile.membership_expiry).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : t["dashboard.no_expiry"];

  // Formatear fecha de solicitud
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

  // Formatear nombre de tipo de acreditación para mostrar
  const formatTypeName = (name: string) => name.replace(/_/g, ' ');

  return (
    <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark">

      {/* Dashboard Header Banner */}
      <div className="bg-primary pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start text-white relative z-10">
          <div className="flex items-center gap-6">
            {/* Avatar con inicial */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-display font-bold shadow-lg backdrop-blur-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-display font-medium tracking-tight mb-1">
                {t["dashboard.hello"]}, {displayName}
              </h1>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <span className="bg-white/15 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase backdrop-blur-sm">
                  {roleLabel}
                </span>
                <MembershipBadge isMember={isMember} lang={lang} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === Columna Izquierda (Contenido Principal) === */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Alerta para No Socios */}
            {!isMember && (
              (() => {
                const pendingMembershipApp = applications.find(
                  (app) => app.type_id === 'solicitud_membresia' && (app.status === 'pending' || app.status === 'under_review' || app.status === 'uploading')
                );

                if (pendingMembershipApp) {
                  return (
                    <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between border-t border-r border-b border-blue-100 dark:border-blue-900/30">
                      <div>
                        <h3 className="font-bold font-display text-blue-700 dark:text-blue-400 text-lg flex items-center gap-2 mb-2">
                          <span className="material-icons-round">info</span>
                          {t["dashboard.membership_under_review"] || "Tu solicitud de membresía está en revisión"}
                        </h3>
                        <p className="text-sm text-blue-600/80 dark:text-blue-300/80 leading-relaxed">
                          {t["dashboard.membership_under_review_desc"] || "Estamos verificando tus documentos. Te notificaremos pronto."}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (applications.length === 0) {
                  return (
                    <div className="bg-white dark:bg-surface-dark border-l-4 border-l-aibapt-green p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between border-t border-r border-b border-accent/50 dark:border-gray-800">
                      <div>
                        <h3 className="font-bold font-display text-aibapt-green text-lg flex items-center gap-2 mb-2">
                          <span className="material-icons-round">waving_hand</span>
                          {lang === 'es' ? '¡Bienvenido a AIBAPT!' : 'Bem-vindo à AIBAPT!'}
                        </h3>
                        <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                          {lang === 'es' 
                            ? '¡Hola! Tu cuenta ha sido creada. Para disfrutar de los beneficios de AIBAPT, completa tu solicitud de membresía aquí.' 
                            : 'Olá! Sua conta foi criada. Para aproveitar os benefícios da AIBAPT, preencha sua solicitação de membresia aqui.'}
                        </p>
                      </div>
                      <Link
                        href={`/${lang}/afiliacion`}
                        className="shrink-0 w-full md:w-auto px-6 py-3 bg-aibapt-green text-white font-bold rounded-xl shadow-md shadow-aibapt-green/20 hover:bg-aibapt-green/90 transition-colors text-center"
                      >
                        {t["dashboard.start_affiliation"] || "Comenzar Afiliación"}
                      </Link>
                    </div>
                  );
                }

                return (
                  <div className="bg-white border-l-4 border-l-aibapt-green p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between border-t border-r border-b border-accent/50">
                    <div>
                      <h3 className="font-bold font-display text-aibapt-green text-lg flex items-center gap-2 mb-2">
                        <span className="material-icons-round">verified_user</span>
                        {t["dashboard.inactive_membership"]}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {t["dashboard.inactive_desc"]}
                      </p>
                    </div>
                    <Link
                      href={`/${lang}/afiliacion`}
                      className="shrink-0 w-full md:w-auto px-6 py-3 bg-aibapt-green text-white font-bold rounded-xl shadow-md shadow-aibapt-green/20 hover:bg-aibapt-green/90 transition-colors text-center"
                    >
                      {t["dashboard.start_affiliation"] || "Quiero ser Socio"}
                    </Link>
                  </div>
                );
              })()
            )}

            {/* Tabla de Trámites Recientes */}
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-accent/50 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-display text-secondary dark:text-white flex items-center gap-2">
                  <span className="material-icons-round text-primary text-[22px]">assignment</span>
                  {t["dashboard.my_applications"]}
                </h2>
                {applications.length > 0 && (
                  <span className="text-xs font-bold text-aibapt-gray bg-aibapt-gray/10 px-3 py-1 rounded-full">
                    {applications.length} {t["dashboard.total"]}
                  </span>
                )}
              </div>

              {applications.length > 0 ? (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-accent/30 dark:border-gray-700">
                        <th className="text-left py-3 px-3 text-xs font-bold text-aibapt-gray uppercase tracking-wider">
                          {t["dashboard.application"]}
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-bold text-aibapt-gray uppercase tracking-wider hidden md:table-cell">
                          {t["dashboard.date"]}
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-bold text-aibapt-gray uppercase tracking-wider">
                          {t["dashboard.status"]}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-accent/10 dark:border-gray-800 last:border-b-0 hover:bg-accent/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-3">
                            <span className="font-medium text-text-main dark:text-white">
                              {formatTypeName(app.accreditation_type_name)}
                            </span>
                            {app.status === 'rejected' && (app as any).admin_notes && (
                              <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded-md border border-red-100 dark:border-red-900/30">
                                <span className="font-bold block mb-1">Nota del Revisor:</span>
                                {(app as any).admin_notes}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-3 text-text-muted dark:text-gray-400 hidden md:table-cell">
                            {formatDate(app.created_at)}
                          </td>
                          <td className="py-4 px-3">
                            <ApplicationStatusBadge status={app.status} lang={lang} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4 bg-accent/5 dark:bg-white/5 rounded-2xl border border-dashed border-accent/30 dark:border-gray-700">
                  <span className="material-icons-round text-5xl text-aibapt-gray/40">inbox</span>
                  <div>
                    <p className="text-sm text-text-muted dark:text-gray-400 font-medium">
                      {t["dashboard.no_applications"]}
                    </p>
                    <p className="text-xs text-text-muted/70 dark:text-gray-500 max-w-sm mt-1">
                      {t["dashboard.no_app_desc"]}
                    </p>
                  </div>
                  <Link
                    href={`/${lang}/formaciones`}
                    className="mt-2 text-xs font-bold text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
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
            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-accent/50 dark:border-gray-800 flex flex-col gap-4">
              <h3 className="font-bold font-display text-secondary dark:text-white border-b border-accent/50 dark:border-gray-700 pb-3">
                {t["dashboard.membership_status"]}
              </h3>

              <div className="flex justify-between text-sm py-2">
                <span className="text-text-muted dark:text-gray-400">{t["dashboard.status_label"]}</span>
                <MembershipBadge isMember={isMember} lang={lang} />
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-text-muted dark:text-gray-400">{t["dashboard.expiry"]}</span>
                <span className="font-bold text-text-main dark:text-white">{expiryDisplay}</span>
              </div>

              <hr className="border-accent/50 dark:border-gray-700" />

              {isMember ? (
                <button className="w-full py-2.5 text-sm font-bold text-text-main dark:text-white hover:text-primary transition-colors flex items-center justify-between group">
                  {t["dashboard.renew"]}
                  <span className="material-icons-round text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              ) : (
                <Link
                  href={`/${lang}/afiliacion`}
                  className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#689153] transition-colors text-center block"
                >
                  {t["dashboard.activate"]}
                </Link>
              )}
            </div>

            {/* Accesos Rápidos */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-accent/50 dark:border-gray-800 flex flex-col gap-2">
              <h3 className="font-bold font-display text-secondary dark:text-white mb-2">
                {t["dashboard.settings"]}
              </h3>
              <Link
                href={`/${lang}/dashboard/perfil`}
                className="flex items-center gap-3 p-3 text-sm text-text-main dark:text-gray-300 hover:bg-accent/20 dark:hover:bg-white/5 rounded-xl transition-colors font-medium border border-transparent hover:border-accent/50 dark:hover:border-gray-700 text-left"
              >
                <span className="material-icons-round text-primary text-[20px]">person</span>
                {t["dashboard.personal_data"]}
              </Link>
              <Link
                href={`/${lang}/dashboard/perfil`}
                className="flex items-center gap-3 p-3 text-sm text-text-main dark:text-gray-300 hover:bg-accent/20 dark:hover:bg-white/5 rounded-xl transition-colors font-medium border border-transparent hover:border-accent/50 dark:hover:border-gray-700 text-left"
              >
                <span className="material-icons-round text-primary text-[20px]">contact_page</span>
                {t["dashboard.cv_directory"]}
              </Link>

              <div className="h-px w-full bg-accent/50 dark:bg-gray-700 my-2"></div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 p-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-bold text-left"
              >
                <span className="material-icons-round text-[20px]">logout</span>
                {t["dashboard.logout"]}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
