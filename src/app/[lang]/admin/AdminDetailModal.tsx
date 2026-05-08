'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';

interface AdminDetailModalProps {
  applicationId: string;
  lang: 'es' | 'pt';
  onClose: () => void;
  onUpdate: () => void;
}

export default function AdminDetailModal({ applicationId, lang, onClose, onUpdate }: AdminDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appData, setAppData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      
      // 1. Fetch App details
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*, profiles(first_name, last_name, full_name, email, member_number, language_preference), accreditation_types(id, name)')
        .eq('id', applicationId)
        .single();

      if (appError) {
        console.error(appError);
        setLoading(false);
        return;
      }
      setAppData(application);

      // 2. Fetch Documents and generate signed URLs
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', applicationId);

      if (!docsError && docsData) {
        const docsWithUrls = await Promise.all((docsData as any[]).map(async (doc: any) => {
          const { data: urlData, error: urlError } = await supabase
            .storage
            .from('private-certifications')
            .createSignedUrl(doc.file_path, 3600);
            
          return {
            ...doc,
            signedUrl: urlError ? null : urlData.signedUrl
          };
        }));
        setDocuments(docsWithUrls);
      }

      setLoading(false);
    }

    loadDetail();
  }, [applicationId]);

  const handleProcess = async (newStatus: 'approved' | 'rejected') => {
    if (newStatus === 'rejected' && !adminNotes.trim()) {
      setError('El motivo del rechazo es obligatorio.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const isCCA = appData?.accreditation_types?.name?.includes('CCA');
      const isMembresia = appData?.accreditation_types?.name?.includes('membresia');
      
      let actionType = 'GENERAL';
      if (isCCA) actionType = 'CCA';
      if (isMembresia) actionType = 'Membresia';

      const res = await fetch('/api/admin/process-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          newStatus,
          adminNotes,
          actionType
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error procesando solicitud');
      }

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando auditoría...</p>
        </div>
      </div>
    );
  }

  if (!appData) return null;

  const metadata = appData.metadata as Record<string, any> || {};
  const isMembresia = appData.accreditation_types?.name?.includes('membresia');

  // Mapeo de slugs técnicos a nombres legibles
  const TRAMITE_NAMES: Record<string, string> = {
    'solicitud_membresia': 'Solicitud de Membresía',
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
  const humanTramiteName = TRAMITE_NAMES[appData.accreditation_types?.name || ''] || appData.accreditation_types?.name?.replace(/_/g, ' ') || 'Desconocido';

  // Mapeo de document_type (slug) a etiquetas legibles para el visor
  const DOC_TYPE_LABELS: Record<string, string> = {
    'hoja_inscripcion': 'Hoja de Inscripción',
    'solicitud_ingreso': 'Solicitud de Ingreso',
    'titulo_profesional': 'Título Profesional',
    'cv': 'Currículum Vitae',
    'comprobante_formacion_sm': 'Diploma Abordaje Trauma',
    'comprobante_formacion_as': 'Certificado Taller 10h',
    'carta_recomendacion_1': 'Carta de Recomendación (1)',
    'carta_recomendacion_2': 'Carta de Recomendación (2)',
    'registro_legal': 'Registro Legal Institución',
    'comprobante_pago': 'Comprobante de Pago',
    'cv_instructor': 'CV del Instructor',
    'formulario_solicitud': 'Formulario de Solicitud',
    'ficha_tecnica': 'Ficha Técnica',
    'calendario_marketing': 'Calendario y Marketing',
    'material_didactico': 'Material Didáctico',
    'control_asistencia': 'Control de Asistencia',
    'cuestionario_evaluacion': 'Cuestionario de Evaluación',
    'cv_facilitador': 'CV del Facilitador',
    'ficha_solicitacion_tecnica': 'Ficha de Solicitación',
    'calendario_evento': 'Calendario del Evento',
    'material_evento': 'Material del Evento',
    'formularios_gestion': 'Formularios de Gestión',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-icons-round text-primary">policy</span>
              Auditoría de Solicitud
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID: {appData.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Info Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-icons-round text-[18px]">person</span> Datos del Solicitante
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-gray-500">Nombre:</span>{" "}
                  <strong className="text-gray-900 dark:text-white">
                    {appData.profiles?.first_name ? `${appData.profiles.first_name} ${appData.profiles.last_name}`.trim() : appData.profiles?.full_name || 'N/A'}
                  </strong>
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <strong className="text-gray-900 dark:text-white">{appData.profiles?.email || 'N/A'}</strong>
                </p>
                {appData.profiles?.member_number && (
                  <p>
                    <span className="text-gray-500">Matrícula:</span>{" "}
                    <strong className="text-primary font-black uppercase tracking-wider">{appData.profiles.member_number}</strong>
                  </p>
                )}
                <p>
                  <span className="text-gray-500">ID Usuario:</span>{" "}
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-700 dark:text-gray-300">{appData.user_id}</code>
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-icons-round text-[18px]">info</span> Información del Trámite
              </h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-500">Trámite:</span> <strong className="text-gray-900 dark:text-white">{humanTramiteName}</strong></p>
                <p><span className="text-gray-500">Estado Actual:</span> <ApplicationStatusBadge status={appData.status} /></p>
                <p><span className="text-gray-500">Fecha de envío:</span> <strong className="text-gray-900 dark:text-white">{new Date(appData.created_at).toLocaleString()}</strong></p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {Object.keys(metadata).length > 0 && (
            <div>
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">Datos Adicionales (Formulario)</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <ul className="space-y-2 text-sm">
                  {Object.entries(metadata)
                    .filter(([key]) => {
                      // Ocultar modalidad_online en membresías (no aplica, no es un evento)
                      if (key === 'modalidad_online' && isMembresia) return false;
                      return true;
                    })
                    .map(([key, value]) => {
                    let displayValue = String(value);
                    
                    // Lógica de formateo según el tipo de dato y clave
                    if (typeof value === 'boolean') {
                      if (key === 'modalidad_online') {
                        displayValue = value ? 'Online' : (lang === 'es' ? 'Presencial' : 'Presencial');
                      } else {
                        if (lang === 'es') displayValue = value ? 'Sí' : 'No';
                        else displayValue = value ? 'Sim' : 'Não';
                      }
                    } else if (key === 'monto_pagado' || key === 'monto') {
                      displayValue = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'pt-BR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(Number(value));
                    } else if (key === 'escenario' || key === 'categoria_membresia') {
                      // Mapeo legible de escenarios y categorías de membresía
                      const categoryMap: Record<string, string> = {
                        'pleno_salud_mental': lang === 'es' ? 'Miembro Pleno — Profesional de Salud Mental' : 'Membro Pleno — Profissional de Saúde Mental',
                        'pleno_agente_social': lang === 'es' ? 'Miembro Pleno — Agente de Intervención Social' : 'Membro Pleno — Agente de Intervenção Social',
                        'pleno': lang === 'es' ? 'Miembro Pleno' : 'Membro Pleno',
                        'institucional': lang === 'es' ? 'Miembro Institucional' : 'Membro Institucional',
                        'bienhechor': lang === 'es' ? 'Miembro Bienhechor' : 'Membro Benfeitor',
                        'simpatizante': lang === 'es' ? 'Miembro Simpatizante' : 'Membro Simpatizante',
                        'certificado': lang === 'es' ? 'Miembro Certificado' : 'Membro Certificado',
                        'supervisor': lang === 'es' ? 'Miembro Supervisor / Profesor' : 'Membro Supervisor / Professor',
                      };
                      displayValue = categoryMap[String(value)] || String(value).replace(/_/g, ' ');
                    } else if (key === 'idioma_solicitud') {
                      displayValue = value === 'es' ? 'Español' : value === 'pt' ? 'Português' : String(value);
                    } else if (key === 'tramite_tipo') {
                      displayValue = value === 'membresia' ? (lang === 'es' ? 'Solicitud de Membresía' : 'Solicitação de Membresia') : String(value);
                    }

                    // Formatear etiqueta legible
                    let displayKey = key.replace(/_/g, ' ');
                    const keyLabelMap: Record<string, string> = {
                      'escenario': appData.accreditation_types?.name?.includes('membresia') 
                        ? (lang === 'es' ? 'Categoría de Socio' : 'Categoria de Sócio')
                        : (lang === 'es' ? 'Escenario' : 'Cenário'),
                      'categoria_membresia': lang === 'es' ? 'Categoría de Membresía' : 'Categoria de Membresia',
                      'monto_pagado': lang === 'es' ? 'Monto Pagado' : 'Valor Pago',
                      'modalidad_online': lang === 'es' ? 'Modalidad' : 'Modalidade',
                      'idioma_solicitud': lang === 'es' ? 'Idioma de Solicitud' : 'Idioma da Solicitação',
                      'tramite_tipo': lang === 'es' ? 'Tipo de Trámite' : 'Tipo de Trâmite',
                    };
                    displayKey = keyLabelMap[key] || displayKey;

                    return (
                      <li key={key} className="flex flex-col sm:flex-row sm:gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                        <span className="text-gray-500 dark:text-gray-400 capitalize w-1/3">
                          {displayKey}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {displayValue}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="material-icons-round text-gray-400">folder_open</span> Documentos Adjuntos
            </h3>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">No se encontraron documentos.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-icons-round">picture_as_pdf</span>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{DOC_TYPE_LABELS[doc.document_type] || doc.document_type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500 truncate">{doc.file_path.split('/').pop()}</p>
                      </div>
                    </div>
                    {doc.signedUrl ? (
                      <a 
                        href={doc.signedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
                        title="Ver Documento"
                      >
                        <span className="material-icons-round">visibility</span>
                      </a>
                    ) : (
                      <span className="text-xs text-red-500 px-2">Error de enlace</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision Area */}
          {(appData.status === 'pending' || appData.status === 'under_review') && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">Resolución de Auditoría</h3>
              
              {!action ? (
                <div className="flex gap-4">
                  <button 
                    onClick={() => setAction('approve')}
                    className="flex-1 bg-aibapt-green hover:bg-aibapt-green/90 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-icons-round">check_circle</span> Aprobar Solicitud
                  </button>
                  <button 
                    onClick={() => setAction('reject')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-icons-round">cancel</span> Rechazar Solicitud
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {action === 'approve' ? 'Notas de Aprobación (Opcional)' : 'Motivo del Rechazo (Obligatorio)'}
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      rows={3}
                      placeholder={action === 'approve' ? 'Notas internas (ej. ID de certificado generado)...' : 'Explique qué documentos faltan o por qué se rechaza el trámite...'}
                    ></textarea>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-center gap-2">
                      <span className="material-icons-round text-[18px]">error</span> {error}
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button 
                      disabled={submitting}
                      onClick={() => setAction(null)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      disabled={submitting}
                      onClick={() => handleProcess(action === 'approve' ? 'approved' : 'rejected')}
                      className={`px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        action === 'approve' ? 'bg-aibapt-green hover:bg-aibapt-green/90' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {submitting ? (
                        <span className="material-icons-round animate-spin">refresh</span>
                      ) : (
                        <span className="material-icons-round">gavel</span>
                      )}
                      Confirmar {action === 'approve' ? 'Aprobación' : 'Rechazo'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
