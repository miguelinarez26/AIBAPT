"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';
import { assetPath } from '@/lib/assets';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-primary to-secondary text-white pt-20 border-t border-white/10 relative overflow-hidden">
      {/* Background Organic Glows */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none -z-10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-[70px] -translate-x-1/4 -translate-y-1/4 pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">
          {/* Brand & Trust Seal */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex flex-col items-center -mt-7">
              <Link href={`/${lang}`} className="inline-block transition-transform hover:scale-[1.02]">
                <Image 
                  src={assetPath("/images/aibapt_logo_transparent_seal.png")}
                  alt="AIBAPT Logo" 
                  width={96} 
                  height={96} 
                  className="object-contain w-24 h-24"
                />
              </Link>
              {/* Social Media Links */}
              <div className="flex gap-3.5 mt-8">
                <a href="https://www.facebook.com/AIBAPT/" target="_blank" rel="noopener noreferrer" className="notranslate bg-accent text-white hover:bg-accent-light hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center" aria-label="Facebook" translate="no">
                  <FiFacebook className="w-4.5 h-4.5" />
                </a>
                <a href="https://www.instagram.com/aibapt" target="_blank" rel="noopener noreferrer" className="notranslate bg-accent text-white hover:bg-accent-light hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center" aria-label="Instagram" translate="no">
                  <FiInstagram className="w-4.5 h-4.5" />
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="notranslate bg-accent text-white hover:bg-accent-light hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center" aria-label="YouTube" translate="no">
                  <FiYoutube className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* La Organización */}
          <div>
            {/* @ts-ignore */}
            <h3 className="font-serif font-bold text-sm text-text-light uppercase tracking-wider mb-6 border-b border-text-light/20 pb-2 inline-block">
              {/* @ts-ignore */}
              {t("footer.org")}
            </h3>
            <ul className="space-y-3.5 text-sm text-text-light">
              {/* @ts-ignore */}
              <li>
                <Link href={`/${lang}/quienes-somos`} className="transition-all duration-300 hover:text-accent hover:translate-x-1 inline-block">
                  {/* @ts-ignore */}
                  {t("footer.about")}
                </Link>
              </li>
              {/* @ts-ignore */}
              <li>
                <Link href={`/${lang}/socios`} className="transition-all duration-300 hover:text-accent hover:translate-x-1 inline-block">
                  {/* @ts-ignore */}
                  {t("nav.partners")}
                </Link>
              </li>
              {/* @ts-ignore */}
              <li>
                <Link href={`/${lang}/contacto`} className="transition-all duration-300 hover:text-accent hover:translate-x-1 inline-block">
                  {/* @ts-ignore */}
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            {/* @ts-ignore */}
            <h3 className="font-serif font-bold text-sm text-text-light uppercase tracking-wider mb-6 border-b border-text-light/20 pb-2 inline-block">
              {/* @ts-ignore */}
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3.5 text-sm text-text-light">
              {/* @ts-ignore */}
              <li>
                <Link href={`/${lang}/afiliacion`} className="transition-all duration-300 hover:text-accent hover:translate-x-1 inline-block">
                  {/* @ts-ignore */}
                  {t("nav.afiliacion")}
                </Link>
              </li>
              {/* @ts-ignore */}
              <li>
                <Link href={`/${lang}/miembros`} className="transition-all duration-300 hover:text-accent hover:translate-x-1 inline-block">
                  {/* @ts-ignore */}
                  {t("nav.members")}
                </Link>
              </li>
              {/* @ts-ignore */}
              <li>
                <Link href={`/${lang}/dashboard`} className="transition-all duration-300 hover:text-accent hover:translate-x-1 inline-block">
                  {/* @ts-ignore */}
                  {t("footer.portal")}
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar con fondo oficial de la marca text-light */}
      <div className="bg-text-light w-full border-t border-white/10 py-5 mt-16 text-white/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-light gap-4">
          {/* @ts-ignore */}
          <p>{t("footer.rights")}</p>

          {/* CarMiDev Branding */}
          <div className="flex items-center gap-2 text-white/40 font-bold text-[9px] uppercase tracking-widest">
            <span>Desarrollado y Diseñado por</span>
            <a 
              href="https://wa.me/message/R76OMSCAFXNTG1"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-[19px] w-[90px] group/logo cursor-pointer shrink-0 block"
            >
              <style>{`
                @keyframes neonGlowPulse {
                  0%, 100% {
                    filter: brightness(0) saturate(100%) invert(67%) sepia(93%) saturate(3020%) hue-rotate(150deg) brightness(105%) contrast(106%) drop-shadow(0 0 2px rgba(0, 229, 255, 0.5));
                  }
                  50% {
                    filter: brightness(0) saturate(100%) invert(67%) sepia(93%) saturate(3020%) hue-rotate(150deg) brightness(105%) contrast(106%) drop-shadow(0 0 8px rgba(0, 229, 255, 0.95));
                  }
                }
                .carmidev-logo-hover {
                  animation: neonGlowPulse 2s infinite ease-in-out;
                }
              `}</style>
              {/* Logo base invertido en modo claro (negro) y original en modo oscuro */}
              <img
                src={assetPath("/images/logo-carmidev.png")}
                alt="CarMiDev Logo"
                className="h-[19px] w-auto object-contain opacity-100 transition-opacity duration-300 group-hover/logo:opacity-0"
              />
              {/* Logo cyan eléctrico superpuesto */}
              <img
                src={assetPath("/images/logo-carmidev.png")}
                alt="CarMiDev Hover"
                className="carmidev-logo-hover absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100"
              />
            </a>
          </div>

          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            {/* @ts-ignore */}
            <Link href={`/${lang}/privacy`} className="transition-colors hover:text-[#d95858]">
              {/* @ts-ignore */}
              {t("footer.privacy")}
            </Link>
            {/* @ts-ignore */}
            <Link href={`/${lang}/terms`} className="transition-colors hover:text-[#d95858]">
              {/* @ts-ignore */}
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
