"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Profile } from "@/types/database";
import { MembershipBadge } from "@/components/dashboard/MembershipBadge";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/i18n/translations";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileClientProps {
  profile: Profile | null;
  lang: 'es' | 'pt';
}

export default function ProfileClient({ profile, lang }: ProfileClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [langPref, setLangPref] = useState<'es' | 'pt'>(profile?.language_preference as 'es' | 'pt' || 'es');
  const router = useRouter();
  const pathname = usePathname();

  const t = translations[lang] as Record<string, string>;
  const isMember = profile?.is_member ?? false;

  // Formatear fecha de vencimiento
  const expiryDisplay = profile?.membership_expiry
    ? new Date(profile.membership_expiry).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : t["dashboard.no_expiry"];

  // Guardar cambios reales en Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    // Crear instancia del browser client con @supabase/ssr
    const supabase = createBrowserSupabaseClient();
    // Forzar cast del cliente para evitar conflicto de inferencia genérica
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id);

    setIsSaving(false);

    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const { setLang } = useLanguage();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'es' | 'pt';
    setLangPref(newLang);
    
    // Usar el LanguageContext como única fuente de verdad
    setLang(newLang);
  };

  return (
    <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark font-sans relative">

      {/* Header */}
      <div className="bg-primary/5 dark:bg-primary/10 pt-12 pb-16 px-6 border-b border-primary/10 dark:border-primary/20">
        <div className="max-w-[1024px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link
              href={`/${lang}/dashboard`}
              className="hidden md:flex items-center justify-center w-12 h-12 bg-white/50 dark:bg-white/10 rounded-full hover:bg-white dark:hover:bg-white/20 transition-colors shadow-sm text-primary"
            >
              <span className="material-icons-round">arrow_back</span>
            </Link>
            <div>
              <Link
                href={`/${lang}/dashboard`}
                className="md:hidden flex items-center gap-1 text-sm font-bold text-primary mb-2"
              >
                <span className="material-icons-round text-[16px]">arrow_back</span>
                {t["profile.back"]}
              </Link>
              <h1 className="text-3xl lg:text-4xl font-display font-medium text-text-main dark:text-white tracking-tight mb-1">
                {t["profile.title"]}
              </h1>
              <p className="text-text-muted dark:text-gray-400 text-sm max-w-lg">
                {t["profile.desc"]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1024px] mx-auto px-4 md:px-6 py-10 relative z-20">

        {/* Estado bloqueado para no socios (solo lectura) */}
        {!isMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white dark:bg-surface-dark border-l-4 border-l-aibapt-gray p-6 rounded-2xl shadow-sm border-t border-r border-b border-accent/50 dark:border-gray-800"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-12 h-12 bg-aibapt-gray/10 rounded-full flex items-center justify-center text-aibapt-gray shrink-0">
                <span className="material-icons-round text-xl">info</span>
              </div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-base mb-1">
                  {t["profile.limited"]}
                </h3>
                <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                  {t["profile.limited_desc"]}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Sidebar con datos de membresía */}
          <aside className="lg:sticky top-28 space-y-4">
            <div className="bg-white dark:bg-surface-dark border border-accent/50 dark:border-gray-800 rounded-2xl p-5">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl font-display font-bold text-primary">
                  {(profile?.full_name || profile?.email || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-text-main dark:text-white text-sm">{profile?.full_name || profile?.email}</p>
                  <p className="text-xs text-text-muted dark:text-gray-400">{profile?.email}</p>
                </div>
                <MembershipBadge isMember={isMember} lang={lang} />
              </div>

              <hr className="border-accent/30 dark:border-gray-700 my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted dark:text-gray-400">{t["dashboard.expiry"]}</span>
                  <span className="font-bold text-text-main dark:text-white text-xs">{expiryDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted dark:text-gray-400">{t["profile.role"]}</span>
                  <span className="font-bold text-text-main dark:text-white text-xs capitalize">{profile?.role || 'member'}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Formulario de edición */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSave} className="bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">

              {/* Indicador de membresía */}
              <div className={`px-6 py-3 border-b flex items-center gap-2 ${
                isMember
                  ? 'bg-aibapt-green/5 border-aibapt-green/20'
                  : 'bg-aibapt-gray/5 border-aibapt-gray/20'
              }`}>
                <span className={`material-icons-round text-[18px] ${isMember ? 'text-aibapt-green' : 'text-aibapt-gray'}`}>
                  {isMember ? 'verified_user' : 'person'}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest ${isMember ? 'text-aibapt-green' : 'text-aibapt-gray'}`}>
                  {isMember
                    ? `${t["profile.active_membership"]} — ${expiryDisplay}`
                    : t["profile.no_membership"]}
                </span>
              </div>

              {/* Campos del formulario */}
              <div className="p-8 space-y-6">
                <h3 className="text-xl font-bold font-display text-text-main dark:text-white mb-6 pb-4 border-b border-accent/30 dark:border-gray-700">
                  {t["profile.basic_info"]}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main dark:text-white">
                      {t["profile.fullname"]}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main dark:text-white">
                      {t["profile.email"]}
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={profile?.email || ''}
                      className="w-full bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-muted cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                {/* Preferencia de Idioma */}
                <div className="space-y-2 mt-6">
                  <label className="text-sm font-bold text-text-main dark:text-white">
                    {t["profile.lang_pref"]}
                  </label>
                  <select
                    value={langPref}
                    onChange={handleLanguageChange}
                    disabled={isSaving}
                    className="w-full bg-white dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                  >
                    <option value="es">Español</option>
                    <option value="pt">Português</option>
                  </select>
                  <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                    {t["profile.lang_desc"]}
                  </p>
                </div>
              </div>

              {/* Footer con botón de guardar */}
              <div className="bg-gray-50 dark:bg-surface-light px-8 py-5 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4 sticky bottom-0 items-center">
                <AnimatePresence>
                  {showSuccess && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-aibapt-green font-bold text-sm flex items-center gap-1 absolute left-8"
                    >
                      <span className="material-icons-round text-[18px]">check_circle</span>
                      {t["profile.updated"]}
                    </motion.span>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={`bg-primary hover:bg-[#689153] text-white font-bold px-8 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isSaving ? (
                    <span className="material-icons-round text-[18px] animate-spin">loop</span>
                  ) : (
                    <span className="material-icons-round text-[18px]">save</span>
                  )}
                  {t["profile.save"]}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
