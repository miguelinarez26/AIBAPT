"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AIBAPT_TRAMITES, EscenarioEvento } from "@/config/aibapt-config";
import { CheckCircle, UploadCloud, Info, FileDown, ArrowLeft, Loader2, ShieldAlert, FileText } from "lucide-react";
import type { Profile, AccreditationType } from "@/types/database";

interface UniversalStepperProps {
  tramiteId: string;
  onBack: () => void;
}

export function UniversalStepper({ tramiteId, onBack }: UniversalStepperProps) {
  const params = useParams();
  const lang = (params?.lang as "es" | "pt") || "es";
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  
  const config = AIBAPT_TRAMITES[tramiteId];
  
  // Custom states for conditional fields
  const [isOnline, setIsOnline] = useState(false);
  const [selectedEscenario, setSelectedEscenario] = useState<string>("");

  // Estado de membresía y precios dinámicos
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [accreditationType, setAccreditationType] = useState<AccreditationType | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [membershipError, setMembershipError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Función para cargar perfil del usuario y precios dinámicos
  const loadMembershipData = async () => {
    setIsLoadingProfile(true);
    setMembershipError(null);

    if (!session?.user) {
      console.warn('[UniversalStepper] No hay sesión activa, omitiendo carga de membresía.');
      setIsLoadingProfile(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();

      // Paso 1: Verificar que la sesión del browser client está activa
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !currentUser) {
        console.error('[UniversalStepper] ❌ Error validando sesión de Supabase:', authError?.message || 'Usuario no encontrado');
        console.error('[UniversalStepper] Detalle completo:', JSON.stringify(authError, null, 2));
        setMembershipError(
          `Error de autenticación: ${authError?.message || 'Sesión expirada'}. Intenta cerrar sesión y volver a entrar.`
        );
        setIsLoadingProfile(false);
        return;
      }

      console.log('[UniversalStepper] ✅ Sesión válida para usuario:', currentUser.id);

      // Paso 2: Fetch perfil para verificar membresía
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('[UniversalStepper] ❌ Error obteniendo perfil:', profileError.message);
        console.error('[UniversalStepper] Código:', profileError.code, '| Detalles:', profileError.details);
        console.error('[UniversalStepper] Hint:', profileError.hint);
        
        // Si es PGRST116 (no encontrado), no es un error crítico
        if (profileError.code === 'PGRST116') {
          console.warn('[UniversalStepper] Perfil no encontrado para el usuario. Se usará perfil vacío.');
          setUserProfile(null);
        } else {
          // Error de RLS, permisos, o conexión — mostrar al usuario
          setMembershipError(
            `No se pudo verificar tu membresía (${profileError.code}): ${profileError.message}. Si el problema persiste, contacta soporte.`
          );
        }
      } else {
        console.log('[UniversalStepper] ✅ Perfil cargado. is_member:', profile?.is_member);
        setUserProfile(profile);
      }

      // Paso 3: Fetch precio dinámico si el trámite tiene una clave de acreditación
      if (config?.accreditationTypeKey) {
        const { data: accType, error: accTypeError } = await supabase
          .from('accreditation_types')
          .select('*')
          .eq('name', config.accreditationTypeKey)
          .single();

        if (accTypeError) {
          console.error('[UniversalStepper] ❌ Error obteniendo tipo de acreditación:', accTypeError.message);
          console.error('[UniversalStepper] Código:', accTypeError.code, '| Key buscada:', config.accreditationTypeKey);
          // No es crítico — el stepper puede funcionar sin precio dinámico
        } else {
          console.log('[UniversalStepper] ✅ Tipo de acreditación cargado:', accType?.name, '| fee_member:', accType?.fee_member, '| fee_non_member:', accType?.fee_non_member);
          setAccreditationType(accType);
        }
      }

    } catch (unexpectedError) {
      // Catch-all para errores inesperados (network, JSON parsing, etc.)
      const errorMsg = unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError);
      console.error('[UniversalStepper] ❌ ERROR INESPERADO cargando membresía:', errorMsg);
      console.error('[UniversalStepper] Stack:', unexpectedError);
      setMembershipError(`Error inesperado: ${errorMsg}`);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadMembershipData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, config?.accreditationTypeKey]);

  // Derivar estado de membresía y precios
  const isMember = userProfile?.is_member ?? false;
  const dynamicPrice = accreditationType
    ? (isMember ? accreditationType.fee_member : accreditationType.fee_non_member)
    : null;

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam && !isNaN(Number(stepParam))) {
      setStep(Number(stepParam));
    }
  }, [searchParams]);

  // Generate dynamic Zod schema
  const generateSchema = () => {
    const shape: any = {};
    
    // Add Escenario if required
    if (Array.isArray(config.monto)) {
      shape.escenario = z.string().min(1, "Debes seleccionar un escenario");
    }

    // Add fields
    config.fields.forEach(field => {
      // Skip conditional fields if their condition is not met
      if (field.name === "cuestionario_evaluacion" && !isOnline) return;
      
      shape[field.name] = field.validator;
    });

    return z.object(shape);
  };

  const schema = generateSchema();
  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Estado de error de envío visible en la UI
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    if (!session?.user) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const supabase = createBrowserSupabaseClient();
    let applicationId: string | null = null;
    const archivosSubidos: Record<string, string> = {};
    const archivosConLabels: Record<string, string> = {};

    try {
      // Paso 1: Determinar monto final
      let montoFinal = config.monto;
      if (Array.isArray(config.monto)) {
        montoFinal = config.monto.find((e: EscenarioEvento) => e.id === data.escenario)?.monto || 0;
      }

      if (!accreditationType?.id) {
        throw new Error("No se pudo determinar el tipo de trámite (falta type_id).");
      }

      // Paso 2: Guardar solicitud en BD como 'uploading'
      console.log('[UniversalStepper] Guardando solicitud inicial (uploading):', { type_id: accreditationType.id, user: session.user.id });
      
      const { data: applicationData, error: dbError } = await supabase.from('applications').insert({
        user_id: session.user.id,
        type_id: accreditationType.id,
        status: 'uploading',
        metadata: {
          escenario: data.escenario,
          monto_pagado: montoFinal,
          modalidad_online: isOnline,
        }
      }).select('id').single();

      if (dbError) {
        throw new Error(`Error al crear la solicitud inicial: ${dbError.message}`);
      }

      applicationId = applicationData.id;
      console.log('[UniversalStepper] ✅ Solicitud creada con ID:', applicationId);

      // Función helper para subir archivos con el ID de la solicitud y timeout
      const uploadFile = async (file: File, prefix: string, appId: string) => {
        // Sanitizar el prefijo y el nombre del archivo para evitar el error 406
        const safePrefix = prefix.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileExt = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
        const fileName = `${safePrefix}_${Date.now()}.${fileExt}`;
        
        // Nueva ruta: incluye el ID de la solicitud para agrupar archivos
        const filePath = `${session.user.id}/${tramiteId}/${appId}/${fileName}`;
        
        console.log(`[UniversalStepper] Subiendo ${fileName} a private-certifications...`);
        
        const uploadPromise = supabase.storage
          .from('private-certifications')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        // Timeout de 10 segundos
        const timeoutPromise = new Promise<{ error: Error }>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: La subida de archivo tardó demasiado.')), 10000)
        );

        const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

        if (uploadError) {
          throw uploadError;
        }
        return filePath;
      };

      // Paso 3: Subir todos los archivos al Storage
      console.log('[UniversalStepper] Iniciando subida de archivos...');
      for (const field of config.fields) {
        if (field.name === "cuestionario_evaluacion" && !isOnline) continue;
        
        const fileList = data[field.name];
        if (fileList && fileList.length > 0 && fileList[0] && fileList[0].size > 0) {
          try {
            const path = await uploadFile(fileList[0], field.name, applicationId);
            archivosSubidos[field.name] = path;
            archivosConLabels[field.label] = path;
          } catch (uploadErr) {
            throw new Error(`Error al subir "${field.label}": ${uploadErr instanceof Error ? uploadErr.message : 'Error desconocido'}`);
          }
        }
      }

      // Paso 4: Guardar archivos en la tabla documents
      if (Object.keys(archivosSubidos).length > 0) {
        const documentsToInsert = Object.entries(archivosSubidos).map(([fieldName, path]) => ({
          application_id: applicationId as string,
          file_path: path,
          document_type: fieldName,
          is_private: true
        }));

        const { error: docsError } = await supabase.from('documents').insert(documentsToInsert);
        if (docsError) {
          throw new Error(`Error vinculando documentos: ${docsError.message}`);
        }
      }

      // Paso 5: Actualizar estado de la solicitud a 'pending'
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'pending' })
        .eq('id', applicationId);

      if (updateError) {
        throw new Error(`Error actualizando estado final: ${updateError.message}`);
      }

      console.log('[UniversalStepper] ✅ Proceso completado exitosamente.');

      // Paso 6: Notificar al admin
      try {
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: config.title,
            userName: session.user.email,
            archivos: archivosConLabels
          })
        });
      } catch (notifyErr) {
        console.warn('[UniversalStepper] ⚠️ No se pudo notificar al admin (no crítico):', notifyErr);
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error inesperado';
      console.error('[UniversalStepper] ❌ Error general en onSubmit:', errorMsg, error);
      setSubmitError(errorMsg);

      // Rollback: Si falló después de crear la solicitud, intentamos limpiar
      if (applicationId) {
        console.log('[UniversalStepper] Iniciando rollback por error...');
        
        // 1. Borrar archivos huérfanos
        if (Object.keys(archivosSubidos).length > 0) {
          const pathsToRemove = Object.values(archivosSubidos);
          await supabase.storage.from('private-certifications').remove(pathsToRemove);
        }
        
        // 2. Borrar la solicitud fallida (los documentos se borrarán en cascada si hay foreign key)
        await supabase.from('applications').delete().eq('id', applicationId);
        console.log('[UniversalStepper] ✅ Rollback completado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) return <p>Configuración no encontrada.</p>;

  // Loading de perfil
  if (isLoadingProfile) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-3xl p-10 text-center shadow-lg border border-accent/20">
        <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
        <p className="text-text-muted">Verificando membresía...</p>
      </div>
    );
  }

  // Estado de error con opción de reintentar
  if (membershipError) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-red-200 dark:border-red-900/30 rounded-3xl p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-3">Error de Verificación</h2>
        <p className="text-text-muted dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
          {membershipError}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 text-text-muted border border-accent rounded-xl hover:bg-accent/10 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />Volver
          </button>
          <button
            onClick={loadMembershipData}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 transition-opacity flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4" />Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Bloqueo preventivo: Trámite exclusivo para socios
  if (config.requiresMembership && !isMember) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-[var(--color-aibapt-gray)]/20 rounded-3xl p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-[var(--color-aibapt-gray)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-[var(--color-aibapt-gray)]" />
        </div>
        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-3">Membresía Requerida</h2>
        <p className="text-text-muted dark:text-gray-400 text-base mb-2 max-w-md mx-auto">
          Este trámite (<strong>{config.title}</strong>) es exclusivo para socios activos de AIBAPT.
        </p>
        <p className="text-text-muted dark:text-gray-400 text-sm mb-8 max-w-md mx-auto">
          Activa o renueva tu membresía para acceder a las certificaciones EMDR y tarifas preferenciales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 text-text-muted border border-accent rounded-xl hover:bg-accent/10 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />Volver a Acreditaciones
          </button>
          <a
            href="/afiliacion"
            className="px-8 py-3 bg-[var(--color-aibapt-green)] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            Activar Membresía
          </a>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-green-200 dark:border-green-900 rounded-3xl p-10 text-center shadow-lg">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">¡Solicitud Enviada!</h2>
        <p className="text-text-muted dark:text-gray-400 text-lg mb-8">
          Hemos recibido tus documentos correctamente. Recibirás respuesta en los próximos 15 días hábiles.
        </p>
        <button
          onClick={onBack}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
        >
          Volver a Acreditaciones
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </button>

      <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2 text-center mt-8 md:mt-0">{config.title[lang]}</h2>
      <p className="text-center text-text-muted dark:text-gray-400 mb-8">{config.description[lang]}</p>

      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= num ? 'bg-primary text-white shadow-md' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`w-16 md:w-32 h-1 mx-2 transition-colors ${step > num ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {/* PASO 1: INFO */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-primary flex items-center mb-4">
                <Info className="w-6 h-6 mr-2" /> A. Leer (Requisitos)
              </h3>
              <ul className="space-y-3 text-text-main dark:text-gray-300">
                {config.instrucciones_leer[lang].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-accent mr-3 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* COMPARATIVA EVENTOS */}
            {Array.isArray(config.monto) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-text-main dark:text-white mb-4">Comparativa de Escenarios</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.isArray(config.monto) && config.monto.map((esc: EscenarioEvento) => (
                    <div key={esc.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="font-bold text-primary text-lg">{typeof esc.label === 'string' ? esc.label : esc.label[lang]}</div>
                      <div className="text-2xl font-black text-accent my-2">{esc.monto} €</div>
                      <p className="text-sm text-text-muted dark:text-gray-400">{typeof esc.description === 'string' ? esc.description : esc.description[lang]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner de Precio Dinámico según membresía */}
            {dynamicPrice !== null && !Array.isArray(config.monto) && (
              <div className={`rounded-2xl p-5 border flex items-center justify-between ${
                isMember
                  ? 'bg-[var(--color-aibapt-green)]/5 border-[var(--color-aibapt-green)]/20'
                  : 'bg-[var(--color-aibapt-gray)]/5 border-[var(--color-aibapt-gray)]/20'
              }`}>
                <div>
                  <p className="text-sm font-bold text-text-main dark:text-white">
                    {isMember ? (lang === 'es' ? '✓ Tarifa de Socio Activo' : '✓ Tarifa de Sócio Ativo') : (lang === 'es' ? 'Tarifa de No Socio' : 'Tarifa de Não Sócio')}
                  </p>
                  <p className="text-xs text-text-muted dark:text-gray-400">
                    {isMember
                      ? (lang === 'es' ? 'Estás disfrutando del precio preferencial para miembros.' : 'Você está aproveitando o preço preferencial para membros.')
                      : (lang === 'es' ? 'Afíliate para acceder a tarifas preferenciales.' : 'Associe-se para acessar tarifas preferenciais.')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-black ${isMember ? 'text-[var(--color-aibapt-green)]' : 'text-[var(--color-aibapt-gray)]'}`}>
                    {dynamicPrice} €
                  </span>
                  {!isMember && accreditationType && (
                    <p className="text-[10px] text-[var(--color-aibapt-green)] font-bold">
                      {lang === 'es' ? 'Socios:' : 'Sócios:'} {accreditationType.fee_member} €
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              {!session ? (
                <button 
                  onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(`/formaciones?tab=accredited&tramiteId=${tramiteId}&step=2`)}`)} 
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
                >
                  {lang === 'es' ? 'Iniciar sesión para continuar' : 'Faça login para continuar'}
                </button>
              ) : (
                <button onClick={() => setStep(2)} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
                  {lang === 'es' ? 'Continuar a Plantillas' : 'Continuar para Modelos'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* PASO 2: DESCARGAS */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-6">
              <FileDown className="w-6 h-6 mr-2 text-primary" /> {lang === 'es' ? 'B. Bajar (Plantillas)' : 'B. Baixar (Modelos)'}
            </h3>
            
            {config.descargas.length === 0 ? (
              <p className="text-text-muted dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl text-center">
                {lang === 'es' ? 'No hay plantillas requeridas para este trámite. Puedes avanzar directamente a la carga de documentos.' : 'Não há modelos exigidos para este trâmite. Você pode avançar diretamente para o envio de documentos.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.descargas.map((doc, idx) => {
                  const docLabel = lang === 'pt' ? doc.label_pt : doc.label_es;
                  const docUrl = lang === 'pt' ? doc.url_pt : doc.url_es;
                  return (
                    <a key={idx} href={docUrl} download className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors group">
                      <span className="font-medium text-text-main dark:text-gray-300">{docLabel}</span>
                      <FileDown className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </div>
            )}
            
            <div className="flex justify-between pt-8">
              <button onClick={() => setStep(1)} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors">{lang === 'es' ? 'Atrás' : 'Voltar'}</button>
              <button onClick={() => setStep(3)} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
                {lang === 'es' ? 'Continuar a Carga' : 'Continuar para Envio'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: CARGA */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-6">
              <UploadCloud className="w-6 h-6 mr-2 text-primary" /> {lang === 'es' ? 'C. Subir (Documentos)' : 'C. Enviar (Documentos)'}
            </h3>
            
            {/* Lógica Condicional: Modalidad Online */}
            {config.hasModalitySelection && (
               <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-6">
                 <label className="flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                     checked={isOnline}
                     onChange={(e) => setIsOnline(e.target.checked)}
                   />
                   <span className="ml-3 font-medium text-text-main dark:text-white">{lang === 'es' ? 'Este es un curso Modalidad Online' : 'Este é um curso Modalidade Online'}</span>
                 </label>
               </div>
            )}

            {/* Lógica Condicional: Selector de Escenario */}
            {Array.isArray(config.monto) && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">{lang === 'es' ? 'Selecciona el Escenario del Evento *' : 'Selecione o Cenário do Evento *'}</label>
                <Controller
                  name="escenario"
                  control={control}
                  render={({ field }) => (
                    <select {...field} value={field.value as string ?? ''} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                      <option value="">{lang === 'es' ? '-- Elige una opción --' : '-- Escolha uma opção --'}</option>
                      {(config.monto as EscenarioEvento[]).map((esc: EscenarioEvento) => (
                        <option key={esc.id} value={esc.id}>{esc.label}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.escenario && <p className="text-red-500 text-sm mt-1">{errors.escenario.message as string}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.fields.map((field) => {
                // Condicional para "Cuestionario de Evaluación"
                if (field.name === "cuestionario_evaluacion" && !isOnline) return null;

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-1">
                      {typeof field.label === 'string' ? field.label : field.label[lang]} {!field.isOptional && "*"}
                    </label>
                    <span className="text-xs text-text-muted dark:text-gray-500 block mb-2">{lang === 'es' ? 'Formatos:' : 'Formatos:'} {field.typeLabel}. {lang === 'es' ? 'Max:' : 'Máx:'} 10MB</span>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, ref, name } }) => {
                        const files = watch(name) as FileList;
                        const fileName = files && files.length > 0 ? files[0].name : null;

                        return (
                          <div className="relative">
                            <label className="flex items-center cursor-pointer group w-full">
                              <span className="py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary/10 text-primary group-hover:bg-primary/20 transition-all mr-4 shrink-0">
                                {lang === 'es' ? 'Seleccionar archivo' : 'Escolher arquivo'}
                              </span>
                              <span className="text-sm text-text-muted dark:text-gray-400 truncate w-full pr-2 block">
                                {fileName ? fileName : (lang === 'es' ? 'Sin archivos seleccionados' : 'Nenhum arquivo escolhido')}
                              </span>
                              <input
                                type="file"
                                accept={
                                  field.typeLabel.includes('PDF') && field.typeLabel.includes('Imagen') ? 'application/pdf,image/*' : 
                                  field.typeLabel.includes('PDF') && field.typeLabel.includes('ZIP') ? 'application/pdf,application/zip' :
                                  'application/pdf'
                                }
                                onChange={(e) => onChange(e.target.files)}
                                ref={ref}
                                name={name}
                                className="hidden"
                              />
                            </label>
                          </div>
                        );
                      }}
                    />
                    {field.description && <p className="text-xs text-accent mt-1">{field.description}</p>}
                    {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message as string}</p>}
                  </div>
                );
              })}
            </div>

            {(() => {
              const watchedFields = watch();
              const filesToUpload = config.fields
                .filter((f) => f.name !== "cuestionario_evaluacion" || isOnline)
                .map((f) => {
                  const files = watchedFields[f.name];
                  if (files && files.length > 0 && files[0] && files[0].size > 0) {
                    return { label: f.label, file: files[0] };
                  }
                  return null;
                })
                .filter(Boolean) as { label: string; file: File }[];

              if (filesToUpload.length === 0) return null;

              return (
                <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 animate-fade-in">
                  <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> {lang === 'es' ? 'Archivos listos para subir:' : 'Arquivos prontos para enviar:'}
                  </h4>
                  <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 space-y-1">
                    {filesToUpload.map((item, i) => (
                      <li key={i}>
                        <span className="font-medium text-green-900 dark:text-green-200">{typeof item.label === 'string' ? item.label : item.label[lang]}</span>: {item.file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {submitError && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start text-left">
                <ShieldAlert className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-400">{lang === 'es' ? 'Error al enviar la solicitud' : 'Erro ao enviar a solicitação'}</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
              <button type="button" onClick={() => setStep(2)} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors">{lang === 'es' ? 'Atrás' : 'Voltar'}</button>
              <button
                type="submit"
                disabled={isSubmitting || !session}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {lang === 'es' ? 'Procesando...' : 'Processando...'}
                  </>
                ) : session ? (
                  lang === 'es' ? "Enviar Solicitud" : "Enviar Solicitação"
                ) : (
                  lang === 'es' ? "Inicia sesión para continuar" : "Faça login para continuar"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
