"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Profile } from "@/types/database";
import { motion } from "framer-motion";
import { BadgeCheck, FileText, ArrowLeft, Globe, MapPin, Award } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface MemberProfileClientProps {
    member: Profile;
}

export default function MemberProfileClient({ member }: MemberProfileClientProps) {
    const { t, lang } = useLanguage();
    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const [loadingCV, setLoadingCV] = useState(false);

    const getAvatarUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${path}`;
    };

    const getMembershipLabel = (type: string | null) => {
        if (!type) return t("dashboard.role.member" as any);
        const labels: Record<string, string> = {
            'pleno_salud_mental': lang === 'es' ? 'Miembro Pleno (Salud Mental)' : 'Membro Pleno (Saúde Mental)',
            'pleno_agente_social': lang === 'es' ? 'Miembro Pleno (Agente Social)' : 'Membro Pleno (Agente Social)',
            'institucional': lang === 'es' ? 'Miembro Institucional' : 'Membro Institucional',
            'bienhechor': lang === 'es' ? 'Miembro Bienhechor' : 'Membro Benfeitor',
            'simpatizante': lang === 'es' ? 'Miembro Simpatizante' : 'Membro Simpatizante',
        };
        return labels[type] || type.replace(/_/g, ' ');
    };

    const handleViewCV = async () => {
        if (!member.cv_url) return;
        setLoadingCV(true);
        try {
            const supabase = createBrowserSupabaseClient();
            const { data, error } = await supabase.storage
                .from('public-assets')
                .createSignedUrl(member.cv_url, 300); // 5 minutos
            
            if (error) throw error;
            window.open(data.signedUrl, '_blank');
        } catch (error) {
            console.error("Error al obtener CV:", error);
            alert(lang === 'es' ? "Error al acceder al currículum." : "Erro ao acessar o currículo.");
        } finally {
            setLoadingCV(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream dark:bg-bg-dark pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Botón Volver */}
                <Link 
                    href={`/${lang}/miembros`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {/* @ts-ignore */}
                    {t["members.profile.back"]}
                </Link>

                <div className="bg-white dark:bg-surface-dark rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-accent/10 overflow-hidden">
                    {/* Hero Section */}
                    <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-transparent">
                        <div className="absolute -bottom-16 left-8 md:left-12">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white dark:bg-surface-dark p-2 shadow-xl border border-accent/10">
                                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-primary/10 relative">
                                    {member.avatar_url ? (
                                        <Image 
                                            src={getAvatarUrl(member.avatar_url)!} 
                                            alt={member.first_name} 
                                            fill 
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                                            {member.first_name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Header Info */}
                    <div className="pt-20 pb-12 px-8 md:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-black text-text-main dark:text-white tracking-tight">
                                        {member.first_name} {member.last_name}
                                    </h1>
                                    <span className="material-icons-round text-aibapt-green text-3xl">verified</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full font-black uppercase tracking-widest text-[10px]">
                                        <BadgeCheck className="w-3.5 h-3.5" />
                                        {member.member_number}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-bold text-aibapt-green uppercase tracking-tighter">
                                        <Award className="w-4 h-4" />
                                        {/* @ts-ignore */}
                                        {t["members.profile.active"]}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <MapPin className="w-4 h-4" />
                                        Iberoamérica
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-accent/10 my-10" />

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-10">
                                {/* Biografía */}
                                <section>
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                                        <span className="w-6 h-px bg-primary"></span>
                                        {/* @ts-ignore */}
                                        {t["members.profile.bio"]}
                                    </h2>
                                    {member.bio ? (
                                        <p className="text-lg text-text-main dark:text-gray-300 leading-relaxed font-medium">
                                            {member.bio}
                                        </p>
                                    ) : (
                                        <p className="text-text-muted italic">
                                            {/* @ts-ignore */}
                                            {t["members.profile.info_updating"]}
                                        </p>
                                    )}
                                </section>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-10">
                                {/* Especialidad */}
                                <section>
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6">
                                        {/* @ts-ignore */}
                                        {t["members.profile.specialty"]}
                                    </h2>
                                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-accent/5">
                                        <p className="text-sm font-black text-text-main dark:text-white uppercase tracking-widest mb-1">
                                            {getMembershipLabel(member.membership_type)}
                                        </p>
                                        <p className="text-xs text-text-muted">AIBAPT Certified Specialist</p>
                                    </div>
                                </section>

                                {/* Currículum */}
                                <section>
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6">
                                        Professional CV
                                    </h2>
                                    {member.cv_url ? (
                                        <button 
                                            onClick={handleViewCV}
                                            disabled={loadingCV}
                                            className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                        >
                                            <FileText className="w-5 h-5" />
                                            {/* @ts-ignore */}
                                            {loadingCV ? '...' : t["members.profile.view_cv"]}
                                        </button>
                                    ) : (
                                        <div className="p-6 rounded-3xl border border-dashed border-accent/30 text-center">
                                            <p className="text-xs text-text-muted font-bold">
                                                {/* @ts-ignore */}
                                                {t["members.profile.info_updating"]}
                                            </p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-12 text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.4em]">
                    Perfil Público Oficial Verificado por AIBAPT
                </div>
            </div>
        </div>
    );
}
