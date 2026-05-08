"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
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
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const supabase = createBrowserSupabaseClient();
      
      const { error: insertError } = await supabase.from("profiles").insert({
        id: session.user.id,
        email: session.user.email,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        language_preference: lang,
      });

      if (insertError) throw insertError;
      
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
    <div className="min-h-screen flex items-center justify-center bg-accent/5 p-6">
      <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <span className="material-icons-round text-3xl">person_add</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main dark:text-white">
            {lang === "es" ? "Completa tu Perfil" : "Complete seu Perfil"}
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {lang === "es" 
              ? "Para brindarte la mejor experiencia, necesitamos conocer tu nombre." 
              : "Para oferecer a melhor experiência, precisamos saber o seu nome."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                {lang === "es" ? "Nombres" : "Nomes"}
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main dark:text-white"
                placeholder={lang === "es" ? "Ej. Juan" : "Ex. João"}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                {lang === "es" ? "Apellidos" : "Sobrenomes"}
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main dark:text-white"
                placeholder={lang === "es" ? "Ej. Pérez" : "Ex. Silva"}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              lang === "es" ? "Comenzar" : "Começar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
