"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { LogOut, User } from "lucide-react";
import logoLight from "../../../public/images/logo_aibapt.png";
import logoDark from "../../../public/images/logo_corto_en_blanco.png";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    const pathname = usePathname();
    const { lang, setLang, t } = useLanguage();
    const { session, profile } = useAuth() as any;

    const handleSignOut = async () => {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
        // El AuthProvider detectará el cambio y actualizará el estado
    };

    return (
        <header className="fixed w-full top-0 z-50 glass-header border-b border-accent/20 dark:border-accent/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href={`/${lang}`} className="flex items-center gap-2">
                        <Image src={logoLight} alt="AIBAPT Logo" width={180} height={100} className="object-contain h-12 w-auto dark:hidden" />
                        <Image src={logoDark} alt="AIBAPT Logo Blanco" width={180} height={100} className="object-contain h-12 w-auto hidden dark:block" />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link href={`/${lang}`} className={`text-sm font-medium transition-colors ${pathname === `/${lang}` || pathname === `/${lang}/` ? 'text-primary dark:text-secondary' : 'text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white'}`}>{t("nav.home")}</Link>

                        {/* La Asociación Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors">
                                {/* @ts-ignore */}
                                {t("nav.association" as any)}
                                <span className="material-icons-round text-[16px]">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 py-2">
                                <Link href={`/${lang}/quienes-somos`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.about")}</Link>
                                <Link href={`/${lang}/socios`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.partners")}</Link>
                                <Link href={`/${lang}/contacto`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.contact")}</Link>
                                <Link href={lang === 'es' ? '/docs/Estatutos_AIBAPT_ESP.pdf' : '/docs/Estatutos_AIBAPT_PT.pdf'} target="_blank" download className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.statutes" as any)}</Link>
                                <Link href={lang === 'es' ? '/docs/Reglamento_Interno_AIBAPT_ESP.pdf' : '/docs/Reglamento_Interno_AIBAPT_PT.pdf'} target="_blank" download className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.rules" as any)}</Link>
                            </div>
                        </div>

                        {/* Membresía Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors">
                                {/* @ts-ignore */}
                                {t("nav.membership" as any)}
                                <span className="material-icons-round text-[16px]">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 py-2">
                                {/* @ts-ignore */}
                                <Link href={`/${lang}/afiliacion`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.afiliacion" as any)}</Link>
                                {/* @ts-ignore */}
                                <Link href={`/${lang}/miembros`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.members" as any)}</Link>
                            </div>
                        </div>

                        {/* Desarrollo Profesional Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors">
                                {/* @ts-ignore */}
                                {t("nav.development" as any)}
                                <span className="material-icons-round text-[16px]">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-6 w-64 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 py-2">
                                <Link href={`/${lang}/formaciones?tab=events`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.development.events" as any)}</Link>
                                <Link href={`/${lang}/formaciones?tab=webinars`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.development.recordings" as any)}</Link>
                                <Link href={`/${lang}/formaciones?tab=accredited`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.development.accredited" as any)}</Link>
                                <Link href={`/${lang}/formaciones?tab=accreditation`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.development.accreditation" as any)}</Link>
                            </div>
                        </div>

                        {/* Publicaciones Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors">
                                {/* @ts-ignore */}
                                {t("nav.news" as any)}
                                <span className="material-icons-round text-[16px]">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-6 w-64 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 py-2">
                                <Link href={`/${lang}/publicaciones?cat=articulos`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("news.cat.clinical")}</Link>
                                <Link href={`/${lang}/publicaciones?cat=entrevistas`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("news.cat.interviews")}</Link>
                                <Link href={`/${lang}/publicaciones?cat=prensa`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("news.cat.prensa")}</Link>
                                <Link href={`/${lang}/publicaciones?cat=libros`} className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("news.cat.libros")}</Link>
                                <div className="h-px bg-accent/10 my-1 mx-2"></div>
                                <Link href={`/${lang}/publicaciones`} className="block px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-colors uppercase tracking-wider">{t("nav.see_all" as any)}</Link>
                            </div>
                        </div>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center bg-accent/50 dark:bg-surface-dark rounded-full p-1 border border-accent dark:border-gray-700">
                            <button
                                onClick={() => setLang("es")}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'es' ? 'bg-white dark:bg-surface-light shadow-sm text-primary dark:text-secondary' : 'text-text-muted dark:text-white/70 hover:text-primary cursor-pointer'}`}
                            >ES</button>
                            <button
                                onClick={() => setLang("pt")}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'pt' ? 'bg-white dark:bg-surface-light shadow-sm text-primary dark:text-secondary' : 'text-text-muted dark:text-white/70 hover:text-primary cursor-pointer'}`}
                            >PT</button>
                        </div>
                        {mounted && session ? (
                            <div className="relative group">
                                <Link href={profile?.role === 'admin' ? `/${lang}/admin` : `/${lang}/dashboard`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                                    <span className="material-icons-round text-lg">account_circle</span>
                                    {t("nav.portal")}
                                </Link>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                                    <button onClick={handleSignOut} className="w-full text-left flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {t("nav.logout" as any)}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href={`/${lang}/login`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                                <span className="material-icons-round text-lg">account_circle</span>
                                {t("nav.portal")}
                            </Link>
                        )}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
                            <span className="material-icons-round">menu</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-surface-dark border-b border-accent/20 dark:border-gray-800 p-4 shadow-lg animate-fade-in-up">
                    <nav className="flex flex-col space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar pb-4">
                        <Link href={`/${lang}`} onClick={() => setIsMenuOpen(false)} className="text-text-main dark:text-white/80 hover:text-primary font-medium px-2">{t("nav.home")}</Link>

                        {/* La Asociación */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.association" as any)}</span>
                            <Link href={`/${lang}/quienes-somos`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.about")}</Link>
                            <Link href={`/${lang}/socios`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.partners")}</Link>
                            <Link href={`/${lang}/contacto`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.contact")}</Link>
                            <Link href={lang === 'es' ? '/docs/Estatutos_AIBAPT_ESP.pdf' : '/docs/Estatutos_AIBAPT_PT.pdf'} target="_blank" download onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.statutes" as any)}</Link>
                            <Link href={lang === 'es' ? '/docs/Reglamento_Interno_AIBAPT_ESP.pdf' : '/docs/Reglamento_Interno_AIBAPT_PT.pdf'} target="_blank" download onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.rules" as any)}</Link>
                        </div>

                        {/* Membresía */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.membership" as any)}</span>
                            {/* @ts-ignore */}
                            <Link href={`/${lang}/afiliacion`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.afiliacion" as any)}</Link>
                            {/* @ts-ignore */}
                            <Link href={`/${lang}/miembros`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.members" as any)}</Link>
                        </div>

                        {/* Desarrollo Profesional */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.development" as any)}</span>
                            <Link href={`/${lang}/formaciones?tab=events`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.development.events" as any)}</Link>
                            <Link href={`/${lang}/formaciones?tab=webinars`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.development.recordings" as any)}</Link>
                            <Link href={`/${lang}/formaciones?tab=accredited`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.development.accredited" as any)}</Link>
                            <Link href={`/${lang}/formaciones?tab=accreditation`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.development.accreditation" as any)}</Link>
                        </div>

                        {/* Publicaciones */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.news" as any)}</span>
                            <Link href={`/${lang}/publicaciones?cat=articulos`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("news.cat.clinical")}</Link>
                            <Link href={`/${lang}/publicaciones?cat=entrevistas`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("news.cat.interviews")}</Link>
                            <Link href={`/${lang}/publicaciones?cat=prensa`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("news.cat.prensa")}</Link>
                            <Link href={`/${lang}/publicaciones?cat=libros`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("news.cat.libros")}</Link>
                            <Link href={`/${lang}/publicaciones`} onClick={() => setIsMenuOpen(false)} className="pl-4 text-xs font-bold text-primary tracking-wider uppercase">{t("nav.see_all" as any)}</Link>
                        </div>

                        <div className="pt-4 border-t border-accent/20 dark:border-gray-800">
                            {mounted && session ? (
                                <div className="space-y-3">
                                    <Link href={`/${lang}/dashboard`} onClick={() => setIsMenuOpen(false)} className={buttonVariants({ variant: "primary", size: "default", fullWidth: true })}>
                                        <span className="material-icons-round text-lg">account_circle</span>
                                        {t("nav.portal")}
                                    </Link>
                                    <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold rounded-xl transition-colors">
                                        <LogOut className="w-5 h-5 mr-2" />
                                        {t("nav.logout" as any)}
                                    </button>
                                </div>
                            ) : (
                                <Link href={`/${lang}/login`} onClick={() => setIsMenuOpen(false)} className={buttonVariants({ variant: "primary", size: "default", fullWidth: true })}>
                                    <span className="material-icons-round text-lg">account_circle</span>
                                    {t("nav.portal")}
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};
