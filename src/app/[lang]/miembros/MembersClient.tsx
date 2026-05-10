"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, User, BadgeCheck, X, FileText, ExternalLink, Loader2, Award } from "lucide-react";
import { Profile } from "@/types/database";
import { translations } from "@/i18n/translations";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface MembersClientProps {
  initialMembers: Profile[];
  lang: 'es' | 'pt';
}

export default function MembersClient({ initialMembers, lang }: MembersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingCV, setLoadingCV] = useState(false);
  
  const t = translations[lang];

  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      const memberNumber = (member.member_number || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || memberNumber.includes(search);
    });
  }, [initialMembers, searchTerm]);

  const getAvatarUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${path}`;
  };

  const getMembershipLabel = (type: string | null) => {
    if (!type) return lang === 'es' ? 'Miembro' : 'Membro';
    const labels: Record<string, Record<'es' | 'pt', string>> = {
      'pleno_salud_mental': { es: 'Pleno (Salud Mental)', pt: 'Pleno (Saúde Mental)' },
      'pleno_agente_social': { es: 'Pleno (Agente Social)', pt: 'Pleno (Agente Social)' },
      'institucional': { es: 'Institucional', pt: 'Institucional' },
      'bienhechor': { es: 'Bienhechor', pt: 'Benfeitor' },
      'simpatizante': { es: 'Simpatizante', pt: 'Simpatizante' },
    };
    return labels[type]?.[lang] || type.replace(/_/g, ' ');
  };

  const handleOpenDrawer = async (member: Profile) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
    setLoadingProfile(true);

    // Fetch rápido para obtener bio actualizada y otros campos
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', member.id)
      .single();

    if (data && !error) {
      setSelectedMember(data);
    }
    setLoadingProfile(false);
  };

  const handleViewCV = async () => {
    if (!selectedMember?.cv_url) return;
    setLoadingCV(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.storage
        .from('public-assets')
        .createSignedUrl(selectedMember.cv_url, 300);
      
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (err) {
      console.error("Error al obtener CV:", err);
    } finally {
      setLoadingCV(false);
    }
  };

  // Cerrar con Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="space-y-8 relative">
      {/* Buscador */}
      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder={t["members.search"]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main dark:text-white"
        />
      </div>

      {/* Listado Oficial de Miembros (Tabla) */}
      <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-accent/10 overflow-hidden">
        {filteredMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-accent/10">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    {/* @ts-ignore */}
                    {t["members.table.photo"]}
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    {/* @ts-ignore */}
                    {t["members.table.name"]}
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-center">
                    {/* @ts-ignore */}
                    {t["members.table.id"]}
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hidden md:table-cell">
                    {/* @ts-ignore */}
                    {t["members.table.category"]}
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">
                    {/* @ts-ignore */}
                    {t["members.table.action"]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence mode="popLayout">
                  {filteredMembers.map((member, idx) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                      className="hover:bg-primary/[0.03] transition-colors group cursor-default"
                    >
                      {/* Foto */}
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-accent/20 shrink-0 relative">
                          {member.avatar_url ? (
                            <Image
                              src={getAvatarUrl(member.avatar_url)!}
                              alt={`${member.first_name} ${member.last_name}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">
                              {member.first_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nombre */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-[10px] text-text-muted md:hidden">
                            {getMembershipLabel(member.membership_type)}
                          </span>
                        </div>
                      </td>

                      {/* Matrícula */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-text-main dark:text-gray-300 text-[10px] font-black tracking-widest uppercase border border-transparent group-hover:border-primary/20 group-hover:text-primary transition-all">
                          <BadgeCheck className="w-3 h-3 text-primary" />
                          {member.member_number || 'PEND.'}
                        </span>
                      </td>

                      {/* Categoría */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs font-bold text-text-muted dark:text-gray-400 uppercase tracking-tight">
                          {getMembershipLabel(member.membership_type)}
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="px-6 py-4 text-right">
                        {member.member_number ? (
                          <button 
                            onClick={() => handleOpenDrawer(member)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary hover:text-white rounded-xl transition-all"
                          >
                            {/* @ts-ignore */}
                            {t["members.table.action"]}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-text-muted italic uppercase tracking-widest px-4">
                            {lang === 'es' ? 'Pendiente' : 'Pendente'}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-surface-dark">
            <User className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-10" />
            <h4 className="text-xl font-bold text-text-main dark:text-white">{t["members.no_results"]}</h4>
            <p className="text-text-muted dark:text-gray-400 text-sm">{t["members.no_results_desc"]}</p>
          </div>
        )}
      </div>

      {/* Drawer (Panel Lateral) */}
      <AnimatePresence>
        {isDrawerOpen && selectedMember && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-all"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/3 bg-white dark:bg-surface-dark z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                {/* Close Button */}
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-muted"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Header Profile */}
                <div className="flex flex-col items-center text-center space-y-4 pt-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-accent/10 relative">
                    {selectedMember.avatar_url ? (
                      <Image 
                        src={getAvatarUrl(selectedMember.avatar_url)!} 
                        alt={selectedMember.first_name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                        {selectedMember.first_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-text-main dark:text-white tracking-tight">
                      {selectedMember.first_name} {selectedMember.last_name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {/* @ts-ignore */}
                        {t["members.drawer.official_id"]}: {selectedMember.member_number}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-accent/10 w-full" />

                {/* Info Sections */}
                <div className="space-y-8">
                  {/* Bio */}
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
                      <span className="w-4 h-px bg-primary"></span>
                      {/* @ts-ignore */}
                      {t["members.drawer.professional_summary"]}
                    </h4>
                    {loadingProfile ? (
                      <div className="flex items-center gap-3 text-text-muted py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Cargando perfil...</span>
                      </div>
                    ) : (
                      <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed font-medium">
                        {selectedMember.bio || t["members.profile.info_updating"]}
                      </p>
                    )}
                  </section>

                  {/* Category */}
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">
                      {/* @ts-ignore */}
                      {t["members.table.category"]}
                    </h4>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-accent/10 text-xs font-bold text-secondary dark:text-white">
                      <Award className="w-4 h-4 text-primary" />
                      {getMembershipLabel(selectedMember.membership_type)}
                    </div>
                  </section>

                  {/* CV Action */}
                  <section className="pt-4">
                    {selectedMember.cv_url ? (
                      <button 
                        onClick={handleViewCV}
                        disabled={loadingCV}
                        className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                        {loadingCV ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                        {/* @ts-ignore */}
                        {t["members.drawer.view_cv"]}
                      </button>
                    ) : (
                      <div className="p-6 rounded-2xl border border-dashed border-accent/30 text-center text-text-muted">
                        <p className="text-xs font-bold uppercase tracking-widest">
                          {/* @ts-ignore */}
                          {t["members.drawer.no_cv"]}
                        </p>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] py-4">
        <span className="w-8 h-px bg-accent/20"></span>
        Registro Oficial AIBAPT {new Date().getFullYear()}
        <span className="w-8 h-px bg-accent/20"></span>
      </div>
    </div>
  );
}
