"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiX } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import { assetPath } from "@/lib/assets";

interface SubComite {
    id: string;
    rol: string;
    lider: string;
    img?: string;
    email?: string;
    desc?: string;
}

interface Directivo {
    cargo: string;
    nombre: string;
    email?: string;
    img?: string;
    desc: string;
    color: "primary" | "accent";
    comites?: SubComite[];
}

const DIRECTIVA_DATA_ES: Directivo[] = [
    {
        cargo: "Asamblea General",
        nombre: "Órgano Supremo",
        email: "secretaria@aibapt.org",
        img: "/images/aibapt_logo_transparent_seal.png",
        desc: "Integrada por todos los miembros activos de la asociación.",
        color: "accent"
    },
    {
        cargo: "Comisión de Garantías",
        nombre: "Comité de Ética",
        email: "secretaria@aibapt.org",
        desc: "Vela por el cumplimiento estatutario y ético.",
        color: "accent"
    },
    {
        cargo: "Presidente",
        nombre: "Elizabeth Maio",
        email: "presidencia@aibapt.org",
        img: "/images/elizabeth.jpg",
        desc: "Liderazgo global y representación institucional de AIBAPT.",
        color: "primary"
    },
    {
        cargo: "Vice Presidente Académico",
        nombre: "Cristina Melo",
        img: "/images/cristina.jpg",
        desc: "Dirección científica y estándares de formación académica.",
        comites: [
            { id: "ca", rol: "Comité de Apoyo Académico", lider: "Glenda Villamarín", img: "/images/webinar_placeholder.png" },
            { id: "cc", rol: "Comité de Certificación", lider: "María Inés Mesquita / Ivete Rizzato", email: "certificacao@aibapt.org" },
            { id: "ce", rol: "Comité de Certificación Esp", lider: "María Eugenia Francis / Rosaura Boada", email: "certificacion@aibapt.org" }
        ],
        color: "primary"
    },
    {
        cargo: "VP Relaciones Internacionales",
        nombre: "Deglya Camero",
        email: "deglya@aibapt.org",
        img: "/images/deglya.jpg",
        desc: "Coordinación de alianzas globales y gestión humanitaria.",
        comites: [
            { id: "cm", rol: "Comunicación y Marketing", lider: "Equipos RRSS, Web y Miembros", email: "comunicacion@aibapt.org" },
            { id: "ah", rol: "Ayuda Humanitaria", lider: "Olivar E. Ribeiro / Daniel Gabarra", desc: "Gestión de proyectos sociales." },
            { id: "ap", rol: "Atención a Paraprofesionales", lider: "María Alejandra Pérez" }
        ],
        color: "primary"
    },
    {
        cargo: "Secretaria",
        nombre: "Neide Zucoli",
        email: "secretaria@aibapt.org",
        img: "/images/secrvetaria.jpg",
        desc: "Gestión documental, actas, comunicación oficial y supervisión del registro de miembros activos.",
        comites: [
            { id: "as", rol: "Apoyo a Secretaría", lider: "Anacelia Fornes" },
            { id: "cm2", rol: "Comité de Miembros", lider: "Eduarda P. / Pedro Bregola", email: "miembroes@aibapt.org" },
            { id: "er", rol: "Gestión Miembros", lider: "Erika Rojas" }
        ],
        color: "primary"
    },
    {
        cargo: "Tesorero",
        nombre: "Mario Salvador",
        email: "financiero@aibapt.org",
        img: "/images/mario.jpg",
        desc: "Administración financiera y sostenibilidad de la asociación.",
        comites: [
            { id: "cf", rol: "Comité Financiero", lider: "Roseane Ferreira", email: "financeiro@aibapt.org" }
        ],
        color: "primary"
    }
];

