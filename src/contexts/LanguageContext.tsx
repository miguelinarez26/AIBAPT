"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, LangKeys } from "@/i18n/translations";
import { usePathname, useRouter } from "next/navigation";

type Language = "es" | "pt";

interface LanguageContextProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: LangKeys) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
    children: React.ReactNode;
    initialLang?: Language;
}

export const LanguageProvider = ({ children, initialLang = "es" }: LanguageProviderProps) => {
    const [lang, setLangState] = useState<Language>(initialLang);
    const pathname = usePathname();
    const router = useRouter();

    // Cambiar idioma: actualiza cookie, estado y navega al prefijo correcto
    const changeLanguage = useCallback((newLang: Language) => {
        setLangState(newLang);

        // Guardar en cookie para que el middleware lo detecte en futuras visitas
        document.cookie = `aibapt-lang=${newLang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

        // Reemplazar el prefijo de idioma en la ruta actual
        // Ej: /es/formaciones → /pt/formaciones
        const segments = pathname.split('/');
        if (segments.length >= 2 && (segments[1] === 'es' || segments[1] === 'pt')) {
            segments[1] = newLang;
        }
        const newPath = segments.join('/') || `/${newLang}`;
        router.push(newPath);
    }, [pathname, router]);

    const t = (key: LangKeys): string => {
        const val = translations[lang][key];
        return val !== undefined ? val : key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
