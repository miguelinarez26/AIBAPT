"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

function LoginContent() {
    const { t, lang } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const supabase = createBrowserSupabaseClient();
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
            } else {
                // Obtener perfil para determinar rol y redirección
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authData.user?.id)
                    .single();

                const role = (profile as any)?.role || 'member';
                const defaultRoute = role === 'admin' ? `/${lang}/admin` : `/${lang}/dashboard`;
                
                const redirectTo = searchParams.get("redirectTo");
                router.push(role === 'admin' ? defaultRoute : (redirectTo || defaultRoute));
            }
        } catch (err: any) {
            console.error("Error en login:", err);
            setError(lang === 'es' 
                ? "Error de conexión con el servidor de Supabase. Verifica tu red o inténtalo de nuevo." 
                : "Erro de conexão com o servidor Supabase. Verifique sua rede ou tente novamente.");
            setLoading(false);
        }
    };

    return (
        <main className="pt-8 md:pt-12 pb-12 min-h-screen bg-background-light dark:bg-background-dark flex items-start justify-center p-6 relative overflow-hidden">
            {/* Organic Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 -z-10"></div>

            <div className="w-full max-w-[1024px] bg-white dark:bg-surface-dark rounded-[32px] shadow-2xl shadow-secondary/10 overflow-hidden flex flex-col md:flex-row relative z-10 border border-secondary/25 dark:border-gray-800">

                {/* Visual / Branding Side */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-primary to-secondary/85 p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <Link href="/" className="mb-12 block w-fit">
                            <Image 
                                src="/images/logo_corto_en_blanco.png" 
                                alt="AIBAPT Logo" 
                                width={240} 
                                height={80} 
                                className="object-contain w-auto h-16"
                                priority
                            />
                        </Link>

                        <h2 className="text-3xl font-serif leading-tight mb-4">
                            {lang === 'es' ? 'Dando la bienvenida a tu espacio de' : 'Dando as boas-vindas ao seu espaço de'} <span className="italic font-light text-highlight">{lang === 'es' ? 'crecimiento' : 'crescimento'}</span>.
                        </h2>
                        <p className="text-white/90 text-sm leading-relaxed max-w-sm">
                            {lang === 'es' ? 'Accede a tus cursos automáticos, verifica tus certificaciones y gestiona tu membresía en un solo lugar.' : 'Acesse seus treinamentos, verifique suas certificações e gerencie sua assinatura em um só lugar.'}
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <span className="material-icons-round text-3xl">shield_moon</span>
                            <div>
                                <h3 className="font-bold text-sm">{lang === 'es' ? 'Plataforma Segura' : 'Plataforma Segura'}</h3>
                                <p className="text-xs text-white/80">{lang === 'es' ? 'Diseñada bajo la arquitectura Zero-Trust de AIBAPT.' : 'Projetada sob a arquitetura Zero-Trust da AIBAPT.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form Side */}
                <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold font-serif text-text-light dark:text-white mb-2">{t("portal.title")}</h1>
                            <p className="text-sm text-text-dark dark:text-white/60">{t("portal.desc")}</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
                                <span className="material-icons-round mr-2">error_outline</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="email">{t("portal.fields.email")}</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">email</span>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="password">{t("portal.fields.password")}</label>
                                    <Link href={`/${lang}/reset-password`} className="text-xs font-bold text-primary hover:underline">{t("auth.forgot_password")}</Link>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">lock</span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40"
                                        placeholder="*****************"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark hover:text-text-light dark:hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-[18px] h-[18px] select-none" />
                                        ) : (
                                            <Eye className="w-[18px] h-[18px] select-none" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group/btn relative inline-flex items-center justify-center bg-primary hover:bg-secondary text-white py-4 w-full rounded-full font-bold text-base transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
                            >
                                <span className="leading-none">
                                    {loading ? (
                                        lang === 'es' ? 'Procesando...' : 'Processando...'
                                    ) : (
                                        t("portal.btn.login.active")
                                    )}
                                </span>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1 shrink-0">
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-text-dark dark:text-white/60">
                            {lang === 'es' ? '¿Aún no tienes cuenta? ' : 'Ainda não tem conta? '}
                            <Link href={`/${lang}/registro?redirectTo=/${lang}/afiliacion`} className="font-bold text-primary hover:underline">
                                {lang === 'es' ? 'Regístrate aquí' : 'Registre-se aqui'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-accent/10 dark:bg-background-dark">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
