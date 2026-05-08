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
  initialEscenario?: string;
}

export function UniversalStepper({ tramiteId, onBack, initialEscenario = "" }: UniversalStepperProps) {
  const params = useParams();
  const lang = (params?.lang as "es" | "pt") || "es";

  // Si es membresía con escenario pre-seleccionado, detectar si es bienhechor (contacto)
  // para saltar directamente al formulario de contacto (step 2)
  const isMembresiaPreselected = tramiteId === 'solicitud_membresia' && !!initialEscenario;
  const config_temp = AIBAPT_TRAMITES[tramiteId];
  const initialIsContactForm = isMembresiaPreselected && Array.isArray(config_temp?.monto)
    ? config_temp.monto.find((e: EscenarioEvento) => e.id === initialEscenario || initialEscenario.startsWith(e.id + '_'))?.isContactForm === true
    : false;

  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  
  const config = AIBAPT_TRAMITES[tramiteId];
  
  // Custom states for conditional fields
  const [isOnline, setIsOnline] = useState(false);
  const [selectedEscenario, setSelectedEscenario] = useState<string>(initialEscenario);

  // Contact form states for "Bienhechor"
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Solo leer URL params si no vino un escenario pre-seleccionado del padre
  useEffect(() => {
    if (initialEscenario) return; // Escenario ya establecido desde la página de membresía
    const scenarioParam = searchParams.get("tipo_membresia") || searchParams.get("escenario");
    if (scenarioParam) {
      setSelectedEscenario(scenarioParam);
    }
  }, [searchParams, initialEscenario]);

  // Estado de membresía y precios dinámicos
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [accreditationType, setAccreditationType] = useState<AccreditationType | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [membershipError, setMembershipError] = useState<string | null>(null);

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

      // Paso 1: Usar la sesión ya existente de AuthProvider
      const currentUser = session.user;

      // Paso 2: Fetch perfil para verificar membresía
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle() as { data: Profile | null; error: any };

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
        setUserProfile(profile);
      }

      // Paso 3: Fetch precio dinámico si el trámite tiene una clave de acreditación
      if (config?.accreditationTypeKey) {
        const { data: accType, error: accTypeError } = await supabase
          .from('accreditation_types')
          .select('*')
          .eq('name', config.accreditationTypeKey)
          .maybeSingle() as { data: AccreditationType | null; error: any };

        if (accTypeError) {
          console.error('[UniversalStepper] ❌ Error obteniendo tipo de acreditación:', accTypeError.message);
          console.error('[UniversalStepper] Código:', accTypeError.code, '| Key buscada:', config.accreditationTypeKey);
          // No es crítico — el stepper puede funcionar sin precio dinámico
        } else {
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

  // Determinar si el escenario seleccionado es de contacto
  const currentEscenarioObj = Array.isArray(config.monto) 
    ? config.monto.find((e: EscenarioEvento) => selectedEscenario === e.id || selectedEscenario.startsWith(e.id + '_')) 
    : null;
  const isContactFormMode = currentEscenarioObj?.isContactForm === true;

  // Validar si la selección es completa (si tiene subProfiles, debe haber elegido uno)
  const isSelectionValid = Array.isArray(config.monto) 
    ? (selectedEscenario && (!currentEscenarioObj?.subProfiles || currentEscenarioObj.subProfiles.some(sp => sp.id === selectedEscenario)))
    : true;

  // Handler for contact form
  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !contactMessage.trim()) return;

    setIsSendingContact(true);
    setSubmitError(null);

    try {
      const isBienhechorOrSimpatizante = selectedEscenario === 'bienhechor' || selectedEscenario === 'simpatizante';
      const response = await fetch('/api/admin/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: isBienhechorOrSimpatizante ? `contacto_${selectedEscenario}` : 'contacto_general',
          userName: userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim() : (userProfile?.full_name || session.user.email),
          accreditationName: isBienhechorOrSimpatizante 
            ? 'Solicitud de miembro bienhechor o simpatizante' 
            : 'Contacto General',
          message: contactMessage,
          email: session.user.email
        }),
      });

      if (!response.ok) throw new Error("Error enviando mensaje de contacto");
      
      setContactSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Error al enviar el formulario.");
    } finally {
      setIsSendingContact(false);
    }
  };

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam && !isNaN(Number(stepParam))) {
      setStep(Number(stepParam));
    }
  }, [searchParams]);

  // Generate dynamic Zod schema
  const generateSchema = (escenarioValue?: string) => {
    const shape: any = {};
    
    // Add Escenario if required
    if (Array.isArray(config.monto)) {
      shape.escenario = z.string().min(1, "Debes seleccionar un escenario");
    }

    // Add fields
    config.fields.forEach(field => {
      // Skip conditional fields if their condition is not met
      if (field.name === "cuestionario_evaluacion" && !isOnline) return;
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
      escenario: searchParams.get("tipo_membresia") || searchParams.get("escenario") || ""
    }
  });

  // Sync state with form
  useEffect(() => {
    if (selectedEscenario) {
      setValue("escenario", selectedEscenario);
    }
  }, [selectedEscenario, setValue]);

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
      // Paso 1: Determinar monto final — soporta sub-perfiles (ej. pleno_salud_mental → pleno.monto)
      let montoFinal = config.monto;
      if (Array.isArray(config.monto)) {
        const directMatch = config.monto.find((e: EscenarioEvento) => e.id === data.escenario);
        const parentMatch = config.monto.find((e: EscenarioEvento) => 
          e.subProfiles?.some(sp => sp.id === data.escenario)
        );
        montoFinal = directMatch?.monto ?? parentMatch?.monto ?? 0;
      }

      if (!accreditationType?.id) {
        console.error('[UniversalStepper] ❌ type_id faltante. accreditationType:', accreditationType, '| accreditationTypeKey:', config.accreditationTypeKey);
        throw new Error(
          lang === 'es' 
            ? `No se pudo vincular tu solicitud al catálogo de trámites. El tipo "${config.accreditationTypeKey || tramiteId}" no fue encontrado en la base de datos. Contacta soporte.`
            : `Não foi possível vincular sua solicitação ao catálogo de trâmites. O tipo "${config.accreditationTypeKey || tramiteId}" não foi encontrado no banco de dados. Contate o suporte.`
        );
      }

      // Paso 2: Crear solicitud en BD como 'pending'
      console.log('[UniversalStepper] Creando solicitud:', { type_id: accreditationType.id, user: session.user.id });
      
      // Construir metadata enriquecida para administración
      const escenarioId = data.escenario || selectedEscenario;
      const enrichedMetadata: Record<string, any> = {
        escenario: escenarioId,
        monto_pagado: montoFinal,
        idioma_solicitud: lang,
      };

      // Solo incluir modalidad_online en trámites que la usan (CCA, eventos), NO en membresía
      if (config.hasModalitySelection) {
        enrichedMetadata.modalidad_online = isOnline;
      }

      // Metadata extra para membresías: guardar nombre legible para el Admin
      if (tramiteId === 'solicitud_membresia') {
        // Resolver nombre humano de la categoría
        const categoryLabels: Record<string, Record<'es' | 'pt', string>> = {
          'pleno_salud_mental': { es: 'Miembro Pleno — Profesional de Salud Mental', pt: 'Membro Pleno — Profissional de Saúde Mental' },
          'pleno_agente_social': { es: 'Miembro Pleno — Agente de Intervención Social', pt: 'Membro Pleno — Agente de Intervenção Social' },
          'pleno': { es: 'Miembro Pleno', pt: 'Membro Pleno' },
          'institucional': { es: 'Miembro Institucional', pt: 'Membro Institucional' },
          'bienhechor': { es: 'Miembro Bienhechor', pt: 'Membro Benfeitor' },
        };
        const readableLabel = categoryLabels[escenarioId]?.[lang] || escenarioId.replace(/_/g, ' ');
        enrichedMetadata.categoria_membresia = readableLabel;
        enrichedMetadata.tramite_tipo = 'membresia';
      }

      const { data: applicationData, error: dbError } = await supabase.from('applications').insert({
        user_id: session.user.id,
        type_id: accreditationType.id,
        status: 'uploading',
        metadata: enrichedMetadata
      } as any).select('id').single();

      if (dbError) {
        throw new Error(`Error al crear la solicitud inicial: ${dbError.message}`);
      }

      applicationId = (applicationData as any).id;

      // Función helper para subir archivos con el ID de la solicitud y timeout
      const uploadFile = async (file: File, prefix: string, appId: string) => {
        // Sanitizar el prefijo y el nombre del archivo para evitar el error 406
        const safePrefix = prefix.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileExt = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
        const fileName = `${safePrefix}_${Date.now()}.${fileExt}`;
        
        // Ruta jerárquica: private-certifications/[user_id]/membresia/[application_id]/archivo.pdf
        const folderName = tramiteId === 'solicitud_membresia' ? 'membresia' : tramiteId;
        const filePath = `${session.user.id}/${folderName}/${appId}/${fileName}`;
        
        const uploadPromise = supabase.storage
          .from('private-certifications')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        // Timeout de 60 segundos para archivos grandes o conexiones lentas
        const timeoutPromise = new Promise<{ error: Error }>((_, reject) => 
          setTimeout(() => reject(new Error(lang === 'es' 
            ? 'Tu conexión es lenta o el archivo es grande. Intentando subir de nuevo (tiempo extendido)...' 
            : 'Sua conexão está lenta ou o arquivo é grande. Tentando subir novamente (tempo estendido)...')), 60000)
        );

        const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

        if (uploadError) {
          throw uploadError;
        }
        return filePath;
      };

      // Paso 3: Subir todos los archivos al Storage
      for (const field of config.fields) {
        if (field.name === "cuestionario_evaluacion" && !isOnline) continue;
        
        const fileList = data[field.name];
        if (fileList && fileList.length > 0 && fileList[0] && fileList[0].size > 0) {
          try {
            const path = await uploadFile(fileList[0], field.name, applicationId!);
            archivosSubidos[field.name] = path;
            const fieldLabel = typeof field.label === 'string' ? field.label : field.label[lang];
            archivosConLabels[fieldLabel] = path;
          } catch (uploadErr) {
            const errLabel = typeof field.label === 'string' ? field.label : field.label[lang];
            throw new Error(`Error al subir "${errLabel}": ${uploadErr instanceof Error ? uploadErr.message : 'Error desconocido'}`);
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

        const { error: docsError } = await supabase.from('documents').insert(documentsToInsert as any);
        if (docsError) {
          throw new Error(`Error vinculando documentos: ${docsError.message}`);
        }
      }

      // Paso 5: Cambiar estado a 'pending' solo tras éxito total
      const { error: finalStatusError } = await supabase
        .from('applications')
        .update({ status: 'pending' })
        .eq('id', applicationId);

      if (finalStatusError) {
        throw new Error(`Error al confirmar la solicitud: ${finalStatusError.message}`);
      }

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
        
        // 1. Borrar archivos huérfanos
        if (Object.keys(archivosSubidos).length > 0) {
          const pathsToRemove = Object.values(archivosSubidos);
          await supabase.storage.from('private-certifications').remove(pathsToRemove);
        }
        
        // 2. Borrar la solicitud fallida (los documentos se borrarán en cascada si hay foreign key)
        await supabase.from('applications').delete().eq('id', applicationId);
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
        <p className="text-text-muted">{lang === 'es' ? 'Verificando membresía...' : 'Verificando membresia...'}</p>
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
        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-3">{lang === 'es' ? 'Error de Verificación' : 'Erro de Verificação'}</h2>
        <p className="text-text-muted dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
          {membershipError}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 text-text-muted border border-accent rounded-xl hover:bg-accent/10 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />{lang === 'es' ? 'Volver' : 'Voltar'}
          </button>
          <button
            onClick={loadMembershipData}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 transition-opacity flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4" />{lang === 'es' ? 'Reintentar' : 'Tentar novamente'}
          </button>
        </div>
      </div>
    );
  }

  // Bloqueo preventivo: Trámite exclusivo para socios (excepto para la solicitud de membresía misma)
  if (config.requiresMembership && !isMember && tramiteId !== 'solicitud_membresia') {
    return (
      <div className="bg-white dark:bg-surface-dark border border-[var(--color-aibapt-gray)]/20 rounded-3xl p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-[var(--color-aibapt-gray)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-[var(--color-aibapt-gray)]" />
        </div>
        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-3">{lang === 'es' ? 'Membresía Requerida' : 'Membresia Requerida'}</h2>
        <p className="text-text-muted dark:text-gray-400 text-base mb-2 max-w-md mx-auto">
          {lang === 'es'
            ? <>{`Este trámite (`}<strong>{typeof config.title === 'string' ? config.title : config.title[lang]}</strong>{`) es exclusivo para socios activos de AIBAPT.`}</>
            : <>{`Este trâmite (`}<strong>{typeof config.title === 'string' ? config.title : config.title[lang]}</strong>{`) é exclusivo para sócios ativos da AIBAPT.`}</>}
        </p>
        <p className="text-text-muted dark:text-gray-400 text-sm mb-8 max-w-md mx-auto">
          {lang === 'es'
            ? 'Activa o renueva tu membresía para acceder a las certificaciones EMDR y tarifas preferenciales.'
            : 'Ative ou renove sua membresia para acessar as certificações EMDR e tarifas preferenciais.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 text-text-muted border border-accent rounded-xl hover:bg-accent/10 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />{lang === 'es' ? 'Volver' : 'Voltar'}
          </button>
          <a
            href={`/${lang}/afiliacion`}
            className="px-8 py-3 bg-[var(--color-aibapt-green)] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            {lang === 'es' ? 'Activar Membresía' : 'Ativar Membresia'}
          </a>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-green-200 dark:border-green-900 rounded-3xl p-10 text-center shadow-lg">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
          {lang === 'es' ? '¡Solicitud Enviada con Éxito!' : 'Solicitação Enviada com Sucesso!'}
        </h2>
        <p className="text-text-muted dark:text-gray-400 text-lg mb-4">
          {lang === 'es'
            ? 'Hemos recibido tus documentos correctamente.'
            : 'Recebemos seus documentos corretamente.'}
        </p>
        <p className="text-text-muted dark:text-gray-400 text-sm mb-8">
          {lang === 'es'
            ? 'Recibirás una respuesta en los próximos 15 días hábiles. Puedes seguir el estado de tu trámite desde tu panel personal.'
            : 'Você receberá uma resposta nos próximos 15 dias úteis. Pode acompanhar o estado do seu trâmite no seu painel pessoal.'}
        </p>
        <a
          href={`/${lang}/dashboard`}
          className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          {lang === 'es' ? 'Ir a Mi Panel →' : 'Ir ao Meu Painel →'}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> {lang === 'es' ? 'Volver' : 'Voltar'}
      </button>

      <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2 text-center mt-8 md:mt-0">{config.title[lang]}</h2>
      <p className="text-center text-text-muted dark:text-gray-400 mb-8">{config.description[lang]}</p>

      {/* Progress Bar (2 Pasos) */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= num ? 'bg-primary text-white shadow-md' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
              {num}
            </div>
            {num < 2 && (
              <div className={`w-16 md:w-32 h-1 mx-2 transition-colors ${step > num ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {/* PASO 1: REQUISITOS Y PLANTILLAS (O FORMULARIO DE CONTACTO) */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Resumen de categoría preseleccionada */}
            {isMembresiaPreselected && selectedEscenario && (() => {
              const parentEsc = (config.monto as EscenarioEvento[]).find(
                (e: EscenarioEvento) => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_')
              );
              const subProfile = parentEsc?.subProfiles?.find(sp => sp.id === selectedEscenario);
              if (!parentEsc) return null;

              return (
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        {lang === 'es' ? 'Categoría Seleccionada' : 'Categoria Selecionada'}
                      </p>
                      <p className="text-lg font-black text-text-main dark:text-white">
                        {typeof parentEsc.label === 'string' ? parentEsc.label : parentEsc.label[lang]}
                        {subProfile && (
                          <span className="text-sm font-medium text-text-muted dark:text-gray-400 ml-2">
                            — {typeof subProfile.label === 'string' ? subProfile.label : subProfile.label[lang]}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-2xl font-black text-accent">
                      {parentEsc.monto > 0 ? `${parentEsc.monto} €` : (lang === 'es' ? 'Voluntario' : 'Voluntário')}
                    </div>
                  </div>
                </div>
              );
            })()}

            {isContactFormMode ? (
              // VISTA BIENHECHOR (Formulario de Contacto Directo)
              <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-6">
                  <FileText className="w-6 h-6 mr-2 text-primary" /> {lang === 'es' ? 'Formulario de Contacto' : 'Formulário de Contato'}
                </h3>
                {contactSuccess ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{lang === 'es' ? '¡Mensaje Enviado!' : 'Mensagem Enviada!'}</h4>
                    <p className="text-text-muted">{lang === 'es' ? 'Nuestra secretaría se pondrá en contacto contigo a la brevedad.' : 'Nossa secretaria entrará em contato em breve.'}</p>
                    <button onClick={onBack} className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">
                      {lang === 'es' ? 'Volver al Inicio' : 'Voltar ao Início'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendContact} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-text-muted mb-1">{lang === 'es' ? 'Nombre Completo' : 'Nome Completo'}</label>
                        <input type="text" disabled value={userProfile?.full_name || ''} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none opacity-70" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-muted mb-1">{lang === 'es' ? 'Correo Electrónico' : 'Email'}</label>
                        <input type="email" disabled value={session?.user?.email || ''} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none opacity-70" />
                      </div>
                    </div>
                    <textarea 
                      required 
                      rows={5} 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={lang === 'es' ? 'Cuéntanos por qué deseas colaborar con AIBAPT...' : 'Conte-nos por que deseja colaborar com a AIBAPT...'}
                      className="w-full p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    ></textarea>
                    {submitError && <p className="text-red-500 text-sm font-bold mb-2">{submitError}</p>}
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={onBack} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors">{lang === 'es' ? 'Atrás' : 'Voltar'}</button>
                      <button type="submit" disabled={isSendingContact || !contactMessage.trim()} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50">
                        {isSendingContact ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                        {lang === 'es' ? 'Enviar Solicitud' : 'Enviar Solicitação'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              // VISTA NORMAL (Requisitos + Descargas)
              <>
                <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-primary flex items-center mb-6">
                    <Info className="w-6 h-6 mr-2" />
                    {lang === 'es' ? 'A. Leer (Requisitos)' : 'A. Ler (Requisitos)'}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Requisitos específicos si hay sub-perfil */}
                    {(() => {
                      const parentEsc = (config.monto as EscenarioEvento[]).find(
                        (e: EscenarioEvento) => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + '_')
                      );
                      const subProfile = parentEsc?.subProfiles?.find(sp => sp.id === selectedEscenario);
                      if (subProfile?.requirements) {
                        return (
                          <div className="bg-primary/5 p-4 rounded-xl mb-2">
                            <ul className="space-y-2">
                              {subProfile.requirements[lang].map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-text-main dark:text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                  <span className="font-medium">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <ul className="space-y-3 text-text-main dark:text-gray-300">
                      {config.instrucciones_leer[lang].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-accent mr-3 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-primary flex items-center mb-6">
                    <FileDown className="w-6 h-6 mr-2" />
                    {lang === 'es' ? 'B. Bajar (Plantillas)' : 'B. Baixar (Modelos)'}
                  </h3>
                  
                  {config.descargas.length === 0 ? (
                    <p className="text-text-muted dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl text-center">
                      {lang === 'es' ? 'No hay plantillas requeridas.' : 'Não há modelos exigidos.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {config.descargas
                        .filter(doc => !doc.dependsOnEscenario || !selectedEscenario || doc.dependsOnEscenario.includes(selectedEscenario))
                        .map((doc, idx) => {
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
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={onBack} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {lang === 'es' ? 'Volver' : 'Voltar'}
                  </button>
                  <button 
                    onClick={() => setStep(2)} 
                    className="bg-primary text-white px-8 py-4 rounded-full font-black text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                  >
                    {lang === 'es' ? 'Ya tengo mis documentos, continuar a Carga →' : 'Já tengo meus documentos, continuar para Envio →'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PASO 2: CARGA DE DOCUMENTACIÓN */}
        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-6">
              <UploadCloud className="w-6 h-6 mr-2 text-primary" /> {lang === 'es' ? 'C. Subir (Documentos)' : 'C. Enviar (Documentos)'}
            </h3>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {config.fields
                  .filter(field => !field.dependsOnEscenario || !selectedEscenario || field.dependsOnEscenario.includes(selectedEscenario))
                  .map((field) => {
                    const error = errors[field.name];
                    return (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-sm font-bold text-text-main dark:text-white mb-2">
                          {typeof field.label === 'string' ? field.label : field.label[lang]}
                          {field.validator && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        <Controller
                          name={field.name}
                          control={control}
                          render={({ field: { onChange, ref } }) => (
                            <div className={`relative group transition-all ${error ? 'ring-2 ring-red-500 rounded-2xl' : ''}`}>
                              <input
                                type="file"
                                ref={ref}
                                onChange={(e) => onChange(e.target.files)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                              />
                              <div className="flex items-center p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl group-hover:border-primary transition-colors">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                  <UploadCloud className="w-5 h-5 text-primary group-hover:text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-main dark:text-gray-300 truncate">
                                    {watch(field.name)?.[0]?.name || (lang === 'es' ? 'Seleccionar archivo...' : 'Selecionar arquivo...')}
                                  </p>
                                  <p className="text-xs text-text-muted">PDF, DOC, JPG (Máx 10MB)</p>
                                </div>
                              </div>
                            </div>
                          )}
                        />
                        {error && <p className="text-red-500 text-xs font-bold mt-1">{error.message as string}</p>}
                      </div>
                    );
                  })}
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
              <button type="button" onClick={() => setStep(1)} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors">{lang === 'es' ? 'Atrás' : 'Voltar'}</button>
              <button
                type="submit"
                disabled={isSubmitting || !session}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {lang === 'es' ? 'Subiendo...' : 'Enviando...'}
                  </>
                ) : (
                  lang === 'es' ? 'Enviar Solicitud Final' : 'Enviar Solicitação Final'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

