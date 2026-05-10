import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import MemberProfileClient from "./MemberProfileClient";
import { translations } from "@/i18n/translations";
import { ArrowLeft, UserX } from "lucide-react";

interface Props {
    params: Promise<{
        lang: 'es' | 'pt';
        id: string; // member_number
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id: rawId } = await params;
    const id = decodeURIComponent(rawId);
    const supabase = await createServerSupabaseClient();
    
    const { data: member } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('member_number', id)
        .eq('is_public', true)
        .eq('is_member', true)
        .single();

    if (!member) return { title: "Miembro no encontrado - AIBAPT" };

    return {
        title: `${member.first_name} ${member.last_name} - Directorio AIBAPT`,
        description: `Perfil profesional de ${member.first_name} ${member.last_name} en la Asociación Iberoamericana de Psicotrauma.`
    };
}

export default async function MemberProfilePage({ params }: Props) {
    const { lang, id: rawId } = await params;
    const id = decodeURIComponent(rawId);
    const t = translations[lang];
    
    console.log('[Perfil Público] Buscando matrícula:', id);

    const supabase = await createServerSupabaseClient();

    // Buscar al miembro por su número de matrícula (member_number)
    const { data: member, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('member_number', id)
        .eq('is_public', true)
        .eq('is_member', true)
        .single();

    if (error || !member) {
        return (
            <div className="min-h-screen bg-cream dark:bg-bg-dark flex items-center justify-center px-4 pt-20">
                <div className="max-w-md w-full bg-white dark:bg-surface-dark p-12 rounded-[2.5rem] shadow-xl text-center border border-accent/10">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <UserX className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-black text-text-main dark:text-white mb-4 tracking-tight leading-tight">
                        {/* @ts-ignore */}
                        {t["members.profile.not_found"]}
                    </h2>
                    <p className="text-text-muted dark:text-gray-400 text-sm mb-8 leading-relaxed">
                        {lang === 'es' 
                            ? 'Si crees que esto es un error, por favor contacta con soporte técnico de AIBAPT.' 
                            : 'Se você acredita que isso é um erro, entre em contato com o suporte técnico da AIBAPT.'}
                    </p>
                    <Link 
                        href={`/${lang}/miembros`}
                        className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {/* @ts-ignore */}
                        {t["members.profile.back"]}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <MemberProfileClient member={member} />
    );
}