const DIRECTIVA_DATA_PT: Directivo[] = [
    {
        cargo: "Assembleia Geral",
        nombre: "Órgão Supremo",
        email: "secretaria@aibapt.org",
        img: "/images/aibapt_logo_transparent_seal.png",
        desc: "Integrada por todos os membros ativos da associação.",
        color: "accent"
    },
    {
        cargo: "Comissão de Garantias",
        nombre: "Comitê de Ética",
        email: "secretaria@aibapt.org",
        desc: "Vela pelo cumprimento estatutário e ético.",
        color: "accent"
    },
    {
        cargo: "Presidente",
        nombre: "Elizabeth Maio",
        email: "presidencia@aibapt.org",
        img: "/images/elizabeth.jpg",
        desc: "Liderança global e representação institucional da AIBAPT.",
        color: "primary"
    },
    {
        cargo: "Vice-Presidente Acadêmico",
        nombre: "Cristina Melo",
        img: "/images/cristina.jpg",
        desc: "Direção científica e padrões de formação acadêmica.",
        comites: [
            { id: "ca", rol: "Comitê de Apoio Acadêmico", lider: "Glenda Villamarín", img: "/images/webinar_placeholder.png" },
            { id: "cc", rol: "Comitê de Certificação", lider: "María Inés Mesquita / Ivete Rizzato", email: "certificacao@aibapt.org" },
            { id: "ce", rol: "Comitê de Certificação Esp.", lider: "María Eugenia Francis / Rosaura Boada", email: "certificacion@aibapt.org" }
        ],
        color: "primary"
    },
    {
        cargo: "VP Relações Internacionais",
        nombre: "Deglya Camero",
        email: "deglya@aibapt.org",
        img: "/images/deglya.jpg",
        desc: "Coordenação de alianças globais e gestão humanitária.",
        comites: [
            { id: "cm", rol: "Comunicação e Marketing", lider: "Equipes RRSS, Web y Miembros", email: "comunicacion@aibapt.org" },
            { id: "ah", rol: "Ajuda Humanitária", lider: "Olivar E. Ribeiro / Daniel Gabarra", desc: "Gestão de projetos sociais." },
            { id: "ap", rol: "Atenção a Paraprofissionais", lider: "María Alejandra Pérez" }
        ],
        color: "primary"
    },
    {
        cargo: "Secretaria",
        nombre: "Neide Zucoli",
        email: "secretaria@aibapt.org",
        img: "/images/secrvetaria.jpg",
        desc: "Gestão documental, atas, comunicação oficial e supervisão do registro de membros ativos.",
        comites: [
            { id: "as", rol: "Apoio à Secretaria", lider: "Anacelia Fornes" },
            { id: "cm2", rol: "Comitê de Membros", lider: "Eduarda P. / Pedro Bregola", email: "miembroes@aibapt.org" },
            { id: "er", rol: "Gestão de Membros", lider: "Erika Rojas" }
        ],
        color: "primary"
    },
    {
        cargo: "Tesoureiro",
        nombre: "Mario Salvador",
        email: "financiero@aibapt.org",
        img: "/images/mario.jpg",
        desc: "Administração financeira e sustentabilidade da associação.",
        comites: [
            { id: "cf", rol: "Comitê Financeiro", lider: "Roseane Ferreira", email: "financeiro@aibapt.org" }
        ],
        color: "primary"
    }
];

