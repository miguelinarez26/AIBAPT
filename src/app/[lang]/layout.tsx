import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SupportedLanguage } from "@/types/database";

// Genera las variantes estáticas de idioma en build-time
export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'pt' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    es: "AIBAPT — Asociación Iberoamericana de Psicotrauma",
    pt: "AIBAPT — Associação Ibero-Americana de Psicotrauma",
  };

  const descriptions: Record<string, string> = {
    es: "Plataforma de acreditación y certificación profesional en psicotraumatología para profesionales de salud mental en Iberoamérica.",
    pt: "Plataforma de acreditação e certificação profissional em psicotraumatologia para profissionais de saúde mental na Ibero-América.",
  };

  return {
    title: titles[lang] || titles.es,
    description: descriptions[lang] || descriptions.es,
  };
}

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Suspense } from "react";

// Layout para rutas internacionalizadas (/es/*, /pt/*)
// Inyecta los proveedores de contexto necesarios para la UI y el idioma.
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <LanguageProvider initialLang={lang as SupportedLanguage}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </Suspense>
    </AuthProvider>
  );
}
