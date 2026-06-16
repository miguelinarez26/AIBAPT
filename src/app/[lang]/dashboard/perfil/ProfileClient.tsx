"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Profile } from "@/types/database";
import { MembershipBadge } from "@/components/dashboard/MembershipBadge";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/i18n/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface ProfileClientProps {
  profile: Profile | null;
  lang: 'es' | 'pt';
}

type Tab = 'personal' | 'profesional' | 'security';

export default function ProfileClient({ profile: initialProfile, lang }: ProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Deep Linking: Detectar pestaña desde la URL
  const initialTab = (searchParams.get('tab') as Tab) || 'personal';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(initialProfile);

  // Estados del Formulario
  const [firstName, setFirstName] = useState(initialProfile?.first_name || '');
  const [lastName, setLastName] = useState(initialProfile?.last_name || '');
  const [phone, setPhone] = useState((initialProfile as any)?.phone || '');
  const [bio, setBio] = useState((initialProfile as any)?.bio || '');
  const [isPublic, setIsPublic] = useState((initialProfile as any)?.is_public ?? false);
  const [avatarUrl, setAvatarUrl] = useState((initialProfile as any)?.avatar_url || '');
  const [cvUrl, setCvUrl] = useState((initialProfile as any)?.cv_url || '');
  const [languagePreference, setLanguagePreference] = useState(initialProfile?.language_preference || lang);

  // Cargar perfil desde el cliente
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push(`/${lang}/login?redirectTo=/${lang}/dashboard/perfil`);
        return;
      }
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data: rawData }) => {
        const data = rawData as any;
        if (!data || !data.first_name?.trim()) {
          router.push(`/${lang}/onboarding`);
          return;
        }
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone((data as any).phone || '');
        setBio((data as any).bio || '');
        setIsPublic((data as any).is_public ?? false);
        setAvatarUrl((data as any).avatar_url || '');
        setCvUrl((data as any).cv_url || '');
        setLanguagePreference(data.language_preference || lang);
      });
    });
  }, []);

  // Estados de Seguridad
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserSupabaseClient();

  const t = translations[lang] as Record<string, string>;
  const isMember = profile?.is_member ?? false;

  const expiryDisplay = profile?.membership_expiry
    ? new Date(profile.membership_expiry).toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : t["dashboard.no_expiry"];

  // Sincronizar pestaña si cambia la URL sin recargar
  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab && (tab === 'personal' || tab === 'profesional' || tab === 'security')) {
      setActiveTab(tab);
    }
  }, [searchParams]);  // --- Lógica de Archivos ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsSaving(true);
    // Unificación: public-assets/avatars/[user_id]/profile.jpg
    const filePath = `avatars/${profile.id}/profile.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('public-assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setErrorMsg(t["profile.error.upload_img"]);
      setIsSaving(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public-assets')
      .getPublicUrl(filePath);

    // Añadir timestamp para evitar cache del navegador al mostrar la nueva imagen
    const finalUrl = `${publicUrl}?t=${Date.now()}`;
    
    setAvatarUrl(filePath); // Guardamos la RUTA RELATIVA en el estado
    await (supabase as any).from('profiles').update({ avatar_url: filePath }).eq('id', profile.id);
    
    // Sincronización Global
    router.refresh();
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsSaving(true);
    // Unificación: private-certifications/cvs/[user_id]/cv.pdf
    // Nota: Forzamos extensión .pdf para consistencia según pedido del usuario
    const filePath = `${profile.id}/cvs/cv.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('private-certifications')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setErrorMsg(t["profile.error.upload_cv"]);
      setIsSaving(false);
      return;
    }

    setCvUrl(filePath);
    await (supabase as any).from('profiles').update({ cv_url: filePath }).eq('id', profile.id);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setErrorMsg(null);

    const { error } = await (supabase as any)
      .from('profiles')
      .update({ 
        first_name: firstName, 
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        phone,
        bio,
        is_public: isPublic,
        language_preference: languagePreference
      })
      .eq('id', profile.id);

    setIsSaving(false);
    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setErrorMsg(error.message);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMsg(t["profile.security.error.mismatch"]);
      return;
    }

    setIsChangingPass(true);
    setErrorMsg(null);

    // 1. Verificar contraseña actual intentando login
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: profile?.email || '',
      password: currentPassword
    });

    if (authError) {
      setErrorMsg(t["profile.security.error.wrong_password"]);
      setIsChangingPass(false);
      return;
    }

    // 2. Si el login fue exitoso, proceder con la actualización
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setIsChangingPass(false);

    if (updateError) {
      setErrorMsg(updateError.message);
    } else {
      setShowSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <main className="pt-8 md:pt-12 min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Organic Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10 pointer-events-none"></div>

      {/* Header Banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row justify-between items-start text-text-light dark:text-white relative z-10">
        <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">
              {firstName} <span className="font-light italic text-primary">{lastName}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
               <MembershipBadge isMember={isMember} lang={lang} />
               <span className="text-text-dark dark:text-gray-400 text-sm flex items-center gap-1 font-medium bg-gray-50/50 dark:bg-white/5 px-4 py-2 rounded-full border border-secondary/20 shadow-sm">
                 <span className="material-icons-round text-[16px] text-primary">email</span>
                 {profile?.email}
               </span>
            </div>
        </div>
        <Link
          href={`/${lang}/dashboard`}
          className="mt-6 md:mt-0 px-6 py-3 bg-white dark:bg-surface-dark border border-secondary/20 rounded-full font-bold text-sm text-text-light dark:text-white hover:text-primary transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-2 group"
        >
          <span className="material-icons-round text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          {t["profile.back"] || "Volver al Dashboard"}
        </Link>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navegación de Pestañas */}
          <div className="lg:col-span-1">
            <nav className="flex flex-col gap-2 p-3 bg-white dark:bg-surface-dark rounded-[32px] border border-secondary/20 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <button 
                onClick={() => { setActiveTab('personal'); router.push(`/${lang}/dashboard/perfil?tab=personal`); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-[20px] font-bold text-sm transition-all ${activeTab === 'personal' ? 'bg-primary text-white shadow-md' : 'text-text-dark dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary'}`}
              >
                <span className="material-icons-round">person</span>
                {t["dashboard.personal_data"]}
              </button>
              <button 
                onClick={() => { setActiveTab('profesional'); router.push(`/${lang}/dashboard/perfil?tab=profesional`); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-[20px] font-bold text-sm transition-all ${activeTab === 'profesional' ? 'bg-primary text-white shadow-md' : 'text-text-dark dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary'}`}
              >
                <span className="material-icons-round">contact_page</span>
                {t["dashboard.cv_directory"]}
              </button>
              <button 
                onClick={() => { setActiveTab('security'); router.push(`/${lang}/dashboard/perfil?tab=security`); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-[20px] font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md' : 'text-text-dark dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary'}`}
              >
                <span className="material-icons-round">security</span>
                {t["profile.security.title"]}
              </button>
            </nav>

            {/* Banner de Matrícula (Prominente pero Ineditable) */}
            <div className={`mt-6 p-6 ${profile?.member_number ? 'bg-primary shadow-[0_8px_30px_rgba(90,153,84,0.2)] border-primary/20' : 'bg-accent shadow-[0_8px_30px_rgba(217,88,88,0.2)] border-white/20'} text-white rounded-[32px] border relative overflow-hidden group`}>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-8xl">verified</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 block mb-2">{t["profile.membership.title"]}</span>
              <div className="text-2xl font-black font-display tracking-tight leading-none mb-4">
                {profile?.member_number || t["profile.membership.pending"]}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold bg-white/10 p-2 rounded-lg">
                <span className="material-icons-round text-sm">lock</span>
                {t["profile.membership.immutable"]}
              </div>
            </div>
          </div>

          {/* Contenido Dinámico */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-surface-dark border border-secondary/20 dark:border-gray-800 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500"
                >
                  <div className="p-8 space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons-round text-primary">person</span>
                      <h3 className="font-bold font-serif text-xl text-text-light dark:text-white">{t["dashboard.personal_data"]}</h3>
                    </div>

                    {/* Cargador de Avatar Integrado en Tab Personal */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-primary/5 dark:bg-white/5 rounded-2xl border border-primary/10">
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-3xl overflow-hidden bg-primary/10 border-4 border-white dark:border-gray-800 shadow-lg relative">
                          {avatarUrl ? (
                            <Image 
                              src={avatarUrl.startsWith('http') ? avatarUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${avatarUrl}${avatarUrl.includes('?') ? '' : `?t=${Date.now()}`}`} 
                              alt="Avatar" 
                              width={112} 
                              height={112} 
                              className="object-cover w-full h-full" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-primary">
                              {firstName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {isSaving && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                              <span className="material-icons-round animate-spin text-white">loop</span>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
                        >
                          <span className="material-icons-round text-lg">photo_camera</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="font-bold text-text-main dark:text-white mb-1">{t["profile.avatar.title"]}</h4>
                        <p className="text-xs text-text-muted dark:text-gray-400 mb-4">
                          {t["profile.avatar.desc"]}
                        </p>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-bold text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {t["profile.avatar.change"]}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.fields.names"]}</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.fields.lastnames"]}</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.fields.phone"]}</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+123456789" className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.lang_pref"]}</label>
                        <select 
                          value={languagePreference} 
                          onChange={(e) => setLanguagePreference(e.target.value as 'es' | 'pt')} 
                          className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        >
                          <option value="es">Español</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-6 flex justify-end mt-auto border-t border-secondary/10 dark:border-gray-800">
                    <button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-secondary text-white font-bold px-8 py-3 rounded-full shadow-[0_8px_20px_rgba(90,153,84,0.3)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 group/btn">
                      {t["profile.save"]}
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                        {isSaving ? <span className="material-icons-round animate-spin text-[18px]">loop</span> : <span className="material-icons-round text-[18px]">save</span>}
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profesional' && (
                <motion.div 
                  key="profesional"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-surface-dark border border-secondary/20 dark:border-gray-800 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500"
                >
                  <div className="p-8 space-y-6">
                      <div className="flex items-center gap-2">
                        <span className="material-icons-round text-primary">contact_page</span>
                        <h3 className="font-bold font-serif text-xl text-text-light dark:text-white">{t["dashboard.cv_directory"]}</h3>
                      </div>

                    {/* Información de Visibilidad (Obligatoria para Socios) */}
                    {isMember && (
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                          <span className="material-icons-round text-xl">visibility</span>
                        </div>
                        <p className="text-xs text-text-muted dark:text-gray-400 leading-relaxed">
                          {t["profile.public_notice"]}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.bio.label"]}</label>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none resize-none transition-all" placeholder={t["profile.bio.placeholder"]} />
                    </div>

                    {/* CV Upload */}
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <span className="material-icons-round text-2xl">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Curriculum Vitae (CV)</p>
                          <p className="text-[11px] text-text-muted">{cvUrl ? t["profile.cv.status.loaded"] : t["profile.cv.status.empty"]}</p>
                        </div>
                      </div>
                      <button onClick={() => cvInputRef.current?.click()} className="w-full md:w-auto bg-white dark:bg-white/10 text-primary font-bold px-6 py-2 rounded-xl text-xs border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                        {cvUrl ? t["profile.cv.btn.update"] : t["profile.cv.btn.upload"]}
                      </button>
                      <input type="file" ref={cvInputRef} onChange={handleCVUpload} accept=".pdf,.doc,.docx" className="hidden" />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-6 flex justify-end mt-auto border-t border-secondary/10 dark:border-gray-800">
                    <button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-secondary text-white font-bold px-8 py-3 rounded-full shadow-[0_8px_20px_rgba(90,153,84,0.3)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 group/btn">
                      {t["profile.save"]}
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                        {isSaving ? <span className="material-icons-round animate-spin text-[18px]">loop</span> : <span className="material-icons-round text-[18px]">save</span>}
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-surface-dark border border-secondary/20 dark:border-gray-800 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500"
                >
                  <form onSubmit={handlePasswordChange} className="flex flex-col h-full">
                    <div className="p-8 space-y-8 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons-round text-primary">security</span>
                        <h3 className="font-bold font-serif text-xl text-text-light dark:text-white">{t["profile.security.title"]}</h3>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.security.current_password"]}</label>
                          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.security.new_password"]}</label>
                          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.security.confirm_password"]}</label>
                          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" required />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 p-6 flex justify-end mt-auto border-t border-secondary/10 dark:border-gray-800">
                      <button type="submit" disabled={isChangingPass} className="bg-primary hover:bg-secondary text-white font-bold px-8 py-3 rounded-full shadow-[0_8px_20px_rgba(90,153,84,0.3)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 group/btn">
                        {t["profile.security.update_btn"]}
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                          {isChangingPass ? <span className="material-icons-round animate-spin text-[18px]">loop</span> : <span className="material-icons-round text-[18px]">update</span>}
                        </div>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensajes Globales */}
            <AnimatePresence mode="wait">
              {showSuccess && (
                <motion.div 
                  key="success-msg"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                  className="mt-4 p-4 bg-aibapt-green text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg"
                >
                  <span className="material-icons-round">check_circle</span>
                  {activeTab === 'security' ? t["profile.security.success"] : t["profile.success.saved"]}
                </motion.div>
              )}
              {errorMsg && (
                <motion.div 
                  key="error-msg"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                  className="mt-4 p-4 bg-red-500 text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg"
                >
                  <span className="material-icons-round">error</span>
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
