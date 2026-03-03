"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { LangKeys } from "@/i18n/translations";

// Simulamos una base de datos local para los slugs
const getCourseData = (slug: string) => {
    const courses = [
        {
            slug: "trauma-webinar-20",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgjkVgvWevbWuIfhq66RugsMp48jK5uMgWRwuCK8Qt3MXPLBMUiLaYtuFSqLAPE01RilmGkTE0AlOvttBbDlTk384J28F_gZ3d6Uh8x2DIPu-3_KuLQFMkmbXrrgVxIH-h7tjzx8sPcqf8KF7PtKRTp_VUIgpr_AzRXdBgdI0VDuhRAN3Ljtyy4QtLckXrsT-AFK90P5zv3JwB3Y5-aomazR8Oo96DwgrNi64-0dinLEiV8y8DZIgXa-mh1gpU09F1TnAb8m23J73u",
            badge: "En Vivo", badgeIcon: "event", badgeStyle: "text-primary bg-primary/10",
            category: "Trauma Complejo",
            title: "Trauma Webinar #20 con Suzana Díaz",
            descLong: "Acompáñanos en este webinar en vivo donde la Dra. Suzana Díaz profundizará en las técnicas más recientes para el abordaje de pacientes con trauma complejo y el impacto neurobiológico de las narrativas en la recuperación.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoOzwVvSo8OtzhSZ9ejd_KbxNBjpnhXQL9-Gw2H5V3FFwwQnXX5UjzfRAvUS4Y4L-dVuJixN9r2RorGMDH_M7mCaG0472485sdJvL6uD8UHUhJU3yWwtRrddQC8XZBo--UiwOn8LQEqAKqx50_Ar7sho3VrEyLybP8kOFAkqUMrTtvc4PegfqwK88cTsfAqjGwtiWMF-jnMkavODzqJe4tCRO5df6KLvWHegIBaYX3qVTvdQr9GQPdgp0rXMwg4Ya3Z8IbsvOgt0C",
            instructorName: "Suzana Díaz",
            instructorBio: "Psicóloga clínica especializada en terapias de avanzada y reprocesamiento del trauma. Miembro certificada AIBAPT y expositora internacional.",
            price: "Gratuito (Registro)",
            duration: "2 Horas (Clínicas)",
            includes: ["Certificado de asistencia", "Material descargable", "Acceso a la grabación por 30 días", "Sesión de Q&A en vivo"],
            isVOD: false,
            extLink: "https://wa.me/5519983961230"
        },
        {
            slug: "psicodrama-clinico",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP97HFwh62_4v6Bq0fSwdZl6HHdZXFQ_MyW9nFrRuWvIMWiAKOJxErx7r2RGwVEeOmbfuwALI8rsk53yaCBSMTpG0X1ca6EiIBxDq7UbboDoLVR7AzKPsr7wOTJv-6mbHujWRGaqKN_WrIAOKWqtieYbtgDgwVlhj0yoy4NkLsOS4R01O19C_yTft4kzy_dijmlbHW8Z58JTsrGCjXa05vsmAGq5L1c90vYJDsJfXyWg1E9HIg9dYT3yvDZTL5jjbz4io2eRPW0Sp7",
            badge: "Presencial", badgeIcon: "location_on", badgeStyle: "text-amber-500 bg-amber-500/10",
            category: "Psicodrama",
            title: "Psicodrama para la Práctica Clínica",
            descLong: "Curso magistral presencial dictado en Brasília. Aprende cómo integrar el Psicodrama en tu consultorio clínico para movilizar emociones, trabajar roles estancados y facilitar el reprocesamiento profundo en pacientes.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZZoN75buPkv39MTVOsuw-fBLszBlKmA9opTeWzIaxy2-7JpViUiVyY5BhKsQwkwHqR5w38bbcIeOtjpZj7t7D6kcuUNMTnaJ1ParB2dhZuZhicFVngsvlZ3UPGlhrxQ6HkBqNBD9Ia7Rx751fo_ZZ2isPFRpi7NNwj5O9nvu8xTrfDPRaJUB7ySaa9U3NljKBolHS6gEMNDgIEZRADPTgjAYnl4_jPmwYUW2nQ0vAxdVEj6x20zloWkEc_V-Zwq7hS7HEOscDQssJ",
            instructorName: "Dra. Esly Carvalho",
            instructorBio: "Doctora en Psicología, pionera del EMDR y Psicodrama en Latinoamérica, autora de múltiples protocolos integrativos.",
            price: "Consultar Cupos",
            duration: "2 Días Intensivos (16 Hrs)",
            includes: ["Créditos de educación continua", "Prácticas supervisadas presenciales", "Material teórico impreso", "Almuerzo y Coffee Break"],
            isVOD: false,
            extLink: "https://www.traumaclinic.com.br/courses/psicodrama"
        },
        {
            slug: "emdr-cuerpo",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOSz3yrAAVIFvEvTU7HtDm-FplkXoOHo6U7hnzW70qijyhQOVMhxr4DkaC5BFJ0zbjHEuVRIIsKrhoS4MxAvCbPenlwVR96Qu5nXwrYvBit6wmwpWQXwR6aaOKJU4ZViiVrWbrvYXAFDQATSgDx7HcJ5aAOmFrjClLM0DdsjJXxEUbScIJTtxs_KykLaRIeUi6NNud7w8Pgnq7frwEhmhXNprL0OQ8NRQGBA3Yv-wUt4ZL8Dr6LJgstZI_nY3fHXYmZ-6qLOy32Z9c",
            badge: "En Vivo", badgeIcon: "event", badgeStyle: "text-primary bg-primary/10",
            category: "Psicoterapia EMDR",
            title: "Formación EMDR con Foco en el Cuerpo",
            descLong: "Vivencia los protocolos corporales avanzados de Silvia Guz. Un encuentro en vivo orientado a dotar al terapeuta de lectura corporal, liberación somática y conexión interoceptiva durante los protocolos de EMDR.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNdL1EvGJ-TP7UjufnWMsgHfxumeFtXyT7V4kS7UI46ruqRQmBEu3Oj0_u9so7ZJqqmNnFa5kft4D7SRqdkbDggEN8FEG2cfZ-lK5OmcpCNZDa0MYE2V8KgHi1fjEbh68HzW0CA9qMiN2A2Zc1_kWTIOch4QDhhrGNAj3zWdzr8pJ0hPanvSZKj6AIeLPDwzPNESXAV7dISaKN8mE2MT7OU5I6AAU4V4wpzaiYr8yDHjJ-AxP5hTMznNu0XYrjR0M4g_mnssaMPYYd",
            instructorName: "Beth Maio & Leo Garcia",
            instructorBio: "Especialistas en somatización y trauma. Entrenadores internacionales dedicados a la conjunción del cuerpo y los abordajes neurobiológicos.",
            price: "Inscripciones Abiertas",
            duration: "8 Horas",
            includes: ["Certificación válida para AIBAPT", "Acceso a la bóveda privada", "Demostraciones de casos en vivo"],
            isVOD: false,
            extLink: "https://wa.me/5519983961230"
        },
        {
            slug: "trauma-webinar-19",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwjFC5Lqrsmp9SkpZJBTVG_JbbrRAFgQ_3cZOFvZTEwTITGSrOiSNtbsvdTaDjq-mPDFM-0iiybDqdMIK2kUl_PHBeQ4k8JvOrv0miSzm5I5wRXjAPZ_UNmlI8Aric3V1sGRGnXPQdumg4ORULY_Ql3BDDqG03F_KQBtqbCbe93GCUcRZ-5Kd6hSenP-XA6nm7Zsv8QiRSDaPl7jNcEa-TNRBwnxFjRVyLPztesJWPiZT3vkgCQuTqyppKaciBZQC_7wSnF3bUvf7c",
            badge: "On-Demand", badgeIcon: "play_circle", badgeStyle: "text-white bg-black/50",
            category: "Trauma Complejo",
            title: "Trauma Webinar #19 | Mirando a través de la Voracidad",
            descLong: "Las adicciones a la comida y los atracones frecuentemente esconden un entramado de traumas. Este seminario web pregrabado detalla el abordaje de trastornos de la conducta alimentaria (TCA) usando terapias de avanzada.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoOzwVvSo8OtzhSZ9ejd_KbxNBjpnhXQL9-Gw2H5V3FFwwQnXX5UjzfRAvUS4Y4L-dVuJixN9r2RorGMDH_M7mCaG0472485sdJvL6uD8UHUhJU3yWwtRrddQC8XZBo--UiwOn8LQEqAKqx50_Ar7sho3VrEyLybP8kOFAkqUMrTtvc4PegfqwK88cTsfAqjGwtiWMF-jnMkavODzqJe4tCRO5df6KLvWHegIBaYX3qVTvdQr9GQPdgp0rXMwg4Ya3Z8IbsvOgt0C",
            instructorName: "Panel de Miembros AIBAPT",
            instructorBio: "Un encuentro panelístico con tres ponentes internacionales y miembros directivos de AIBAPT especialistas en TCA.",
            price: "10 €",
            duration: "1h 45min",
            includes: ["Acceso ilimitado a la bóveda", "Material de presentación (PDF)", "2 Créditos Clínicos (CCA)"],
            extLink: "/formaciones/trauma-webinar-19/buy",
            isVOD: true
        },
        // Webinar 18
        {
            slug: "trauma-webinar-18",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOSz3yrAAVIFvEvTU7HtDm-FplkXoOHo6U7hnzW70qijyhQOVMhxr4DkaC5BFJ0zbjHEuVRIIsKrhoS4MxAvCbPenlwVR96Qu5nXwrYvBit6wmwpWQXwR6aaOKJU4ZViiVrWbrvYXAFDQATSgDx7HcJ5aAOmFrjClLM0DdsjJXxEUbScIJTtxs_KykLaRIeUi6NNud7w8Pgnq7frwEhmhXNprL0OQ8NRQGBA3Yv-wUt4ZL8Dr6LJgstZI_nY3fHXYmZ-6qLOy32Z9c",
            badge: "On-Demand", badgeIcon: "play_circle", badgeStyle: "text-white bg-black/50",
            category: "Trauma Complejo",
            title: "Trauma Webinar #18 | Guion de vida y Trauma Psicológico",
            descLong: "Cómo nuestras narrativas del pasado dictaminan nuestro presente y futuro. En esta grabación clínica revisamos el uso del 'Guion de Vida' post-trauma y cómo los terapeutas pueden ayudar a re-escribir esta narrativa a través de EMDR.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMYXD1XBkPUXnI7W8TK-Falr56QML6_oYvevsXwebVRLM6yM484YbyqQP62PD9-1HELQs-V-7Q1-jz2iy4ROyDofWCFtXmtark3aEyXFYxUWRaaMb-b8rSDe5yEks2qcHgLQYrjZSQfdbnBgkPOErphM9pG-G11gIGy3kIfRUeMCk9wa3IXguNUxHK1gz7FvrBVAIgIi6JCwHkQoxYVBFN5acONzCgDZcx0X6yjuJSB-pVx6ir8zRpOuIKCLsMBRX5I2eaKJA80cf",
            instructorName: "Comité Científico",
            instructorBio: "Comité central encargado de diseminar las técnicas probadas por evidencias en AIBAPT.",
            price: "10 €",
            duration: "2h 10min",
            includes: ["Acceso ilimitado a la bóveda", "Transcripción y diapositivas", "2 Créditos Clínicos (CCA)"],
            extLink: "/formaciones/trauma-webinar-18/buy",
            isVOD: true
        },
        // Webinar 17
        {
            slug: "trauma-webinar-17",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg0CvRIYkg4wPoJolTJNC_Zr1bxk5BqCd5apRpWa9kG7s7SwxjPrL1-hBhzsdjlVhh66bZCjKoNMfKJtrZIqHod5P0f7aHH276s7_hU6gwn-WjS-absUJn2eZVKpMXblST-Uspy2TOfal2AGJNJMKBDRAEYgQqGNKf5NHrdH-sCyoIwhNNGVSQkzJSIED35BFfFIOqmVI0O-AkdDJDbfo2HE_wUdB4VjvFQlwN7r5PEf6IzgCsYH0N0tg67N4Bpqu4u-YEDGf05xER",
            badge: "On-Demand", badgeIcon: "play_circle", badgeStyle: "text-white bg-black/50",
            category: "Psicoterapia EMDR",
            title: "Trauma Webinar #17 | IA para Psicoterapeutas EMDR",
            descLong: "La Inteligencia Artificial no reemplazará al terapeuta, pero puede estructurar la práctica clínica. Este novedoso webinar discute la integración ética, legal y operativa de IA para organizar planes de tratamiento EMDR.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtx3ZYvsza8SXCic3k-NtlmoM0Dpuz9uUrkFYAL5wpxD18NZyQawcnouB8ySDwZHw6qDl_wOzhsvekoEQMS3P94SiBuXtpcSR2hnN7XVfdyRP_T_6C6HrMaMxkE8_511L4PyGz78oeVbcARh5tlDvFFbjG1I7RQ8vXkhhBbI7ZBDSl9kNIrZr1xoXQLbebsU4nLB6tNzzBl14IpOB5noOXJjNLBPp6g_uGB35X6KA_JQL5hupKSc47Ag-otItC-HOV0s70XyJ--Ssj",
            instructorName: "Invitado Especial",
            instructorBio: "Especialista en tecnología y ética clínica aplicada a psicoterapias.",
            price: "10 €",
            duration: "1h 30min",
            includes: ["Acceso de por vida a la grabación", "Plantillas de Prompt para terapeutas", "1.5 Créditos Clínicos (CCA)"],
            extLink: "/formaciones/trauma-webinar-17/buy",
            isVOD: true
        },
        // Webinar 16
        {
            slug: "trauma-webinar-16",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFqVfbqfrxeVaN8arWBYhx92ysovO8ycmOEMqgLHphoqoaZX3YVyN8Iyj1ZQ68Js91JmFxn-SzqGm6Rizp9aLbIrzR_Qi5W95BJ_vTTQBs8fcqQjU5swef1wmJ9_TY_AIsTRbvo5Y2GXI34vl-Nnh0x8rhtUbHnq8MBPuEveAXUUT5D3-7wVp3aE8DmmWg5nX_-jyruUVicPwaf3E7d0JFEJ0gyvmwIL4nwtP9jxWcTEALOBbLPrq36rOShJ373bn90i1QkQ_djCIv",
            badge: "On-Demand", badgeIcon: "play_circle", badgeStyle: "text-white bg-black/50",
            category: "Trauma Infantil",
            title: "Trauma Webinar #16 | El abuso sexual infantil",
            descLong: "Uno de los factores precipitantes de trauma complejo más prevalentes. En este webinar pregrabado, analizamos protocolos específicos de acompañamiento y resiliencia para el sobreviviente infantil y adulto.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoOzwVvSo8OtzhSZ9ejd_KbxNBjpnhXQL9-Gw2H5V3FFwwQnXX5UjzfRAvUS4Y4L-dVuJixN9r2RorGMDH_M7mCaG0472485sdJvL6uD8UHUhJU3yWwtRrddQC8XZBo--UiwOn8LQEqAKqx50_Ar7sho3VrEyLybP8kOFAkqUMrTtvc4PegfqwK88cTsfAqjGwtiWMF-jnMkavODzqJe4tCRO5df6KLvWHegIBaYX3qVTvdQr9GQPdgp0rXMwg4Ya3Z8IbsvOgt0C",
            instructorName: "Especialista Pediátrico",
            instructorBio: "Psicólogo pediatra enfocado en prevención y tratamiento de abuso y disociación temprana.",
            price: "10 €",
            duration: "2h 00min",
            includes: ["Grabación accesible inmediatamente", "Recursos bibliográficos", "2 Créditos Clínicos (CCA)"],
            extLink: "/formaciones/trauma-webinar-16/buy",
            isVOD: true
        }
    ];

    return courses.find((c) => c.slug === slug) || null;
};

