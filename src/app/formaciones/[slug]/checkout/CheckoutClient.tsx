"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VisaIcon, MastercardIcon, PayPalLogo } from "@/components/ui/PaymentLogos";
import { WEBINARS_DATA } from "@/data/webinars";
import { notFound } from 'next/navigation';

export default function CheckoutClient({ slug }: { slug: string }) {
    const [method, setMethod] = useState<'card' | 'paypal'>('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // WEBINARS DATA Integration
    const getWebinarData = (slug: string) => {
        const w = WEBINARS_DATA.find(x => x.slug === slug);
        if (!w) return null;
        return {
            id: w.slug.split('-').pop(),
            title: w.title,
            price: w.price,
            image: w.img,
            instructor: w.instructorName,
            instructorImg: w.instructorImg,
            includes: w.includes
        };
    };

    const webinar = getWebinarData(slug);
    if (!webinar) return notFound();

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Backend integration placeholder
        setTimeout(() => {
            alert('En un entorno real, aquí se procesaría el pago con Stripe o PayPal.');
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f0a] pt-32 pb-20 px-4 text-text-main dark:text-white">
            <div className="max-w-6xl mx-auto">
                <Link href={`/formaciones/${slug}`} className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-12 group">
                    <span className="material-icons-round text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
                    <span className="text-xs font-black uppercase tracking-widest">Volver al webinar</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* LEFT: PAYMENT METHODS */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white dark:bg-[#1a2b18]/40 border border-black/5 dark:border-white/5 rounded-[48px] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
                            <h2 className="text-3xl font-black mb-8 italic tracking-tighter uppercase text-primary">Proceso de Pago</h2>
                            
                            {/* Tabs */}
                            <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-3xl mb-10">
                                <button 
                                    onClick={() => setMethod('card')}
                                    className={`flex-1 py-4 rounded-[22px] flex items-center justify-center gap-3 transition-all font-black text-xs tracking-widest uppercase ${method === 'card' ? 'bg-primary text-white shadow-xl' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                                >
                                    <span className="material-icons-round text-xl">credit_card</span>
                                    Tarjeta
                                </button>
                                <button 
                                    onClick={() => setMethod('paypal')}
                                    className={`flex-1 py-4 rounded-[22px] flex items-center justify-center gap-3 transition-all font-black text-xs tracking-widest uppercase ${method === 'paypal' ? 'bg-primary text-white shadow-xl' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                                >
                                    <PayPalLogo />
                                </button>
                            </div>

                            {method === 'card' ? (
                                <form onSubmit={handlePayment} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-primary dark:text-gray-400 uppercase tracking-widest ml-4">Titular de la tarjeta</label>
                                        <input type="text" placeholder="NOMBRE COMPLETO" required className="w-full bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm tracking-wide" />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-primary dark:text-gray-400 uppercase tracking-widest ml-4">Número de tarjeta</label>
                                        <div className="relative">
                                            <input type="text" placeholder="0000 0000 0000 0000" required className="w-full bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm tracking-widest" />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                                <VisaIcon className="opacity-50" />
                                                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 opacity-20"></div>
                                                <MastercardIcon className="opacity-50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-primary dark:text-gray-400 uppercase tracking-widest ml-4">Caducidad</label>
                                            <input type="text" placeholder="MM/YY" required className="w-full bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm tracking-widest" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-primary dark:text-gray-400 uppercase tracking-widest ml-4">CVC / CVC2</label>
                                            <input type="text" placeholder="123" required className="w-full bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm tracking-widest" />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-6 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <span className="material-icons-round text-xl">verified_user</span>
                                        )}
                                        CONFIRMAR PAGO {webinar.price}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-12 space-y-8">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-black/40 rounded-full flex items-center justify-center mx-auto">
                                        <PayPalLogo className="scale-150" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold tracking-tight">Paga con total seguridad vía PayPal</h3>
                                        <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">Serás redirigido a la plataforma oficial de PayPal para completar tu transacción de forma segura.</p>
                                    </div>
                                    <button 
                                        onClick={handlePayment}
                                        className="w-full py-6 bg-[#ffc439] text-[#003087] rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                                    >
                                        CONTINUAR CON PAYPAL
                                    </button>
                                </div>
                            )}

                            <p className="text-[9px] text-center text-text-muted mt-10 tracking-[0.3em] font-black uppercase flex items-center justify-center gap-2">
                                <span className="material-icons-round text-[14px]">lock</span>
                                Encriptación SSL de 256 bits · Pago seguro
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-primary rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative Brand Elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#b04e22]/20 rounded-full blur-[80px]"></div>
                            
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <span className="py-2 px-5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10">Tu Compra</span>
                                    <span className="material-icons-round opacity-30 text-4xl">inventory_2</span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black italic tracking-tighter leading-none leading-[0.95] drop-shadow-xl">{webinar.title}</h3>
                                    <p className="text-[#e2725b] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-icons-round text-sm">person</span>
                                        {webinar.instructor}
                                    </p>
                                </div>

                                <div className="py-8 border-y border-white/10 space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Subtotal</span>
                                        <span className="font-bold">{webinar.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-black italic p-4">
                                        <span className="uppercase tracking-widest text-xs opacity-60 not-italic">TOTAL</span>
                                        <span className="text-4xl text-[#e2725b] drop-shadow-lg">{webinar.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Incluye acceso inmediato a:</p>
                                    <ul className="space-y-4">
                                        {webinar.includes.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 group/item">
                                                <span className="w-5 h-5 rounded-full bg-[#b04e22] flex items-center justify-center shrink-0">
                                                    <span className="material-icons-round text-[12px]">done</span>
                                                </span>
                                                <span className="text-[13px] font-bold opacity-90">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
