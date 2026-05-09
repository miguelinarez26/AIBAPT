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

export default function ProfileClient({ profile, lang }: ProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Deep Linking: Detectar pestaña desde la URL
  const initialTab = (searchParams.get('tab') as Tab) || 'personal';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados del Formulario
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState((profile as any)?.phone || '');
  const [bio, setBio] = useState((profile as any)?.bio || '');
  const [isPublic, setIsPublic] = useState((profile as any)?.is_public ?? false);
  const [avatarUrl, setAvatarUrl] = useState((profile as any)?.avatar_url || '');
  const [cvUrl, setCvUrl] = useState((profile as any)?.cv_url || '');
  const [languagePreference, setLanguagePreference] = useState(profile?.language_preference || lang);

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
      setErrorMsg(lang === 'es' ? 'Error subiendo imagen' : 'Erro ao carregar imagem');
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
      setErrorMsg(lang === 'es' ? 'Error subiendo CV' : 'Erro ao carregar CV');
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
    <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark font-sans relative">
      
      {/* Header Estilo Pro (Simplificado) */}
      <div className="bg-primary/5 dark:bg-primary/10 pt-12 pb-16 px-6 border-b border-primary/10 dark:border-primary/20">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-display font-medium text-text-main dark:text-white tracking-tight mb-2">
              {firstName} {lastName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
              <MembershipBadge isMember={isMember} lang={lang} />
              <span className="text-text-muted dark:text-gray-400 text-sm flex items-center gap-1">
                <span className="material-icons-round text-[16px]">email</span>
                {profile?.email}
              </span>
            </div>
          </div>

          <Link
            href={`/${lang}/dashboard`}
            className="px-6 py-2.5 bg-white dark:bg-white/10 rounded-xl font-bold text-sm text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            {t["profile.back"]}
          </Link>
        </div>
      </div>

      <main className="max-w-[1140px] mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navegación de Pestañas */}
          <div className="lg:col-span-3">
            <nav className="flex flex-col gap-2 p-2 bg-white dark:bg-surface-dark rounded-2xl border border-accent/30 dark:border-gray-800 shadow-sm">
              <button 
                onClick={() => { setActiveTab('personal'); router.push(`/${lang}/dashboard/perfil?tab=personal`); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'personal' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-accent/10'}`}
              >
                <span className="material-icons-round">person</span>
                {t["dashboard.personal_data"]}
              </button>
              <button 
                onClick={() => { setActiveTab('profesional'); router.push(`/${lang}/dashboard/perfil?tab=profesional`); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profesional' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-accent/10'}`}
              >
                <span className="material-icons-round">contact_page</span>
                {t["dashboard.cv_directory"]}
              </button>
              <button 
                onClick={() => { setActiveTab('security'); router.push(`/${lang}/dashboard/perfil?tab=security`); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-accent/10'}`}
              >
                <span className="material-icons-round">security</span>
                {t["profile.security.title"]}
              </button>
            </nav>

            {/* Banner de Matrícula (Prominente pero Ineditable) */}
            <div className="mt-6 p-6 bg-secondary text-white rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-8xl">verified</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 block mb-2">{lang === 'es' ? 'Matrícula Profesional' : 'Matrícula Profissional'}</span>
              <div className="text-2xl font-black font-display tracking-tight leading-none mb-4">
                {profile?.member_number || 'PENDIENTE'}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold bg-white/10 p-2 rounded-lg">
                <span className="material-icons-round text-sm">lock</span>
                {lang === 'es' ? 'Identificador Inmutable' : 'Identificador Imutável'}
              </div>
            </div>
          </div>

          {/* Contenido Dinámico */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div className="p-8 space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons-round text-primary">person</span>
                      <h3 className="text-xl font-bold font-display">{t["dashboard.personal_data"]}</h3>
                    </div>

                    {/* Cargador de Avatar Integrado en Tab Personal */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-accent/5 dark:bg-white/5 rounded-2xl border border-accent/10">
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
                        <h4 className="font-bold text-text-main dark:text-white mb-1">{lang === 'es' ? 'Foto de Perfil' : 'Foto de Perfil'}</h4>
                        <p className="text-xs text-text-muted dark:text-gray-400 mb-4">
                          {lang === 'es' ? 'Sube una foto profesional para tu credencial y directorio.' : 'Envie uma foto profissional para sua credencial e diretório.'}
                        </p>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-bold text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {lang === 'es' ? 'Cambiar Imagen' : 'Alterar Imagem'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{lang === 'es' ? 'Nombres' : 'Nomes'}</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{lang === 'es' ? 'Apellidos' : 'Sobrenomes'}</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{lang === 'es' ? 'Teléfono' : 'Telefone'}</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+123456789" className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.lang_pref"]}</label>
                        <select 
                          value={languagePreference} 
                          onChange={(e) => setLanguagePreference(e.target.value as 'es' | 'pt')} 
                          className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="es">Español</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-6 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white font-bold px-10 py-3 rounded-2xl shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2">
                      {isSaving ? <span className="material-icons-round animate-spin">loop</span> : <span className="material-icons-round">save</span>}
                      {t["profile.save"]}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profesional' && (
                <motion.div 
                  key="profesional"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-icons-round text-primary">contact_page</span>
                        <h3 className="text-xl font-bold font-display">{t["dashboard.cv_directory"]}</h3>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-accent/5 px-4 py-2 rounded-xl border border-accent/10">
                        <span className="text-xs font-bold uppercase text-text-muted tracking-widest">{lang === 'es' ? 'Público' : 'Público'}</span>
                        <div 
                          onClick={() => setIsPublic(!isPublic)}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isPublic ? 'bg-aibapt-green' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isPublic ? 'left-6' : 'left-1'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{lang === 'es' ? 'Biografía Profesional' : 'Biografia Profissional'}</label>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none" placeholder={lang === 'es' ? 'Describe tu especialidad...' : 'Descreva sua especialidade...'} />
                    </div>

                    {/* CV Upload */}
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <span className="material-icons-round text-2xl">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Curriculum Vitae (CV)</p>
                          <p className="text-[11px] text-text-muted">{cvUrl ? (lang === 'es' ? 'Tu currículum profesional está cargado.' : 'Seu currículo profissional está carregado.') : (lang === 'es' ? 'Sube tu currículum para completar tu perfil.' : 'Envie seu currículo para completar seu perfil.')}</p>
                        </div>
                      </div>
                      <button onClick={() => cvInputRef.current?.click()} className="w-full md:w-auto bg-white dark:bg-white/10 text-primary font-bold px-6 py-2 rounded-xl text-xs border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                        {cvUrl ? (lang === 'es' ? 'ACTUALIZAR CV' : 'ATUALIZAR CV') : (lang === 'es' ? 'SUBIR CV' : 'ENVIAR CV')}
                      </button>
                      <input type="file" ref={cvInputRef} onChange={handleCVUpload} accept=".pdf,.doc,.docx" className="hidden" />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-6 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white font-bold px-10 py-3 rounded-2xl shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2">
                      {isSaving ? <span className="material-icons-round animate-spin">loop</span> : <span className="material-icons-round">save</span>}
                      {t["profile.save"]}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden"
                >
                  <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-round text-red-500">lock</span>
                      <h3 className="text-xl font-bold font-display">{t["profile.security.title"]}</h3>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.security.current_password"]}</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.security.new_password"]}</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-text-muted tracking-widest">{t["profile.security.confirm_password"]}</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" required />
                      </div>
                    </div>

                    <button type="submit" disabled={isChangingPass} className="bg-secondary text-white font-bold px-10 py-3 rounded-2xl shadow-lg hover:bg-secondary-dark transition-all flex items-center gap-2">
                      {isChangingPass ? <span className="material-icons-round animate-spin">loop</span> : <span className="material-icons-round">update</span>}
                      {t["profile.security.update_btn"]}
                    </button>
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
                  {activeTab === 'security' ? t["profile.security.success"] : (lang === 'es' ? 'Cambios guardados con éxito.' : 'Alterações salvas com sucesso.')}
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
      </main>
    </div>
  );
}
