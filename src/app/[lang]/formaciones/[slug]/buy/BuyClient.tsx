"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { LangKeys } from "@/i18n/translations";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface BuyClientProps {
    slug: string;
    initialPrice: number;
    title: string;
    thumbnail: string;
    isFree: boolean;
}

export default function BuyClient({ slug, initialPrice, title, thumbnail, isFree }: BuyClientProps) {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("+34");
    const [countryIso, setCountryIso] = useState("es");
    const [phone, setPhone] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const countryCodes = [
        { code: "+34", iso: "es", name: "España" },
        { code: "+351", iso: "pt", name: "Portugal" },
        { code: "+52", iso: "mx", name: "México" },
        { code: "+1", iso: "us", name: "Estados Unidos" },
        { code: "+57", iso: "co", name: "Colombia" },
        { code: "+54", iso: "ar", name: "Argentina" },
        { code: "+56", iso: "cl", name: "Chile" },
        { code: "+51", iso: "pe", name: "Perú" },
        { code: "+593", iso: "ec", name: "Ecuador" },
        { code: "+58", iso: "ve", name: "Venezuela" },
        { code: "+55", iso: "br", name: "Brasil" },
        { code: "+598", iso: "uy", name: "Uruguay" },
        { code: "+595", iso: "py", name: "Paraguay" },
        { code: "+591", iso: "bo", name: "Bolivia" },
        { code: "+506", iso: "cr", name: "Costa Rica" },
        { code: "+507", iso: "pa", name: "Panamá" },
        { code: "+1", iso: "do", name: "República Dominicana" },
        { code: "+502", iso: "gt", name: "Guatemala" },
        { code: "+504", iso: "hn", name: "Honduras" },
        { code: "+503", iso: "sv", name: "El Salvador" },
        { code: "+505", iso: "ni", name: "Nicaragua" },
        { code: "+53", iso: "cu", name: "Cuba" },
        { code: "+1", iso: "ca", name: "Canadá" },
        { code: "+44", iso: "gb", name: "Reino Unido" },
        { code: "+33", iso: "fr", name: "Francia" },
        { code: "+49", iso: "de", name: "Alemania" },
        { code: "+39", iso: "it", name: "Italia" },
    ];

    const isFormValid = name.trim().length > 0 && email.trim().length > 0 && email.includes("@");

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "EUR",
        intent: "capture",
        locale: lang === "pt" ? "pt_PT" : "es_ES",
    };

    const handleFreeRegistration = async () => {
        setIsProcessing(true);
        setErrorMessage("");
        try {
            const res = await fetch("/api/checkout/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ webinarSlug: slug })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMessage(data.message);
                // Redirect to dashboard or success page after 2 seconds
                setTimeout(() => router.push(`/${lang}/dashboard`), 2000);
            } else {
                setErrorMessage(data.error || "Error al procesar inscripción gratuita.");
            }
        } catch (err) {
            setErrorMessage("Error de conexión al procesar la inscripción.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleStripeCheckout = async () => {
        setIsProcessing(true);
        setErrorMessage("");
        try {
            const res = await fetch("/api/checkout/stripe/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    webinarSlug: slug,
                    host: window.location.origin 
                })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.success) {
                setSuccessMessage(data.message);
                setTimeout(() => router.push(`/${lang}/dashboard`), 2000);
            } else {
                setErrorMessage(data.error || "Error al iniciar el pago con tarjeta.");
            }
        } catch (err) {
            setErrorMessage("Error de conexión con el procesador de pagos.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="pt-8 md:pt-12 pb-20 min-h-screen bg-background-light relative">
            <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6">
                <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 font-medium">
                    <span className="material-icons-round text-[18px]">keyboard_backspace</span>
                    {lang === "pt" ? "Voltar Atrás" : "Volver Atrás"}
                </button>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* LEFT COLUMN: Payment Information & Forms */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-text-main dark:text-white font-display mb-2">{t("checkout.title" as LangKeys)}</h1>
                            <p className="text-text-muted dark:text-gray-400">
                                {lang === "pt" 
                                    ? "Preencha o formulário abaixo para processar sua aquisição com segurança."
                                    : "Completa el formulario a continuación para procesar tu adquisición de forma segura."}
                            </p>
                        </div>

                        {/* Terms of Use Alert */}
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
                            className="bg-white/80 backdrop-blur-md dark:bg-surface-dark border border-white/60 dark:border-gray-800 rounded-[32px] p-6 md:p-8 shadow-sm relative z-20"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                    <span className="material-icons-round text-primary">person</span>
                                    {t("checkout.contact" as LangKeys)}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={lang === "pt" ? "Nome completo *" : "Nombre completo *"} 
                                        className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all shadow-sm" 
                                    />
                                    <div className="flex w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary focus-within:bg-white transition-all shadow-sm relative z-20">
                                        <div className="relative flex items-center border-r border-gray-200 dark:border-gray-700 bg-gray-100/50 rounded-l-xl dark:bg-surface-dark w-[105px] shrink-0" ref={dropdownRef}>
                                            <button 
                                                type="button"
                                                className="w-full h-full py-3 pl-3 pr-2 flex items-center justify-between focus:outline-none"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img src={`https://flagcdn.com/w20/${countryIso}.png`} alt="flag" className="w-[18px] h-auto rounded-[2px] shadow-sm" />
                                                    <span className="text-sm font-medium text-text-main dark:text-white">{phoneCode}</span>
                                                </div>
                                                <span className="material-icons-round text-gray-400 text-[16px]">expand_more</span>
                                            </button>

                                            {isDropdownOpen && (
                                                <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-[100] py-2 max-h-60 overflow-y-auto">
                                                    {countryCodes.map((country) => (
                                                        <button
                                                            key={country.iso}
                                                            type="button"
                                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-surface-light transition-colors text-left"
                                                            onClick={() => {
                                                                setPhoneCode(country.code);
                                                                setCountryIso(country.iso);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                        >
                                                            <img src={`https://flagcdn.com/w20/${country.iso}.png`} alt={country.name} className="w-[20px] h-auto rounded-[2px] shadow-sm shrink-0" />
                                                            <span className="text-sm font-medium text-text-main dark:text-white truncate">{country.name}</span>
                                                            <span className="text-sm text-text-muted ml-auto shrink-0">{country.code}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="tel" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder={lang === "pt" ? "Telefone (Opcional)" : "Teléfono (Opcional)"} 
                                            className="w-full bg-transparent px-3 py-3 text-text-main dark:text-white focus:outline-none rounded-r-xl" 
                                        />
                                    </div>
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={lang === "pt" ? "Correio eletrónico *" : "Correo electrónico *"} 
                                    className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all shadow-sm" 
                                />
                            </div>
                        </motion.section>

                        {/* Benefits Reassurance Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-primary/5 border border-primary/20 rounded-[32px] p-6 md:p-8 shadow-sm relative z-10"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-icons-round text-primary">verified</span>
                                <h3 className="font-bold text-text-main dark:text-white">
                                    {lang === "pt" ? "O que inclui sua aquisição?" : "¿Qué incluye tu adquisición?"}
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-round text-primary text-xl shrink-0">check_circle</span>
                                    <p className="text-sm text-text-muted dark:text-gray-300">
                                        {lang === "pt" ? "90 dias de acesso à gravação completa do evento." : "90 días de acceso a la grabación completa del evento."}
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-round text-primary text-xl shrink-0">check_circle</span>
                                    <p className="text-sm text-text-muted dark:text-gray-300">
                                        {lang === "pt" ? "Certificado de participação oficial emitido pela AIBAPT." : "Certificado de participación oficial emitido por AIBAPT."}
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-round text-primary text-xl shrink-0">check_circle</span>
                                    <p className="text-sm text-text-muted dark:text-gray-300">
                                        {lang === "pt" ? "Créditos de formação válidos para certificação." : "Créditos de formación válidos para certificación."}
                                    </p>
                                </li>
                            </ul>
                        </motion.section>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <aside className="w-full lg:w-[420px] shrink-0 text-text-main dark:text-white">
                        <div className="bg-white/80 backdrop-blur-md dark:bg-surface-dark border border-white/60 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-xl sticky top-28">
                            <div className="bg-white/40 dark:bg-surface-light px-6 py-5 border-b border-white/60 dark:border-gray-800">
                                <h3 className="font-extrabold text-text-main dark:text-white text-lg">{t("checkout.summary" as LangKeys)}</h3>
                            </div>

                            <div className="p-6">
                                <div className="flex gap-4 items-start mb-6">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm bg-gray-100">
                                        {thumbnail ? (
                                            <Image src={thumbnail} alt="Product Thumbnail" fill className="object-cover" />
                                        ) : (
                                            <span className="material-icons-round text-3xl text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between h-full py-1">
                                        <h4 className="font-bold text-text-main dark:text-white text-sm leading-tight line-clamp-2">{title}</h4>
                                        <p className="text-primary font-bold">{isFree ? 'Gratis' : `${initialPrice} €`}</p>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <span className="font-bold text-text-main dark:text-white text-lg">{t("checkout.total" as LangKeys)}</span>
                                        <span className="font-black text-primary text-2xl">{isFree ? '0 €' : `${initialPrice} €`}</span>
                                    </div>
                                </div>

                                {errorMessage && (
                                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                        {errorMessage}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                        {successMessage}
                                    </div>
                                )}

                                {/* Metodo de Pago Selector */}
                                {!isFree && (
                                    <div className="mb-6">
                                        <p className="text-sm font-bold text-text-main dark:text-white mb-3">Método de pago</p>
                                        <div className="flex bg-gray-100 dark:bg-surface-light rounded-xl p-1 gap-1">
                                            <button
                                                onClick={() => setPaymentMethod("card")}
                                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === "card" ? "bg-white dark:bg-surface-dark text-text-main dark:text-white shadow-sm" : "text-text-muted hover:text-text-main"}`}
                                            >
                                                <span className="material-icons-round text-[18px]">credit_card</span>
                                                Tarjeta
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod("paypal")}
                                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === "paypal" ? "bg-white dark:bg-surface-dark text-text-main dark:text-white shadow-sm" : "text-text-muted hover:text-text-main"}`}
                                            >
                                                <span className="material-icons-round text-[18px]">paypal</span>
                                                PayPal
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Logic */}
                                {isFree ? (
                                    <button 
                                        onClick={handleFreeRegistration}
                                        disabled={isProcessing || !isFormValid}
                                        className={`w-full text-white font-bold inline-flex items-center justify-center gap-3 py-4 rounded-full shadow-md transition-all ${isProcessing || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:-translate-y-1'}`}
                                    >
                                        <span className="material-icons-round text-white/70 transition-colors">how_to_reg</span>
                                        {isProcessing ? 'Procesando...' : 'Registrarse Gratis'}
                                    </button>
                                ) : paymentMethod === "card" ? (
                                    <div className="space-y-4">
                                        {!isFormValid && (
                                            <p className="text-xs text-amber-600 mb-3 text-center bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                {lang === "pt" ? "Preencha seu Nome e E-mail para habilitar o pagamento." : "Completa tu Nombre y Correo para habilitar el pago."}
                                            </p>
                                        )}
                                        <button 
                                            onClick={handleStripeCheckout}
                                            disabled={isProcessing || !isFormValid}
                                            className={`w-full text-white font-bold inline-flex items-center justify-center gap-3 py-4 rounded-full shadow-md transition-all ${isProcessing || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover hover:-translate-y-1'}`}
                                        >
                                            <span className="material-icons-round text-white/70">lock</span>
                                            {isProcessing ? 'Procesando...' : `Pagar ${initialPrice} € de forma segura`}
                                        </button>
                                        <p className="text-xs text-center text-text-muted mt-4">
                                            <span className="material-icons-round text-[14px] align-middle mr-1">security</span>
                                            Pagos seguros procesados por Stripe
                                        </p>
                                    </div>
                                ) : (
                                    <PayPalScriptProvider options={initialOptions}>
                                        {!isFormValid && (
                                            <p className="text-xs text-amber-600 mb-3 text-center bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                {lang === "pt" ? "Preencha seu Nome e E-mail para habilitar o pagamento." : "Completa tu Nombre y Correo para habilitar el pago."}
                                            </p>
                                        )}
                                        <PayPalButtons
                                            disabled={!isFormValid}
                                            style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay" }}
                                            createOrder={async () => {
                                                const res = await fetch("/api/checkout/paypal/create-order", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ webinarSlug: slug }),
                                                });
                                                const order = await res.json();
                                                return order.id;
                                            }}
                                            onApprove={async (data, actions) => {
                                                const res = await fetch("/api/checkout/paypal/capture-order", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ orderID: data.orderID }),
                                                });
                                                const orderData = await res.json();
                                                const errorDetail = orderData?.details?.[0];
                                                
                                                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                                    return actions.restart();
                                                } else if (errorDetail) {
                                                    throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                                                } else {
                                                    setSuccessMessage("¡Pago exitoso! Redirigiendo...");
                                                    setTimeout(() => router.push(`/${lang}/dashboard`), 2000);
                                                }
                                            }}
                                            onError={(err) => {
                                                setErrorMessage("Ocurrió un error con PayPal. Intenta nuevamente.");
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
