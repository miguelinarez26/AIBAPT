import React from "react";

export function generateStaticParams() {
    return [
        { slug: "trauma-webinar-20" },
        { slug: "psicodrama-clinico" },
        { slug: "emdr-cuerpo" },
        { slug: "trauma-webinar-19" },
        { slug: "trauma-webinar-18" },
        { slug: "trauma-webinar-17" },
        { slug: "trauma-webinar-16" }
    ];
}

export default function FormacionSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
