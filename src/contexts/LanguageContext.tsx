"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, LangKeys } from "@/i18n/translations";

type Language = "es" | "pt";

interface LanguageContextProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: LangKeys) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>("es");

    // Load from LocalStorage if applied previously
    useEffect(() => {
        const savedLang = localStorage.getItem("aibapt-lang") as Language;
        if (savedLang && (savedLang === "es" || savedLang === "pt")) {
            setLang(savedLang);
        }
    }, []);

    const changeLanguage = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem("aibapt-lang", newLang);
    };

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
