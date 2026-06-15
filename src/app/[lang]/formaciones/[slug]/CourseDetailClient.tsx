"use client";

import Image from "next/image";
import Link from "next/link";
import { VisaIcon, MastercardIcon, PayPalLogo } from "@/components/ui/PaymentLogos";
import { notFound } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { WEBINARS_DATA } from "@/data/webinars";

// Simulamos una base de datos local para los slugs
const getCourseData = (slug: string) => {
    return WEBINARS_DATA.find((w) => w.slug === slug) || null;
};

export default function CourseDetailClient({ slug }: { slug: string }) {
    const { t, lang } = useLanguage();
    const course = getCourseData(slug);

    if (!course) {
        return notFound();
    }

    return (
        <div className="pt-20 bg-background-light dark:bg-bg-dark min-h-screen font-sans text-text-main dark:text-white">
            {/* HERO BANNER - PREMIUM STYLE */}
            <div className="relative w-full overflow-hidden border-b border-gray-100 dark:border-gray-800 bg-background-light py-12 md:py-16">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                    {/* Pattern Overlay with more elegance */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2E6534 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-20">
                        <div className="max-w-3xl space-y-6 md:space-y-8">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase backdrop-blur-xl border border-primary/20">
                                    {course.badge === "VOD / Grabación" ? (lang === "pt" ? "VOD / Gravação" : "VOD / Grabación") : course.badge}
                                </span>
                                <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase backdrop-blur-xl border border-secondary/20">
                                    {course.category === "Seminarios Internacionales" ? (lang === "pt" ? "Seminários Internacionais" : "Seminarios Internacionales") : course.category}
                                </span>
                            </div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-text-light dark:text-white leading-[1.1] tracking-tight drop-shadow-sm"
                            >
                                {course.title}
                            </motion.h1>

                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-accent text-xl">person</span>
                                <span className="text-accent font-bold uppercase tracking-widest text-[11px] md:text-xs">
                                    {course.instructorName}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <div className="flex items-center gap-2.5 font-bold text-[11px] tracking-widest bg-white/60 dark:bg-white/5 py-2.5 px-5 rounded-full border border-white/60 dark:border-white/10 text-text-main dark:text-white/90 backdrop-blur-md shadow-sm">
                                    <span className="material-icons-round text-primary text-[18px]">schedule</span>
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2.5 font-bold text-[11px] tracking-widest bg-white/60 dark:bg-white/5 py-2.5 px-5 rounded-full border border-white/60 dark:border-white/10 text-text-main dark:text-white/90 backdrop-blur-md shadow-sm">
                                    <span className="material-icons-round text-primary text-[18px]">verified</span>
                                    <span>Créditos AIBAPT</span>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP PRICES - SLIGHTLY MORE COMPACT CARD */}
                        <div className="hidden lg:block shrink-0">
                            <div className="bg-white/80 backdrop-blur-md dark:bg-surface-dark p-8 rounded-[40px] shadow-xl border border-white/60 dark:border-gray-800 w-[380px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <p className="text-[11px] font-bold text-text-muted tracking-widest uppercase mb-1.5">
                                                {lang === "pt" ? "Investimento total" : "Inversión total"}
                                            </p>
                                            <p className="text-5xl font-extrabold text-primary dark:text-white leading-none tracking-tight">
                                                {course.price}
                                            </p>
                                        </div>
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <span className="material-icons-round text-primary text-3xl">shopping_bag</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Link
                                            href={`/formaciones/${slug}/checkout`}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 transition-all shadow-md shadow-primary/20 hover:-translate-y-1 text-sm tracking-wide group/btn"
                                        >
                                            <span>{lang === "pt" ? "Adquirir gravação" : "Adquirir grabación"}</span>
                                            <span className="material-icons-round text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                        </Link>

                                        {/* Garantía de Seguridad */}
                                        <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                                            <p className="text-[10px] font-bold text-text-muted mb-4 tracking-widest uppercase">
                                                {lang === "pt" ? "Pagamento 100% seguro" : "Pago 100% seguro"}
                                            </p>
                                            <div className="flex items-center justify-center gap-10 py-5 px-8 bg-background-light dark:bg-bg-dark rounded-3xl opacity-80">
                                                <PayPalLogo className="" />
                                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                                                <VisaIcon className="" />
                                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                                                <MastercardIcon className="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-20 bg-transparent">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                    
                    <div className="lg:col-span-2 space-y-16">
                        {/* Summary */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-white/80 backdrop-blur-md dark:bg-surface-dark p-10 md:p-14 rounded-[40px] border border-white/60 dark:border-gray-800 relative group overflow-hidden shadow-sm"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px]"></div>
                            <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-8 flex items-center gap-4">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                {lang === "pt" ? "Detalhes da gravação" : "Detalles de la grabación"}
                            </h2>
                            <p className="text-lg text-text-muted dark:text-gray-300 leading-[1.8] font-medium max-w-4xl">
                                {course.descLong}
                            </p>
                        </motion.section>

                        {/* Instructor */}
                        <section className="space-y-10">
                            <h2 className="text-3xl font-extrabold text-primary dark:text-white px-8">
                                Docente titular
                            </h2>
                            <div className="bg-white/80 backdrop-blur-md dark:bg-surface-dark border border-white/60 dark:border-gray-800 p-12 rounded-[40px] shadow-sm flex flex-col md:flex-row gap-12 items-center md:items-start">
                                <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[32px] overflow-hidden relative shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <Image fill alt={course.instructorName} src={course.instructorImg} className="object-cover" />
                                </div>
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <h3 className="text-4xl font-extrabold text-primary dark:text-white tracking-tight">{course.instructorName}</h3>
                                    <div className="w-16 h-1 bg-primary rounded-full mx-auto md:mx-0"></div>
                                    <p className="text-lg text-text-muted dark:text-gray-400 leading-relaxed italic font-medium">
                                        "{course.instructorBio}"
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR */}
                    <aside className="sticky top-32 space-y-8">
                        <div className="bg-primary/95 dark:bg-surface-dark rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden border border-white/10 group">
                            {/* Gradient Play: Official AIBAPT Green to Terracota Accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-accent/30 opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"></div>
                            
                            <div className="relative z-10">
                                <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-white tracking-tight">
                                    <span className="material-icons-round text-accent text-3xl animate-pulse">auto_awesome</span>
                                    {lang === "pt" ? "Benefícios" : "Beneficios"}
                                </h3>
                                <ul className="space-y-6">
                                    {course.includes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 group/item">
                                            <div className="mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-accent to-secondary text-white flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                                                <span className="material-icons-round text-[16px]">done</span>
                                            </div>
                                            <span className="text-white font-medium text-[15px] leading-relaxed drop-shadow-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        {/* Mobile Buy Button - Quick Payment Info */}
                        <div className="md:hidden bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-sm border border-white/60 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent"></div>
                             <div className="relative z-10">
                                <div className="mb-6">
                                    <p className="text-[11px] font-bold text-text-muted tracking-widest uppercase mb-1">
                                        {lang === "pt" ? "Investimento total" : "Inversión total"}
                                    </p>
                                    <p className="text-4xl font-extrabold text-primary leading-none tracking-tight">
                                        {course.price}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <Link
                                        href={`/formaciones/${slug}/checkout`}
                                        className="w-full bg-primary text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 text-sm tracking-wide shadow-md hover:bg-primary/90 transition-colors"
                                    >
                                        <span>{lang === "pt" ? "Adquirir gravação" : "Adquirir grabación"}</span>
                                        <span className="material-icons-round text-[18px]">arrow_forward</span>
                                    </Link>
                                </div>
                                <p className="text-[10px] font-bold text-center text-text-muted mt-6 tracking-widest uppercase">
                                    {lang === "pt" ? "Processo de pagamento seguro" : "Proceso de pago seguro"}
                                </p>
                            </div>
                        </div>

                        {/* Trust */}
                        <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[40px] flex flex-col items-center gap-6 text-center">
                            <Image src="/images/logo_aibapt.png" alt="AIBAPT Logo" width={60} height={60} className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                            <p className="text-[10px] font-bold text-text-muted tracking-widest leading-relaxed uppercase px-2">
                                {lang === "pt" 
                                    ? "Qualidade educativa respaldada pelo comitê científico da AIBAPT Internacional" 
                                    : "Calidad educativa respaldada por el comité científico de AIBAPT Internacional"}
                            </p>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
