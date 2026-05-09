"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, User, BadgeCheck, MapPin } from "lucide-react";
import { Profile } from "@/types/database";
import { translations } from "@/i18n/translations";
import { motion, AnimatePresence } from "framer-motion";

interface MembersClientProps {
  initialMembers: Profile[];
  lang: 'es' | 'pt';
}

export default function MembersClient({ initialMembers, lang }: MembersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const t = translations[lang];

  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      const memberNumber = (member.member_number || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || memberNumber.includes(search);
    });
  }, [initialMembers, searchTerm]);

  // Función para resolver la URL del avatar
  const getAvatarUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${path}`;
  };

  // Mapeo de tipos de membresía a etiquetas legibles
  const getMembershipLabel = (type: string | null) => {
    if (!type) return lang === 'es' ? 'Miembro' : 'Membro';
    const labels: Record<string, Record<'es' | 'pt', string>> = {
      'pleno_salud_mental': { es: 'Miembro Pleno (Salud Mental)', pt: 'Membro Pleno (Saúde Mental)' },
      'pleno_agente_social': { es: 'Miembro Pleno (Agente Social)', pt: 'Membro Pleno (Agente Social)' },
      'institucional': { es: 'Miembro Institucional', pt: 'Membro Institucional' },
      'bienhechor': { es: 'Miembro Bienhechor', pt: 'Membro Benfeitor' },
      'simpatizante': { es: 'Miembro Simpatizante', pt: 'Membro Simpatizante' },
    };
    return labels[type]?.[lang] || type.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-12">
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

      {/* Grid de Miembros */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-primary/10 mb-4 border-4 border-accent/10 group-hover:scale-105 transition-transform relative">
                      {member.avatar_url ? (
                        <Image
                          src={getAvatarUrl(member.avatar_url)!}
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-primary">
                          {member.first_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Nombre e Info */}
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-1 line-clamp-1">
                      {member.first_name} {member.last_name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase mb-4 tracking-wider">
                      <BadgeCheck className="w-3 h-3" />
                      {member.member_number || 'MAT. PENDIENTE'}
                    </div>

                    <p className="text-xs font-bold text-text-muted dark:text-gray-400 mb-6 uppercase tracking-widest">
                      {getMembershipLabel(member.membership_type)}
                    </p>

                    <div className="w-full h-px bg-accent/10 mb-6" />

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 text-text-muted dark:text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">Iberoamérica</span>
                        </div>
                        <span className="text-[10px] font-bold text-aibapt-green bg-aibapt-green/10 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                            {lang === 'es' ? 'Verificado' : 'Verificado'}
                        </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-accent/30 dark:border-gray-800">
          <User className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-20" />
          <h4 className="text-xl font-bold text-text-main dark:text-white">{t["members.no_results"]}</h4>
          <p className="text-text-muted dark:text-gray-400">{t["members.no_results_desc"]}</p>
        </div>
      )}
    </div>
  );
}
