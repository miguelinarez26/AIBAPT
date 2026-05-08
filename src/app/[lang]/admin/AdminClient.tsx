'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';
import { ApplicationStatus } from '@/types/database';
import AdminDetailModal from './AdminDetailModal';

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

// Mapeo de slugs técnicos a nombres legibles para el Admin
const TRAMITE_DISPLAY_NAMES: Record<string, string> = {
  'solicitud_membresia': 'Solicitud de Membresía',
  'solicitud_simpatizante': 'Solicitud de Simpatizante',
  'CCA': 'Acreditación CCA',
  'Eventos_Conferencia': 'Evento — Conferencia',
  'Eventos_Workshop': 'Evento — Workshop',
  'Eventos_Congreso': 'Evento — Congreso',
  'Emision_CCA': 'Emisión de CCA',
  'Renovacion_CCA': 'Renovación de CCA',
  'EMDR_Psicoterapeuta': 'EMDR Psicoterapeuta',
  'EMDR_Supervisor': 'EMDR Supervisor',
  'Equivalencia_EMDR': 'Equivalencia EMDR',
  'Psicotrauma_Individual': 'Psicotrauma Individual',
  'Psicotrauma_Programa': 'Psicotrauma Programa',
  'Equivalencia_Basica_Alumno': 'Equivalencia Básica (Alumno)',
  'Equivalencia_Basica_Formador': 'Equivalencia Básica (Formador)',
};

function humanizeTramiteName(slug: string | undefined): string {
  if (!slug) return 'Trámite Desconocido';
  return TRAMITE_DISPLAY_NAMES[slug] || slug.replace(/_/g, ' ');
}

export default function AdminClient({ lang }: { lang: 'es' | 'pt' }) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Panel Maestro de Auditoría</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona, revisa y aprueba las solicitudes de los miembros.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtro de Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="under_review">En Revisión</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          <button onClick={loadApplications} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-icons-round text-[16px]">refresh</span>
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Trámite</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando solicitudes...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No se encontraron solicitudes.</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(app.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {app.profiles?.first_name ? `${app.profiles.first_name} ${app.profiles.last_name}`.trim() : app.profiles?.full_name || 'Usuario sin nombre'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {app.profiles?.member_number ? (
                            <span className="text-primary font-bold tracking-wider">#{app.profiles.member_number}</span>
                          ) : app.profiles?.email || app.user_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {humanizeTramiteName(app.accreditation_types?.name)}
                    </td>
                    <td className="px-6 py-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedAppId(app.id)}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        Auditar <span className="material-icons-round text-[16px]">arrow_forward</span>
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
