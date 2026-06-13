'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Document } from '@/types/database';

interface AdminDetailModalProps {
  applicationId: string;
  lang: 'es' | 'pt';
  onClose: () => void;
  onUpdate: () => void;
}

export default function AdminDetailModal({ applicationId, lang, onClose, onUpdate }: AdminDetailModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appData, setAppData] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (appError) {
        console.error("❌ [AdminDetailModal] Error al cargar la solicitud:", appError);
        setLoading(false);
        return;
      }

      const appObj = application as any;

      if (appObj) {
        // Cargar perfil en paralelo
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, full_name, email, member_number, language_preference')
          .eq('id', appObj.user_id)
          .single();

        if (profileError) {
          console.warn("⚠️ [AdminDetailModal] Error al cargar el perfil del usuario:", profileError);
        }

        // Cargar tipo de acreditación
        const { data: accType, error: accTypeError } = await supabase
          .from('accreditation_types')
          .select('id, name')
          .eq('id', appObj.type_id)
          .single();

        if (accTypeError) {
          console.warn("⚠️ [AdminDetailModal] Error al cargar el tipo de acreditación:", accTypeError);
        }

        // Combinar datos en el objeto application
        appObj.profiles = profile || null;
        appObj.accreditation_types = accType || null;
      }

      setAppData(appObj);

      console.log("[Admin] Buscando documentos para APP_ID:", applicationId);
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', applicationId);

      if (!docsError && docsData) {
        setDocuments(docsData as Document[]);
      }
      setLoading(false);
    }

    loadDetail();
  }, [applicationId]);

  const handleProcess = async (newStatus: 'approved' | 'rejected') => {
    if (newStatus === 'rejected' && !adminNotes.trim()) {
      setError(t("admin.modal.error.notes"));
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

  const handleViewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('private-certifications')
        .createSignedUrl(filePath, 60);

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (err: any) {
      alert(t("admin.modal.error.file"));
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t("admin.modal.loading")}</p>
        </div>
      </div>
    );
  }

  if (!appData) return null;

  const metadata = appData.metadata as Record<string, any> || {};
  const isMembresia = appData.accreditation_types?.name?.includes('membresia');

  const TRAMITE_NAMES: Record<string, string> = {
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
  const humanTramiteName = TRAMITE_NAMES[appData.accreditation_types?.name || ''] || appData.accreditation_types?.name?.replace(/_/g, ' ') || t("status.unknown");

  const DOC_TYPE_LABELS: Record<string, Record<'es' | 'pt', string>> = {
    'hoja_inscripcion': { es: 'Hoja de Inscripción', pt: 'Ficha de Inscrição' },
    'solicitud_ingreso': { es: 'Solicitud de Ingreso', pt: 'Solicitação de Ingresso' },
    'titulo_profesional': { es: 'Título Profesional', pt: 'Título Profissional' },
    'cv': { es: 'Currículum Vitae', pt: 'Currículum Vitae' },
    'comprobante_formacion_sm': { es: 'Diploma Abordaje Trauma', pt: 'Diploma Abordagem Trauma' },
    'comprobante_formacion_as': { es: 'Certificado Taller 10h', pt: 'Certificado Workshop 10h' },
    'carta_recomendacion_1': { es: 'Carta de Recomendación (1)', pt: 'Carta de Recomendação (1)' },
    'carta_recomendacion_2': { es: 'Carta de Recomendación (2)', pt: 'Carta de Recomendação (2)' },
    'registro_legal': { es: 'Registro Legal Institución', pt: 'Registro Legal Instituição' },
    'comprobante_pago': { es: 'Comprobante de Pago', pt: 'Comprovante de Pagamento' },
    'cv_instructor': { es: 'CV del Instructor', pt: 'CV do Instrutor' },
    'formulario_solicitud': { es: 'Formulario de Solicitud', pt: 'Formulário de Solicitação' },
    'ficha_tecnica': { es: 'Ficha Técnica', pt: 'Ficha Técnica' },
    'calendario_marketing': { es: 'Calendario y Marketing', pt: 'Calendário e Marketing' },
    'material_didactico': { es: 'Material Didáctico', pt: 'Material Didático' },
    'control_asistencia': { es: 'Control de Asistencia', pt: 'Controle de Freqüência' },
    'cuestionario_evaluacion': { es: 'Cuestionario de Evaluación', pt: 'Questionário de Avaliação' },
    'cv_facilitador': { es: 'CV del Facilitador', pt: 'CV do Facilitador' },
    'ficha_solicitacion_tecnica': { es: 'Ficha de Solicitación', pt: 'Ficha de Solicitação' },
    'calendario_evento': { es: 'Calendario del Evento', pt: 'Calendário do Evento' },
    'material_evento': { es: 'Material del Evento', pt: 'Material do Evento' },
    'formularios_gestion': { es: 'Formularios de Gestión', pt: 'Formulários de Gestão' },
    'certificado_formacion_basica': { es: 'Certificado de Formación Básica', pt: 'Certificado de Formação Básica' },
    'certificado_curso_avanzado': { es: 'Certificado de Curso Avanzado', pt: 'Certificado de Curso Avançado' },
    'cartas_recomendacion_colegas': { es: '2 Cartas de Recomendación (Colegas)', pt: '2 Cartas de Recomendação (Colegas)' },
    'carta_recomendacion_supervisor': { es: 'Carta de recomendación de Supervisor', pt: 'Carta de recomendação de Supervisor' },
    'certificados_entrenamiento_basico': { es: 'Certificados de Entrenamiento Básico', pt: 'Certificados de Treinamento Básico' },
    'certificado_psicoterapeuta': { es: 'Certificado de Psicoterapeuta', pt: 'Certificado de Psicoterapeuta' },
    'carta_recomendacion_trainer': { es: 'Carta de recomendación de Trainer', pt: 'Carta de recomendação de Trainer' },
    'registro_supervision': { es: 'Registro de Supervisión', pt: 'Registro de Supervisão' },
    'portafolio_creditos': { es: 'Portafolio de Créditos CCA', pt: 'Portfólio de Créditos CCA' },
    'declaracion_etica': { es: 'Declaración Ética', pt: 'Declaração Ética' },
    'certificado_externo': { es: 'Certificado Externo', pt: 'Certificado Externo' },
    'aval_membresia': { es: 'Aval de Membresía', pt: 'Aval de Membresia' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-icons-round text-primary">policy</span>
              {t("admin.modal.title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID: {appData.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-icons-round text-[18px]">person</span> {t("admin.modal.applicant_data")}
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-gray-500">{t("profile.fields.names")}:</span>{" "}
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
                    <span className="text-gray-500">{t("dashboard.membership.id" as any)}:</span>{" "}
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
                <span className="material-icons-round text-[18px]">info</span> {t("admin.modal.application_info")}
              </h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-500">{t("admin.table.application")}:</span> <strong className="text-gray-900 dark:text-white">{humanTramiteName}</strong></p>
                <p><span className="text-gray-500">{t("admin.table.status")}:</span> <ApplicationStatusBadge status={appData.status} /></p>
                <p><span className="text-gray-500">{t("admin.table.date")}:</span> <strong className="text-gray-900 dark:text-white">{new Date(appData.created_at).toLocaleString()}</strong></p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {Object.keys(metadata).length > 0 && (
            <div>
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">{t("admin.modal.extra_data")}</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <ul className="space-y-2 text-sm">
                  {Object.entries(metadata)
                    .filter(([key]) => !(key === 'modalidad_online' && isMembresia))
                    .map(([key, value]) => {
                    let displayValue = String(value);
                    
                    // Lógica de valores humanizados
                    if (typeof value === 'boolean') {
                      if (key === 'modalidad_online') {
                        displayValue = value ? t("field.label.online") : t("field.label.presencial");
                      } else {
                        displayValue = value ? t("field.label.si") : t("field.label.no");
                      }
                    } else if (key === 'monto_pagado' || key === 'monto' || key === 'inversion') {
                      displayValue = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'pt-BR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(Number(value));
                    } else if (key === 'escenario' || key === 'categoria_membresia') {
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

                    // Lógica de etiquetas humanizadas (Keys)
                    const keyLabelMap: Record<string, string> = {
                      'escenario': appData.accreditation_types?.name?.includes('membresia') 
                        ? (lang === 'es' ? 'Categoría de Socio' : 'Categoria de Sócio')
                        : (lang === 'es' ? 'Escenario' : 'Cenário'),
                      'categoria_membresia': lang === 'es' ? 'Categoría de Membresía' : 'Categoria de Membresia',
                      'monto_pagado': t("field.label.monto_pagado"),
                      'monto': t("field.label.monto_pagado"),
                      'inversion': t("field.label.inversion"),
                      'modalidad_online': t("field.label.modalidad"),
                      'idioma_solicitud': lang === 'es' ? 'Idioma de Solicitud' : 'Idioma da Solicitação',
                      'tramite_tipo': lang === 'es' ? 'Tipo de Trámite' : 'Tipo de Trâmite',
                      'fecha_pago': t("field.label.fecha_pago"),
                      'referencia': t("field.label.referencia"),
                    };
                    const displayKey = keyLabelMap[key] || key.replace(/_/g, ' ');

                    return (
                      <li key={key} className="flex flex-col sm:flex-row sm:gap-4 border-b border-gray-200 dark:border-gray-800 py-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted w-full sm:w-1/3">{displayKey}</span>
                        <span className="text-sm text-secondary dark:text-white font-bold">{displayValue}</span>
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
              <span className="material-icons-round text-gray-400">folder_open</span> {t("admin.modal.attached_docs")}
            </h3>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">{t("admin.table.empty")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-icons-round">picture_as_pdf</span>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {DOC_TYPE_LABELS[doc.document_type]?.[lang] || DOC_TYPE_LABELS[doc.document_type]?.['es'] || doc.document_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{doc.file_path.split('/').pop()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewDocument(doc.file_path)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0 hover:scale-110 active:scale-95 duration-150"
                    >
                      <span className="material-icons-round">visibility</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision Area */}
          {(appData.status === 'pending' || appData.status === 'under_review') && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">{t("admin.modal.resolution")}</h3>
              
              {!action ? (
                <div className="flex gap-4">
                  <button onClick={() => setAction('approve')} className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                    <span className="material-icons-round">check_circle</span> {t("admin.modal.approve_btn")}
                  </button>
                  <button onClick={() => setAction('reject')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                    <span className="material-icons-round">cancel</span> {t("admin.modal.reject_btn")}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {action === 'approve' ? t("admin.modal.notes_approve") : t("admin.modal.notes_reject")}
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white outline-none"
                      rows={3}
                    ></textarea>
                  </div>

                  {error && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{error}</div>}

                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setAction(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Cancelar</button>
                    <button 
                      disabled={submitting}
                      onClick={() => handleProcess(action === 'approve' ? 'approved' : 'rejected')}
                      className={`px-6 py-2 text-white rounded-lg font-medium flex items-center gap-2 ${action === 'approve' ? 'bg-primary' : 'bg-red-600'}`}
                    >
                      {submitting ? <span className="material-icons-round animate-spin">refresh</span> : <span className="material-icons-round">gavel</span>}
                      {t("admin.modal.confirm")} {action === 'approve' ? t("admin.filter.approved") : t("admin.filter.rejected")}
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
