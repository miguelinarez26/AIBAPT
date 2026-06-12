import React from "react";
import { WEBINARS_DATA } from "@/data/webinars";

export function generateStaticParams() {
    return WEBINARS_DATA.map((webinar) => ({
        slug: webinar.slug
    }));
}

export default function FormacionSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
