"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactoPage() {
    const { t, lang } = useLanguage();
    return (
        <div className="pt-20">
            <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-12">
                <div className="flex flex-col gap-4 max-w-3xl mb-12 text-center mx-auto">
                    <nav className="flex items-center justify-center gap-2 text-sm text-text-muted mb-4">
                        <Link className="hover:text-primary transition-colors" href="/">{lang === 'es' ? 'Inicio' : 'Início'}</Link>
                        <span className="material-icons-round text-[16px]">chevron_right</span>
                        <span className="font-medium text-primary">{t("contact.nav.contact")}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-black font-display text-secondary">
                        {t("contact.title")}
                    </h1>
                    <p className="text-lg text-text-muted">
                        {t("contact.desc")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-3xl border border-accent/50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                        <h2 className="text-2xl font-bold font-display text-secondary mb-6 relative z-10">{t("contact.form.title")}</h2>
                        <form className="flex flex-col gap-6 relative z-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-text-main" htmlFor="name">{t("contact.form.name")}</label>
                                <input id="name" type="text" className="w-full rounded-xl border border-accent/50 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main" placeholder={lang === 'es' ? "Ej. Dra. María Pérez" : "Ex. Dra. Maria Perez"} required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-text-main" htmlFor="email">{t("contact.form.email")}</label>
                                <input id="email" type="email" className="w-full rounded-xl border border-accent/50 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main" placeholder="maria.perez@email.com" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-text-main" htmlFor="subject">{t("contact.form.subject")}</label>
                                <select id="subject" className="w-full rounded-xl border border-accent/50 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main">
                                    <option>{lang === 'es' ? 'Dudas sobre Membresía' : 'Dúvidas sobre Associação'}</option>
                                    <option>{lang === 'es' ? 'Soporte Técnico (Plataforma)' : 'Suporte Técnico (Plataforma)'}</option>
                                    <option>{lang === 'es' ? 'Información de Eventos' : 'Informações sobre Eventos'}</option>
                                    <option>{lang === 'es' ? 'Otro' : 'Outro'}</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-text-main" htmlFor="message">{t("contact.form.message")}</label>
                                <textarea id="message" rows={4} className="w-full rounded-xl border border-accent/50 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main resize-none" placeholder={lang === 'es' ? "¿En qué podemos ayudarte?" : "Em que podemos ajudar?"} required></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-sm mt-2">
                                {t("contact.form.submit")}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information & Map Area */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold font-display text-secondary">{t("contact.info.title")}</h2>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent/30 text-primary rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-icons-round">email</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main">{t("contact.info.support")}</h4>
                                    <p className="text-text-muted text-sm">info@aibapt.org</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent/30 text-primary rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-icons-round">account_balance</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main">{t("contact.info.admin")}</h4>
                                    <p className="text-text-muted text-sm">admin@aibapt.org</p>
                                    <p className="text-text-muted text-xs italic mt-1">{lang === 'es' ? 'Contacto directo: Daniel Oliveira / Erika' : 'Contato direto: Daniel Oliveira / Erika'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent/30 text-primary rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-icons-round">place</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main">{t("contact.info.hq")}</h4>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        Madrid, España.<br />
                                        <span className="text-xs italic">{lang === 'es' ? 'Atención principal en horario CET (Central European Time).' : 'Atendimento principal no horário CET (Central European Time).'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Decorative Map placeholder */}
                        <div className="w-full h-48 bg-accent/20 rounded-3xl border border-accent/50 relative overflow-hidden flex items-center justify-center group">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                            <div className="text-center relative z-10 flex flex-col items-center gap-2">
                                <span className="material-icons-round text-primary/50 text-4xl group-hover:scale-110 transition-transform">public</span>
                                <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">AIBAPT Global</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
