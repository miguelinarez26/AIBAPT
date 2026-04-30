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

// Layout para rutas internacionalizadas (/es/*, /pt/*)
// Hereda providers del root layout — solo añade Header/Footer y metadata SEO.
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
