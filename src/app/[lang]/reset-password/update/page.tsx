"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Loader2, Lock, CheckCircle } from "lucide-react";

function ResetUpdateContent() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const supabase = createBrowserSupabaseClient();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError(lang === 'es' ? 'Las contraseñas no coinciden' : 'As senhas não coincidem');
            return;
        }

        setLoading(true);
        setError("");

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push(`/${lang}/login`);
            }, 3000);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl shadow-xl p-8 md:p-10 relative z-10 border border-accent/20 dark:border-gray-800">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black font-display text-secondary dark:text-white mb-2">{t("auth.reset_new_title")}</h1>
                    <p className="text-sm text-text-muted dark:text-white/60">{t("auth.reset_new_desc")}</p>
                </div>

                {success ? (
                    <div className="text-center space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <p className="text-sm text-text-main dark:text-white font-medium">
                            {lang === 'es' ? 'Contraseña actualizada. Redirigiendo al login...' : 'Senha atualizada. Redirecionando para o login...'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                                <span className="material-icons-round text-lg">error_outline</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="password">
                                {lang === 'es' ? 'Nueva Contraseña' : 'Nova Senha'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white transition-all"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-white/60" htmlFor="confirm">
                                {lang === 'es' ? 'Confirmar Nueva Contraseña' : 'Confirmar Nova Senha'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                <input
                                    id="confirm"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-accent/50 dark:border-gray-700 bg-white/50 dark:bg-surface-dark pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white transition-all"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("auth.reset_new_btn")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetUpdatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-accent/10 dark:bg-background-dark">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <ResetUpdateContent />
        </Suspense>
    );
}
