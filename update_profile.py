import re
import sys

file_path = "src/app/[lang]/dashboard/perfil/ProfileClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_header = """    <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark font-sans relative">
      
      {/* Header Estilo Pro (Simplificado) */}
      <div className="bg-primary/5 dark:bg-primary/10 pt-12 pb-16 px-6 border-b border-primary/10 dark:border-primary/20">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-display font-medium text-text-main dark:text-white tracking-tight mb-2">
              {firstName} {lastName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
              <MembershipBadge isMember={isMember} lang={lang} />
              <span className="text-text-muted dark:text-gray-400 text-sm flex items-center gap-1">
                <span className="material-icons-round text-[16px]">email</span>
                {profile?.email}
              </span>
            </div>
          </div>

          <Link
            href={`/${lang}/dashboard`}
            className="px-6 py-2.5 bg-white dark:bg-white/10 rounded-xl font-bold text-sm text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            {t["profile.back"]}
          </Link>
        </div>
      </div>

      <main className="max-w-[1140px] mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">"""

new_header = """    <main className="pt-8 md:pt-12 min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Organic Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10 pointer-events-none"></div>

      {/* Header Banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row justify-between items-start text-text-light dark:text-white relative z-10">
        <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">
              {firstName} <span className="font-light italic text-primary">{lastName}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
               <MembershipBadge isMember={isMember} lang={lang} />
               <span className="text-text-dark dark:text-gray-400 text-sm flex items-center gap-1 font-medium bg-gray-50/50 dark:bg-white/5 px-4 py-2 rounded-full border border-secondary/20 shadow-sm">
                 <span className="material-icons-round text-[16px] text-primary">email</span>
                 {profile?.email}
               </span>
            </div>
        </div>
        <Link
          href={`/${lang}/dashboard`}
          className="mt-6 md:mt-0 px-6 py-3 bg-white dark:bg-surface-dark border border-secondary/20 rounded-full font-bold text-sm text-text-light dark:text-white hover:text-primary transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-2 group"
        >
          <span className="material-icons-round text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          {t["profile.back"] || "Volver al Dashboard"}
        </Link>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">"""

if old_header in content:
    content = content.replace(old_header, new_header)
    print("Header replaced")
else:
    print("Old header not found")

old_sidebar = """          {/* Navegación de Pestañas */}
          <div className="lg:col-span-3">
            <nav className="flex flex-col gap-2 p-2 bg-white dark:bg-surface-dark rounded-2xl border border-accent/30 dark:border-gray-800 shadow-sm">"""
new_sidebar = """          {/* Navegación de Pestañas */}
          <div className="lg:col-span-1">
            <nav className="flex flex-col gap-2 p-3 bg-white dark:bg-surface-dark rounded-[32px] border border-secondary/20 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">"""
if old_sidebar in content:
    content = content.replace(old_sidebar, new_sidebar)

old_btn_active = "px-4 py-3 rounded-xl font-bold text-sm transition-all bg-primary text-white shadow-md"
new_btn_active = "px-4 py-3 rounded-[20px] font-bold text-sm transition-all bg-primary text-white shadow-md"
content = content.replace(old_btn_active, new_btn_active)

old_btn_inactive = "px-4 py-3 rounded-xl font-bold text-sm transition-all text-text-muted hover:bg-accent/10"
new_btn_inactive = "px-4 py-3 rounded-[20px] font-bold text-sm transition-all text-text-dark dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary"
content = content.replace(old_btn_inactive, new_btn_inactive)

old_content_area = """          {/* Contenido Dinámico */}
          <div className="lg:col-span-9">"""
new_content_area = """          {/* Contenido Dinámico */}
          <div className="lg:col-span-3">"""
if old_content_area in content:
    content = content.replace(old_content_area, new_content_area)

old_card_style = "className=\"bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden\""
new_card_style = "className=\"bg-white dark:bg-surface-dark border border-secondary/20 dark:border-gray-800 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500\""
content = content.replace(old_card_style, new_card_style)

# Inputs
content = content.replace('className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"', 'className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none transition-all"')

content = content.replace('className="w-full bg-accent/5 dark:bg-white/5 border border-accent/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"', 'className="w-full bg-gray-50/50 dark:bg-white/5 border border-secondary/20 dark:border-gray-700 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-primary/10 outline-none resize-none transition-all"')

# Banner matricula
content = content.replace('bg-secondary text-white rounded-3xl shadow-lg', 'bg-primary text-white rounded-[32px] shadow-[0_8px_30px_rgba(33,150,83,0.12)] border border-primary-light/20')

# Card headers
content = content.replace('<h3 className="text-xl font-bold font-display">', '<h3 className="font-bold font-serif text-xl text-text-light dark:text-white">')

content = content.replace('      </main>\n    </div>', '      </div>\n    </main>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
