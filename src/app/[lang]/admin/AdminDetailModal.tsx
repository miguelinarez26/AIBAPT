'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { ApplicationStatusBadge } from '@/components/dashboard/ApplicationStatusBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Document } from '@/types/database';
import { toast } from 'sonner';
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
  const [action, setAction] = useState<'approve' | 'reject' | 'review' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

        // Cargar detalles del curso acreditado (instructor, etc.)
        if (appObj.metadata && (appObj.metadata as any).course_id) {
          const { data: courseData, error: courseError } = await supabase
            .from('courses_accredited')
            .select('*')
            .eq('id', (appObj.metadata as any).course_id)
            .single();
          if (!courseError && courseData) {
            appObj.course_details = courseData;
          }
        }
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
      setError(t("admin.modal.error.notes") || "Debes incluir una nota para rechazar.");
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

      toast.success(`¡Solicitud ${newStatus === 'approved' ? 'aprobada' : 'rechazada'} exitosamente!`);
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
      toast.error(t("admin.modal.error.file") || "Error al abrir el archivo.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-secondary/20 shadow-xl flex flex-col items-center max-w-xs w-full">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-light dark:text-zinc-300 font-medium text-sm text-center">{t("admin.modal.loading")}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[32px] border border-secondary/20 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center bg-white dark:bg-zinc-900">
          <div>
            <h2 className="text-xl font-bold text-text-light dark:text-white flex items-center gap-2">
              <span className="material-icons-round text-primary">policy</span>
              {t("admin.modal.title")}
            </h2>
            <p className="text-xs text-text-dark dark:text-zinc-400 mt-1">ID: {appData.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-dark hover:text-text-light dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
            aria-label="Cerrar"
          >
            <span className="material-icons-round text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-text-dark dark:text-zinc-400 mb-4 flex items-center gap-2">
                <span className="material-icons-round text-[18px]">person</span>
                {t("admin.modal.applicant_data")}
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/30 pb-2 last:border-0 last:pb-0">
                  <span className="text-text-dark dark:text-zinc-400">{t("profile.fields.names")}:</span>{" "}
                  <strong className="text-text-light dark:text-white font-semibold">
                    {appData.profiles?.first_name ? `${appData.profiles.first_name} ${appData.profiles.last_name}`.trim() : appData.profiles?.full_name || 'N/A'}
                  </strong>
                </p>
                <p className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/30 pb-2 last:border-0 last:pb-0">
                  <span className="text-text-dark dark:text-zinc-400">Email:</span>{" "}
                  <strong className="text-text-light dark:text-white font-semibold">{appData.profiles?.email || 'N/A'}</strong>
                </p>
                {appData.profiles?.member_number && (
                  <p className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/30 pb-2 last:border-0 last:pb-0">
                    <span className="text-text-dark dark:text-zinc-400">{t("dashboard.membership.id" as any)}:</span>{" "}
                    <strong className="text-primary font-bold tracking-wider">{appData.profiles.member_number}</strong>
                  </p>
                )}
                <p className="flex justify-between items-center pt-1">
                  <span className="text-text-dark dark:text-zinc-400">ID Usuario:</span>{" "}
                  <code className="text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg text-text-dark dark:text-zinc-300 font-mono">{appData.user_id}</code>
                </p>
              </div>
            </div>

            <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
              <h3 className="text-sm font-bold text-primary dark:text-secondary mb-4 flex items-center gap-2">
                <span className="material-icons-round text-[18px]">info</span>
                {t("admin.modal.application_info")}
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between items-center border-b border-primary/10 pb-2 last:border-0 last:pb-0">
                  <span className="text-text-dark dark:text-zinc-400">{t("admin.table.application")}:</span>{" "}
                  <strong className="text-text-light dark:text-white font-semibold">{humanTramiteName}</strong>
                </p>
                <p className="flex justify-between items-center border-b border-primary/10 pb-2 last:border-0 last:pb-0">
                  <span className="text-text-dark dark:text-zinc-400">{t("admin.table.status")}:</span>{" "}
                  <ApplicationStatusBadge status={appData.status} />
                </p>
                <p className="flex justify-between items-center pt-1">
                  <span className="text-text-dark dark:text-zinc-400">{t("admin.table.date")}:</span>{" "}
                  <strong className="text-text-light dark:text-white font-semibold">{new Date(appData.created_at).toLocaleString()}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Panel de Auditoría Académica (CCA) */}
          {appData.course_details && (
            <div className="p-6 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-4">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <span className="material-icons-round text-[18px] flex items-center">workspace_premium</span>
                Auditoría de curso acreditado
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <p className="flex justify-between items-center border-b border-amber-500/10 pb-2">
                    <span className="text-text-dark dark:text-zinc-400">Instructor avalado:</span>{" "}
                    <strong className="text-text-light dark:text-white font-semibold">
                      {appData.course_details.instructor_name || "N/A"}
                    </strong>
                  </p>
                  <p className="flex justify-between items-center pt-1">
                    <span className="text-text-dark dark:text-zinc-400">Créditos oficiales del curso:</span>{" "}
                    <strong className="text-text-light dark:text-white font-semibold">
                      {appData.course_details.credits || 12} CCA
                    </strong>
                  </p>
                </div>

                <div className="space-y-2">
                  {(() => {
                    const finishDateStr = metadata.fecha_finalizacion;
                    if (!finishDateStr) return <p className="text-text-dark dark:text-zinc-400 italic">Fecha de finalización no provista.</p>;
                    
                    const finishDate = new Date(finishDateStr);
                    const today = new Date();
                    const diffMonths = (today.getFullYear() - finishDate.getFullYear()) * 12 + today.getMonth() - finishDate.getMonth();
                    const isOverLimit = diffMonths > 5;
                    
                    return (
                      <>
                        <p className="flex justify-between items-center border-b border-amber-500/10 pb-2">
                          <span className="text-text-dark dark:text-zinc-400">Fecha de conclusión:</span>{" "}
                          <strong className="text-text-light dark:text-white font-semibold">
                            {new Date(finishDateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </strong>
                        </p>
                        <p className="flex justify-between items-center pt-1">
                          <span className="text-text-dark dark:text-zinc-400">Tiempo transcurrido:</span>{" "}
                          <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${isOverLimit ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-red-400' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary'}`}>
                            {diffMonths} meses
                          </span>
                        </p>
                        {isOverLimit && (
                          <div className="text-xs text-accent dark:text-red-400 font-bold flex items-center gap-1.5 mt-2 bg-accent/5 p-2 rounded-lg border border-accent/10">
                            <span className="material-icons-round text-xs">error</span>
                            Excede el límite normativo de 5 meses.
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          {Object.keys(metadata).length > 0 && (
            <div>
              <h3 className="text-md font-bold text-text-light dark:text-white mb-4">Datos adicionales</h3>
              <div className="bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800/50">
                <ul className="space-y-1 text-sm">
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
                        ? (lang === 'es' ? 'Categoría de socio' : 'Categoria de sócio')
                        : (lang === 'es' ? 'Escenario' : 'Cenário'),
                      'categoria_membresia': lang === 'es' ? 'Categoría de membresía' : 'Categoria de membresia',
                      'monto_pagado': t("field.label.monto_pagado"),
                      'monto': t("field.label.monto_pagado"),
                      'inversion': t("field.label.inversion"),
                      'modalidad_online': t("field.label.modalidad"),
                      'idioma_solicitud': lang === 'es' ? 'Idioma de solicitud' : 'Idioma da solicitação',
                      'tramite_tipo': lang === 'es' ? 'Tipo de trámite' : 'Tipo de trâmite',
                      'fecha_pago': t("field.label.fecha_pago"),
                      'referencia': t("field.label.referencia"),
                    };
                    const displayKey = keyLabelMap[key] || key.replace(/_/g, ' ');

                    return (
                      <li key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-100 dark:border-zinc-800/50 py-3 last:border-0 last:pb-0">
                        <span className="text-xs font-semibold text-text-dark dark:text-zinc-400 w-full sm:w-1/3">{displayKey}</span>
                        <span className="text-sm text-text-light dark:text-white font-semibold sm:w-2/3 sm:text-right">{displayValue}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <h3 className="text-md font-bold text-text-light dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons-round text-text-dark">folder_open</span>
              {t("admin.modal.attached_docs")}
            </h3>
            {documents.length === 0 ? (
              <p className="text-sm text-text-dark italic bg-zinc-50/30 dark:bg-zinc-900/20 p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800/80 text-center">
                {t("admin.table.empty")}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl hover:shadow-sm hover:border-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 text-accent rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-icons-round text-xl">picture_as_pdf</span>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-text-light dark:text-white truncate">
                          {DOC_TYPE_LABELS[doc.document_type]?.[lang] || DOC_TYPE_LABELS[doc.document_type]?.['es'] || doc.document_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-text-dark dark:text-zinc-400 truncate">{doc.file_path.split('/').pop()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewDocument(doc.file_path)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all duration-200 shrink-0 hover:scale-105 active:scale-95"
                      title="Visualizar documento"
                    >
                      <span className="material-icons-round">visibility</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision Area */}
          {(appData.status === 'pending' || appData.status === 'under_review' || appData.status === 'rejected') && (
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
              <h3 className="text-md font-bold text-text-light dark:text-white mb-4">Resolución del trámite</h3>
              
              {!action ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setAction('approve')} 
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0"
                  >
                    <span className="material-icons-round text-lg">check_circle</span>
                    {t("admin.modal.approve_btn") || "Aprobar"}
                  </button>
                  <button 
                    onClick={() => setAction('reject')} 
                    className="flex-1 bg-accent hover:bg-accent/95 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 active:translate-y-0"
                  >
                    <span className="material-icons-round text-lg">cancel</span>
                    {t("admin.modal.reject_btn") || "Rechazar"}
                  </button>
                  {appData.status === 'pending' && (
                    <button 
                      onClick={() => setAction('review')} 
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 active:translate-y-0"
                    >
                      <span className="material-icons-round text-lg">schedule</span>
                      {lang === 'es' ? 'En Revisión' : 'Em Revisão'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-50/50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-light dark:text-zinc-300 mb-2">
                      {action === 'approve' ? t("admin.modal.notes_approve") : action === 'reject' ? t("admin.modal.notes_reject") : (lang === 'es' ? 'Notas de revisión (opcional)' : 'Notas de revisão (opcional)')}
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-text-light dark:text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                      rows={3}
                    ></textarea>
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50 animate-fade-in">
                      <span className="material-icons-round mr-2 text-lg">error_outline</span>
                      {error}
                    </div>
                  )}



                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setAction(null)} 
                      className="px-5 py-2.5 text-text-dark hover:text-text-light hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full font-medium transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <button 
                      disabled={submitting}
                      onClick={() => {
                        if (action === 'reject' && !adminNotes.trim()) {
                          setError(t("admin.modal.error.notes") || "Debes incluir una nota para rechazar.");
                          return;
                        }
                        setError(null);
                        setShowConfirmModal(true);
                      }}
                      className={`px-6 py-2.5 text-white rounded-full font-medium flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                        action === 'approve' 
                          ? 'bg-primary hover:shadow-lg hover:shadow-primary/20' 
                          : action === 'reject'
                            ? 'bg-accent hover:shadow-lg hover:shadow-accent/20'
                            : 'bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20'
                      }`}
                    >
                      {submitting ? (
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                      ) : (
                        <span className="material-icons-round text-lg">{action === 'review' ? 'schedule' : 'gavel'}</span>
                      )}
                      {action === 'approve' ? (lang === 'es' ? 'Confirmar Aprobación' : 'Confirmar Aprovação') : action === 'reject' ? (lang === 'es' ? 'Confirmar Rechazo' : 'Confirmar Rejeição') : (lang === 'es' ? 'Confirmar Estado' : 'Confirmar Status')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 text-text-light dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold rounded-full transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
          >
            <span className="material-icons-round text-lg">arrow_back</span>
            {lang === 'es' ? 'Volver al listado' : 'Voltar à listagem'}
          </button>
        </div>
      </div>

      {/* Confirm Modal Overlay */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-secondary/20 shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${action === 'approve' ? 'bg-primary/10 text-primary' : action === 'reject' ? 'bg-accent/10 text-accent' : 'bg-amber-500/10 text-amber-500'}`}>
                <span className="material-icons-round text-2xl">{action === 'approve' ? 'info' : action === 'reject' ? 'warning_amber' : 'schedule'}</span>
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-2">
                {lang === 'es' ? 'Confirmación requerida' : 'Confirmação necessária'}
              </h3>
              <p className="text-sm text-text-dark dark:text-zinc-400 mb-6">
                {lang === 'es' 
                  ? `¿Estás seguro de que deseas ${action === 'approve' ? 'aprobar' : action === 'reject' ? 'rechazar' : 'marcar en revisión'} esta solicitud?`
                  : `Tem certeza de que deseja ${action === 'approve' ? 'aprovar' : action === 'reject' ? 'rejeitar' : 'marcar em revisão'} esta solicitação?`}
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  disabled={submitting}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-text-dark hover:text-text-light hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full font-medium transition-all text-sm"
                >
                  Cancelar
                </button>
                <button 
                  disabled={submitting}
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleProcess(action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'under_review');
                  }}
                  className={`px-5 py-2 text-white rounded-full font-medium flex items-center gap-2 transition-all text-sm ${action === 'approve' ? 'bg-primary hover:bg-primary/90' : action === 'reject' ? 'bg-accent hover:bg-accent/90' : 'bg-amber-500 hover:bg-amber-600'}`}
                >
                  {action === 'approve' ? (lang === 'es' ? 'Confirmar Aprobación' : 'Confirmar Aprovação') : action === 'reject' ? (lang === 'es' ? 'Confirmar Rechazo' : 'Confirmar Rejeição') : (lang === 'es' ? 'Marcar en Revisión' : 'Marcar em Revisão')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
