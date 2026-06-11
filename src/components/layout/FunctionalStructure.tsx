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
        <section className="py-24 bg-background-light overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Encabezado */}
                <div className="text-center mb-20">
                    <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">Acompañando la excelencia</p>
                    <h2 className="text-4xl md:text-[56px] font-serif text-text-light mb-6 leading-[1.1]">Organigrama <span className="italic font-light text-primary">Funcional</span></h2>
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
                                className="group/card flex flex-col lg:flex-row items-center gap-8 bg-white p-8 md:p-10 rounded-[32px] border-2 border-accent hover:border-accent-light hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 cursor-pointer relative z-10"
                            >
                                {/* Imagen Directivo (Asegurando carga local) */}
                                {member.img ? (
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl relative shrink-0 transition-colors duration-500">
                                        <img src={member.img} alt={member.nombre} className="w-full h-full object-cover transition-transform group-hover/card:scale-105" />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-50 flex items-center justify-center text-text-light group-hover/card:text-accent shrink-0 transition-all duration-500 group-hover/card:scale-105">
                                        <FiUsers className="text-5xl" />
                                    </div>
                                )}

                                {/* Datos Directivo */}
                                <div className="flex-1 text-center lg:text-left">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 transition-colors duration-500 ${member.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-highlight/50 text-text-light'} group-hover/card:bg-accent/10 group-hover/card:text-accent`}>
                                        {member.cargo}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-serif text-text-light mb-4">{member.nombre}</h3>
                                    <p className="text-text-dark text-[15px] leading-relaxed max-w-2xl">{member.desc}</p>
                                </div>

                                {/* Botón Interactividad */}
                                <div className="shrink-0 flex items-center gap-4 text-accent font-bold opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                                    Conocer Equipo <FiChevronRight className="text-2xl transition-transform group-hover/card:translate-x-1" />
                                </div>
                            </motion.div>

                            {/* Subcomités */}
                            {member.comites && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pl-0 lg:pl-20 relative z-0">

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
                                            className="bg-white border-2 border-gray-100 hover:border-secondary p-6 rounded-[24px] hover:shadow-md transition-all duration-300 cursor-pointer group/comite"
                                        >
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-dark/70 group-hover/comite:text-secondary mb-2 transition-colors">{comite.rol}</p>
                                            <p className="text-[15px] font-medium text-text-light group-hover/comite:text-text-dark transition-colors">{comite.lider}</p>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMember(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-white max-w-xl w-full rounded-[32px] shadow-2xl relative z-[100] overflow-hidden">
                            <div className="p-10 md:p-12 text-center">
                                <button onClick={() => setActiveMember(null)} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-text-dark hover:text-primary transition-colors"><FiX className="text-2xl" /></button>

                                {activeMember.img && (
                                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 border-4 border-white shadow-md relative">
                                        <img src={activeMember.img} alt={activeMember.nombre} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest rounded-full mb-4">
                                    {activeMember.cargo || "Información"}
                                </span>
                                <h3 className="text-3xl font-serif text-text-light mb-4 leading-tight">{activeMember.nombre}</h3>
                                <p className="text-text-dark text-[15px] mb-8 leading-relaxed">{activeMember.desc || "Parte vital del equipo de gestión de AIBAPT."}</p>

                                {activeMember.email && (
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-text-dark/50">Contacto Oficial</p>
                                        <a href={`mailto:${activeMember.email}`} className="group/btn inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-secondary hover:-translate-y-1 transition-all shadow-sm">
                                            <FiMail className="text-lg" /> {activeMember.email}
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
