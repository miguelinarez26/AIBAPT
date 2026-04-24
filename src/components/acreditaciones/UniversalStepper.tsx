"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AIBAPT_TRAMITES, EscenarioEvento } from "@/config/aibapt-config";
import { CheckCircle, UploadCloud, Info, FileDown, ArrowLeft, Loader2 } from "lucide-react";

interface UniversalStepperProps {
  tramiteId: string;
  onBack: () => void;
}

export function UniversalStepper({ tramiteId, onBack }: UniversalStepperProps) {
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  
  const config = AIBAPT_TRAMITES[tramiteId];
  
  // Custom states for conditional fields
  const [isOnline, setIsOnline] = useState(false);
  const [selectedEscenario, setSelectedEscenario] = useState<string>("");
  
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const uploadFile = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}-${Math.random()}.${fileExt}`;
    const filePath = `${session?.user?.id || 'anon'}/${tramiteId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('solicitudes-archivos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    return filePath;
  };

  const onSubmit = async (data: any) => {
    if (!session?.user) return;
    setIsSubmitting(true);
    try {
      const archivosSubidos: Record<string, string> = {};
      const archivosConLabels: Record<string, string> = {};
      
      // Upload all files
      for (const field of config.fields) {
        if (field.name === "cuestionario_evaluacion" && !isOnline) continue;
        
        const fileList = data[field.name];
        if (fileList && fileList.length > 0) {
          const path = await uploadFile(fileList[0], field.name);
          archivosSubidos[field.name] = path;
          archivosConLabels[field.label] = path;
        }
      }

      // Determine final amount
      let montoFinal = config.monto;
      if (Array.isArray(config.monto)) {
        montoFinal = config.monto.find((e: EscenarioEvento) => e.id === data.escenario)?.monto || 0;
      }

      // Save to DB
      console.log('Intentando guardar en base de datos:', { tipo: config.title, user: session.user.id });
      const { error: dbError } = await supabase.from('solicitudes').insert({
        user_id: session.user.id,
        tipo: config.title,
        estado: 'pendiente',
        datos: {
          escenario: data.escenario,
          monto_pagado: montoFinal,
          modalidad_online: isOnline,
          archivos: archivosSubidos
        }
      });

      if (dbError) {
        console.error('❌ ERROR GRAVE - Supabase Insert Falló:', dbError);
        console.error('Detalles del error:', JSON.stringify(dbError, null, 2));
        alert(`Error al guardar en base de datos: ${dbError.message || dbError.details || 'Error desconocido'}`);
        throw dbError;
      }
      console.log('✅ Solicitud guardada en base de datos exitosamente.');

      // Notify admin
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: config.title,
          userName: session.user.email,
          archivos: archivosConLabels
        })
      });

      setSubmitSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Error enviando la solicitud. Revisa la consola para más detalles.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) return <p>Configuración no encontrada.</p>;

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

      <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2 text-center mt-8 md:mt-0">{config.title}</h2>
      <p className="text-center text-text-muted dark:text-gray-400 mb-8">{config.description}</p>

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
                {config.instrucciones_leer.map((item, idx) => (
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
                  {config.monto.map((esc: EscenarioEvento) => (
                    <div key={esc.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="font-bold text-primary text-lg">{esc.label}</div>
                      <div className="text-2xl font-black text-accent my-2">{esc.monto} €</div>
                      <p className="text-sm text-text-muted dark:text-gray-400">{esc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              {!session ? (
                <button 
                  onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(`/formaciones?tab=accredited&tramiteId=${tramiteId}&step=2`)}`)} 
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
                >
                  Iniciar sesión para continuar
                </button>
              ) : (
                <button onClick={() => setStep(2)} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
                  Continuar a Plantillas
                </button>
              )}
            </div>
          </div>
        )}

        {/* PASO 2: DESCARGAS */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-6">
              <FileDown className="w-6 h-6 mr-2 text-primary" /> B. Bajar (Plantillas)
            </h3>
            
            {config.descargas.length === 0 ? (
              <p className="text-text-muted dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl text-center">
                No hay plantillas requeridas para este trámite. Puedes avanzar directamente a la carga de documentos.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.descargas.map((doc, idx) => (
                  <a key={idx} href={doc.url} download className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors group">
                    <span className="font-medium text-text-main dark:text-gray-300">{doc.label}</span>
                    <FileDown className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            )}
            
            <div className="flex justify-between pt-8">
              <button onClick={() => setStep(1)} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors">Atrás</button>
              <button onClick={() => setStep(3)} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
                Continuar a Carga
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: CARGA */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center mb-6">
              <UploadCloud className="w-6 h-6 mr-2 text-primary" /> C. Subir (Documentos)
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
                   <span className="ml-3 font-medium text-text-main dark:text-white">Este es un curso Modalidad Online</span>
                 </label>
               </div>
            )}

            {/* Lógica Condicional: Selector de Escenario */}
            {Array.isArray(config.monto) && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Selecciona el Escenario del Evento *</label>
                <Controller
                  name="escenario"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                      <option value="">-- Elige una opción --</option>
                      {config.monto.map((esc: EscenarioEvento) => (
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
                      {field.label} {!field.isOptional && "*"}
                    </label>
                    <span className="text-xs text-text-muted dark:text-gray-500 block mb-2">Formatos: {field.typeLabel}. Max: 10MB</span>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, ref, name } }) => (
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
                          className="w-full text-sm text-text-muted dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20
                            cursor-pointer transition-all"
                        />
                      )}
                    />
                    {field.description && <p className="text-xs text-accent mt-1">{field.description}</p>}
                    {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message as string}</p>}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
              <button type="button" onClick={() => setStep(2)} className="text-text-muted hover:text-primary font-medium px-6 py-3 transition-colors">Atrás</button>
              <button
                type="submit"
                disabled={isSubmitting || !session}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : session ? (
                  "Enviar Solicitud"
                ) : (
                  "Inicia sesión para continuar"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
