"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PortalPage() {
    const { t, lang } = useLanguage();
    const [loginRole, setLoginRole] = useState<"socio" | "no-socio" | null>(null);

    return (
        <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Organic Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <main className="w-full max-w-[1024px] bg-white dark:bg-surface-dark rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-accent/20 dark:border-gray-800">

                {/* Visual / Branding Side */}
                <div className="w-full md:w-5/12 bg-primary p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
                            <div className="w-10 h-10 bg-white rounded-tr-xl rounded-bl-xl flex items-center justify-center text-primary shadow-sm">
                                <span className="material-icons-round text-2xl">spa</span>
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">AIBAPT</span>
                        </Link>

                        <h2 className="text-3xl font-display font-medium leading-tight mb-4">
                            {lang === 'es' ? 'Dando la bienvenida a tu espacio de' : 'Dando as boas-vindas ao seu espaço de'} <span className="font-black italic">{lang === 'es' ? 'crecimiento' : 'crescimento'}</span>.
                        </h2>
                        <p className="text-primary-content/80 text-sm leading-relaxed max-w-sm">
                            {lang === 'es' ? 'Accede a tus cursos automáticos, verifica tus certificaciones y gestiona tu membresía en un solo lugar.' : 'Acesse seus treinamentos, verifique suas certificações e gerencie sua assinatura em um só lugar.'}
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 bg-black/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <span className="material-icons-round text-3xl">shield_moon</span>
                            <div>
                                <h3 className="font-bold text-sm">{lang === 'es' ? 'Plataforma Segura' : 'Plataforma Segura'}</h3>
                                <p className="text-xs text-primary-content/70">{lang === 'es' ? 'Diseñada bajo la arquitectura Zero-Trust de AIBAPT.' : 'Projetada sob a arquitetura Zero-Trust da AIBAPT.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form Side */}
                <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-black font-display text-secondary dark:text-white mb-2">{t("portal.title")}</h1>
                            <p className="text-sm text-text-muted dark:text-white/60">{t("portal.desc")}</p>
                        </div>

                        {/* Interactive Role Selector (Demo Mode) */}
                        <div className="text-center mb-2">
                            <p className="text-xs font-bold text-primary">{t("portal.role.select")}</p>
                        </div>
                        <div className="mb-8 bg-accent/20 dark:bg-surface-light p-1.5 rounded-2xl flex relative">
                            <button
                                onClick={() => setLoginRole("socio")}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${loginRole === "socio" ? "bg-white dark:bg-primary shadow-sm text-primary dark:text-white" : "text-text-muted dark:text-white/60 hover:text-text-main"}`}
                            >
                                {t("portal.role.partner")}
                            </button>
                            <button
                                onClick={() => setLoginRole("no-socio")}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${loginRole === "no-socio" ? "bg-white dark:bg-primary shadow-sm text-secondary dark:text-white" : "text-text-muted dark:text-white/60 hover:text-text-main"}`}
                            >
                                {t("portal.role.guest")}
                            </button>
                        </div>

                        <form className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="email">{t("portal.fields.email")}</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">email</span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={loginRole === "socio" ? "dr.socio@aibapt.org" : loginRole === "no-socio" ? "invitado@mail.com" : ""}
                                        readOnly
                                        className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white transition-all"
                                        placeholder="Selecciona un rol arriba"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="password">{t("portal.fields.password")}</label>
                                    <Link href="#" className="text-xs font-bold text-primary hover:underline">{lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Esqueceu sua senha?'}</Link>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">lock</span>
                                    <input
                                        id="password"
                                        type="password"
                                        value={loginRole ? "**********" : ""}
                                        readOnly
                                        className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white transition-all"
                                        placeholder="*****************"
                                    />
                                </div>
                            </div>

                            <Link
                                href={loginRole ? `/dashboard?role=${loginRole}` : "#"}
                                className={`mt-4 py-3.5 w-full text-center font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${loginRole ? 'bg-primary text-white hover:bg-[#689153] hover:shadow-md' : 'bg-accent/50 text-text-muted cursor-not-allowed'}`}
                            >
                                {loginRole ? t("portal.btn.login.active") : t("portal.btn.login.select")}
                                {loginRole && <span className="material-icons-round text-[18px]">arrow_forward</span>}
                            </Link>
                        </form>

                        <div className="mt-8 text-center text-sm text-text-muted dark:text-white/60">
                            {lang === 'es' ? '¿Aún no eres miembro de AIBAPT? ' : 'Ainda não é membro da AIBAPT? '}
                            <Link href="#" className="font-bold text-secondary dark:text-primary hover:underline">
                                {lang === 'es' ? 'Inicia tu afiliación aquí' : 'Inicie sua afiliação aqui'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
