"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

import logoDark from "../../../public/images/logo corto en blanco.png";

export const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-primary text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-12">
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 p-4 rounded-xl inline-flex items-center justify-center mb-6">
                            <Image src={logoDark} alt="AIBAPT Logo" width={180} height={100} className="object-contain h-10 w-auto" />
                        </div>
                        <p className="text-white text-sm mb-6 leading-relaxed font-medium">
                            {t("footer.desc")}
                        </p>
                        <form className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-white">{t("footer.newsletter")}</label>
                            <div className="flex flex-col gap-2">
                                <input className="bg-white/10 border border-accent/50 text-white placeholder-white/60 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-full transition-colors" placeholder={t("footer.newsletter.placeholder")} type="email" />
                                <Button variant="secondary" size="sm" fullWidth type="button">
                                    {t("footer.subscribe")}
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-6 text-white">{t("footer.org")}</h4>
                        <ul className="space-y-3 text-sm text-white font-medium">
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.about")}</a></li>
                            <li><Link href="/leadership" className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block">{t("footer.board")}</Link></li>
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="/quienes-somos">{t("footer.mission")}</a></li>
                            <li><Link className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="/afiliacion">{t("footer.affiliates")}</Link></li>
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.transparency")}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-6 text-white">{t("footer.resources")}</h4>
                        <ul className="space-y-3 text-sm text-white font-medium">
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.portal")}</a></li>
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.certs")}</a></li>
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.library")}</a></li>
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.events")}</a></li>
                            <li><a className="hover:text-gray-200 hover:translate-x-1 transition-all inline-block" href="#">{t("footer.news")}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-6 text-white">{t("footer.contact")}</h4>
                        <ul className="space-y-4 text-sm text-white font-medium">
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-white text-base mt-0.5">location_on</span>
                                <span>Av. da Liberdade 110,<br />Lisboa, Portugal</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-white text-base">email</span>
                                <span>contacto@aibapt.org</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-white text-base">phone</span>
                                <span>+351 21 000 0000</span>
                            </li>
                        </ul>
                        <div className="mt-6 flex gap-4">
                            <a className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all" href="#">
                                <span className="text-xs font-bold">in</span>
                            </a>
                            <a className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all" href="#">
                                <span className="text-xs font-bold">tw</span>
                            </a>
                            <a className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all" href="#">
                                <span className="text-xs font-bold">fb</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white font-medium pt-2">
                    <p>{t("footer.rights")}</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a className="hover:text-gray-200" href="#">{t("footer.privacy")}</a>
                        <a className="hover:text-gray-200" href="#">{t("footer.terms")}</a>
                        <a className="hover:text-gray-200" href="#">{t("footer.cookies")}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
