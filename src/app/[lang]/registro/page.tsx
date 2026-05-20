"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
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
            // Éxito en Auth, el trigger debería crear el perfil.
            // Esperamos un momento para asegurar consistencia
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const redirectTo = searchParams.get("redirectTo");
            const defaultRoute = `/${lang}/dashboard`;
            
            router.push(redirectTo || defaultRoute);
            router.refresh();
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Organic Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <main className="w-full max-w-[1024px] bg-white dark:bg-surface-dark rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-accent/20 dark:border-gray-800">

                {/* Visual / Branding Side */}
                <div className="w-full md:w-5/12 bg-secondary p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
                            <div className="w-10 h-10 bg-white rounded-tr-xl rounded-bl-xl flex items-center justify-center text-secondary shadow-sm">
                                <span className="material-icons-round text-2xl">spa</span>
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">AIBAPT</span>
                        </Link>

                        <h2 className="text-3xl font-display font-medium leading-tight mb-4">
                            {lang === 'es' ? 'Únete a nuestra' : 'Junte-se à nossa'} <span className="font-black italic">{lang === 'es' ? 'comunidad' : 'comunidade'}</span>.
                        </h2>
                        <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                            {lang === 'es' ? 'Crea tu cuenta gratuita para comenzar tu proceso de afiliación y acceder a recursos exclusivos.' : 'Crie sua conta gratuita para iniciar seu processo de afiliação e acessar recursos exclusivos.'}
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 bg-black/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <span className="material-icons-round text-3xl">verified_user</span>
                            <div>
                                <h3 className="font-bold text-sm">{lang === 'es' ? 'Proceso Oficial' : 'Processo Oficial'}</h3>
                                <p className="text-xs text-white/70">{lang === 'es' ? 'Registro en la Asociación Ibero-Americana de Psicotrauma.' : 'Registro na Associação Ibero-Americana de Psicotrauma.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Form Side */}
                <div className="w-full md:w-7/12 p-10 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-black font-display text-secondary dark:text-white mb-2">{lang === 'es' ? 'Crear Cuenta' : 'Criar Conta'}</h1>
                            <p className="text-sm text-text-muted dark:text-white/60">{lang === 'es' ? 'Ingresa tus datos para registrarte' : 'Insira seus dados para se registrar'}</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
                                <span className="material-icons-round mr-2">error_outline</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            {/* Nombres y Apellidos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="firstName">{lang === 'es' ? 'Nombres' : 'Nomes'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">person</span>
                                        <input
                                            id="firstName"
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 text-text-main dark:text-white transition-all"
                                            placeholder={lang === 'es' ? 'Ej: Juan' : 'Ex: João'}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="lastName">{lang === 'es' ? 'Apellidos' : 'Sobrenomes'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">person</span>
                                        <input
                                            id="lastName"
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 text-text-main dark:text-white transition-all"
                                            placeholder={lang === 'es' ? 'Ej: Pérez' : 'Ex: Silva'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="email">{lang === 'es' ? 'Correo Electrónico' : 'Correio Eletrônico'}</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">email</span>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 text-text-main dark:text-white transition-all"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="password">{lang === 'es' ? 'Contraseña' : 'Senha'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">lock</span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 text-text-main dark:text-white transition-all"
                                            placeholder="******"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors"
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
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="confirmPassword">{lang === 'es' ? 'Confirmar' : 'Confirmar'}</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">lock_clock</span>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 text-text-main dark:text-white transition-all"
                                            placeholder="******"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors"
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
                                className="mt-4 py-3.5 w-full text-center font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 bg-secondary text-white hover:bg-secondary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {lang === 'es' ? 'Creando cuenta...' : 'Criando conta...'}
                                    </>
                                ) : (
                                    <>
                                        {lang === 'es' ? 'Registrarse' : 'Registrar-se'}
                                        <span className="material-icons-round text-[18px]">person_add</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-text-muted dark:text-white/60">
                            {lang === 'es' ? '¿Ya tienes una cuenta? ' : 'Já tem uma conta? '}
                            <Link href={`/${lang}/login`} className="font-bold text-primary hover:underline">
                                {lang === 'es' ? 'Inicia Sesión aquí' : 'Faça login aqui'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
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