export default function CourseDetailPage() {
    const params = useParams();
    const { t } = useLanguage();

    const slug = typeof params?.slug === 'string' ? params.slug : "not-found";
    const course = getCourseData(slug);

    if (!course) {
        return notFound();
    }

    return (
        <div className="pt-20 bg-cream dark:bg-bg-dark min-h-screen">
            {/* HEROBANNER - GLASSMORPHISM */}
            <div className="relative w-full h-[50vh] md:h-[60vh] flex items-end">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={course.img}
                        alt={course.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 pb-12">
                    <Link href="/formaciones" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm">
                        <span className="material-icons-round text-[16px]">arrow_back</span>
                        {t("course.back" as LangKeys)}
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm border border-white/10 ${course.badgeStyle}`}>
                                    <span className="material-icons-round text-[16px]">{course.badgeIcon}</span>
                                    {course.badge}
                                </div>
                                <span className="text-white/80 text-sm font-medium tracking-wide uppercase px-3 py-1 border border-white/20 rounded-full backdrop-blur-md">
                                    {course.category}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white leading-tight mb-4 drop-shadow-lg">
                                {course.title}
                            </h1>

                            <p className="text-lg md:text-xl text-gray-200 font-medium">
                                <span className="material-icons-round text-primary mr-2 align-middle">schedule</span>
                                {t("course.duration" as LangKeys)}: {course.duration}
                            </p>
                        </div>

                        {/* DESKTOP CTA (Sticky equivalent behavior) */}
                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl w-[320px]">
                                <p className="text-white/70 text-sm mb-1 uppercase tracking-wide font-bold">{t("course.price" as LangKeys)}</p>
                                <p className="text-3xl font-bold text-white mb-6">{course.price}</p>
                                <a
                                    href={course.extLink}
                                    target={course.extLink.startsWith("http") ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="w-full bg-primary hover:bg-[#689153] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/50 hover:-translate-y-1"
                                >
                                    <span className="material-icons-round">{course.isVOD ? "shopping_cart" : "how_to_reg"}</span> {course.isVOD ? t("course.buy" as LangKeys) : t("course.enroll" as LangKeys)}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Col: Details & Instructor */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 p-8 md:p-10 rounded-3xl shadow-sm"
                        >
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6 flex items-center gap-3">
                                <span className="material-icons-round text-primary text-3xl">info</span>
                                {t("course.about" as LangKeys)}
                            </h2>
                            <p className="text-lg text-text-muted dark:text-gray-300 leading-relaxed">
                                {course.descLong}
                            </p>
                        </motion.section>

                        {/* Instructor Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-gradient-to-br from-primary/5 via-white dark:from-primary/10 dark:via-surface-dark to-white dark:to-surface-dark border border-accent/20 dark:border-gray-800 p-8 md:p-10 rounded-3xl shadow-sm"
                        >
                            <h2 className="text-lg font-bold text-text-muted dark:text-gray-400 uppercase tracking-wide mb-6">
                                {t("course.instructor" as LangKeys)}
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full border-4 border-white dark:border-gray-700 shadow-md overflow-hidden relative">
                                    <Image fill alt={course.instructorName} src={course.instructorImg} className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">{course.instructorName}</h3>
                                    <p className="text-text-muted dark:text-gray-300 leading-relaxed">
                                        {course.instructorBio}
                                    </p>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Col: Includes / MOBILE CTA */}
                    <aside className="space-y-8">
                        {/* Mobile CTA (Only visible on small screens) */}
                        <div className="block md:hidden bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 p-6 rounded-3xl shadow-lg relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                            <p className="text-text-muted dark:text-gray-400 text-sm mb-1 uppercase tracking-wide font-bold">{t("course.price" as LangKeys)}</p>
                            <p className="text-3xl font-bold text-text-main dark:text-white mb-6">{course.price}</p>
                            <a
                                href={course.extLink}
                                target={course.extLink.startsWith("http") ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="w-full bg-primary hover:bg-[#689153] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                            >
                                <span className="material-icons-round">{course.isVOD ? "shopping_cart" : "how_to_reg"}</span> {course.isVOD ? t("course.buy" as LangKeys) : t("course.enroll" as LangKeys)}
                            </a>
                        </div>

                        {/* What's included */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 p-8 rounded-3xl shadow-sm"
                        >
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-primary">verified</span>
                                {t("course.includes" as LangKeys)}
                            </h3>
                            <ul className="space-y-4">
                                {course.includes.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <span className="material-icons-round text-[16px]">check</span>
                                        </div>
                                        <span className="text-text-muted dark:text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
