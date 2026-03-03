"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { LangKeys } from "@/i18n/translations";

// Simulamos una base de datos local para los slugs (Idéntica a la página de detalle)
const getCourseData = (slug: string) => {
    const courses = [
        {
            slug: "trauma-webinar-19",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwjFC5Lqrsmp9SkpZJBTVG_JbbrRAFgQ_3cZOFvZTEwTITGSrOiSNtbsvdTaDjq-mPDFM-0iiybDqdMIK2kUl_PHBeQ4k8JvOrv0miSzm5I5wRXjAPZ_UNmlI8Aric3V1sGRGnXPQdumg4ORULY_Ql3BDDqG03F_KQBtqbCbe93GCUcRZ-5Kd6hSenP-XA6nm7Zsv8QiRSDaPl7jNcEa-TNRBwnxFjRVyLPztesJWPiZT3vkgCQuTqyppKaciBZQC_7wSnF3bUvf7c",
            title: "Trauma Webinar #19 | Mirando a través de la Voracidad",
            category: "Trauma Complejo",
            price: 10,
            currency: "€"
        },
        {
            slug: "trauma-webinar-18",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOSz3yrAAVIFvEvTU7HtDm-FplkXoOHo6U7hnzW70qijyhQOVMhxr4DkaC5BFJ0zbjHEuVRIIsKrhoS4MxAvCbPenlwVR96Qu5nXwrYvBit6wmwpWQXwR6aaOKJU4ZViiVrWbrvYXAFDQATSgDx7HcJ5aAOmFrjClLM0DdsjJXxEUbScIJTtxs_KykLaRIeUi6NNud7w8Pgnq7frwEhmhXNprL0OQ8NRQGBA3Yv-wUt4ZL8Dr6LJgstZI_nY3fHXYmZ-6qLOy32Z9c",
            title: "Trauma Webinar #18 | Guion de vida y Trauma Psicológico",
            category: "Trauma Complejo",
            price: 10,
            currency: "€"
        },
        {
            slug: "trauma-webinar-17",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg0CvRIYkg4wPoJolTJNC_Zr1bxk5BqCd5apRpWa9kG7s7SwxjPrL1-hBhzsdjlVhh66bZCjKoNMfKJtrZIqHod5P0f7aHH276s7_hU6gwn-WjS-absUJn2eZVKpMXblST-Uspy2TOfal2AGJNJMKBDRAEYgQqGNKf5NHrdH-sCyoIwhNNGVSQkzJSIED35BFfFIOqmVI0O-AkdDJDbfo2HE_wUdB4VjvFQlwN7r5PEf6IzgCsYH0N0tg67N4Bpqu4u-YEDGf05xER",
            title: "Trauma Webinar #17 | IA para Psicoterapeutas EMDR",
            category: "Psicoterapia EMDR",
            price: 10,
            currency: "€"
        },
        {
            slug: "trauma-webinar-16",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFqVfbqfrxeVaN8arWBYhx92ysovO8ycmOEMqgLHphoqoaZX3YVyN8Iyj1ZQ68Js91JmFxn-SzqGm6Rizp9aLbIrzR_Qi5W95BJ_vTTQBs8fcqQjU5swef1wmJ9_TY_AIsTRbvo5Y2GXI34vl-Nnh0x8rhtUbHnq8MBPuEveAXUUT5D3-7wVp3aE8DmmWg5nX_-jyruUVicPwaf3E7d0JFEJ0gyvmwIL4nwtP9jxWcTEALOBbLPrq36rOShJ373bn90i1QkQ_djCIv",
            title: "Trauma Webinar #16 | El abuso sexual infantil",
            category: "Trauma Infantil",
            price: 10,
            currency: "€"
        }
    ];

    return courses.find((c) => c.slug === slug) || null;
};

