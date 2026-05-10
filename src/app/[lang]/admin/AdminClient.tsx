'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';
import { ApplicationStatus } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminDetailModal from './AdminDetailModal';
import { Eye, RotateCw } from 'lucide-react';

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
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  const supabase = createBrowserSupabaseClient();

  const loadApplications = async () => {
    setLoading(true);
    // JOIN con profiles y accreditation_types
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        created_at,
        status,
        user_id,
        profiles ( first_name, last_name, full_name, email, member_number ),
        accreditation_types ( name )
      `)
      .neq('status', 'uploading')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setApplications(data as unknown as ApplicationRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApps = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("admin.panel.title")}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t("admin.panel.desc")}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("admin.filter.status")}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="all">{t("admin.filter.all")}</option>
              <option value="pending">{t("admin.filter.pending")}</option>
              <option value="under_review">{t("admin.filter.review")}</option>
              <option value="approved">{t("admin.filter.approved")}</option>
              <option value="rejected">{t("admin.filter.rejected")}</option>
            </select>
          </div>
          <button 
            onClick={loadApplications} 
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all group"
            title={t("admin.btn.refresh")}
          >
            <RotateCw size={18} className={`group-active:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-500 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5">{t("admin.table.date")}</th>
                <th className="px-6 py-5">{t("admin.table.applicant")}</th>
                <th className="px-6 py-5">{t("admin.table.application")}</th>
                <th className="px-6 py-5">{t("admin.table.status")}</th>
                <th className="px-6 py-5 text-right">{t("admin.table.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t("admin.table.loading")}</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t("admin.table.empty")}</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-text-muted dark:text-gray-400 font-medium">
                      {new Date(app.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-secondary dark:text-white group-hover:text-primary transition-colors">
                          {app.profiles?.first_name 
                            ? `${app.profiles.first_name} ${app.profiles.last_name}`.trim() 
                            : app.profiles?.full_name || '---'}
                        </span>
                        <span className="text-[10px] text-text-muted dark:text-gray-500 uppercase tracking-tight mt-0.5">
                          {app.profiles?.member_number ? (
                            <span className="font-black text-primary/70">ID: {app.profiles.member_number}</span>
                          ) : app.profiles?.email || app.user_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-text-main dark:text-gray-300 bg-accent/10 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-accent/20">
                        {humanizeTramiteName(app.accreditation_types?.name)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button
                        onClick={() => setSelectedAppId(app.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Eye size={16} />
                        {t("admin.table.audit")}
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
