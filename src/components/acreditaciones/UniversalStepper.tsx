"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AIBAPT_TRAMITES, EscenarioEvento, LocalizedText } from "@/config/aibapt-config";
import { CheckCircle, UploadCloud, Info, FileDown, ArrowLeft, Loader2, ShieldAlert, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Profile, AccreditationType } from "@/types/database";

interface UniversalStepperProps {
  tramiteId: string;
  onBack: () => void;
  initialEscenario?: string;
}

export function UniversalStepper({ tramiteId, onBack, initialEscenario = "" }: UniversalStepperProps) {
  const { t } = useLanguage();
  const params = useParams();
  const lang = (params?.lang as "es" | "pt") || "es";
  const searchParams = useSearchParams();

  // Helper de traducción estricto
  const getTranslation = (obj: LocalizedText | string | undefined): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || "";
  };

  const config = AIBAPT_TRAMITES[tramiteId];
  const isMembresiaPreselected = tramiteId === 'solicitud_membresia' && !!initialEscenario;
  
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  
  // States
  const [selectedEscenario, setSelectedEscenario] = useState<string>(() => {
    if (initialEscenario) return initialEscenario;
    if (config && config.monto.length === 1) return config.monto[0].id;
    return "";
  });
  const [isOnline, setIsOnline] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Contact states
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Profile and Dynamic Prices
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [accreditationType, setAccreditationType] = useState<AccreditationType | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [membershipError, setMembershipError] = useState<string | null>(null);

  // Scroll al inicio al montar el componente para evitar que se quede abajo tras hacer click en una tarjeta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync scenario from URL if not preselected
  useEffect(() => {
    if (initialEscenario) return;
    const scenarioParam = searchParams.get("tipo_membresia") || searchParams.get("escenario");
    if (scenarioParam) setSelectedEscenario(scenarioParam);
  }, [searchParams, initialEscenario]);

  const loadMembershipData = async () => {
    console.log("🔍 [UniversalStepper] Iniciando carga de datos de membresía...");
    console.log("🔍 [UniversalStepper] session.user.id:", session?.user?.id);
    console.log("🔍 [UniversalStepper] config.id (tramiteId):", config?.id);

    if (!session?.user || !config) {
      console.warn("⚠️ [UniversalStepper] No hay sesión de usuario o configuración válida.");
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      const supabase = createBrowserSupabaseClient();
      
      // Carga de perfil resiliente
      console.log("🔍 [UniversalStepper] Consultando perfil en Supabase...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("❌ [UniversalStepper] Error consultando tabla profiles:", profileError);
        throw profileError;
      }
      console.log("🔍 [UniversalStepper] Perfil obtenido:", profile);

      // Si no hay perfil, creamos un mock seguro con valores por defecto
      const safeProfile = (profile || {
        id: session.user.id,
        email: session.user.email,
        is_member: false,
        role: 'guest',
        first_name: '',
        last_name: ''
      }) as unknown as Profile;

      setUserProfile(safeProfile);

      // Carga de precios dinámicos
      const typeKey = config.accreditationTypeKey || config.id;
      console.log("🔍 [UniversalStepper] Consultando typeKey en accreditation_types:", typeKey);
      if (typeKey) {
        const { data: accType, error: accTypeError } = await supabase
          .from('accreditation_types')
          .select('*')
          .eq('name', typeKey)
          .maybeSingle();
        
        if (accTypeError) {
          console.error("❌ [UniversalStepper] Error consultando accreditation_types:", accTypeError);
        }
        console.log("🔍 [UniversalStepper] Tipo de acreditación obtenido:", accType);
        
        if (accType) {
          setAccreditationType(accType as AccreditationType);
        } else {
          console.warn(`⚠️ [UniversalStepper] No se encontró ningún registro con name = '${typeKey}' en accreditation_types.`);
        }
      }
    } catch (err: any) {
      console.error("❌ [UniversalStepper] Excepción atrapada en loadMembershipData:", err);
      setMembershipError(err.message || "Error cargando datos de perfil");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadMembershipData();
  }, [session, config?.accreditationTypeKey]);

  // Lógica de Precios y Escenarios
  const isMember = userProfile?.is_member ?? false;
  const currentEscenarioObj = config?.monto.find(e => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_'));
  const isContactFormMode = currentEscenarioObj?.isContactForm === true;

  // Validación de esquema dinámica
  const generateSchema = (escenarioValue?: string) => {
    const shape: any = {
      escenario: z.string().min(1, "Debes seleccionar un nivel")
    };

    config.fields.forEach(field => {
      if (field.dependsOnEscenario && escenarioValue && !field.dependsOnEscenario.includes(escenarioValue)) return;
      shape[field.name] = field.validator;
    });

    return z.object(shape);
  };

  const { control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<any>({
    resolver: (values, context, options) => {
      return zodResolver(generateSchema(values.escenario))(values, context, options);
    },
    defaultValues: {
      escenario: initialEscenario || searchParams.get("tipo_membresia") || searchParams.get("escenario") || ""
    }
  });

  useEffect(() => {
    if (selectedEscenario) setValue("escenario", selectedEscenario);
  }, [selectedEscenario, setValue]);

  const onSubmit = async (data: any) => {
    if (!session?.user || !config) return;
    if (!accreditationType) {
      setSubmitError(lang === "es" ? "Error: Tipo de trámite no cargado en la base de datos." : "Erro: Tipo de trâmite não carregado no banco de dados.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const supabase = createBrowserSupabaseClient();
    let applicationId: string | null = null;
    const uploadedFiles: Record<string, string> = {};

    try {
      // Resolver Monto Final
      const directMatch = config.monto.find(e => e.id === data.escenario);
      const parentMatch = config.monto.find(e => e.subProfiles?.some(sp => sp.id === data.escenario));
      const finalPrice = directMatch?.monto ?? parentMatch?.monto ?? 0;

      // Resolver categoría EMDR para metadata enriquecida
      const categoriaEmdr = config.accreditationTypeKey?.startsWith('EMDR') ? config.accreditationTypeKey : null;

      // Crear Solicitud
      const { data: appData, error: appError } = await (supabase.from('applications') as any).insert({
        user_id: session.user.id,
        type_id: accreditationType.id,
        status: 'uploading',
        metadata: {
          escenario: data.escenario,
          nivel_solicitado: tramiteId,
          categoria_emdr: categoriaEmdr,
          precio_aplicado: finalPrice,
          monto_pagado: finalPrice,
          idioma: lang,
          modalidad_online: isOnline
        }
      }).select('id').maybeSingle();

      if (appError) throw appError;
      applicationId = appData?.id || null;

      // Subida de Archivos
      for (const field of config.fields) {
        const fileList = data[field.name];
        if (fileList?.[0]) {
          const file = fileList[0];
          const fileName = `${field.name}_${Date.now()}.${file.name.split('.').pop()}`;
          const filePath = `${tramiteId}/${session.user.id}/${applicationId}/${fileName}`;
          
          const { error: storageError } = await supabase.storage
            .from('private-certifications')
            .upload(filePath, file);
          
          if (storageError) throw storageError;
          uploadedFiles[field.name] = filePath;
        }
      }

      // Vincular documentos
      const docs = Object.entries(uploadedFiles).map(([type, path]) => ({
        application_id: applicationId,
        user_id: session.user.id,
        file_path: path,
        document_type: type,
        is_private: true
      }));

      if (docs.length > 0) {
        const { error: docsError } = await (supabase.from('documents') as any).insert(docs);
        if (docsError) throw docsError;
      }

      // Finalizar
      await (supabase.from('applications') as any).update({ status: 'pending' }).eq('id', applicationId);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Error procesando solicitud");
      
      // Rollback: Eliminar archivos subidos del Storage
      const filePathsToClean = Object.values(uploadedFiles);
      if (filePathsToClean.length > 0) {
        try {
          await supabase.storage
              .from('private-certifications')
              .remove(filePathsToClean);
        } catch (storageCleanupError) {
          console.error("Error al limpiar archivos del storage durante rollback:", storageCleanupError);
        }
      }

      if (applicationId) await (supabase.from('applications') as any).delete().eq('id', applicationId);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) return <p className="p-10 text-center">Configuración no encontrada.</p>;

  if (isLoadingProfile) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-3xl p-10 text-center shadow-lg border border-accent/20">
        <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
        <p className="text-text-muted">Cargando motor de trámites...</p>
      </div>
    );
  }

  // Restricción de Membresía
  if (config.requiresMembership && !userProfile?.is_member) {
    const isLoggedIn = !!session?.user;

    return (
      <div className="bg-white dark:bg-surface-dark border border-amber-200 dark:border-amber-900 rounded-3xl p-10 text-center shadow-lg max-w-2xl mx-auto mb-8 animate-fade-in-up">
        <ShieldAlert className="w-20 h-20 text-amber-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
          {isLoggedIn 
             ? (lang === "es" ? "Membresía Requerida" : "Membresia Requerida")
             : (lang === "es" ? "Inicia Sesión" : "Faça Login")
          }
        </h2>
        <p className="text-text-muted mb-8 text-lg">
          {isLoggedIn
             ? (lang === "es"
                 ? "Este trámite está restringido únicamente a miembros activos de AIBAPT. Por favor, solicita tu membresía primero."
                 : "Este trâmite é restrito apenas a membros ativos da AIBAPT. Por favor, solicite sua membresia primeiro.")
             : (lang === "es"
                 ? "Debes iniciar sesión para verificar tu estado de membresía y continuar con este trámite."
                 : "Você deve fazer login para verificar seu status de membresia e continuar com este trâmite.")
          }
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="border border-gray-300 dark:border-gray-700 text-text-main dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {lang === "es" ? "Volver" : "Voltar"}
          </button>
          
          {isLoggedIn ? (
            <button
              onClick={() => window.location.href = `/${lang}/dashboard?tramite=solicitud_membresia`}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark flex items-center justify-center gap-3 group/btn"
            >
              {lang === "es" ? "Solicitar Membresía" : "Solicitar Membresia"}
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          ) : (
            <button
              onClick={() => window.location.href = `/${lang}/login?redirect=/${lang}/formaciones?tab=accreditation`}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark flex items-center justify-center gap-3 group/btn"
            >
              {lang === "es" ? "Iniciar Sesión" : "Fazer Login"}
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-green-200 dark:border-green-900 rounded-3xl p-10 text-center shadow-lg">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">¡Solicitud Enviada!</h2>
        <p className="text-text-muted mb-8 text-lg">Hemos recibido tus documentos. Revisaremos tu solicitud en un plazo de 15 días hábiles.</p>
        <button onClick={() => window.location.href = `/${lang}/dashboard`} className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark flex items-center justify-center gap-3 group/btn mx-auto">
          Ir al Dashboard
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 rounded-3xl p-6 md:p-10 shadow-lg relative">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-sm font-medium text-text-muted hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </button>

      <div className="text-center mt-8 md:mt-0 mb-10">
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2">{getTranslation(config.title)}</h2>
        <p className="text-text-muted dark:text-gray-400 mb-4">{getTranslation(config.description)}</p>
        {/* Badge de inversión — cambia según si el trámite es gratuito o de pago */}
        {config.monto.length === 1 && (
          config.monto[0].monto === 0 ? (
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-black border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              {lang === 'es' ? 'Trámite Gratuito — Exento de Pago' : 'Trâmite Gratuito — Isento de Pagamento'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/8 text-primary text-sm font-black border border-primary/20 shadow-sm">
              {lang === 'es' ? `Inversión: ${config.monto[0].monto} €` : `Investimento: ${config.monto[0].monto} €`}
              <span className="text-primary/60 font-medium">· PayPal: financiero@aibapt.org</span>
            </span>
          )
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step >= num ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
              {num}
            </div>
            {num < 2 && <div className={`w-24 h-1 mx-3 ${step > num ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-10 animate-fade-in-up">
          {/* Selección de Escenario o Detalles del Trámite */}
          {initialEscenario ? (
            <div className="bg-cream/40 dark:bg-bg-dark/40 border border-accent/15 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase tracking-widest block mb-1">Nivel Seleccionado</span>
                <h4 className="font-bold text-text-main dark:text-white text-xl">
                  {getTranslation(
                    config.monto.find(e => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_'))?.label || 
                    config.monto[0].label
                  )}
                </h4>
                <p className="text-sm text-text-muted mt-1 max-w-xl leading-relaxed">
                  {getTranslation(
                    config.monto.find(e => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_'))?.description || 
                    config.monto[0].description
                  )}
                </p>
              </div>
              <div className="sm:text-right shrink-0 bg-white dark:bg-surface-dark px-6 py-4 rounded-2xl border border-accent/10 shadow-sm flex flex-col items-start sm:items-end">
                <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase tracking-widest block mb-0.5">Inversión</span>
                <span className="text-2xl font-black text-primary">
                  {config.monto.find(e => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_'))?.monto || 
                   config.monto[0].monto} €
                </span>
              </div>
            </div>
          ) : config.monto.length > 1 ? (
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-primary flex items-center mb-6">
                <ShieldAlert className="w-6 h-6 mr-2" /> Selección de Nivel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.monto.map((esc) => {
                  const isSelected = selectedEscenario === esc.id || 
                    (esc.subProfiles && esc.subProfiles.some((sp: any) => sp.id === selectedEscenario)) || 
                    selectedEscenario.startsWith(esc.id + '_');
                  return (
                    <button
                      key={esc.id}
                      type="button"
                      onClick={() => setSelectedEscenario(esc.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 ease-out hover:shadow-lg ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                          : 'border-gray-50 dark:border-gray-800 hover:border-primary/20'
                      }`}
                    >
                      <p className="font-bold text-text-main dark:text-white text-lg">{getTranslation(esc.label)}</p>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">{getTranslation(esc.description)}</p>
                      <p className="text-primary font-black mt-3">{esc.monto} €</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-cream/40 dark:bg-bg-dark/40 border border-accent/15 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase tracking-widest block mb-1">Detalles del Trámite</span>
                <h4 className="font-bold text-text-main dark:text-white text-xl">{getTranslation(config.monto[0].label)}</h4>
                <p className="text-sm text-text-muted mt-1 max-w-xl leading-relaxed">{getTranslation(config.monto[0].description)}</p>
              </div>
              <div className="sm:text-right shrink-0 bg-white dark:bg-surface-dark px-6 py-4 rounded-2xl border border-accent/10 shadow-sm flex flex-col items-start sm:items-end">
                <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase tracking-widest block mb-0.5">Inversión</span>
                <span className="text-2xl font-black text-primary">{config.monto[0].monto} €</span>
              </div>
            </div>
          )}

          {/* Requisitos Dinámicos */}
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-primary flex items-center mb-6">
              <Info className="w-6 h-6 mr-2" /> Requisitos de Aplicación
            </h3>
            
            {/* Sub-requisitos si hay sub-perfil */}
            {(() => {
              const parentEsc = config.monto.find(e => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_'));
              const subProfile = parentEsc?.subProfiles?.find(sp => sp.id === selectedEscenario);
              if (!subProfile) return null;
              return (
                <div className="bg-primary/5 p-5 rounded-2xl mb-6 border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase mb-3">Requisitos para {getTranslation(subProfile.label)}</p>
                  <ul className="space-y-2">
                    {subProfile.requirements[lang].map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-text-main dark:text-gray-300 font-medium">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            <ul className="space-y-4">
              {config.instrucciones_leer[lang].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 shrink-0 mt-1" />
                  <span className="text-text-main dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plantillas de Descarga */}
          {config.descargas && config.descargas.length > 0 && (
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-primary flex items-center mb-6">
                <FileDown className="w-6 h-6 mr-2" /> {lang === "es" ? "Plantillas de Descarga" : "Modelos de Download"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.descargas
                  .filter(desc => !desc.dependsOnEscenario || desc.dependsOnEscenario.includes(selectedEscenario))
                  .map((desc, idx) => (
                    <a
                      key={idx}
                      href={lang === "es" ? desc.url_es : desc.url_pt}
                      download
                      className="p-4 rounded-xl border border-gray-200 hover:border-primary/50 flex items-center justify-between hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-primary/70 mr-3" />
                        <span className="font-bold text-sm text-text-main dark:text-white">
                          {lang === "es" ? desc.label_es : desc.label_pt}
                        </span>
                      </div>
                      <FileDown className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </a>
                  ))}
              </div>
            </div>
          )}

          {/* Caja PayPal — solo visible cuando hay coste y el trámite lo requiere */}
          {config.monto.length === 1 && config.monto[0].monto > 0 && (
            <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#009cde]/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#003087]" xmlns="http://www.w3.org/2000/svg"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19a.75.75 0 0 0-.741.636l-.979 6.37zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a1.637 1.637 0 0 0-1.617 1.387l-1.039 6.787-.155 1.01h3.18a.563.563 0 0 0 .556-.65l.047-.303.878-5.567.057-.306a.562.562 0 0 1 .555-.477h.35c2.263 0 4.034-.919 4.551-3.578.217-1.114.105-2.044-.47-2.7a2.232 2.232 0 0 0-.917-.517z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                  {lang === 'es' ? 'Pago previo requerido vía PayPal' : 'Pagamento prévio requerido via PayPal'}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                  {lang === 'es'
                    ? `Transfiere ${config.monto[0].monto} € a financiero@aibapt.org antes de subir tus documentos. Adjunta el comprobante en el Paso 2.`
                    : `Transfira ${config.monto[0].monto} € para financiero@aibapt.org antes de enviar seus documentos. Anexe o comprovante no Passo 2.`}
                </p>
              </div>
              <a
                href={`https://www.paypal.com/paypalme/aibapt`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-xl bg-[#009cde] hover:bg-[#0070ba] text-white text-xs font-black transition-colors shadow-sm"
              >
                {lang === 'es' ? 'Pagar ahora' : 'Pagar agora'} ↗
              </a>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
            <button onClick={onBack} className="text-text-muted font-medium px-6 py-3">
              {lang === 'es' ? 'Cancelar' : 'Cancelar'}
            </button>
            <button
              onClick={() => selectedEscenario ? setStep(2) : alert(lang === 'es' ? 'Selecciona un nivel' : 'Selecione um nível')}
              className="bg-primary text-white px-10 py-4 rounded-full font-black text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark flex items-center justify-center gap-3 group/btn"
            >
              {lang === 'es' ? 'Continuar a Carga' : 'Continuar para Upload'}
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up">
          <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-8">
              <UploadCloud className="w-6 h-6 mr-2 text-primary" /> Carga de Documentación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.fields
                .filter(field => !field.dependsOnEscenario || field.dependsOnEscenario.includes(selectedEscenario))
                .map((field) => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="block text-sm font-bold text-text-main dark:text-white min-h-[2.75rem] leading-tight flex items-start">
                      {getTranslation(field.label)}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <div className={`relative group transition-all p-5 bg-white dark:bg-surface-dark border-2 border-dashed rounded-2xl hover:border-primary ${errors[field.name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}>
                          <input type="file" ref={ref} onChange={(e) => onChange(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="flex items-center">
                            <UploadCloud className="w-8 h-8 text-primary/40 mr-4" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{value?.[0]?.name || "Seleccionar archivo"}</p>
                              <p className="text-xs text-text-muted">{field.typeLabel} (Máx 10MB)</p>
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    {errors[field.name] && <p className="text-red-500 text-xs font-bold">{errors[field.name]?.message as string}</p>}
                  </div>
                ))}
            </div>
          </div>

          {submitError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{submitError}</div>}

          <div className="flex justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
            <button type="button" onClick={() => setStep(1)} className="text-text-muted font-medium px-6 py-3">Atrás</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-primary text-white px-10 py-4 rounded-full font-black text-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark group/btn"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Finalizar Trámite
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
