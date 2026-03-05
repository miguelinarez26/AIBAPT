"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { LangKeys } from "@/i18n/translations";
import elizabeth from "../../../public/images/elizabeth.jpg";
import cristina from "../../../public/images/cristina.jpg";
import mario from "../../../public/images/mario.jpg";
import deglya from "../../../public/images/Deglya-3 (1).jpg";

const DIRECTIVE_MEMBERS = [
    {
        id: "pres",
        name: "Elizabeth Regina Maio",
        roleKey: "team.board.pres",
        descKey: "team.board.pres_desc",
        image: elizabeth,
    },
    {
        id: "vp",
        name: "Deglya J. Camero Flores",
        roleKey: "team.board.vp",
        descKey: "team.board.vp_desc",
        image: deglya,
    },
    {
        id: "vp_acad",
        name: "Cristina Melo Pérez",
        roleKey: "team.board.vp_acad",
        descKey: "team.board.vp_acad_desc",
        image: cristina,
    },
    {
        id: "tres",
        name: "Mario C. Salvador",
        roleKey: "team.board.tres",
        descKey: "team.board.tres_desc",
        image: mario,
    },
];

const COMMITTEES = [
    {
        id: "sci",
        titleKey: "team.com.sci",
        descKey: "team.com.sci_func",
        icon: "science"
    },
    {
        id: "edu",
        titleKey: "team.com.edu",
        descKey: "team.com.edu_func",
        icon: "school"
    },
    {
        id: "ethics",
        titleKey: "team.com.ethics",
        descKey: "team.com.ethics_func",
        icon: "gavel"
    },
];

export const FunctionalStructure = () => {
    const { t } = useLanguage();

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

                {/* Junta Directiva */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-0.5 w-12 bg-primary"></div>
                        <h3 className="text-3xl font-serif font-bold text-secondary dark:text-white">{t("team.board" as LangKeys)}</h3>
                        <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-800"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {DIRECTIVE_MEMBERS.map((member, index) => (
                            <motion.div
                                key={member.id}
                                id={`member-${member.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-80 lg:h-96"
                            >
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Gradiente inferior por defecto para legibilidad del nombre */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0"></div>

                                {/* Overlay oscuro al hacer hover (con description detallada) */}
                                <div className="absolute inset-0 bg-secondary/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center p-6 sm:p-8 backdrop-blur-sm">
                                    <p className="text-white font-bold text-xl leading-tight mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        {member.name}
                                    </p>
                                    <p className="text-accent text-sm font-bold uppercase tracking-wider mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                        {t(member.roleKey as LangKeys)}
                                    </p>
                                    <div className="w-8 h-0.5 bg-primary mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100"></div>
                                    <p className="text-white/90 text-sm md:text-base leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                        {t(member.descKey as LangKeys)}
                                    </p>
                                </div>

                                {/* Texto Visible por Defecto (Nombre y Rol) */}
                                <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:translate-y-8 group-hover:opacity-0">
                                    <p className="text-white font-bold text-xl leading-tight mb-1 drop-shadow-md">{member.name}</p>
                                    <p className="text-accent text-sm font-medium drop-shadow-md">{t(member.roleKey as LangKeys)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Comités */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-0.5 w-12 bg-primary"></div>
                        <h3 className="text-3xl font-serif font-bold text-secondary dark:text-white">{t("team.com" as LangKeys)}</h3>
                        <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-800"></div>
                    </div>
                    <p className="text-text-muted dark:text-gray-400 mb-8 max-w-2xl">{t("team.com.desc" as LangKeys)}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {COMMITTEES.map((com, index) => (
                            <motion.div
                                key={com.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/50 transition-colors group"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-icons-round text-3xl">{com.icon}</span>
                                </div>
                                <h4 className="font-serif text-xl font-bold text-secondary dark:text-white mb-3">{t(com.titleKey as LangKeys)}</h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-6 flex-1">
                                    {t(com.descKey as LangKeys)}
                                </p>
                                <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    {t("team.com.contact" as LangKeys)} <FiArrowUpRight />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
