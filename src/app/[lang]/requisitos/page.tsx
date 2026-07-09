"use client";

import { AIBAPT_TRAMITES } from "@/config/aibapt-config";
import { motion } from "framer-motion";
import { ChevronRight, FileCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function RequisitosPage({ params }: { params: Promise<{ lang: "es" | "pt" }> }) {
  const { lang } = use(params);
  const config = AIBAPT_TRAMITES["solicitud_membresia"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTranslation = (obj: any): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || "";
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

  if (!mounted) return null;

  return (
    <main className="w-full min-h-screen bg-background-light pt-10 md:pt-12 pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          href={`/${lang}/afiliacion`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-8"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          {lang === "es" ? "Volver a Membresías" : "Voltar às Membresias"}
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 uppercase tracking-wider">
            {lang === "es" ? "Información Importante" : "Informação Importante"}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-light mb-4 leading-tight">
            {lang === "es" ? "Requisitos de Ingreso" : "Requisitos de Ingresso"}
          </h1>
          <p className="text-base text-text-dark leading-relaxed max-w-2xl mx-auto">
            {lang === "es" 
              ? "Revisa cuidadosamente los documentos y criterios necesarios para aplicar a cada una de nuestras categorías de membresía en AIBAPT." 
              : "Revise cuidadosamente os documentos e critérios necessários para aplicar a cada uma das nossas categorias de membresia na AIBAPT."}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {config.monto.map((membresia) => (
            <motion.div 
              key={membresia.id}
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              {/* Decorative accent inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-serif text-text-light">
                  {getTranslation(membresia.label)}
                </h2>
              </div>
              
              <p className="text-text-dark mb-6 border-b border-gray-100 pb-4">
                {getTranslation(membresia.description)}
              </p>

              {/* Si tiene sub-perfiles (como Miembro Pleno) iteramos los requisitos de cada uno */}
              {membresia.subProfiles ? (
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-text-light mb-2 text-primary">
                    {membresia.subProfiles.map((sub: any) => getTranslation(sub.label)).join(' / ')}
                  </h3>
                  <p className="text-sm text-text-dark/80 italic mb-4">
                    {membresia.subProfiles.map((sub: any) => getTranslation(sub.examples)).filter(Boolean).join(' / ')}
                  </p>
                  
                  {membresia.subProfiles[0].requirements && (
                    <ul className="space-y-3">
                      {membresia.subProfiles[0].requirements[lang].map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-text-dark">
                          <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                /* Si no tiene subperfiles, mostramos los requisitos directos (como Institucional) */
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                  {membresia.requirements ? (
                    <ul className="space-y-3">
                      {membresia.requirements[lang].map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-text-dark">
                          <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-text-dark italic">
                      {lang === "es" 
                        ? "No se exigen requisitos documentales específicos para esta categoría." 
                        : "Não são exigidos requisitos documentais específicos para esta categoria."}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
