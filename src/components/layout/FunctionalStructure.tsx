"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiX, FiChevronRight, FiUsers } from "react-icons/fi";

// Definición de Interfaces para evitar errores de tipos
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

const DIRECTIVA_DATA: Directivo[] = [
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

interface ActiveMemberDetail {
    cargo: string;
    nombre: string;
    desc: string;
    img?: string;
    email?: string;
}

export const FunctionalStructure = () => {
    const [activeMember, setActiveMember] = useState<ActiveMemberDetail | null>(null);

    return (
        <section className="py-24 bg-cream/30 dark:bg-bg-dark/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Encabezado */}
                <div className="text-center mb-20">
                    <span className="text-primary italic font-display text-2xl mb-4 block">Acompañando la excelencia</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-secondary dark:text-white mb-6">Organigrama Funcional</h2>
                    <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
                </div>

                {/* Listado de Directivos */}
                <div className="space-y-12">
                    {DIRECTIVA_DATA.map((member, index) => (
                        <div key={index} className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onClick={() => setActiveMember(member)}
                                className="group flex flex-col lg:flex-row items-center gap-8 bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[3rem] border border-accent/20 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer relative z-10"
                            >
                                {/* Imagen Directivo (Asegurando carga local) */}
                                {member.img ? (
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl relative shrink-0">
                                        <img src={member.img} alt={member.nombre} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                                        <FiUsers className="text-5xl" />
                                    </div>
                                )}

                                {/* Datos Directivo */}
                                <div className="flex-1 text-center lg:text-left">
                                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 ${member.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                                        {member.cargo}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">{member.nombre}</h3>
                                    <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl">{member.desc}</p>
                                </div>

                                {/* Botón Interactividad */}
                                <div className="shrink-0 flex items-center gap-4 text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Conocer Equipo <FiChevronRight className="text-2xl" />
                                </div>
                            </motion.div>

                            {/* Subcomités */}
                            {member.comites && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pl-8 md:pl-20 relative z-0">
                                    <div className="hidden lg:block absolute left-10 top-[-80px] bottom-10 w-0.5 bg-primary/20 -z-10"></div>

                                    {member.comites.map((comite, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMember({ ...comite, cargo: "Comité Directivo", nombre: comite.rol, desc: comite.desc || "Equipo de apoyo y gestión funcional." });
                                            }}
                                            className="bg-white/60 dark:bg-surface-light border border-primary/10 hover:border-primary/40 p-6 rounded-3xl hover:shadow-lg transition-all cursor-pointer group"
                                        >
                                            <p className="text-[10px] font-bold uppercase text-primary/70 mb-2">{comite.rol}</p>
                                            <p className="text-base font-bold text-secondary dark:text-white group-hover:text-primary transition-colors">{comite.lider}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Detalle */}
            <AnimatePresence>
                {activeMember && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMember(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-white dark:bg-surface-dark max-w-xl w-full rounded-[3rem] shadow-2xl relative z-[100] overflow-hidden">
                            <div className="p-12 text-center">
                                <button onClick={() => setActiveMember(null)} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary transition-colors"><FiX className="text-2xl" /></button>

                                {activeMember.img && (
                                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary/20 shadow-lg relative">
                                        <img src={activeMember.img} alt={activeMember.nombre} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                    {activeMember.cargo || "Información"}
                                </span>
                                <h3 className="text-3xl font-bold text-secondary dark:text-white mb-6 leading-tight">{activeMember.nombre}</h3>
                                <p className="text-text-muted dark:text-gray-300 text-lg mb-8 leading-relaxed">{activeMember.desc || "Parte vital del equipo de gestión de AIBAPT."}</p>

                                {activeMember.email && (
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Contacto Oficial</p>
                                        <a href={`mailto:${activeMember.email}`} className="flex items-center justify-center gap-3 p-5 bg-primary text-white rounded-2xl font-bold hover:shadow-xl transition-all">
                                            <FiMail className="text-xl" /> {activeMember.email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