export const FunctionalStructure = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { lang } = useLanguage();

    const data = lang === "pt" ? DIRECTIVA_DATA_PT : DIRECTIVA_DATA_ES;
    const activeMember = activeIndex !== null ? data[activeIndex] : null;

    return (
        <section className="py-24 bg-background-light overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Encabezado */}
                <div className="text-center mb-20">
                    <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">
                        {lang === "pt" ? "Acompanhando a excelência" : "Acompañando la excelencia"}
                    </p>
                    <h2 className="text-4xl md:text-[56px] font-serif text-text-light mb-6 leading-[1.1]">
                        {lang === "pt" ? "Organograma" : "Organigrama"}{" "}
                        <span className="italic font-light text-primary">Funcional</span>
                    </h2>
                </div>

                {/* Portrait Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            onClick={() => setActiveIndex(index)}
                            className="group/card bg-white rounded-[32px] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                        >
                            {/* Panel de color superior */}
                            <div className={`h-40 w-full rounded-t-[32px] flex items-end justify-center ${member.color === "primary" ? "bg-primary" : "bg-accent"}`}>
                                {member.img ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl translate-y-12 shrink-0">
                                        <img
                                            src={assetPath(member.img)}
                                            alt={member.nombre}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl translate-y-12 shrink-0 bg-white">
                                        <img src={assetPath("/images/aibapt_logo_transparent_seal.png")} alt="AIBAPT" className="w-full h-full object-contain p-1" />
                                    </div>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="pt-16 pb-8 px-8 text-center flex flex-col items-center">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${member.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                                    {member.cargo}
                                </span>
                                <h3 className="text-xl font-serif text-text-light mb-3 leading-snug">{member.nombre}</h3>
                                <p className="text-text-dark text-sm leading-relaxed mb-6 line-clamp-3">{member.desc}</p>

                                {/* Indicador de comités */}
                                {member.comites && (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-accent mt-auto">
                                        <span>
                                            {member.comites.length}{" "}
                                            {member.comites.length === 1
                                                ? (lang === "pt" ? "comitê" : "comité")
                                                : (lang === "pt" ? "comitês" : "comités")}
                                        </span>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover/card:translate-x-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal de Detalle */}
            <AnimatePresence>
                {activeMember && (
                    <>
                        {/* Backdrop separado — cubre toda la pantalla */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveIndex(null)}
                            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
                        />

                        {/* Contenedor de posicionamiento — centrado horizontal y vertical */}
                        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="bg-white max-w-xl w-full rounded-[32px] shadow-2xl relative flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
                            >
                                {/* Botón cerrar — siempre visible, fuera del scroll */}
                                <button
                                    onClick={() => setActiveIndex(null)}
                                    className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-gray-400 hover:text-primary transition-colors shadow-sm z-20"
                                >
                                    <FiX />
                                </button>

                                {/* Panel de color superior — fijo, nunca scrollea */}
                                <div className={`h-28 w-full shrink-0 ${activeMember.color === "primary" ? "bg-primary" : "bg-accent"}`} />

                                {/* Foto — margen negativo para solapar el panel, nunca scrollea */}
                                <div className="flex justify-center -mt-10 shrink-0 relative z-10">
                                    {activeMember.img ? (
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                            <img src={assetPath(activeMember.img)} alt={activeMember.nombre} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                                            <img src={assetPath("/images/aibapt_logo_transparent_seal.png")} alt="AIBAPT" className="w-full h-full object-contain p-1" />
                                        </div>
                                    )}
                                </div>

                                {/* Contenido scrolleable — solo esta parte tiene scroll */}
                                <div className="overflow-y-auto flex-1 px-10 pt-4 pb-10 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${activeMember.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                                        {activeMember.cargo}
                                    </span>
                                    <h3 className="text-2xl font-serif text-text-light mb-3 leading-tight">{activeMember.nombre}</h3>
                                    <p className="text-text-dark text-sm leading-relaxed mb-6">{activeMember.desc}</p>

                                    {activeMember.email && (
                                        <a
                                            href={`mailto:${activeMember.email}`}
                                            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-primary/20 transition-all"
                                        >
                                            <FiMail /> {activeMember.email}
                                        </a>
                                    )}

                                    {/* Sub-comités */}
                                    {activeMember.comites && (
                                        <div className="mt-8">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                                                {lang === "pt" ? "Comitês sob sua direção" : "Comités bajo su dirección"}
                                            </p>
                                            <div className="space-y-3">
                                                {activeMember.comites.map((comite, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-1 p-4 rounded-2xl border-2 border-gray-100 hover:border-secondary transition-colors duration-300 text-center">
                                                        <p className="text-[10px] font-bold uppercase text-primary/70">{comite.rol}</p>
                                                        <p className="text-sm font-bold text-text-light">{comite.lider}</p>
                                                        {comite.email && (
                                                            <p className="text-xs text-text-dark">{comite.email}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};
