"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AIBAPT_TRAMITES, EscenarioEvento } from "@/config/aibapt-config";
import { UniversalStepper } from "@/components/acreditaciones/UniversalStepper";
import {
  CheckCircle,
  ArrowLeft,
  Heart,
  Users,
  Building2,
  Star,
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

  const [selectedEscenario, setSelectedEscenario] = useState<string>("");
  const [showStepper, setShowStepper] = useState(false);

  // Derivar objeto del escenario seleccionado para detectar sub-perfiles
  const currentEscenarioObj = Array.isArray(config.monto)
    ? config.monto.find(
        (e: EscenarioEvento) =>
          selectedEscenario === e.id || selectedEscenario.startsWith(e.id + "_")
      )
    : null;

  // La selección es válida sólo si no hay sub-perfiles pendientes de elegir
  const isSelectionValid =
    selectedEscenario &&
    (!currentEscenarioObj?.subProfiles ||
      currentEscenarioObj.subProfiles.some(
        (sp: { id: string }) => sp.id === selectedEscenario
      ));

  // --- Handler del botón "Continuar" ---
  // Si el usuario NO está logueado → redirect a registro con returnTo
  // Si está logueado → mostrar Stepper
  const handleContinue = () => {
    if (!session) {
      // Guardar escenario en la URL para preservar la selección tras login
      const redirectPath = `/${lang}/afiliacion`;
      router.push(`/${lang}/registro?redirectTo=${encodeURIComponent(redirectPath)}`);
      return;
    }
    setShowStepper(true);
  };

  // --- Vista del Stepper (documentos) ---
  if (showStepper) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <UniversalStepper
            tramiteId="solicitud_membresia"
            initialEscenario={selectedEscenario}
            onBack={() => setShowStepper(false)}
          />
        </div>
      </div>
    );
  }

  // --- Vista del Selector de Categorías (PÚBLICA) ---
  return (
    <div className="bg-gray-50 dark:bg-background-dark pb-16">
      {/* Breadcrumb + Título del Portal */}
      <div className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 pt-3 pb-1 flex items-center gap-2 text-sm text-text-muted dark:text-gray-500">
          <Link
            href={`/${lang}`}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "es" ? "Inicio" : "Início"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-text-main dark:text-white">
            {lang === "es" ? "Afiliación" : "Afiliação"}
          </span>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4" />
            {lang === "es" ? "PORTAL DE AFILIACIÓN" : "PORTAL DE AFILIAÇÃO"}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white mb-3">
            {lang === "es"
              ? "Solicitud de Membresía AIBAPT"
              : "Solicitação de Membresia AIBAPT"}
          </h1>
          <p className="text-text-muted dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {lang === "es"
              ? "Selecciona tu categoría, descarga las plantillas y sube tus documentos directamente desde aquí."
              : "Selecione sua categoria, baixe os modelos e envie seus documentos diretamente por aqui."}
          </p>
        </div>
      </div>

      {/* Selector de Categorías — 3 tarjetas centradas */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full">
          {(config.monto as EscenarioEvento[]).map((esc) => {
            const isSelected =
              selectedEscenario === esc.id ||
              selectedEscenario.startsWith(esc.id + "_");
            const Icon = CATEGORY_ICONS[esc.id] || Users;

            return (
              <div
                key={esc.id}
                onClick={() => {
                  // Para categorías con sub-perfiles (ej. Pleno), preseleccionar el primero
                  if (esc.subProfiles && esc.subProfiles.length > 0) {
                    if (!isSelected) setSelectedEscenario(esc.subProfiles[0].id);
                  } else {
                    // Para Institucional y Bienhechor, selección directa
                    setSelectedEscenario(esc.id);
                  }
                }}
                className={`flex-1 max-w-md cursor-pointer transition-all duration-300 rounded-2xl border-2 flex flex-col ${
                  isSelected
                    ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                    : "bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:border-primary/40 hover:shadow-md"
                }`}
              >
                {/* Cabecera de la tarjeta */}
                <div className="p-6 text-center flex-1 flex flex-col">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
                      isSelected
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3
                    className={`text-xl font-black mb-1 ${
                      isSelected ? "text-primary" : "text-text-main dark:text-white"
                    }`}
                  >
                    {typeof esc.label === "string" ? esc.label : esc.label[lang]}
                  </h3>

                  {/* Precio */}
                  <div className="text-3xl font-black text-accent mb-2">
                    {esc.monto > 0
                      ? `${esc.monto} €`
                      : lang === "es" ? "Voluntario" : "Voluntário"}
                    {esc.monto > 0 && (
                      <span className="text-sm font-medium text-text-muted">
                        /{lang === "es" ? "año" : "ano"}
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <p className="text-text-muted dark:text-gray-400 text-sm mb-2">
                    {typeof esc.description === "string"
                      ? esc.description
                      : esc.description[lang]}
                  </p>

                  {/* Ejemplos de profesionales */}
                  {esc.examples && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                      {esc.examples[lang]}
                    </p>
                  )}

                  {/* Indicador selección simple (Institucional) */}
                  {isSelected && !esc.subProfiles && !esc.isContactForm && (
                    <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-primary text-sm font-bold">
                      <CheckCircle className="w-5 h-5" />
                      {lang === "es" ? "Seleccionado" : "Selecionado"}
                    </div>
                  )}

                  {/* Badge Contacto para Bienhechor */}
                  {esc.isContactForm && isSelected && (
                    <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-primary text-sm font-bold">
                      <CheckCircle className="w-5 h-5" />
                      {lang === "es" ? "Formulario de contacto" : "Formulário de contato"}
                    </div>
                  )}
                </div>

                {/* Sub-selector de perfil (solo Miembro Pleno) */}
                {esc.subProfiles && isSelected && (
                  <div
                    className="border-t border-gray-200 dark:border-gray-700 p-5 animate-fade-in-up"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm font-bold text-text-main dark:text-white mb-3 text-center">
                      {lang === "es" ? "Elige tu perfil:" : "Escolha seu perfil:"}
                    </p>
                    <div className="flex flex-col gap-3">
                      {esc.subProfiles.map((sp) => {
                        const spSelected = selectedEscenario === sp.id;
                        return (
                          <label
                            key={sp.id}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                              spSelected
                                ? "border-primary bg-primary/5 dark:bg-primary/10"
                                : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
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
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {spSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span
                                className={`font-bold text-sm ${
                                  spSelected ? "text-primary" : "text-text-main dark:text-white"
                                }`}
                              >
                                {typeof sp.label === "string" ? sp.label : sp.label[lang]}
                              </span>
                            </div>

                            {/* Ejemplos del sub-perfil */}
                            {sp.examples && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 italic ml-6">
                                {sp.examples[lang]}
                              </p>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botón de acción — Gate de autenticación aquí */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleContinue}
            disabled={!isSelectionValid}
            className="bg-primary text-white px-12 py-4 rounded-full font-black text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
          >
            {!session
              ? (lang === "es"
                ? "Crear Cuenta y Continuar →"
                : "Criar Conta e Continuar →")
              : (lang === "es"
                ? "Iniciar Proceso de Afiliación →"
                : "Iniciar Processo de Afiliação →")}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4 max-w-lg mx-auto">
          {!session
            ? (lang === "es"
              ? "Al continuar, se te pedirá crear una cuenta para subir tus documentos de forma segura."
              : "Ao continuar, será solicitado que crie uma conta para enviar seus documentos de forma segura.")
            : (lang === "es"
              ? "Al continuar, podrás descargar las plantillas necesarias y subir tus documentos para revisión de la Secretaría."
              : "Ao continuar, você poderá baixar os modelos necessários e enviar seus documentos para revisão da Secretaria.")}
        </p>
      </div>
    </div>
  );
}
