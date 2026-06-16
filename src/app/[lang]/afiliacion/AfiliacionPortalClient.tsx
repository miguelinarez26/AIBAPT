"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AIBAPT_TRAMITES, EscenarioEvento, LocalizedText } from "@/config/aibapt-config";
import { UniversalStepper } from "@/components/acreditaciones/UniversalStepper";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Heart,
  Users,
  Building2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  pleno: Users,
  institucional: Building2,
  bienhechor: Heart,
};

export default function AfiliacionPortalClient({ lang }: { lang: "es" | "pt" }) {
  const { session } = useAuth();
  const router = useRouter();
  const config = AIBAPT_TRAMITES["solicitud_membresia"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper de traducción defensivo
  const getTranslation = (obj: LocalizedText | string | undefined): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || "";
  };

  const [selectedEscenario, setSelectedEscenario] = useState<string>("");
  const [showStepper, setShowStepper] = useState(false);

  // Derivar objeto del escenario seleccionado para detectar sub-perfiles
  const currentEscenarioObj = config?.monto.find(
    (e: EscenarioEvento) =>
      selectedEscenario === e.id || selectedEscenario.startsWith(e.id + "_")
  );

  // La selección es válida sólo si no hay sub-perfiles pendientes de elegir
  const isSelectionValid =
    selectedEscenario &&
    (!currentEscenarioObj?.subProfiles ||
      currentEscenarioObj.subProfiles.some(
        (sp: { id: string }) => sp.id === selectedEscenario
      ));

  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!isSelectionValid) {
      setError(lang === "es" ? "Por favor selecciona el tipo de membresía al que deseas aplicar para continuar." : "Por favor, selecione o tipo de membresia que deseja aplicar para continuar.");
      return;
    }
    setError(null);

    // Redireccionar si es formulario de contacto (Miembro Bienhechor / Simpatizante)
    const selectedScenarioObj = config?.monto.find(
      (e) => e.id === selectedEscenario || selectedEscenario.startsWith(e.id + "_")
    );
    if (selectedScenarioObj?.isContactForm) {
      router.push(`/${lang}/contacto`);
      return;
    }

    if (!session) {
      const redirectPath = `/${lang}/afiliacion`;
      router.push(`/${lang}/registro?redirectTo=${encodeURIComponent(redirectPath)}`);
      return;
    }
    setShowStepper(true);
  };

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  if (showStepper) {
    return (
      <div className="w-full min-h-screen bg-background-light relative overflow-hidden py-12">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] animation-delay-2000"></div>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <UniversalStepper
            tramiteId="solicitud_membresia"
            initialEscenario={selectedEscenario}
            onBack={() => setShowStepper(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative pb-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-6 max-w-4xl mx-auto"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 uppercase tracking-wider">
            {lang === "es" ? "Portal de Afiliación" : "Portal de Afiliação"}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-light mb-2 leading-[1.1]">
            {lang === "es" ? (
              <>
                Solicitud de <span className="italic font-light text-primary">Membresía</span> AIBAPT
              </>
            ) : (
              <>
                Solicitação de <span className="italic font-light text-primary">Membresia</span> AIBAPT
              </>
            )}
          </h1>
          <p className="text-sm md:text-base text-text-dark leading-relaxed max-w-3xl mx-auto">
            {lang === "es"
              ? "Selecciona tu categoría, descarga las plantillas y sube tus documentos directamente desde aquí."
              : "Selecione sua categoria, baixe os modelos e envie seus documentos diretamente por aqui."}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row justify-center items-stretch gap-4 lg:gap-6 w-full mb-8"
        >
          {config?.monto.map((esc) => {
            const isSelected =
              selectedEscenario === esc.id ||
              selectedEscenario.startsWith(esc.id + "_");
            const Icon = CATEGORY_ICONS[esc.id] || Users;

            return (
              <motion.div
                key={esc.id}
                variants={fadeInUp}
                className="relative flex-1 max-w-md flex flex-col group"
              >
                {/* Glow/Aura decorativo detrás de la tarjeta al hacer hover o estar seleccionada */}
                <div
                  className={`absolute inset-0 rounded-[32px] blur-2xl -z-10 transition-all duration-500 translate-y-2 opacity-0 group-hover:opacity-100 ${
                    isSelected ? "opacity-100 bg-primary/25" : "bg-primary/15"
                  }`}
                />

                <div
                  onClick={() => {
                    setError(null);
                    if (esc.subProfiles && esc.subProfiles.length > 0) {
                      if (!isSelected) setSelectedEscenario(esc.subProfiles[0].id);
                    } else {
                      setSelectedEscenario(esc.id);
                    }
                  }}
                  className={`flex-1 flex flex-col cursor-pointer transition-all duration-500 rounded-[32px] border relative overflow-hidden h-full ${
                    isSelected
                      ? "bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                      : "bg-white border-secondary/35 shadow-md shadow-secondary/15 hover:bg-primary hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
                  }`}
                >
                  <div className="p-6 md:p-8 text-center flex-1 flex flex-col relative z-10">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500 shadow-sm ${
                        isSelected
                          ? "bg-secondary text-white shadow-md shadow-black/10"
                          : "bg-primary/10 text-primary group-hover:bg-white group-hover:text-primary"
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3
                      className={`text-xl font-serif transition-colors duration-500 mb-1 leading-snug ${
                        isSelected ? "text-white" : "text-text-light group-hover:text-white"
                      }`}
                    >
                      {getTranslation(esc.label)}
                    </h3>

                    <div className={`text-2xl font-black mb-2 transition-colors duration-500 ${
                        isSelected ? "text-white" : "text-accent group-hover:text-white"
                      }`}>
                      {esc.monto > 0
                        ? `${esc.monto} €`
                        : lang === "es" ? "Voluntario" : "Voluntário"}
                      {esc.monto > 0 && (
                        <span className={`text-sm font-medium ml-1 transition-colors duration-500 ${isSelected ? "text-white/80" : "text-text-dark group-hover:text-white/80"}`}>
                          /{lang === "es" ? "año" : "ano"}
                        </span>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed mb-3 transition-colors duration-500 ${
                        isSelected ? "text-white/95" : "text-text-dark group-hover:text-white/95"
                      }`}>
                      {getTranslation(esc.description)}
                    </p>

                    {esc.examples && (
                      <p className={`text-xs italic transition-colors duration-500 ${
                        isSelected ? "text-white/80" : "text-text-dark/70 group-hover:text-white/80"
                      }`}>
                        {getTranslation(esc.examples)}
                      </p>
                    )}

                    {isSelected && !esc.subProfiles && !esc.isContactForm && (
                      <div className="mt-auto pt-6 flex items-center justify-center gap-2 text-white text-sm font-bold animate-fade-in-up">
                        <CheckCircle className="w-5 h-5" />
                        {lang === "es" ? "Seleccionado" : "Selecionado"}
                      </div>
                    )}

                    {esc.isContactForm && isSelected && (
                      <div className="mt-auto pt-6 flex items-center justify-center gap-2 text-white text-sm font-bold animate-fade-in-up">
                        <CheckCircle className="w-5 h-5" />
                        {lang === "es" ? "Formulario de contacto" : "Formulário de contacto"}
                      </div>
                    )}
                  </div>

                  {esc.subProfiles && isSelected && (
                    <div
                      className="bg-white/10 p-6 backdrop-blur-sm animate-fade-in-up relative z-10 flex-1 border-t border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-sm font-bold text-white mb-4 text-center">
                        {lang === "es" ? "Elige tu perfil:" : "Escolha seu perfil:"}
                      </p>
                      <div className="flex flex-col gap-3">
                        {esc.subProfiles.map((sp) => {
                          const spSelected = selectedEscenario === sp.id;
                          return (
                            <label
                              key={sp.id}
                              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 ${
                                spSelected
                                  ? "border-white bg-white shadow-lg shadow-black/10 scale-[1.02]"
                                  : "border-white/30 hover:border-white/60 hover:bg-white/10"
                              }`}
                            >
                              <input
                                type="radio"
                                name="subprofile"
                                value={sp.id}
                                checked={spSelected}
                                onChange={() => setSelectedEscenario(sp.id)}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    spSelected
                                      ? "border-primary bg-primary"
                                      : "border-white/60"
                                  }`}
                                >
                                  {spSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span
                                  className={`font-bold text-sm ${
                                    spSelected ? "text-primary" : "text-white"
                                  }`}
                                >
                                  {getTranslation(sp.label)}
                                </span>
                              </div>

                              {sp.examples && (
                                <p className={`text-xs italic ml-6 ${spSelected ? "text-gray-500" : "text-white/70"}`}>
                                  {getTranslation(sp.examples)}
                                </p>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 max-w-xl mx-auto bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center justify-center text-sm border border-red-100 dark:border-red-900/50">
              <span className="material-icons-round mr-2">error_outline</span>
              {error}
            </motion.div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="group/btn relative inline-flex items-center gap-4 bg-accent hover:bg-accent-light text-white pl-8 pr-2 py-2 rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1"
          >
            <span className="leading-none">
              {!(mounted && session)
                ? (lang === "es"
                  ? "Crear cuenta y continuar"
                  : "Criar conta e continuar")
                : (lang === "es"
                  ? "Iniciar proceso de afiliación"
                  : "Iniciar processo de afiliação")}
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-text-dark/70 mt-6 max-w-lg mx-auto">
          {!(mounted && session)
            ? (lang === "es"
              ? "Al continuar, se te pedirá crear una cuenta para subir tus documentos de forma segura."
              : "Ao continuar, será solicitado que crie uma conta para enviar seus documentos de forma segura.")
            : (lang === "es"
              ? "Al continuar, podrás descargar las plantillas necesarias y subir tus documentos para revisión de la Secretaría."
              : "Ao continuar, você poderá baixar os modelos necesarios e enviar seus documentos para revisão da Secretaria.")}
        </p>
      </div>
    </div>
  );
}
