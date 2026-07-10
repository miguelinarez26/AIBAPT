"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CustomPhoneInput } from "@/components/ui/CustomPhoneInput";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { 
  ChevronRight, 
  Loader2, 
  UploadCloud, 
  FileText,
  UserCircle2,
  MapPin,
  Building,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { EscenarioEvento } from "@/config/aibapt-config";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const fileSchema = z
  .any()
  .refine((files) => files?.length === 1, "Este archivo es obligatorio.")
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "El tamaño máximo es de 10MB.")
  .refine((files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), "Solo se aceptan archivos PDF.");

const optionalFileSchema = z
  .any()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, "El tamaño máximo es de 10MB.")
  .refine((files) => !files || files.length === 0 || ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), "Solo se aceptan archivos PDF.");

const formSchema = z.object({
  person_type: z.enum(["pleno_salud_mental", "pleno_agente_social", "institucional", "bienhechor", "simpatizante", "otro"]),
  cpf_document: z.string().min(1, "El CPF / Doc Fiscal es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  neighborhood: z.string().min(1, "El barrio es obligatorio"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  state: z.string().min(1, "El estado es obligatorio"),
  country: z.string().min(1, "El país es obligatorio"),
  zip_code: z.string().min(1, "El CEP / Código Postal es obligatorio"),
  phone_mobile: z.string().min(1, "El teléfono celular es obligatorio").refine((val) => {
    try {
      return isValidPhoneNumber(val);
    } catch {
      return false;
    }
  }, "El número ingresado no es válido para ese país"),
  phone_commercial: z.string().optional().refine((val) => {
    if (!val || val.trim().length <= 5) return true;
    try {
      return isValidPhoneNumber(val);
    } catch {
      return false;
    }
  }, "El número comercial ingresado no es válido para ese país"),
  professional_register: z.string().min(1, "El registro profesional es obligatorio"),
  training_emdr: z.boolean().default(false),
  training_brainspotting: z.boolean().default(false),
  training_se: z.boolean().default(false),
  training_ifs: z.boolean().default(false),
  training_trv: z.boolean().default(false),
  training_ti_cbt: z.boolean().default(false),
  training_ot: z.boolean().default(false),
  training_otros_texto: z.string().optional(),
  is_public_directory: z.enum(["yes", "no"]),
  cv_file: optionalFileSchema,
  comprobante_file: optionalFileSchema,
  comprobante_donacion_file: optionalFileSchema,
  carta_option: z.enum(["request", "upload"]),
  carta_file: z.any().optional(),
  terms_accepted: z.literal(true, {
    message: "Debes aceptar los objetivos y términos de AIBAPT"
  }),
});

const getDynamicSchema = (personType: string, cartaOption: string, hasAnyTraining: boolean) => {
  const isVoluntary = ["simpatizante", "institucional", "bienhechor"].includes(personType);
  return formSchema.extend({
    professional_register: isVoluntary ? z.string().optional() : z.string().min(1, "El registro profesional es obligatorio"),
    person_type_otro_texto: z.string().optional().superRefine((val, ctx) => {
      if (personType === "otro" && (!val || val.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Por favor, especifica tu profesión",
        });
      }
    }),
    training_otros_texto: z.string().optional().superRefine((val, ctx) => {
      if (!isVoluntary && !hasAnyTraining && (!val || val.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes seleccionar al menos una formación o especificar en 'Otros'",
        });
      }
    }),
    cv_file: !isVoluntary ? fileSchema : optionalFileSchema,
    comprobante_file: !isVoluntary ? fileSchema : optionalFileSchema,
    comprobante_donacion_file: personType === "bienhechor" ? fileSchema : optionalFileSchema,
    carta_file: cartaOption === 'upload' ? fileSchema : optionalFileSchema,
  });
};

type FormValues = z.infer<typeof formSchema>;

