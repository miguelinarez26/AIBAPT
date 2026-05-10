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
  const [selectedEscenario, setSelectedEscenario] = useState<string>(initialEscenario);
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

  // Sync scenario from URL if not preselected
  useEffect(() => {
    if (initialEscenario) return;
    const scenarioParam = searchParams.get("tipo_membresia") || searchParams.get("escenario");
    if (scenarioParam) setSelectedEscenario(scenarioParam);
  }, [searchParams, initialEscenario]);

  const loadMembershipData = async () => {
    if (!session?.user || !config) {
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      const supabase = createBrowserSupabaseClient();
      
      // Carga de perfil resiliente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Si no hay perfil, creamos un mock seguro con valores por defecto
      const safeProfile = (profile || {
        id: session.user.id,
        email: session.user.email,
        is_member: false,
        role: 'guest',
        first_name: '',
        last_name: ''
      }) as Profile;

      setUserProfile(safeProfile);

      // Carga de precios dinámicos
      if (config.accreditationTypeKey) {
        const { data: accType } = await supabase
          .from('accreditation_types')
          .select('*')
          .eq('name', config.accreditationTypeKey)
          .maybeSingle();
        
        if (accType) setAccreditationType(accType as AccreditationType);
      }
    } catch (err: any) {
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
    if (!session?.user || !config || !accreditationType) return;
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

      // Crear Solicitud
      const { data: appData, error: appError } = await supabase.from('applications').insert({
        user_id: session.user.id,
        type_id: accreditationType.id,
        status: 'uploading',
        metadata: {
          escenario: data.escenario,
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
        file_path: path,
        document_type: type,
        is_private: true
      }));

      if (docs.length > 0) {
        const { error: docsError } = await supabase.from('documents').insert(docs);
        if (docsError) throw docsError;
      }

      // Finalizar
      await supabase.from('applications').update({ status: 'pending' }).eq('id', applicationId);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Error procesando solicitud");
      if (applicationId) await supabase.from('applications').delete().eq('id', applicationId);
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

  if (submitSuccess) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-green-200 dark:border-green-900 rounded-3xl p-10 text-center shadow-lg">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">¡Solicitud Enviada!</h2>
        <p className="text-text-muted mb-8 text-lg">Hemos recibido tus documentos. Revisaremos tu solicitud en un plazo de 15 días hábiles.</p>
        <button onClick={() => window.location.href = `/${lang}/dashboard`} className="bg-primary text-white px-8 py-3 rounded-full font-bold">Ir al Dashboard</button>
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
        <p className="text-text-muted dark:text-gray-400">{getTranslation(config.description)}</p>
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
          {/* Selección de Escenario */}
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-primary flex items-center mb-6">
              <ShieldAlert className="w-6 h-6 mr-2" /> Selección de Nivel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.monto.map((esc) => (
                <button
                  key={esc.id}
                  onClick={() => setSelectedEscenario(esc.id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedEscenario === esc.id ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-gray-50 dark:border-gray-800 hover:border-primary/20'}`}
                >
                  <p className="font-bold text-text-main dark:text-white text-lg">{getTranslation(esc.label)}</p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{getTranslation(esc.description)}</p>
                  <p className="text-primary font-black mt-3">{esc.monto} €</p>
                </button>
              ))}
            </div>
          </div>

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

          <div className="flex justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
            <button onClick={onBack} className="text-text-muted font-medium px-6 py-3">Cancelar</button>
            <button 
              onClick={() => selectedEscenario ? setStep(2) : alert("Selecciona un nivel")}
              className="bg-primary text-white px-10 py-4 rounded-full font-black text-lg shadow-lg hover:scale-[1.02] transition-all"
            >
              Continuar a Carga →
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
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-bold text-text-main dark:text-white">
                      {getTranslation(field.label)}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, ref } }) => (
                        <div className={`relative group transition-all p-5 bg-white dark:bg-surface-dark border-2 border-dashed rounded-2xl hover:border-primary ${errors[field.name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}>
                          <input type="file" ref={ref} onChange={(e) => onChange(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="flex items-center">
                            <UploadCloud className="w-8 h-8 text-primary/40 mr-4" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{watch(field.name)?.[0]?.name || "Seleccionar archivo"}</p>
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
              className="bg-[var(--color-aibapt-green)] text-white px-10 py-4 rounded-full font-black text-lg shadow-lg disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Finalizar Trámite
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
