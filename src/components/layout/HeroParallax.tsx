"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const IMG_PADDING = 12;

export const HeroParallax = () => {
    const { t } = useLanguage();

    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-background-dark">
            <TextParallaxContent
                imgUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                subheading={t("home.badge")}
                heading={t("home.title1") + " " + t("home.title_highlight") + " " + t("home.title2")}
                onPlayVideo={() => setIsVideoOpen(true)}
            >
                <ExampleContent
                    title={t("home.hero.healing_root")}
                    desc1={t("home.desc")}
                    desc2={t("home.hero.join_community")}
                    btnText={t("home.btn_trainings")}
                />
            </TextParallaxContent>

            {/* Video Modal */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsVideoOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                            >
                                <span className="material-icons-round">close</span>
                            </button>
                            {/* Placeholder Video - Reemplazar el src con el video real de YouTube / Vimeo */}
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title="AIBAPT Bienvenida"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TextParallaxContent = ({
    imgUrl,
    subheading,
    heading,
    onPlayVideo,
    children,
}: {
    imgUrl: string;
    subheading: string;
    heading: string;
    onPlayVideo: () => void;
    children: React.ReactNode;
}) => {
    return (
        <div
            style={{
                paddingLeft: IMG_PADDING,
                paddingRight: IMG_PADDING,
            }}
        >
            <div className="relative h-[150vh]">
                <StickyImage imgUrl={imgUrl} />
                <OverlayCopy heading={heading} subheading={subheading} onPlayVideo={onPlayVideo} />
            </div>
            {children}
        </div>
    );
};

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["end end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <motion.div
            style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: `calc(100vh - ${IMG_PADDING * 2}px)`,
                top: IMG_PADDING,
                scale,
            }}
            ref={targetRef}
            className="sticky z-0 overflow-hidden rounded-3xl"
        >
            <motion.div
                className="absolute inset-0 bg-neutral-950/70"
                style={{
                    opacity,
                }}
            />
        </motion.div>
    );
};

const OverlayCopy = ({
    subheading,
    heading,
    onPlayVideo,
}: {
    subheading: string;
    heading: string;
    onPlayVideo: () => void;
}) => {
    const { t } = useLanguage();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
    const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

    return (
        <motion.div
            style={{
                y,
                opacity,
            }}
            ref={targetRef}
            className="absolute left-0 top-0 flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center text-white"
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center justify-center -mt-10 md:-mt-20"
            >
                <p className="mb-4 text-center text-2xl md:text-4xl text-white font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    {subheading}
                </p>
                <p className="text-center text-4xl font-bold text-white md:text-6xl lg:text-7xl max-w-5xl mx-auto px-4 drop-shadow-[0_4px_16px_rgba(0,0,0,1)] mb-8">{heading}</p>

                {/* Botón de Reproducir Video */}
                <button
                    onClick={onPlayVideo}
                    className="group relative flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <span className="material-icons-round text-white ml-1">play_arrow</span>
                    </div>
                    {t("home.hero.play_video")}
                </button>
            </motion.div>

            {/* Bouncing Scroll Arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => {
                    window.scrollTo({
                        top: window.innerHeight,
                        behavior: "smooth"
                    });
                }}
            >
                <span className="text-white/60 text-xs uppercase tracking-[0.2em] mb-2 font-bold drop-shadow-md">{t("home.hero.explore")}</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
                >
                    <span className="material-icons-round text-white text-2xl">keyboard_arrow_down</span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const ExampleContent = ({ title, desc1, desc2, btnText }: { title: string, desc1: string, desc2: string, btnText: string }) => (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
        <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-secondary dark:text-white">
            {title}
        </h2>
        <div className="col-span-1 md:col-span-8">
            <p className="mb-4 text-xl text-text-muted dark:text-gray-300 md:text-2xl">
                {desc1}
            </p>
            <p className="mb-8 text-xl text-text-muted dark:text-gray-300 md:text-2xl">
                {desc2}
            </p>
            <button className="w-full rounded bg-primary px-9 py-4 text-xl text-white transition-colors hover:bg-primary/90 md:w-fit font-bold flex items-center justify-center gap-2">
                {btnText} <FiArrowUpRight className="inline" />
            </button>
        </div>
    </div>
);