export default function MembershipApplicationForm({
  selectedEscenario,
  currentEscenarioObj,
  lang,
  userId
}: {
  selectedEscenario: string;
  currentEscenarioObj: EscenarioEvento | undefined;
  lang: "es" | "pt";
  userId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = createBrowserSupabaseClient();

  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: async (data, context, options) => {
      // Calculate hasAnyTraining from data directly for validation to be accurate during submit
      const hasTraining = data.training_emdr || data.training_brainspotting || data.training_se || 
                          data.training_ifs || data.training_trv || data.training_ti_cbt || data.training_ot;
      const schema = getDynamicSchema(data.person_type, data.carta_option, hasTraining as boolean);
      return (zodResolver(schema) as any)(data, context, options);
    },
    mode: "onChange",
    defaultValues: {
      person_type: (selectedEscenario === "pleno" ? "pleno_salud_mental" : selectedEscenario) as any,
      is_public_directory: "yes",
      carta_option: "request",
    }
  });

  const cartaOption = watch("carta_option");
  const personType = watch("person_type");
  const isVoluntary = personType === "bienhechor" || personType === "simpatizante" || personType === "institucional";
  
  const trainingCheckboxes = watch([
    "training_emdr", "training_brainspotting", "training_se", 
    "training_ifs", "training_trv", "training_ti_cbt", "training_ot"
  ]);
  const hasAnyTraining = trainingCheckboxes.some(v => v === true);

  React.useEffect(() => {
    // Only trigger if the form has been submitted at least once (isSubmitted) 
    // or if the user is interacting with it, to avoid infinite loops and premature errors.
    trigger("training_otros_texto");
  }, [hasAnyTraining, trigger]);

  React.useEffect(() => {
    if (personType === "otro") {
      trigger("person_type_otro_texto");
    }
  }, [personType, trigger]);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const applicationId = uuidv4();
      
      const uploadFile = async (fileList: FileList, docType: string) => {
        if (!fileList || fileList.length === 0) return null;
        const file = fileList[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${applicationId}/${docType}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: docError } = await (supabase.from('documents') as any).insert({
          application_id: applicationId,
          user_id: userId,
          file_path: fileName,
          document_type: docType,
          is_private: true
        });

        if (docError) {
          console.error("Error inserting into documents table:", docError);
          throw new Error(`Error guardando referencia del documento: ${docError.message || JSON.stringify(docError)}`);
        }

        return fileName;
      };

      const metadata = {
        person_type: data.person_type,
        person_type_otro_texto: data.person_type_otro_texto,
        cpf_document: data.cpf_document,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zip_code: data.zip_code,
        phone_mobile: data.phone_mobile,
        phone_commercial: data.phone_commercial,
        professional_register: data.professional_register,
        training_background: {
          emdr: data.training_emdr,
          brainspotting: data.training_brainspotting,
          se: data.training_se,
          ifs: data.training_ifs,
          trv: data.training_trv,
          ti_cbt: data.training_ti_cbt,
          ot: data.training_ot,
          otros_texto: data.training_otros_texto
        },
        is_public_directory: data.is_public_directory === "yes",
        carta_recomendacion_solicitada: data.carta_option === "request",
        lang: lang,
        escenario: selectedEscenario,
        payment_status: currentEscenarioObj?.monto === 0 ? "not_required" : "pending"
      };

      // 1. Crear primero la solicitud para evitar violar la Foreign Key en documents
      const { error: appError } = await (supabase.from('applications') as any).insert({
        id: applicationId,
        user_id: userId,
        type_id: "solicitud_membresia",
        status: "pending", // Reverted to a valid enum value
        metadata: metadata
      });

      if (appError) {
        const errorDetails = `Code: ${appError.code}, Message: ${appError.message}, Details: ${appError.details}, Hint: ${appError.hint}`;
        console.error("Error inserting application:", errorDetails, appError);
        throw new Error(`Error guardando solicitud: ${errorDetails}`);
      }

      // 2. Subir y registrar documentos (ahora applicationId ya existe en applications)
      await uploadFile(data.cv_file, 'cv');
      await uploadFile(data.comprobante_file, 'comprobante_formacion');
      await uploadFile(data.comprobante_donacion_file, 'pago'); // Cambiado a 'pago' para respetar el Enum
      if (data.carta_option === 'upload') {
        await uploadFile(data.carta_file, 'carta_recomendacion');
      }

      // 3. Actualizar el perfil del usuario

      const { error: profileError } = await (supabase.from('profiles') as any).update({
        person_type: data.person_type,
        cpf_document: data.cpf_document,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zip_code: data.zip_code,
        phone_mobile: data.phone_mobile,
        phone_commercial: data.phone_commercial,
        professional_register: data.professional_register,
        training_background: metadata.training_background,
        is_public_directory: data.is_public_directory === "yes"
      }).eq('id', userId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw new Error(`Error actualizando perfil: ${profileError.message || JSON.stringify(profileError)}`);
      }

      toast.success(lang === "es" ? "Solicitud procesada. Redirigiendo al pago..." : "Solicitação processada. Redirecionando para pagamento...");
      window.location.href = `/${lang}/checkout/${applicationId}`;

    } catch (err: any) {
      console.error("Caught in onSubmit:", err);
      // Extraemos información real si err es un objeto vacío o sin mensaje claro
      let errorMsg = err.message;
      if (!errorMsg || errorMsg === "[object Object]") {
        try {
          errorMsg = JSON.stringify(err);
        } catch (e) {
          errorMsg = String(err);
        }
      }
      if (errorMsg === "{}") errorMsg = "Error desconocido de Supabase (posible RLS o columna faltante).";
      
      setSubmitError(errorMsg || "Ocurrió un error inesperado al procesar la solicitud.");
      toast.error(lang === "es" ? "Error al procesar la solicitud" : "Erro ao processar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormError = () => {
    setSubmitError(lang === "es" ? "Faltan campos por completar o hay errores de validación. Revisa el formulario." : "Faltam campos para preencher ou existem erros de validação.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 pt-8">
      {currentEscenarioObj && (
        <div className="bg-primary text-white rounded-2xl shadow-xl border border-primary-dark p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="z-10 mb-6 md:mb-0">
            <h2 className="text-2xl font-serif text-white mb-2">
              {lang === "es" ? "Inversión Anual" : "Investimento Anual"}
            </h2>
            <p className="text-white/80 max-w-md font-light">
              {typeof currentEscenarioObj.description === 'string' 
                ? currentEscenarioObj.description 
                : currentEscenarioObj.description[lang]}
            </p>
          </div>
          
          <div className="z-10 text-center md:text-right bg-accent text-white py-4 px-8 rounded-2xl shadow-lg border border-accent/20 transition-transform hover:scale-105 duration-300">
            <span className="block text-sm font-medium uppercase tracking-wider mb-1 opacity-90">
              {lang === "es" ? "Total a pagar" : "Total a pagar"}
            </span>
            <div className="flex items-start justify-center md:justify-end text-white">
              <span className="text-2xl font-bold mt-1">€</span>
              <span className="text-5xl font-bold font-serif">{currentEscenarioObj.monto}</span>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
          <span className="material-icons-round mr-2">error_outline</span>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit as any, handleFormError)} className="space-y-8">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 dark:border-gray-800 p-8 transition-all duration-500 group/card">
          <div className="flex items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <UserCircle2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-serif text-text-light">Datos Personales y de Contacto</h3>
          </div>

          <div className="space-y-6">
            {!isVoluntary && selectedEscenario !== "institucional" && (
              <div>
                <label className="block text-sm font-medium text-text-light mb-3">Persona física: *</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-start space-x-3 cursor-pointer bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
                  <input type="radio" value="pleno_salud_mental" {...register("person_type")} className="accent-primary focus:ring-primary h-4 w-4 mt-0.5 cursor-pointer" />
                  <span className="text-sm font-medium text-text-dark">Profesional de la Salud Mental (psicólogos y psiquiatras)</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
                  <input type="radio" value="pleno_agente_social" {...register("person_type")} className="accent-primary focus:ring-primary h-4 w-4 mt-0.5 cursor-pointer" />
                  <span className="text-sm font-medium text-text-dark leading-snug">Agente de Intervención Social (trabajadores sociales, enfermeros, terapeutas familiares, socorristas, policías, bomberos, consejeros religiosos, etc.)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
                  <input type="radio" value="otro" {...register("person_type")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer" />
                  <span className="text-sm font-medium text-text-dark">Otro</span>
                </label>
                {personType === "otro" && (
                  <div className="pl-8 pr-4 animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="text" 
                      placeholder="Especifique su profesión..." 
                      {...register("person_type_otro_texto")} 
                      className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner" 
                    />
                    {errors.person_type_otro_texto && <p className="text-red-500 text-xs mt-1">{errors.person_type_otro_texto.message as string}</p>}
                  </div>
                )}
              </div>
            </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-text-light mb-1">CPF / Documento Fiscal *</label>
                <input type="text" {...register("cpf_document")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
                {errors.cpf_document && <p className="text-red-500 text-xs mt-1">{errors.cpf_document.message}</p>}
              </div>
              <div className="flex flex-col h-full">
                {!isVoluntary && (
                  <>
                    <label className="block text-sm font-medium text-text-light mb-1">Registro Profesional (CRP/CRM) *</label>
                    <input type="text" {...register("professional_register")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
                    {errors.professional_register && <p className="text-red-500 text-xs mt-1">{errors.professional_register.message as string}</p>}
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-text-light mb-1">Celular / WhatsApp *</label>
                <Controller
                    name="phone_mobile"
                    control={control}
                    render={({ field }) => (
                      <CustomPhoneInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder={lang === "es" ? "Solo número local (sin prefijo)" : "Apenas número local (sem prefixo)"}
                        searchPlaceholder={lang === "es" ? "Buscar país..." : "Buscar país..."}
                        notFoundText={lang === "es" ? "País no encontrado" : "País não encontrado"}
                      />
                    )}
                />
                {errors.phone_mobile && <p className="text-red-500 text-xs mt-1">{errors.phone_mobile.message as string}</p>}
              </div>
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-text-light mb-1">Teléfono Comercial</label>
                <Controller
                    name="phone_commercial"
                    control={control}
                    render={({ field }) => (
                      <CustomPhoneInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder={lang === "es" ? "Número comercial" : "Número comercial"}
                      />
                    )}
                />
                {errors.phone_commercial && <p className="text-red-500 text-xs mt-1">{errors.phone_commercial.message as string}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 dark:border-gray-800 p-8 transition-all duration-500 group/card">
          <div className="flex items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-serif text-text-light">Dirección</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-light mb-1">Dirección Completa *</label>
              <input type="text" {...register("address")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">Barrio *</label>
              <input type="text" {...register("neighborhood")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">Ciudad *</label>
              <input type="text" {...register("city")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">Estado *</label>
              <input type="text" {...register("state")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">País *</label>
              <input type="text" {...register("country")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">CEP / Código Postal *</label>
              <input type="text" {...register("zip_code")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code.message}</p>}
            </div>
          </div>
        </div>

        {!isVoluntary && (
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 dark:border-gray-800 p-8 transition-all duration-500 group/card">
            <div className="flex items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif text-text-light">Formación (Cursos o certificaciones) *</h3>
            </div>
            
            <label className="block text-sm font-medium text-text-light mb-4">Selecciona las formaciones con las que cuentas:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_emdr")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">EMDR</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_brainspotting")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">Brainspotting</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_se")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">SE</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_ifs")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">IFS</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_trv")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">TRV</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_ti_cbt")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">TI-CBT</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("training_ot")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300" />
                <span className="text-sm">OT</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">Otros (Especificar)</label>
              <input type="text" {...register("training_otros_texto")} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary/50 hover:bg-white transition-all duration-300 shadow-inner" />
              {errors.training_otros_texto && <p className="text-red-500 text-xs mt-1">{errors.training_otros_texto.message as string}</p>}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 dark:border-gray-800 p-8 transition-all duration-500 group/card">
          <div className="flex items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-serif text-text-light">Carga de Documentos</h3>
          </div>

          <div className="space-y-6">
            {!isVoluntary && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-1">1. Cargar Currículum (PDF) *</label>
                  <input type="file" accept=".pdf" {...register("cv_file")} className="w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {errors.cv_file && <p className="text-red-500 text-xs mt-1">{errors.cv_file.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-1">2. Cargar Comprobante de formación en tratamiento del trauma reconocida por la AIBAPT (PDF) *</label>
                  <input type="file" accept=".pdf" {...register("comprobante_file")} className="w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {errors.comprobante_file && <p className="text-red-500 text-xs mt-1">{errors.comprobante_file.message as string}</p>}
                </div>
              </>
            )}

            {personType === "bienhechor" && (
                <div>
                  <label className="block text-sm font-medium text-text-light mb-1">Cargar Comprobante de Donación (PDF) *</label>
                  <input type="file" accept=".pdf" {...register("comprobante_donacion_file")} className="w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {errors.comprobante_donacion_file && <p className="text-red-500 text-xs mt-1">{errors.comprobante_donacion_file.message as string}</p>}
                </div>
            )}

            <div className={!isVoluntary ? "pt-4 border-t border-gray-100 dark:border-gray-800" : ""}>
              <label className="block text-sm font-bold text-text-light mb-3">
                {!isVoluntary ? "3. Carta de Recomendación *" : "1. Carta de Recomendación *"}
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className={`flex-1 flex items-center space-x-2 cursor-pointer bg-white dark:bg-dark-card px-4 py-3 rounded-xl border transition-colors ${cartaOption === 'request' ? 'border-primary shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}>
                    <input type="radio" value="request" {...register("carta_option")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer" />
                    <span className="text-sm font-medium">Solicitar Carta de Recomendación</span>
                  </label>
                  <label className={`flex-1 flex items-center space-x-2 cursor-pointer bg-white dark:bg-dark-card px-4 py-3 rounded-xl border transition-colors ${cartaOption === 'upload' ? 'border-primary shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}>
                    <input type="radio" value="upload" {...register("carta_option")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer" />
                    <span className="text-sm font-medium">Subir PDF de la carta</span>
                  </label>
                </div>
                
                {cartaOption === 'upload' && (
                  <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                    <input type="file" accept=".pdf" {...register("carta_file")} className="w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {errors.carta_file && <p className="text-red-500 text-xs mt-1">{errors.carta_file.message as string}</p>}
                  </div>
                )}
                {cartaOption === 'request' && (
                  <div className="animate-in fade-in text-sm text-text-dark pt-2 px-2 border-l-2 border-primary">
                    AIBAPT gestionará internamente la solicitud de su carta de recomendación.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 dark:border-gray-800 p-8 transition-all duration-500 group/card">
          <label className="block text-base font-bold text-text-light mb-3">¿Desea que su información sea pública en el directorio de la página de AIBAPT?</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="yes" {...register("is_public_directory")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <span className="text-sm">Sí</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="no" {...register("is_public_directory")} className="accent-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 dark:border-gray-800 p-8 transition-all duration-500 group/card">
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6 text-text-dark">
            <p><strong>He leído y estoy de acuerdo con los objetivos de la Asociación Iberoamericana de Psicotrauma:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>El propósito de mantener los más altos estándares de excelencia y la integridad en la formación clínica.</li>
              <li>La práctica clínica e investigación.</li>
              <li>La promoción de un ambiente de apoyo para el desarrollo profesional y educativo entre todos sus miembros.</li>
              <li>El mantenimiento del más alto nivel de conducta ética, según se expresa en los Códigos de Ética para los profesionales de la salud mental del país donde se reside.</li>
            </ul>
          </div>
          
          <label className="flex items-center space-x-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <input type="checkbox" {...register("terms_accepted")} className="accent-primary focus:ring-primary h-5 w-5 cursor-pointer rounded border-gray-300" />
            <span className="text-sm font-medium text-text-light dark:text-gray-300">Acepto los términos y condiciones de la Asociación Iberoamericana de Psicotrauma.</span>
          </label>
          {errors.terms_accepted && <p className="text-red-500 text-xs mt-2 ml-8">{errors.terms_accepted?.message as string}</p>}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group flex items-center justify-center space-x-2 px-8 py-4 bg-accent hover:bg-accent-light text-white font-medium rounded-full shadow-md transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            <span>
              {isSubmitting 
                ? (lang === "es" ? "Procesando..." : "Processando...")
                : currentEscenarioObj?.monto === 0 
                  ? (lang === "es" ? "Enviar Solicitud" : "Enviar Solicitação")
                  : (lang === "es" ? "Proceder al Pago Seguro" : "Proceder ao Pagamento Seguro")
              }
            </span>
            {!isSubmitting && (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
