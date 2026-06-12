"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  return (
    <header className="w-full bg-[var(--background)] z-50 sticky top-0 transition-all duration-300">
      <div className="w-full px-4 md:px-8 lg:px-[140px] h-24 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image 
              src="/images/logo_aibapt.png" 
              alt="AIBAPT Logo" 
              width={240} 
              height={80} 
              className="object-contain w-auto h-16"
              priority
            />
          </Link>
        </div>
        
        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-[15px] text-[#333333]">
          {/* Inicio - Active state pill */}
          <Link href="/" className="bg-highlight px-4 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap">{t("nav.home")}</Link>

          {/* La Asociación */}
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-highlight transition-all duration-300 whitespace-nowrap">
              {/* @ts-ignore */}
              {t("nav.association")} 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 min-w-[220px] bg-background-light rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 z-50">
              <div className="flex flex-col gap-1 text-[#555555] text-[14px] font-light">
                <Link href="/quienes-somos" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.about")}</Link>
                <Link href="/socios" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.partners")}</Link>
                <Link href="/contacto" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.contact")}</Link>
                {/* @ts-ignore */}
                <Link href={lang === 'es' ? '/docs/Estatutos_AIBAPT_ESP.pdf' : '/docs/Estatutos_AIBAPT_PT.pdf'} target="_blank" download className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.statutes")}</Link>
                {/* @ts-ignore */}
                <Link href={lang === 'es' ? '/docs/Reglamento_Interno_AIBAPT_ESP.pdf' : '/docs/Reglamento_Interno_AIBAPT_PT.pdf'} target="_blank" download className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.rules")}</Link>
              </div>
            </div>
          </div>

          {/* Membresía */}
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-highlight transition-all duration-300 whitespace-nowrap">
              {/* @ts-ignore */}
              {t("nav.membership")} 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 min-w-[220px] bg-background-light rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 z-50">
              <div className="flex flex-col gap-1 text-[#555555] text-[14px] font-light">
                {/* @ts-ignore */}
                <Link href="/afiliacion" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.afiliacion")}</Link>
                {/* @ts-ignore */}
                <Link href="/miembros" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("nav.members")}</Link>
              </div>
            </div>
          </div>
          
          {/* Desarrollo Profesional with Mega Menu */}
          <div className="group relative">
            <Link href="/formaciones" className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-highlight transition-all duration-300 whitespace-nowrap">
              {/* @ts-ignore */}
              {t("nav.development")} 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-[40%] w-[650px] h-[450px] bg-background-light rounded-[32px] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 overflow-hidden z-50">
              {/* Mega Menu Image Side */}
              <div className="relative w-full h-full bg-gray-200">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/desarrollo-profesional.jpg')" }}></div>
                {/* Contact Us Pill floating over image */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <Link href="/formaciones?tab=events" className="group/btn flex items-center gap-3 bg-highlight text-text-light pl-6 pr-2 py-1.5 rounded-full font-medium transition-all duration-300 hover:-translate-y-1 hover:brightness-95 shadow-md">
                    <span className="whitespace-nowrap text-[14px]">Ver Eventos</span>
                    <div className="w-9 h-9 bg-black/5 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
              {/* Mega Menu Links Side */}
              <div className="px-10 py-8 flex flex-col justify-between h-full">
                {/* @ts-ignore */}
                <h3 className="text-[26px] font-serif italic text-text-light tracking-tight">{t("nav.development")}</h3>
                <div className="flex flex-col gap-1 text-[#555555] text-[14px] font-light">
                  <Link href="/formaciones?tab=events" onClick={() => {if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('resetTabState', { detail: 'events' }))}} className="block px-4 py-2 -mx-4 rounded-md hover:bg-highlight hover:text-text-light transition-colors">Próximos Eventos</Link>
                  <Link href="/formaciones?tab=recordings" onClick={() => {if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('resetTabState', { detail: 'recordings' }))}} className="block px-4 py-2 -mx-4 rounded-md hover:bg-highlight hover:text-text-light transition-colors">Videoteca</Link>
                  <Link href="/formaciones?tab=accredited" onClick={() => {if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('resetTabState', { detail: 'accredited' }))}} className="block px-4 py-2 -mx-4 rounded-md hover:bg-highlight hover:text-text-light transition-colors">Cursos y eventos acreditados</Link>
                  <Link href="/formaciones?tab=accreditation" onClick={() => {if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('resetTabState', { detail: 'accreditation' }))}} className="block px-4 py-2 -mx-4 rounded-md hover:bg-highlight hover:text-text-light transition-colors">Acredita tu curso o evento</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-highlight transition-all duration-300 whitespace-nowrap">
              {/* @ts-ignore */}
              {t("nav.news")} 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 min-w-[240px] bg-background-light rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 z-50">
              <div className="flex flex-col gap-1 text-[#555555] text-[14px] font-light">
                {/* @ts-ignore */}
                <Link href="/publicaciones?cat=articulos" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("news.cat.clinical")}</Link>
                {/* @ts-ignore */}
                <Link href="/publicaciones?cat=entrevistas" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("news.cat.interviews")}</Link>
                {/* @ts-ignore */}
                <Link href="/publicaciones?cat=prensa" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("news.cat.prensa")}</Link>
                {/* @ts-ignore */}
                <Link href="/publicaciones?cat=libros" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors">{t("news.cat.libros")}</Link>
                <Link href="/publicaciones" className="block px-4 py-2 rounded-md hover:bg-highlight hover:text-text-light transition-colors font-medium">Ver Todo</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'es' ? 'bg-white shadow-sm text-primary' : 'text-[#555555] hover:text-primary cursor-pointer'}`}
            >ES</button>
            <button
              onClick={() => setLang("pt")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'pt' ? 'bg-white shadow-sm text-primary' : 'text-[#555555] hover:text-primary cursor-pointer'}`}
            >PT</button>
          </div>
          
          <div className="flex items-center">
            <Link href="/portal" className="group flex items-center gap-3 bg-primary text-white pl-6 pr-2 py-1.5 rounded-full font-medium transition-all duration-300 hover:bg-secondary hover:-translate-y-1">
              <span className="whitespace-nowrap text-[15px]">{t("nav.portal")}</span>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button className="text-[#333333]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