export default function CheckoutPage() {
    const params = useParams();
    const { t } = useLanguage();
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
    const slug = typeof params?.slug === 'string' ? params.slug : "not-found";

    // Validamos que el curso exista en el array de compras de arriba (Solo VOD)
    const course = getCourseData(slug);

    if (!course) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-cream dark:bg-bg-dark">
                <div className="text-center p-10 bg-white dark:bg-surface-dark rounded-3xl shadow-xl max-w-lg">
                    <span className="material-icons-round text-6xl text-primary mb-4">error_outline</span>
                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Producto No Encontrado</h2>
                    <p className="text-text-muted dark:text-gray-400 mb-6">No se puede procesar el checkout porque el curso no permite pagos directos (o no existe).</p>
                    <Link href="/formaciones" className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-[#689153] transition-colors">Volver al Catálogo</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-cream dark:bg-bg-dark font-sans relative">

            <main className="max-w-[1280px] mx-auto w-full px-4 sm:px-6">

                {/* Header Back Link */}
                <Link href={`/formaciones/${course.slug}`} className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 font-medium">
                    <span className="material-icons-round text-[18px]">keyboard_backspace</span>
                    {t("course.back" as LangKeys)}
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* LEFT COLUMN: Payment Information & Forms */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-text-main dark:text-white font-display mb-2">{t("checkout.title" as LangKeys)}</h1>
                            <p className="text-text-muted dark:text-gray-400">Complete the form below to process your acquisition securely.</p>
                        </div>

                        {/* Terms of Use Accordion / Alert block */}
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 md:p-6 flex gap-4 items-start shadow-sm">
                            <span className="material-icons-round text-amber-500 text-2xl mt-0.5">warning_amber</span>
                            <div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-1">{t("checkout.terms" as LangKeys)}</h3>
                                <p className="text-sm text-amber-700/80 dark:text-amber-200/70 leading-relaxed">{t("checkout.terms.desc" as LangKeys)}</p>
                            </div>
                        </div>

                        {/* Contact Information Form */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                    <span className="material-icons-round text-primary">person</span>
                                    {t("checkout.contact" as LangKeys)}
                                </h2>
                                <p className="text-sm text-text-muted dark:text-gray-400">
                                    {t("checkout.login" as LangKeys)}{" "}
                                    <a href="#" className="font-bold text-secondary dark:text-primary hover:underline">Log in</a></p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Nombre completo" className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    <input type="text" placeholder="Teléfono (Opcional)" className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <input type="email" placeholder="Correo electrónico" className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </motion.section>

                        {/* Payment Information Form */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                    <span className="material-icons-round text-primary">credit_card</span>
                                    {t("checkout.payment" as LangKeys)}
                                </h2>
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={60} height={16} className="opacity-70 dark:brightness-200 dark:grayscale" />
                            </div>

                            <div className="space-y-4">
                                {/* Simulated VAT / Address fields based on the old app reqs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="País / Región" className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    <div className="relative">
                                        <input type="text" placeholder="Código Postal" className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="text-sm font-medium text-primary hover:text-[#689153] transition-colors">
                                        {t("checkout.vat" as LangKeys)}
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <aside className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl sticky top-28">

                            {/* Summary Header */}
                            <div className="bg-gray-50 dark:bg-surface-light px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-text-main dark:text-white text-lg">{t("checkout.summary" as LangKeys)}</h3>
                            </div>

                            {/* Course Data injected here */}
                            <div className="p-6">
                                <div className="flex gap-4 items-start mb-6">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <Image src={course.img} alt="Product Thumbnail" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-between h-full py-1">
                                        <h4 className="font-bold text-text-main dark:text-white text-sm leading-tight line-clamp-2">{course.title}</h4>
                                        <p className="text-secondary dark:text-primary font-bold">{course.price} {course.currency}</p>
                                    </div>
                                </div>

                                {/* Coupon Code */}
                                <div className="border-t border-b border-gray-100 dark:border-gray-800 py-6 my-6">
                                    <p className="text-xs font-bold uppercase text-text-muted dark:text-gray-400 mb-2 tracking-wide">{t("checkout.coupon" as LangKeys)}</p>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Ej: AIBAPT2026" className="w-full flex-1 bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-text-main dark:text-white focus:outline-none focus:border-primary uppercase" />
                                        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-main dark:text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">{t("checkout.coupon.apply" as LangKeys)}</button>
                                    </div>
                                </div>

                                {/* Totals calculation */}
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between items-center text-sm text-text-muted dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-text-main dark:text-white">{course.price} {course.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-text-muted dark:text-gray-400">
                                        <span>VAT (Tax)</span>
                                        <span className="font-medium text-text-main dark:text-white">Calculando...</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <span className="font-bold text-text-main dark:text-white text-lg">{t("checkout.total" as LangKeys)}</span>
                                        <span className="font-black text-primary text-2xl">{course.price} {course.currency}</span>
                                    </div>
                                </div>

                                {/* Payment Method Selector */}
                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPaymentMethod("card")}
                                            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${paymentMethod === "card"
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-light text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            <span className="material-icons-round text-[18px]">credit_card</span>
                                            {t("checkout.method.card" as LangKeys)}
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("paypal")}
                                            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${paymentMethod === "paypal"
                                                ? "border-[#0070ba] bg-[#0070ba]/10 text-[#0070ba]"
                                                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-light text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={60} height={16} className={`opacity-70 ${paymentMethod === 'paypal' ? 'opacity-100' : 'dark:brightness-200 dark:grayscale'}`} />
                                        </button>
                                    </div>

                                    {/* Credit Card Form Fields */}
                                    {paymentMethod === "card" && (
                                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <input type="text" placeholder={t("checkout.card.name" as LangKeys)} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                            <div className="relative">
                                                <input type="text" placeholder={t("checkout.card.number" as LangKeys)} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pl-11 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                <span className="material-icons-round absolute left-3 top-3.5 text-gray-400 text-[18px]">payment</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="text" placeholder={t("checkout.card.exp" as LangKeys)} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                <input type="text" placeholder={t("checkout.card.cvc" as LangKeys)} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic CTA */}
                                <button className={`w-full text-white font-bold flex items-center justify-center gap-3 py-4 rounded-xl shadow-lg transition-colors group ${paymentMethod === 'paypal' ? 'bg-[#0070ba] hover:bg-[#003087]' : 'bg-primary hover:bg-[#689153]'
                                    }`}>
                                    <span className="material-icons-round text-white/70 group-hover:text-white transition-colors">lock</span>
                                    {paymentMethod === 'paypal' ? t("checkout.btn.pay" as LangKeys) : t("checkout.btn.pay_card" as LangKeys)}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-green-600 text-[16px]">verified_user</span>
                                    <span className="text-xs text-text-muted dark:text-gray-400 font-medium text-center">
                                        Pago 100% procesado y asegurado vía {paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
