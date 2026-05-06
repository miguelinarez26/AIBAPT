import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quiénes Somos | AIBAPT",
    description: "Conozca la AIBAPT, sus objetivos, misión y propósitos. La Asociación Iberoamericana de Psicotrauma reúne profesionales para expandir conocimientos sobre Psicotrauma.",
    openGraph: {
        title: "Quiénes Somos | AIBAPT",
        description: "Conozca la AIBAPT, sus objetivos, misión y propósitos. La Asociación Iberoamericana de Psicotrauma reúne profesionales para expandir conocimientos sobre Psicotrauma.",
        url: "https://esp.aibapt.org/quienes-somos",
        siteName: "AIBAPT",
        type: "website",
    },
};

export default function QuienesSomosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
