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
    const { t } = useLanguage();
    const course = getCourseData(slug);

    if (!course) {
        return notFound();
    }

    return (
        <div className="pt-20 bg-white dark:bg-bg-dark min-h-screen font-sans text-text-main dark:text-white">
            {/* HERO BANNER - CORPORATE STYLE */}
            <div className="relative w-full overflow-hidden border-b border-gray-100 dark:border-gray-800 bg-[#2c4c28] py-12 md:py-16">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2c4c28] via-[#3d6339] to-[#5a9954]"></div>
                    {/* Pattern Overlay with more elegance */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-20">
                        <div className="max-w-3xl space-y-6 md:space-y-8">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.25em] uppercase backdrop-blur-xl">
                                    {course.badge}
                                </span>
                                <span className="bg-[#94d98d]/20 border border-[#94d98d]/30 text-[#b4f0ae] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-xl">
                                    {course.category}
                                </span>
                            </div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-xl"
                            >
                                {course.title}
                            </motion.h1>

                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-[#e2725b] text-xl">person</span>
                                <span className="text-[#e2725b] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                                    {course.instructorName}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <div className="flex items-center gap-2.5 font-bold text-[11px] tracking-widest bg-white/5 py-2.5 px-5 rounded-xl border border-white/10 text-white/90 backdrop-blur-md">
                                    <span className="material-icons-round text-[#94d98d] text-[18px]">schedule</span>
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2.5 font-bold text-[11px] tracking-widest bg-white/5 py-2.5 px-5 rounded-xl border border-white/10 text-white/90 backdrop-blur-md">
                                    <span className="material-icons-round text-[#94d98d] text-[18px]">verified</span>
                                    <span>CREDITOS AIBAPT</span>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP PRICES - SLIGHTLY MORE COMPACT CARD */}
                        <div className="hidden lg:block shrink-0">
                            <div className="bg-white dark:bg-surface-dark p-8 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 w-[380px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase mb-1.5">INVERSIÓN TOTAL</p>
                                            <p className="text-5xl font-black text-primary dark:text-white leading-none tracking-tighter italic">
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
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/20 hover:-translate-y-1 active:scale-95 text-[11px] uppercase tracking-[0.2em]"
                                        >
                                            <span className="material-icons-round">shopping_cart</span>
                                            ADQUIRIR GRABACIÓN
                                        </Link>

                                        {/* Garantía de Seguridad */}
                                        <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                                            <p className="text-[10px] font-black text-gray-400 mb-4 tracking-[0.2em] uppercase">PAGO 100% SEGURO</p>
                                            <div className="flex items-center justify-center gap-10 py-5 px-8 bg-gray-50 dark:bg-bg-dark rounded-3xl opacity-70">
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
            <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-20 bg-white dark:bg-bg-dark">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                    
                    <div className="lg:col-span-2 space-y-16">
                        {/* Summary */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-gray-50 dark:bg-surface-dark p-10 md:p-14 rounded-[48px] border border-gray-100 dark:border-gray-800 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px]"></div>
                            <h2 className="text-3xl font-black text-primary dark:text-white mb-8 flex items-center gap-4">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                DETALLES DE LA GRABACIÓN
                            </h2>
                            <p className="text-xl text-text-muted dark:text-gray-300 leading-[1.8] font-medium max-w-4xl">
                                {course.descLong}
                            </p>
                        </motion.section>

                        {/* Instructor */}
                        <section className="space-y-10">
                            <h2 className="text-3xl font-black text-primary dark:text-white px-8">
                                DOCENTE TITULAR
                            </h2>
                            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-12 rounded-[48px] shadow-sm flex flex-col md:flex-row gap-12 items-center md:items-start">
                                <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[40px] overflow-hidden relative shadow-2xl rotate-3">
                                    <Image fill alt={course.instructorName} src={course.instructorImg} className="object-cover" />
                                </div>
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <h3 className="text-4xl font-black text-primary dark:text-white tracking-tight">{course.instructorName}</h3>
                                    <div className="w-16 h-1 bg-primary rounded-full mx-auto md:mx-0"></div>
                                    <p className="text-xl text-text-muted dark:text-gray-400 leading-relaxed italic font-medium">
                                        \"{course.instructorBio}\"
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR */}
                    <aside className="sticky top-32 space-y-8">
                        <div className="bg-primary/95 dark:bg-surface-dark rounded-[48px] p-10 text-white shadow-[0_32px_96px_-24px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/5 group">
                            {/* Gradient Play: Official AIBAPT Green to Terracota Accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#b04e22]/30 opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#b04e22]/20 rounded-full blur-[80px]"></div>
                            
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-white italic tracking-tighter">
                                    <span className="material-icons-round text-[#e2725b] text-3xl animate-pulse">auto_awesome</span>
                                    BENEFICIOS
                                </h3>
                                <ul className="space-y-6">
                                    {course.includes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 group/item">
                                            <div className="mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#e2725b] to-[#b04e22] text-white flex items-center justify-center shrink-0 group-hover/item:scale-125 transition-transform shadow-[0_0_20px_rgba(176,78,34,0.4)]">
                                                <span className="material-icons-round text-[18px]">done_all</span>
                                            </div>
                                            <span className="text-white font-bold text-[15px] leading-tight drop-shadow-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        {/* Mobile Buy Button - Quick Payment Info */}
                        <div className="md:hidden bg-primary p-10 rounded-[48px] shadow-2xl border border-white/5 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-tr from-[#b04e22]/20 to-transparent"></div>
                             <div className="relative z-10">
                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase mb-1">INVERSIÓN TOTAL</p>
                                    <p className="text-5xl font-black text-white leading-none tracking-tighter italic">
                                        {course.price}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <Link
                                        href={`/formaciones/${slug}/checkout`}
                                        className="w-full bg-white text-primary font-black py-6 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-xl"
                                    >
                                        <span className="material-icons-round">shopping_cart</span>
                                        ADQUIRIR GRABACIÓN
                                    </Link>
                                </div>
                                <p className="text-[9px] font-black text-center text-white/40 mt-6 tracking-[.3em] uppercase">Proceso de Pago Seguro</p>
                            </div>
                        </div>

                        {/* Trust */}
                        <div className="p-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[48px] flex flex-col items-center gap-6 text-center">
                            <Image src="/images/logo_aibapt.png" alt="AIBAPT Logo" width={60} height={60} className="opacity-20 grayscale" />
                            <p className="text-[11px] font-black text-gray-400 tracking-[0.2em] leading-relaxed uppercase px-4">
                                CALIDAD EDUCATIVA RESPALDADA POR EL COMITÉ CIENTIFICO DE AIBAPT INTERNACIONAL
                            </p>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
