"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function PublicacionesContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const activeCat = searchParams.get("cat");

    // Map categories to translations
    const categoryLabels: Record<string, string> = {
        articulos: t("news.cat.clinical"),
        entrevistas: t("news.cat.interviews"),
        prensa: t("news.cat.prensa"),
        libros: t("news.cat.libros"),
    };

    const isPlaceholderCat = ["entrevistas", "prensa", "libros"].includes(activeCat || "");

    return (
        <div className="pt-20 bg-cream/30 dark:bg-bg-dark min-h-screen">
            <main className="flex-grow flex justify-center py-8 lg:py-12 px-4 md:px-6">
                <div className="layout-content-container max-w-[1280px] w-full flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                            <nav className="flex items-center gap-2 text-sm text-text-muted mb-2">
                                <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                                <span className="material-icons-round text-sm">chevron_right</span>
                                <Link href="/publicaciones" className="hover:text-primary transition-colors">Publicaciones</Link>
                                {activeCat && (
                                    <>
                                        <span className="material-icons-round text-sm">chevron_right</span>
                                        <span className="text-primary font-bold">{categoryLabels[activeCat] || activeCat}</span>
                                    </>
                                )}
                            </nav>
                            <h1 className="text-secondary dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] font-display">
                                {activeCat ? categoryLabels[activeCat] : t("news.title")}
                            </h1>
                            <p className="text-text-muted dark:text-gray-400 text-lg font-normal leading-normal">
                                {activeCat ? `Explora nuestra selección de ${categoryLabels[activeCat]?.toLowerCase()}.` : t("news.desc")}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCat || "all"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isPlaceholderCat ? (
                                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-3xl text-center shadow-sm">
                                        <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6">
                                            <span className="material-icons-round text-5xl">
                                                {activeCat === 'entrevistas' ? 'mic' : activeCat === 'prensa' ? 'newspaper' : 'auto_stories'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-secondary dark:text-white mb-2">Sección en Construcción</h3>
                                        <p className="text-text-muted dark:text-gray-400 max-w-md mx-auto mb-8">
                                            Estamos preparando contenido exclusivo de {categoryLabels[activeCat || ""]?.toLowerCase()} para nuestra comunidad. ¡Pronto estará disponible!
                                        </p>
                                        <Link href="/publicaciones" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
                                            Ver Artículos Recientes
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-10">
                                        {(!activeCat || activeCat === 'articulos') && (
                                            <article className="group relative flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-surface-dark shadow-sm hover:shadow-md transition-all duration-300 border border-accent/20 dark:border-gray-800">
                                                <div className="w-full h-[320px] md:h-[400px] bg-accent/20 relative overflow-hidden">
                                                    <Image
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJB7Qtss89nzKTtfgULY4AdGbEEJc3Hjfm6xvxJMZzD542VCuXFdYrOMavUaAJxZyUPNck-0tScKwpd2TaVf4rJY3ovURMuePJIcNYxidlen-WI_DTZDOkFI25f8v4yFa21ySdKjIh9mB5kBZMVJ7J-xJIVaZIG3hSfB8mFNk5g-g94mKZErkwtnimUuy9NuYLpmchXy-94mtcFcVHHooqMPMKA2AFFMJw82cxCjFnxpl3d-l1k_YnlNtHdmtptWBa2vFV8J_HYMk-"
                                                        alt="A peaceful forest path"
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                                                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-full">
                                                            {t("news.destacado")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 md:p-10 flex flex-col gap-4">
                                                    <h2 className="text-secondary dark:text-white text-2xl md:text-3xl font-bold leading-tight font-display group-hover:text-primary transition-colors">
                                                        {t("news.post1.title")}
                                                    </h2>
                                                    <p className="text-text-muted dark:text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
                                                        {t("news.post1.desc")}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-primary font-bold mt-2 cursor-pointer group/link w-fit">
                                                        <span>{t("news.read_more")}</span>
                                                        <span className="material-icons-round text-sm transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                                                    </div>
                                                </div>
                                            </article>
                                        )}
                                        <div className="h-px w-full bg-accent/30 dark:bg-gray-800 my-2"></div>
                                        <div className="flex flex-col gap-8">
                                            <h3 className="text-secondary dark:text-white text-2xl font-bold font-display">{t("news.recientes")}</h3>
                                            <article className="flex flex-col md:flex-row gap-6 group cursor-pointer">
                                                <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-accent/20 relative">
                                                    <Image
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSW406h2kQBlaDu7oYu6nDLew2_r7oBO_FmPe7fQ2xrdRlXaJPG46TJSwLGoBY8Qf6M9NRhLr0VZ4DbozhF-fHQNAjcPntoJFZiSC1FagUtRLwTTZgHgqQdSkNn1w-7w45WcDd-ZZrhfhCbdYGdQEsjyHRUN1zQoqdFw2s8aJdd8hh146-pIZ-bOhZIbp9gj7nrMsDdijLBh6PfE-IynuweF5TBwAvE0XFfCNEU5JdYXA8Tgc6KM1urBK8U5V3Bx02D1L_ASlwJ_k6"
                                                        alt="Imagen de artículo"
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center gap-2">
                                                    <div className="flex items-center gap-3 text-xs font-medium text-text-muted mb-1">
                                                        <span className="text-primary uppercase tracking-wider font-bold">{t("news.cat.clinical")}</span>
                                                        <span>•</span>
                                                        <span>15 Oct, 2024</span>
                                                    </div>
                                                    <h4 className="text-xl font-bold font-display text-text-main dark:text-white leading-tight group-hover:text-primary transition-colors">
                                                        {t("news.post2.title")}
                                                    </h4>
                                                    <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                        {t("news.post2.desc")}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-primary text-sm font-bold mt-2 hover:underline decoration-2 underline-offset-4 decoration-primary/30">
                                                        <span>{t("news.read_more")}</span>
                                                        <span className="material-icons-round text-[16px]">arrow_outward</span>
                                                    </div>
                                                </div>
                                            </article>
                                            <div className="h-px w-full bg-accent/30 dark:bg-gray-800"></div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <aside className="w-full lg:w-[360px] flex flex-col gap-8 shrink-0">
                        <div className="bg-accent/30 dark:bg-surface-dark/50 p-8 rounded-3xl relative overflow-hidden border border-accent/50 dark:border-gray-800">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-surface-light flex items-center justify-center text-primary shadow-sm mb-2">
                                    <span className="material-icons-round text-2xl">mail</span>
                                </div>
                                <h3 className="text-xl font-bold font-display text-secondary dark:text-white">{t("news.newsletter.title")}</h3>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-2">{t("news.newsletter.desc")}</p>
                                <form className="flex flex-col gap-3">
                                    <input className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-main dark:text-white placeholder:text-text-muted/60" placeholder={t("news.newsletter.placeholder")} type="email" />
                                    <button className="w-full rounded-xl bg-primary hover:bg-[#689153] text-white font-bold py-3 text-sm transition-all shadow-md shadow-primary/20" type="submit">
                                        {t("news.newsletter.btn")}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold font-display text-secondary dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                Categorías
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/publicaciones" className={`px-4 py-2 rounded-xl text-sm transition-colors shadow-sm border ${!activeCat ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-surface-dark border-accent/50 dark:border-gray-800 text-text-muted hover:border-primary hover:text-primary'}`}>
                                    Ver Todo
                                </Link>
                                <Link href="/publicaciones?cat=articulos" className={`px-4 py-2 rounded-xl text-sm transition-colors shadow-sm border ${activeCat === 'articulos' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-surface-dark border-accent/50 dark:border-gray-800 text-text-muted hover:border-primary hover:text-primary'}`}>
                                    {t("news.cat.clinical")}
                                </Link>
                                <Link href="/publicaciones?cat=entrevistas" className={`px-4 py-2 rounded-xl text-sm transition-colors shadow-sm border ${activeCat === 'entrevistas' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-surface-dark border-accent/50 dark:border-gray-800 text-text-muted hover:border-primary hover:text-primary'}`}>
                                    {t("news.cat.interviews")}
                                </Link>
                                <Link href="/publicaciones?cat=prensa" className={`px-4 py-2 rounded-xl text-sm transition-colors shadow-sm border ${activeCat === 'prensa' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-surface-dark border-accent/50 dark:border-gray-800 text-text-muted hover:border-primary hover:text-primary'}`}>
                                    {t("news.cat.prensa")}
                                </Link>
                                <Link href="/publicaciones?cat=libros" className={`px-4 py-2 rounded-xl text-sm transition-colors shadow-sm border ${activeCat === 'libros' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-surface-dark border-accent/50 dark:border-gray-800 text-text-muted hover:border-primary hover:text-primary'}`}>
                                    {t("news.cat.libros")}
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-4">
                            <h3 className="text-lg font-bold font-display text-secondary dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                {t("news.sidebar.follow")}
                            </h3>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-accent/50 dark:border-gray-800">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-accent/50 dark:border-gray-800">
                                    <span className="material-icons-round text-lg">podcasts</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default function NoticiasPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream dark:bg-bg-dark flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <PublicacionesContent />
        </Suspense>
    );
}

