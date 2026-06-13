"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

function RegistroContent() {
    const { lang } = useLanguage();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError(lang === 'es' ? 'Las contraseñas no coinciden' : 'As senhas não coincidem');
            return;
        }

        if (!firstName.trim() || !lastName.trim()) {
            setError(lang === 'es' ? 'Nombres y Apellidos son obligatorios' : 'Nome e Sobrenome são obrigatórios');
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        const supabase = createBrowserSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    // Mantener full_name por retrocompatibilidad con el trigger
                    full_name: `${firstName.trim()} ${lastName.trim()}`,
                }
            }
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else if (!authData.user) {
            setError(lang === 'es' ? 'No se pudo crear el usuario. Intenta de nuevo.' : 'Não foi possível criar o usuário. Tente novamente.');
            setLoading(false);
        } else {
            setSuccess(true);
            toast.success(lang === 'es' ? '¡Registro exitoso! Iniciando sesión...' : 'Registro bem-sucedido! Iniciando sessão...');
            // Éxito en Auth, el trigger debería crear el perfil.
            // Esperamos un momento visual para que el usuario lea el éxito
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const redirectTo = searchParams.get("redirectTo");
            const defaultRoute = `/${lang}/dashboard`;
            
            router.push(redirectTo || defaultRoute);
            router.refresh();
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
                            {lang === 'es' ? 'Únete a nuestra' : 'Junte-se à nossa'} <span className="italic font-light text-highlight">{lang === 'es' ? 'comunidad' : 'comunidade'}</span>.
                        </h2>
                        <p className="text-white/90 text-sm leading-relaxed max-w-sm">
                            {lang === 'es' ? 'Crea tu cuenta gratuita para comenzar tu proceso de afiliación y acceder a recursos exclusivos.' : 'Crie sua conta gratuita para iniciar seu processo de afiliação e acessar recursos exclusivos.'}
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <span className="material-icons-round text-3xl">verified_user</span>
                            <div>
                                <h3 className="font-bold text-sm">{lang === 'es' ? 'Proceso Oficial' : 'Processo Oficial'}</h3>
                                <p className="text-xs text-white/80">{lang === 'es' ? 'Registro en la Asociación Ibero-Americana de Psicotrauma.' : 'Registro na Associação Ibero-Americana de Psicotrauma.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Form Side */}
                <div className="w-full md:w-7/12 p-10 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold font-serif text-text-light dark:text-white mb-2">{lang === 'es' ? 'Crear Cuenta' : 'Criar Conta'}</h1>
                            <p className="text-sm text-text-dark dark:text-white/60">{lang === 'es' ? 'Ingresa tus datos para registrarte' : 'Insira seus dados para se registrar'}</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
                                <span className="material-icons-round mr-2">error_outline</span>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl flex items-center text-sm border border-green-100 dark:border-green-900/50">
                                <span className="material-icons-round mr-2">check_circle</span>
                                {lang === 'es' ? '¡Registro exitoso! Iniciando sesión...' : 'Registro bem-sucedido! Iniciando sessão...'}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            {/* Nombres y Apellidos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="firstName">{lang === 'es' ? 'Nombres' : 'Nomes'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">person</span>
                                        <input
                                            id="firstName"
                                            type="text"
                                            required
                                            disabled={loading || success}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder={lang === 'es' ? 'Ej: Juan' : 'Ex: João'}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="lastName">{lang === 'es' ? 'Apellidos' : 'Sobrenomes'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">person</span>
                                        <input
                                            id="lastName"
                                            type="text"
                                            required
                                            disabled={loading || success}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder={lang === 'es' ? 'Ej: Pérez' : 'Ex: Silva'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="email">{lang === 'es' ? 'Correo Electrónico' : 'Correio Eletrônico'}</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">email</span>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        disabled={loading || success}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="password">{lang === 'es' ? 'Contraseña' : 'Senha'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">lock</span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={loading || success}
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="******"
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

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-text-light dark:text-white pl-1" htmlFor="confirmPassword">{lang === 'es' ? 'Confirmar' : 'Confirmar'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-dark text-[18px]">lock_clock</span>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            disabled={loading || success}
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="******"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark hover:text-text-light dark:hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-[18px] h-[18px] select-none" />
                                            ) : (
                                                <Eye className="w-[18px] h-[18px] select-none" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group/btn relative inline-flex items-center justify-center bg-primary hover:bg-secondary text-white py-4 w-full rounded-full font-bold text-base transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
                            >
                                <span className="leading-none">
                                    {loading ? (
                                        lang === 'es' ? 'Creando cuenta...' : 'Criando conta...'
                                    ) : (
                                        lang === 'es' ? 'Registrarse' : 'Registrar-se'
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

                        <div className="mt-6 text-center text-sm text-text-dark dark:text-white/60">
                            {lang === 'es' ? '¿Ya tienes una cuenta? ' : 'Já tem uma conta? '}
                            <Link href={`/${lang}/login`} className="font-bold text-primary hover:underline">
                                {lang === 'es' ? 'Inicia Sesión aquí' : 'Faça login aqui'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function RegistroPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-accent/10 dark:bg-background-dark">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <RegistroContent />
        </Suspense>
    );
}
