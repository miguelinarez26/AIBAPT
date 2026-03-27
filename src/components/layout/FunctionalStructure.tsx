"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { FiArrowUpRight, FiX, FiMail, FiUsers, FiAward } from "react-icons/fi";
import { LangKeys } from "@/i18n/translations";
import elizabeth from "../../../public/images/elizabeth.jpg";
import cristina from "../../../public/images/cristina.jpg";
import mario from "../../../public/images/mario.jpg";
import deglya from "../../../public/images/deglya.jpg";
import neide from "../../../public/images/secrvetaria.jpg";

interface SubTeam {
    name: string;
    members: string[];
}

interface CommitteeDetail {
    nameKey: string;
    descKey: string;
    members?: string[];
    subTeams?: SubTeam[];
    email?: string;
}

interface TeamMember {
    id: string;
    name: string;
    roleKey: string;
    descKey: string;
    image: StaticImageData | string;
    email?: string;
    committees: CommitteeDetail[];
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        id: "elizabeth",
        name: "Elizabeth Maio",
        roleKey: "team.board.pres",
        descKey: "team.board.pres_desc",
        image: elizabeth,
        email: "presidencia@aibapt.org",
        committees: [
            {
                nameKey: "Asamblea General", // Hardcoded as it's a top level
                descKey: "Órgano supremo de gobierno de la asociación enfocado en la toma de decisiones estratégicas.",
                members: []
            },
            {
                nameKey: "team.com.garantias",
                descKey: "team.com.garantias_func",
                members: []
            }
        ]
    },
    {
        id: "cristina",
        name: "Cristina Melo",
        roleKey: "team.board.vp_acad",
        descKey: "team.board.vp_acad_desc",
        image: cristina,
        committees: [
            {
                nameKey: "team.com.apoyo_acad",
                descKey: "team.com.apoyo_acad_func",
                members: ["Glenda Villamarín"]
            },
            {
                nameKey: "team.com.cert",
                descKey: "team.com.cert_func",
                members: ["Maria Inês Mesquita", "Ivete Rizzato", "María Eugenia Francis", "Rosaura Boada"]
            }
        ]
    },
    {
        id: "deglya",
        name: "Deglya Camero",
        roleKey: "team.board.vp",
        descKey: "team.board.vp_desc",
        image: deglya,
        email: "deglya@aibapt.org",
        committees: [
            {
                nameKey: "team.com.mkt",
                descKey: "team.com.mkt_func",
                subTeams: [
                    { name: "Equipo de RRSS", members: ["Francirys Vargas", "Leonardo García"] },
                    { name: "Web Site", members: ["Daniel Gabarra", "Erick Meneses"] },
                    { name: "Equipo Miembros", members: ["Erika Rojas"] }
                ]
            },
            {
                nameKey: "team.com.social",
                descKey: "team.com.social_func",
                subTeams: [
                    { name: "Ayuda Humanitaria", members: ["Olivar E. Ribeiro", "Daniel Gabarra"] },
                    { name: "Atención a Paraprofesionales", members: ["María Alejandra Pérez"] }
                ]
            }
        ]
    },
    {
        id: "neide",
        name: "Neide Zucoli",
        roleKey: "team.board.sec",
        descKey: "team.board.sec_desc",
        image: neide,
        email: "secretaria@aibapt.org",
        committees: [
            {
                nameKey: "team.com.apoyo_sec",
                descKey: "team.com.apoyo_sec_func",
                members: ["Anacelia Fornes"]
            },
            {
                nameKey: "team.com.members",
                descKey: "team.com.members_func",
                members: ["Eduarda Pichioli Da Silveira", "Pedro Bregola", "Erika Rojas"]
            }
        ]
    },
    {
        id: "mario",
        name: "Mario Salvador",
        roleKey: "team.board.tres",
        descKey: "team.board.tres_desc",
        image: mario,
        email: "financiero@aibapt.org",
        committees: [
            {
                nameKey: "team.com.fin",
                descKey: "team.com.fin_func",
                members: ["Roseane Ferreira"]
            }
        ]
    }
];

