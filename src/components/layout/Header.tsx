"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import logoLight from "../../../public/images/logo aibapt.png";
import logoDark from "../../../public/images/logo corto en blanco.png";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { lang, setLang, t } = useLanguage();

    return (
        <header className="fixed w-full top-0 z-50 glass-header border-b border-accent/20 dark:border-accent/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src={logoLight} alt="AIBAPT Logo" width={180} height={100} className="object-contain h-12 w-auto dark:hidden" />
                        <Image src={logoDark} alt="AIBAPT Logo Blanco" width={180} height={100} className="object-contain h-12 w-auto hidden dark:block" />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary dark:text-secondary' : 'text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white'}`}>{t("nav.home")}</Link>

                        {/* La Asociación Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors">
                                {/* @ts-ignore */}
                                {t("nav.association" as any)}
                                <span className="material-icons-round text-[16px]">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 py-2">
                                <Link href="/quienes-somos" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.about")}</Link>
                                <Link href="/socios" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.partners")}</Link>
                                <Link href="/contacto" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.contact")}</Link>
                                <Link href="/docs/estatutos.pdf" target="_blank" download className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">Estatutos</Link>
                                <Link href="/docs/reglamento_interno.pdf" target="_blank" download className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">Reglamento Interno</Link>
                                <Link href="/organigrama" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">Organigrama Funcional</Link>
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
                                <Link href="/afiliacion" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.afiliacion" as any)}</Link>
                                {/* @ts-ignore */}
                                <Link href="/miembros" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.members" as any)}</Link>
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
                                <Link href="/formaciones" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.trainings")}</Link>
                                <Link href="/certificaciones" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("nav.certifications")}</Link>
                                <Link href="/recursos" className="block px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-primary/5 hover:text-primary">{t("footer.resources")}</Link>
                            </div>
                        </div>

                        <Link href="/publicaciones" className={`text-sm font-medium transition-colors ${pathname === '/publicaciones' ? 'text-primary dark:text-secondary' : 'text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white'}`}>{t("nav.news")}</Link>
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
                        <Link href="/portal" className={buttonVariants({ variant: "primary", size: "sm" })}>
                            <span className="material-icons-round text-lg">account_circle</span>
                            {t("nav.portal")}
                        </Link>
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
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-text-main dark:text-white/80 hover:text-primary font-medium px-2">{t("nav.home")}</Link>

                        {/* La Asociación */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.association" as any)}</span>
                            <Link href="/quienes-somos" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.about")}</Link>
                            <Link href="/socios" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.partners")}</Link>
                            <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.contact")}</Link>
                            <Link href="/docs/estatutos.pdf" target="_blank" download onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">Estatutos</Link>
                            <Link href="/docs/reglamento_interno.pdf" target="_blank" download onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">Reglamento Interno</Link>
                            <Link href="/organigrama" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">Organigrama Funcional</Link>
                        </div>

                        {/* Membresía */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.membership" as any)}</span>
                            {/* @ts-ignore */}
                            <Link href="/afiliacion" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.afiliacion" as any)}</Link>
                            {/* @ts-ignore */}
                            <Link href="/miembros" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.members" as any)}</Link>
                        </div>

                        {/* Desarrollo Profesional */}
                        <div className="flex flex-col space-y-3">
                            {/* @ts-ignore */}
                            <span className="text-xs font-bold text-primary dark:text-gold uppercase tracking-wider px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.development" as any)}</span>
                            <Link href="/formaciones" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.trainings")}</Link>
                            <Link href="/certificaciones" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("nav.certifications")}</Link>
                            <Link href="/recursos" onClick={() => setIsMenuOpen(false)} className="pl-4 text-sm font-medium text-text-muted dark:text-gray-400 hover:text-primary">{t("footer.resources")}</Link>
                        </div>

                        <Link href="/publicaciones" onClick={() => setIsMenuOpen(false)} className="text-text-main dark:text-white/80 hover:text-primary font-medium px-2 pt-2 border-t border-accent/10 dark:border-gray-800">{t("nav.news")}</Link>

                        <div className="pt-4 border-t border-accent/20 dark:border-gray-800">
                            <Link href="/portal" onClick={() => setIsMenuOpen(false)} className={buttonVariants({ variant: "primary", size: "default", fullWidth: true })}>
                                <span className="material-icons-round text-lg">account_circle</span>
                                {t("nav.portal")}
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};
