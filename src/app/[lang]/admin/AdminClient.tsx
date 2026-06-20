'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';
import { ApplicationStatus } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminDetailModal from './AdminDetailModal';
import { Eye, RotateCw, Search, X } from 'lucide-react';
import Link from 'next/link';

interface ApplicationRow {
  id: string;
  created_at: string;
  status: ApplicationStatus;
  user_id: string;
  profiles: { 
    first_name: string; 
    last_name: string; 
    full_name: string | null; 
    email: string | null; 
    member_number: string | null 
  } | null;
  accreditation_types: { name: string } | null;
}

export default function AdminClient({ lang }: { lang: 'es' | 'pt' }) {
  const { t } = useLanguage();

  // Mapeo de slugs técnicos a nombres legibles para el Admin vía i18n
  const TRAMITE_DISPLAY_NAMES: Record<string, string> = {
    'solicitud_membresia': t("tramite.name.membresia"),
    'CCA': t("tramite.name.cca"),
    'Eventos_Conferencia': t("tramite.name.conferencia"),
    'Eventos_Workshop': t("tramite.name.workshop"),
    'Eventos_Congreso': t("tramite.name.congreso"),
    'Emision_CCA': t("tramite.name.emision_cca"),
    'Renovacion_CCA': t("tramite.name.renovacion_cca"),
    'EMDR_Psicoterapeuta': t("tramite.name.emdr_psico"),
    'EMDR_Supervisor': t("tramite.name.emdr_sup"),
    'Equivalencia_EMDR': t("tramite.name.emdr_equiv"),
    'Psicotrauma_Individual': t("tramite.name.trauma_ind"),
    'Psicotrauma_Programa': t("tramite.name.trauma_prog"),
  };

  function humanizeTramiteName(slug: string | undefined): string {
    if (!slug) return t("status.unknown");
    return TRAMITE_DISPLAY_NAMES[slug] || slug.replace(/_/g, ' ');
  }
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  const supabase = createBrowserSupabaseClient();

  const loadApplications = async () => {
    setLoading(true);
    console.log("🔍 [AdminClient] Verificando autorización y cargando solicitudes...");
    
    // 0. Verificar autorización de administrador
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      window.location.href = `/${lang}/login?redirectTo=/${lang}/admin`;
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const profile = data as { role: string } | null;

    if (!profile || profile.role !== 'admin') {
      window.location.href = `/${lang}/dashboard`;
      return;
    }

    // 1. Obtener aplicaciones
    const { data: appsData, error: appsError } = await supabase
      .from('applications')
      .select('id, created_at, status, user_id, type_id')
      .neq('status', 'uploading')
      .order('created_at', { ascending: false });

    if (appsError) {
      console.error("❌ [AdminClient] Error cargando aplicaciones:", appsError.message);
      console.error("❌ [AdminClient] Código:", appsError.code);
      console.error("❌ [AdminClient] Detalles:", appsError.details);
      console.error("❌ [AdminClient] Hint:", appsError.hint);
      setLoading(false);
      return;
    }

    const appsList = (appsData || []) as any[];

    if (appsList.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    // 2. Obtener perfiles de los usuarios involucrados
    const userIds = Array.from(new Set(appsList.map(app => app.user_id)));
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, full_name, email, member_number')
      .in('id', userIds);

    if (profilesError) {
      console.warn("⚠️ [AdminClient] Error cargando perfiles vinculados:", profilesError.message);
    }

    const profilesList = (profilesData || []) as any[];

    // 3. Obtener tipos de acreditación involucrados
    const typeIds = Array.from(new Set(appsList.map(app => app.type_id)));
    const { data: typesData, error: typesError } = await supabase
      .from('accreditation_types')
      .select('id, name')
      .in('id', typeIds);

    if (typesError) {
      console.warn("⚠️ [AdminClient] Error cargando tipos de acreditación vinculados:", typesError.message);
    }

    const typesList = (typesData || []) as any[];

    // Mapas para unión rápida en memoria
    const profilesMap = new Map(profilesList.map(p => [p.id, p]));
    const typesMap = new Map(typesList.map(t => [t.id, t]));

    // Combinar en estructura esperada por el componente
    const combined: ApplicationRow[] = appsList.map(app => ({
      id: app.id,
      created_at: app.created_at,
      status: app.status as ApplicationStatus,
      user_id: app.user_id,
      profiles: profilesMap.get(app.user_id) || null,
      accreditation_types: typesMap.get(app.type_id) || null
    }));

    console.log("🔍 [AdminClient] Solicitudes combinadas en memoria:", combined);
    setApplications(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const applicantName = (app.profiles?.first_name ? `${app.profiles.first_name} ${app.profiles.last_name}`.trim() : app.profiles?.full_name || '').toLowerCase();
      const applicantEmail = (app.profiles?.email || '').toLowerCase();
      const memberNumber = (app.profiles?.member_number || '').toLowerCase();
      const tramiteName = humanizeTramiteName(app.accreditation_types?.name).toLowerCase();
      
      if (!applicantName.includes(query) && 
          !applicantEmail.includes(query) && 
          !memberNumber.includes(query) && 
          !tramiteName.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 mt-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-light dark:text-white mb-2 leading-tight">
            {t("admin.panel.title") || "Panel Maestro de Auditoría"}
          </h1>
          <p className="text-text-muted dark:text-gray-400 font-medium">
            {t("admin.panel.desc") || "Gestiona, revisa y aprueba las solicitudes de los miembros."}
          </p>
        </div>
        <Link
          href={`/${lang}/dashboard`}
          className="px-6 py-3 bg-white dark:bg-surface-dark border border-secondary/20 rounded-full font-bold text-sm text-text-light dark:text-white hover:text-primary transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-2 group"
        >
          <span className="material-icons-round text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          {t("profile.back") || "Volver a Mi Tablero"}
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-secondary/20 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border-t-4 border-t-primary overflow-hidden mb-6 relative min-h-[400px] flex flex-col">
        <div className="px-8 py-6 border-b border-secondary/20 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-3 relative">
            <span className="text-[11px] font-black text-primary dark:text-primary uppercase tracking-widest">{t("admin.filter.status") || "Filtro de Estado"}</span>
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl text-xs font-black text-primary dark:text-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-sm w-auto min-w-[160px] hover:border-primary/40 hover:bg-primary/10"
              >
                <span>
                  {statusFilter === 'all' && "Todas"}
                  {statusFilter === 'pending' && "Pendientes"}
                  {statusFilter === 'under_review' && "En Revisión"}
                  {statusFilter === 'approved' && "Aprobadas"}
                  {statusFilter === 'rejected' && "Rechazadas"}
                </span>
                <span className={`material-icons-round text-[16px] text-primary transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-[180px] bg-white dark:bg-surface-dark border border-secondary/20 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col py-1">
                  {[
                    { id: 'all', label: "Todas" },
                    { id: 'pending', label: "Pendientes" },
                    { id: 'under_review', label: "En Revisión" },
                    { id: 'approved', label: "Aprobadas" },
                    { id: 'rejected', label: "Rechazadas" }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => { setStatusFilter(option.id); setIsFilterOpen(false); }}
                      className={`text-left px-4 py-2.5 text-xs font-bold transition-colors ${statusFilter === option.id ? 'bg-primary/10 text-primary' : 'text-text-main dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-[280px] max-w-md relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted dark:text-gray-500 group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder={lang === 'es' ? 'Buscar por nombre, email o trámite...' : 'Buscar por nome, email ou trâmite...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-full pl-11 pr-10 py-2.5 text-sm font-medium text-text-light dark:text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-text-muted hover:text-accent transition-colors"
                title={lang === 'es' ? 'Borrar búsqueda' : 'Limpar pesquisa'}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button 
            onClick={loadApplications} 
            className="p-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group shadow-sm hover:shadow-md"
            title={t("admin.btn.refresh") || "Actualizar"}
          >
            <RotateCw size={18} className={`group-active:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 border-b border-primary/20 text-[10px] uppercase tracking-widest text-primary dark:text-primary font-black">
                <th className="px-8 py-5">{t("admin.table.date") || "FECHA"}</th>
                <th className="px-8 py-5">{t("admin.table.applicant") || "SOLICITANTE"}</th>
                <th className="px-8 py-5">{t("admin.table.application") || "TRÁMITE"}</th>
                <th className="px-8 py-5">{t("admin.table.status") || "ESTADO"}</th>
                <th className="px-8 py-5 text-right">{t("admin.table.action") || "ACCIÓN"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-text-muted font-bold text-sm">
                    <span className="material-icons-round animate-spin text-primary text-3xl mb-2">loop</span><br />
                    {t("admin.table.loading") || "Cargando solicitudes..."}
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="relative group cursor-default">
                        <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative w-24 h-24 rounded-[32px] bg-primary border border-white/20 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:scale-105">
                          <span className="material-icons-round text-white text-5xl -rotate-3 transition-transform">inbox</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-serif text-primary mt-4 font-black">
                        ¡Todo al día!
                      </h3>
                      <p className="text-text-muted dark:text-gray-400 font-medium text-sm max-w-sm mx-auto">
                        No hay ninguna solicitud que coincida con este filtro. El panel está limpio.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 text-text-main dark:text-gray-400 font-medium text-sm">
                      {new Date(app.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-light dark:text-white group-hover:text-primary transition-colors text-sm">
                          {app.profiles?.first_name 
                            ? `${app.profiles.first_name} ${app.profiles.last_name}`.trim() 
                            : app.profiles?.full_name || '---'}
                        </span>
                        <span className="text-[11px] text-text-muted dark:text-gray-500 uppercase tracking-tight mt-0.5 font-bold">
                          {app.profiles?.member_number ? (
                            <span className="text-primary/80">ID: {app.profiles.member_number}</span>
                          ) : app.profiles?.email || app.user_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-text-main dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                        {humanizeTramiteName(app.accreditation_types?.name)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => setSelectedAppId(app.id)}
                        className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        <Eye size={16} />
                        {t("admin.table.audit") || "Auditar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppId && (
        <AdminDetailModal 
          applicationId={selectedAppId} 
          lang={lang} 
          onClose={() => setSelectedAppId(null)} 
          onUpdate={loadApplications} 
        />
      )}
    </div>
  );
}
