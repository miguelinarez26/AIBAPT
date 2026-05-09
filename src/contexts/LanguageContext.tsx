"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, LangKeys } from "@/i18n/translations";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

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

export const LanguageProvider = ({ children, initialLang }: LanguageProviderProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { session } = useAuth();

    // Determinar el idioma inicial: prop > URL > cookie > defecto
    const resolveInitialLang = (): Language => {
        if (initialLang) return initialLang;
        // Detectar desde la URL actual
        const segments = pathname.split('/');
        if (segments.length >= 2 && (segments[1] === 'es' || segments[1] === 'pt')) {
            return segments[1] as Language;
        }
        // Fallback a cookie si existe
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(/aibapt-lang=(es|pt)/);
            if (match) return match[1] as Language;
        }
        return 'es';
    };

    const [lang, setLangState] = useState<Language>(resolveInitialLang);

    // Sincronizar lang con la URL cuando el pathname cambia (navegación directa o setLang)
    useEffect(() => {
        const segments = pathname.split('/');
        if (segments.length >= 2 && (segments[1] === 'es' || segments[1] === 'pt')) {
            const urlLang = segments[1] as Language;
            if (urlLang !== lang) {
                setLangState(urlLang);
            }
        }
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    const changeLanguage = useCallback(async (newLang: Language) => {
        setLangState(newLang);

        // Guardar en cookie para que el middleware lo detecte en futuras visitas
        document.cookie = `aibapt-lang=${newLang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

        // Sincronizar con la base de datos ELIMINADO del Header
        // El idioma oficial solo se cambia desde la página de Perfil.
        /*
        if (session?.user) {
            const supabase = createBrowserSupabaseClient();
            const { error } = await supabase
                .from('profiles')
                .update({ language_preference: newLang })
                .eq('id', session.user.id);
                
            if (error) {
                console.error("Error sincronizando idioma:", error);
            }
        }
        */

        // Reemplazar el prefijo de idioma en la ruta actual
        // Ej: /es/formaciones → /pt/formaciones
        const segments = pathname.split('/');
        if (segments.length >= 2 && (segments[1] === 'es' || segments[1] === 'pt')) {
            segments[1] = newLang;
        }
        const newPath = segments.join('/') || `/${newLang}`;
        router.push(newPath);
    }, [pathname, router, session]);

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