export const FunctionalStructure = () => {
    const { t } = useLanguage();
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    return (
        <section className="py-24 bg-cream dark:bg-background-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary dark:text-white font-serif italic text-xl mb-2 block">{t("team.badge" as LangKeys)}</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-secondary dark:text-white mb-6">
                        {t("team.title" as LangKeys)}
                    </h2>
                    <p className="text-xl text-primary font-medium mb-4">{t("team.period" as LangKeys)}</p>
                    <p className="text-text-main dark:text-white/80">
                        {t("team.desc" as LangKeys)}
                    </p>
                </div>

                {/* Junta Directiva Grid */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-0.5 w-12 bg-primary"></div>
                        <h3 className="text-3xl font-serif font-bold text-secondary dark:text-white">{t("team.board" as LangKeys)}</h3>
                        <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-800"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {TEAM_MEMBERS.map((member, index) => (
                            <motion.div
                                key={member.id}
                                layoutId={`member-${member.id}`}
                                onClick={() => setSelectedMember(member)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-[450px] cursor-pointer"
                            >
                                {member.image ? (
                                    <Image
                                        src={member.image as any}
                                        alt={member.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 20vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        <span className="text-6xl text-white opacity-20 font-serif">{member.name[0]}</span>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white font-bold text-lg leading-tight mb-1">{member.name}</p>
                                    <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">
                                        {t(member.roleKey as LangKeys)}
                                    </p>
                                    <div className="flex items-center gap-2 text-white/50 text-xs">
                                        <span className="w-4 h-0.5 bg-primary"></span>
                                        <span>Click para detalles</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de Detalles */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMember(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        
                        <motion.div
                            layoutId={`member-${selectedMember.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                            >
                                <FiX className="text-xl dark:text-white" />
                            </button>

                            {/* Lateral Izquierdo - Imagen y Perfil */}
                            <div className="md:w-1/3 relative h-64 md:h-auto">
                                {selectedMember.image ? (
                                    <Image
                                        src={selectedMember.image as any}
                                        alt={selectedMember.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        <span className="text-8xl text-white opacity-20 font-serif">{selectedMember.name[0]}</span>
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h4 className="text-white text-2xl font-bold font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{selectedMember.name}</h4>
                                    <p className="text-accent font-medium text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t(selectedMember.roleKey as LangKeys)}</p>
                                </div>
                            </div>

                            {/* Contenido Derecho - Detalles */}
                            <div className="md:w-2/3 p-8 sm:p-12 overflow-y-auto">
                                <div className="mb-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiMail className="text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-gray-400">Objetivo del Cargo</span>
                                    </div>
                                    <p className="text-lg text-secondary dark:text-white/90 font-serif leading-relaxed italic">
                                        "{t(selectedMember.descKey as LangKeys)}"
                                    </p>
                                    {selectedMember.email && (
                                        <a href={`mailto:${selectedMember.email}`} className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline">
                                            <FiMail /> {selectedMember.email}
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-2">
                                        <FiUsers className="text-primary" />
                                        <h5 className="font-bold text-secondary dark:text-white uppercase tracking-wider text-sm">Comités y Responsabilidades</h5>
                                    </div>

                                    <div className="grid gap-6">
                                        {selectedMember.committees.map((com, i) => (
                                            <div key={i} className="bg-cream/50 dark:bg-white/5 rounded-2xl p-6 border border-primary/10">
                                                <h6 className="font-bold text-secondary dark:text-white flex items-center gap-2 mb-2">
                                                    <FiAward className="text-primary text-sm" />
                                                    {com.nameKey.startsWith('team.') ? t(com.nameKey as LangKeys) : com.nameKey}
                                                </h6>
                                                <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                                                    {com.descKey.startsWith('team.') ? t(com.descKey as LangKeys) : com.descKey}
                                                </p>
                                                
                                                {com.members && com.members.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {com.members.map((m, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-white dark:bg-surface-dark border border-primary/20 rounded-full text-xs text-secondary dark:text-white">
                                                                {m}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {com.subTeams && (
                                                    <div className="space-y-4">
                                                        {com.subTeams.map((st, idx) => (
                                                            <div key={idx} className="pl-4 border-l-2 border-primary/20">
                                                                <p className="text-xs font-bold text-primary uppercase mb-2">{st.name}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {st.members.map((m, mIdx) => (
                                                                        <span key={mIdx} className="text-xs text-secondary dark:text-gray-300">
                                                                            • {m}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
