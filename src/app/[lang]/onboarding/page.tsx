"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { session } = useAuth();
  const { lang, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    
    // Explicit Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError(lang === "es" ? "Por favor, completa tus nombres y apellidos para continuar." : "Por favor, preencha seus nomes e sobrenomes para continuar.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const supabase = createBrowserSupabaseClient();
      
      const { error: updateError } = await (supabase as any)
        .from("profiles")
        .upsert({
          id: session.user.id,
          email: session.user.email,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          language_preference: lang,
          role: "member"
        });

      if (updateError) throw updateError;
      
      // Success, redirect to dashboard
      router.push(`/${lang}/dashboard`);
      router.refresh();
      
    } catch (err: any) {
      console.error("Error creating profile:", err);
      setError(err.message || "Error al crear el perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-background-light dark:bg-background-dark p-6 pt-8 md:pt-12 relative overflow-hidden">
      {/* Organic Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 -z-10"></div>

      <div className="bg-white dark:bg-surface-dark p-10 md:p-12 rounded-[32px] shadow-2xl shadow-secondary/10 max-w-md w-full relative z-10 border border-secondary/25 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            <span className="material-icons-round text-3xl">person_add</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-text-light dark:text-white mb-2">
            {lang === "es" ? "Completa tu Perfil" : "Complete seu Perfil"}
          </h1>
          <p className="text-sm text-text-dark dark:text-white/60">
            {lang === "es" 
              ? "Para brindarte la mejor experiencia, necesitamos conocer tu nombre." 
              : "Para oferecer a melhor experiência, precisamos saber o seu nome."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text-light dark:text-white mb-2 pl-1">
                {lang === "es" ? "Nombres" : "Nomes"}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError(null); }}
                className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40"
                placeholder={lang === "es" ? "Ej. Juan" : "Ex. João"}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-light dark:text-white mb-2 pl-1">
                {lang === "es" ? "Apellidos" : "Sobrenomes"}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setError(null); }}
                className="w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-dark px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-light dark:text-white transition-all placeholder:text-text-dark/40"
                placeholder={lang === "es" ? "Ej. Pérez" : "Ex. Silva"}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50">
              <span className="material-icons-round mr-2">error_outline</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group/btn relative inline-flex items-center justify-center bg-primary hover:bg-secondary text-white py-4 w-full rounded-full font-bold text-base transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
          >
            <span className="leading-none">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  lang === "es" ? "Comenzar" : "Começar"
                )}
            </span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1 shrink-0">
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
