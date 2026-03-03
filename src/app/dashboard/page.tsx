"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

function DashboardContent() {
    const { t, lang } = useLanguage();
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "no-socio";
    const isDirectiva = role === "directiva";
    const isSocio = role === "socio" || isDirectiva;

    // Mock User Data based on role
    const user = isSocio
        ? {
            name: isDirectiva ? "Dra. Directiva" : "Dr. Socio Activo",
            membershipStatus: lang === 'es' ? "Activa" : "Ativa",
            expiryDate: isDirectiva ? "Vitalicia" : "15 Oct 2025",
            roleTag: isDirectiva ? "Junta Directiva" : (lang === 'es' ? "Socio Profesional" : "Sócio Profissional")
        }
        : { name: lang === 'es' ? "Usuario Invitado" : "Usuário Convidado", membershipStatus: lang === 'es' ? "Inactiva" : "Inativa", expiryDate: "N/A", roleTag: lang === 'es' ? "Cuenta Gratuita" : "Conta Gratuita" };

    // Simulated array of purchased events for this user
    const myRecordedEvents = [
        {
            title: "Trauma Webinar #19 | Mirando a través de la Voracidad",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwjFC5Lqrsmp9SkpZJBTVG_JbbrRAFgQ_3cZOFvZTEwTITGSrOiSNtbsvdTaDjq-mPDFM-0iiybDqdMIK2kUl_PHBeQ4k8JvOrv0miSzm5I5wRXjAPZ_UNmlI8Aric3V1sGRGnXPQdumg4ORULY_Ql3BDDqG03F_KQBtqbCbe93GCUcRZ-5Kd6hSenP-XA6nm7Zsv8QiRSDaPl7jNcEa-TNRBwnxFjRVyLPztesJWPiZT3vkgCQuTqyppKaciBZQC_7wSnF3bUvf7c",
            daysLeft: 60,
            hasExpired: false
        },
        {
            title: "Trauma Webinar #16 | El abuso sexual infantil",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFqVfbqfrxeVaN8arWBYhx92ysovO8ycmOEMqgLHphoqoaZX3YVyN8Iyj1ZQ68Js91JmFxn-SzqGm6Rizp9aLbIrzR_Qi5W95BJ_vTTQBs8fcqQjU5swef1wmJ9_TY_AIsTRbvo5Y2GXI34vl-Nnh0x8rhtUbHnq8MBPuEveAXUUT5D3-7wVp3aE8DmmWg5nX_-jyruUVicPwaf3E7d0JFEJ0gyvmwIL4nwtP9jxWcTEALOBbLPrq36rOShJ373bn90i1QkQ_djCIv",
            daysLeft: 0,
            hasExpired: true
        }
    ];

    return (
        <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark">
            {/* Dashboard Header Banner */}
            <div className="bg-primary pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between text-white relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-3xl font-display shadow-lg">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-medium tracking-tight mb-1">{lang === 'es' ? 'Hola' : 'Olá'}, {user.name}</h1>
                            <div className="flex items-center gap-2">
                                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium tracking-wide uppercase">
                                    {user.roleTag}
                                </span>
                                {isSocio && (
                                    <span className="flex items-center gap-1 text-xs text-white bg-green-500/80 px-2 py-1 rounded-full border border-green-400">
                                        <span className="material-icons-round text-[14px]">verified</span> {lang === 'es' ? 'Miembro Verificado' : 'Membro Verificado'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Main Content */}
            <main className="max-w-[1280px] mx-auto px-6 -mt-16 pb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Main Panels) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Status Warning for Non-Members */}
                        {!isSocio && (
                            <div className="bg-white border-l-4 border-l-orange-500 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between border-t border-r border-b border-accent/50">
                                <div>
                                    <h3 className="font-bold font-display text-orange-600 text-lg flex items-center gap-2 mb-2">
                                        <span className="material-icons-round">warning_amber</span>
                                        {lang === 'es' ? 'Membresía Inactiva o Vencida' : 'Assinatura Inativa ou Vencida'}
                                    </h3>
                                    <p className="text-sm text-text-muted leading-relaxed">
                                        {lang === 'es' ? 'Actualmente no tienes acceso a la biblioteca clínica, certificaciones automáticas gratuitas, ni a la red de especialistas globales. Completa tu proceso de afiliación o renueva tu anualidad.' : 'Atualmente você não tem acesso à biblioteca clínica, certificações automáticas gratuitas, nem à rede de especialistas globais. Conclua seu processo de afiliação ou renove sua anuidade.'}
                                    </p>
                                </div>
                                <button className="shrink-0 w-full md:w-auto px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors">
                                    {lang === 'es' ? 'Iniciar Afiliación' : 'Iniciar Afiliação'}
                                </button>
                            </div>
                        )}

                        {/* Recent Trainings / Certifications */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-accent/50 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold font-display text-secondary">{lang === 'es' ? 'Mis formaciones e insignias' : 'Meus cursos e selos'}</h2>
                                <Link href="#" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                    {lang === 'es' ? 'Ver todas' : 'Ver todos'} <span className="material-icons-round text-[16px]">arrow_forward</span>
                                </Link>
                            </div>

                            {isSocio ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-accent/20 rounded-2xl border border-accent/50 flex flex-col gap-3 group hover:border-primary/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                                <span className="material-icons-round">psychology</span>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-full text-text-muted shadow-sm border border-accent/30">{lang === 'es' ? 'Completado' : 'Concluído'}</span>
                                        </div>
                                        <h4 className="font-bold text-text-main leading-tight group-hover:text-primary transition-colors">{lang === 'es' ? 'Seminario: Trauma Complejo y Disociación' : 'Seminário: Trauma Complexo e Dissociação'}</h4>
                                        <p className="text-xs text-text-muted">{lang === 'es' ? 'Certificado emitido el 12 Oct 2023' : 'Certificado emitido em 12 Out 2023'}</p>
                                        <button className="text-xs font-bold text-primary flex items-center gap-1 mt-2">
                                            <span className="material-icons-round text-[14px]">download</span> {lang === 'es' ? 'Descargar PDF' : 'Baixar PDF'}
                                        </button>
                                    </div>
                                    <div className="p-4 bg-accent/20 rounded-2xl border border-accent/50 flex flex-col gap-3 group hover:border-primary/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                                <span className="material-icons-round">ondemand_video</span>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-1 rounded-full shadow-sm">{lang === 'es' ? 'En Curso' : 'Em Andamento'}</span>
                                        </div>
                                        <h4 className="font-bold text-text-main leading-tight group-hover:text-primary transition-colors">{lang === 'es' ? 'Webinar: Intervención Temprana' : 'Webinar: Intervenção Precoce'}</h4>
                                        <div className="w-full bg-accent/50 rounded-full h-1.5 mt-2">
                                            <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">{lang === 'es' ? 'Progreso' : 'Progresso'}: 45%</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center gap-4 bg-accent/10 rounded-2xl border border-dashed border-accent">
                                    <span className="material-icons-round text-5xl text-accent/80">folder_open</span>
                                    <div>
                                        <p className="text-sm text-text-muted font-medium">{t("dash.vault.empty.title")}</p>
                                        <p className="text-xs text-text-muted/70 max-w-sm mt-1">
                                            {t("dash.vault.empty.desc")}
                                        </p>
                                    </div>
                                    <Link href="/formaciones" className="mt-2 text-xs font-bold text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors">
                                        {t("dash.vault.empty.btn")}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mis Eventos Grabados / Purchased VODs Section */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-accent/50 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold font-display text-secondary flex items-center gap-2">
                                    <span className="material-icons-round text-primary">video_library</span>
                                    {lang === 'es' ? 'Mis Eventos Grabados' : 'Meus Eventos Gravados'}
                                </h2>
                                <Link href="/formaciones" className="text-sm font-bold text-primary hover:underline">
                                    {lang === 'es' ? 'Explorar más' : 'Explorar mais'}
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {myRecordedEvents.map((ev, idx) => {
                                    const isUnlimited = isDirectiva;
                                    const textUnlimited = lang === 'es' ? 'Acceso Ilimitado' : 'Acesso Ilimitado';
                                    const textDaysLeft = lang === 'es' ? `${ev.daysLeft} días restantes` : `${ev.daysLeft} dias restantes`;
                                    const textExpired = lang === 'es' ? 'Acceso Expirado' : 'Acesso Expirado';

                                    const isAvailable = isUnlimited || !ev.hasExpired;

                                    return (
                                        <div key={idx} className={`relative flex flex-col bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${!isAvailable ? 'border-red-200 opacity-80 grayscale-[50%]' : 'border-accent/50 hover:border-primary/50'}`}>
                                            <div className="aspect-video relative bg-black/5">
                                                <Image src={ev.img} alt={ev.title} fill className="object-cover" />

                                                {/* Expiration Badge */}
                                                <div className="absolute top-3 right-3 z-10">
                                                    {isUnlimited ? (
                                                        <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1 shadow-md">
                                                            <span className="material-icons-round text-[14px]">all_inclusive</span> {textUnlimited}
                                                        </span>
                                                    ) : isAvailable ? (
                                                        <span className={`text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1 shadow-md ${ev.daysLeft <= 15 ? 'bg-orange-500' : 'bg-primary'}`}>
                                                            <span className="material-icons-round text-[14px]">schedule</span> {textDaysLeft}
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1 shadow-md">
                                                            <span className="material-icons-round text-[14px]">block</span> {textExpired}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Play Button Overlay */}
                                                {isAvailable && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="material-icons-round text-5xl text-white drop-shadow-lg">play_circle</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col gap-3 flex-1">
                                                <h4 className="font-bold text-text-main leading-tight text-sm line-clamp-2">{ev.title}</h4>

                                                {isAvailable ? (
                                                    <button className="w-full mt-auto py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold rounded-xl transition-colors">
                                                        {lang === 'es' ? 'Reproducir Grabación' : 'Reproduzir Gravação'}
                                                    </button>
                                                ) : (
                                                    <button className="w-full mt-auto py-2.5 bg-gray-100 text-gray-500 text-sm font-bold rounded-xl cursor-not-allowed border border-gray-200">
                                                        {lang === 'es' ? 'Renovar Acceso' : 'Renovar Acesso'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Profile & Billing Data) */}
                    <div className="space-y-8">

                        {/* Membresia Status Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-accent/50 flex flex-col gap-4">
                            <h3 className="font-bold font-display text-secondary border-b border-accent/50 pb-3">{t("dash.status.title")}</h3>

                            <div className="flex justify-between text-sm py-2">
                                <span className="text-text-muted">{lang === 'es' ? 'Estatus' : 'Status'}</span>
                                <span className={`font-bold ${isSocio ? 'text-green-600' : 'text-orange-500'}`}>
                                    {user.membershipStatus}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-text-muted">{lang === 'es' ? 'Vencimiento' : 'Vencimento'}</span>
                                <span className="font-bold text-text-main">{user.expiryDate}</span>
                            </div>

                            <hr className="border-accent/50" />

                            {isSocio ? (
                                <button className="w-full py-2.5 text-sm font-bold text-text-main hover:text-primary transition-colors flex items-center justify-between group">
                                    {lang === 'es' ? 'Renovar Membresía' : 'Renovar Assinatura'}
                                    <span className="material-icons-round text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            ) : (
                                <button className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#689153] transition-colors">
                                    {lang === 'es' ? 'Pagar Anualidad (Paypal / TDC)' : 'Pagar Anuidade (Paypal / Cartão)'}
                                </button>
                            )}
                        </div>

                        {/* User Shortcuts */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-accent/50 flex flex-col gap-2">
                            <h3 className="font-bold font-display text-secondary mb-2">{t("dash.menu.settings")}</h3>
                            <Link href={`/dashboard/perfil?role=${role}`} className="flex items-center gap-3 p-3 text-sm text-text-main hover:bg-accent/20 rounded-xl transition-colors font-medium border border-transparent hover:border-accent/50 text-left">
                                <span className="material-icons-round text-primary text-[20px]">person</span> {lang === 'es' ? 'Datos Personales' : 'Dados Pessoais'}
                            </Link>
                            <Link href={`/dashboard/perfil?role=${role}&tab=cv`} className="flex items-center gap-3 p-3 text-sm text-text-main hover:bg-accent/20 rounded-xl transition-colors font-medium border border-transparent hover:border-accent/50 text-left">
                                <span className="material-icons-round text-primary text-[20px]">contact_page</span> {lang === 'es' ? 'Currículum y Directorio' : 'Currículo e Diretório'}
                            </Link>
                            <button className="flex items-center gap-3 p-3 text-sm text-text-main hover:bg-accent/20 rounded-xl transition-colors font-medium border border-transparent hover:border-accent/50 text-left">
                                <span className="material-icons-round text-primary text-[20px]">receipt_long</span> {lang === 'es' ? 'Facturación Digital' : 'Faturamento Digital'}
                            </button>

                            <div className="h-px w-full bg-accent/50 my-2"></div>

                            <Link href="/portal" className="flex items-center gap-3 p-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-bold text-left mt-2">
                                <span className="material-icons-round text-[20px]">logout</span> {t("dash.menu.logout")}
                            </Link>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-40 pr-8 text-center text-primary font-display text-2xl animate-pulse">Cargando perfil...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
