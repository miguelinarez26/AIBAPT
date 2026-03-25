"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NoticiasPage() {
    const { t, lang } = useLanguage();
    return (
        <div className="pt-20">
            {/* Main Content */}
            <main className="flex-grow flex justify-center py-8 lg:py-12 px-4 md:px-6">
                <div className="layout-content-container max-w-[1280px] w-full flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Articles */}
                    <div className="flex-1 flex flex-col gap-10">
                        {/* Page Title Area */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-secondary text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] font-display">
                                {t("news.title")}
                            </h1>
                            <p className="text-text-muted text-lg font-normal leading-normal">
                                {t("news.desc")}
                            </p>
                        </div>

                        {/* Featured Article */}
                        <article className="group relative flex flex-col rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-accent/20">
                            <div className="w-full h-[320px] md:h-[400px] bg-accent/20 relative overflow-hidden">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJB7Qtss89nzKTtfgULY4AdGbEEJc3Hjfm6xvxJMZzD542VCuXFdYrOMavUaAJxZyUPNck-0tScKwpd2TaVf4rJY3ovURMuePJIcNYxidlen-WI_DTZDOkFI25f8v4yFa21ySdKjIh9mB5kBZMVJ7J-xJIVaZIG3hSfB8mFNk5g-g94mKZErkwtnimUuy9NuYLpmchXy-94mtcFcVHHooqMPMKA2AFFMJw82cxCjFnxpl3d-l1k_YnlNtHdmtptWBa2vFV8J_HYMk-"
                                    alt="A peaceful forest path with sunlight filtering through leaves, symbolizing hope and future"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                                    <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-full">
                                        {t("news.destacado")}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 md:p-10 flex flex-col gap-4">
                                <h2 className="text-secondary text-2xl md:text-3xl font-bold leading-tight font-display group-hover:text-primary transition-colors">
                                    {t("news.post1.title")}
                                </h2>
                                <p className="text-text-muted text-base md:text-lg leading-relaxed line-clamp-3">
                                    {t("news.post1.desc")}
                                </p>
                                <div className="flex items-center gap-2 text-primary font-bold mt-2 cursor-pointer group/link w-fit">
                                    <span>{t("news.read_more")}</span>
                                    <span className="material-icons-round text-sm transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                                </div>
                            </div>
                        </article>

                        {/* Divider */}
                        <div className="h-px w-full bg-accent/30 my-2"></div>

                        {/* Recent Articles List */}
                        <div className="flex flex-col gap-8">
                            <h3 className="text-secondary text-2xl font-bold font-display">{t("news.recientes")}</h3>

                            {/* Article Item 1 */}
                            <article className="flex flex-col md:flex-row gap-6 group cursor-pointer">
                                <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-accent/20 relative">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSW406h2kQBlaDu7oYu6nDLew2_r7oBO_FmPe7fQ2xrdRlXaJPG46TJSwLGoBY8Qf6M9NRhLr0VZ4DbozhF-fHQNAjcPntoJFZiSC1FagUtRLwTTZgHgqQdSkNn1w-7w45WcDd-ZZrhfhCbdYGdQEsjyHRUN1zQoqdFw2s8aJdd8hh146-pIZ-bOhZIbp9gj7nrMsDdijLBh6PfE-IynuweF5TBwAvE0XFfCNEU5JdYXA8Tgc6KM1urBK8U5V3Bx02D1L_ASlwJ_k6"
                                        alt="Imagen de artículo"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-2">
                                    <div className="flex items-center gap-3 text-xs font-medium text-text-muted mb-1">
                                        <span className="text-primary uppercase tracking-wider font-bold">{t("news.cat.clinical")}</span>
                                        <span>•</span>
                                        <span>15 Oct, 2024</span>
                                    </div>
                                    <h4 className="text-xl font-bold font-display text-text-main leading-tight group-hover:text-primary transition-colors">
                                        {t("news.post2.title")}
                                    </h4>
                                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                                        {t("news.post2.desc")}
                                    </p>
                                    <div className="flex items-center gap-1 text-primary text-sm font-bold mt-2 hover:underline decoration-2 underline-offset-4 decoration-primary/30">
                                        <span>{t("news.read_more")}</span>
                                        <span className="material-icons-round text-[16px]">arrow_outward</span>
                                    </div>
                                </div>
                            </article>

                            <div className="h-px w-full bg-accent/30"></div>

                            {/* Article Item 2 */}
                            <article className="flex flex-col md:flex-row gap-6 group cursor-pointer">
                                <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-accent/20 relative">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAflrz-GQiBYWVlUAG58zCE-anzEPSL75Bq4DoDL_fUTKTBcGazqsMGlGlxmKfrvifjUtVUgP5Js0gWB7u1EUCscJMdU7GhsgG99m6dkAZkkdhquZVWY2lN9Cy8vojhMJ8gentPZw4UkkdBmRqMOuft_OM_aDJUr0Wa2xNSLfrJpUNE1Nstl39h4Gx0-pH3gsSWmCnWCb0Nz6pIVDtgDrK3hkR9909D9vSrCH8mUJzMhwTK06dVdutCKBN5ESlfPKa0o8zEk8hIHsFY"
                                        alt="Imagen de artículo"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-2">
                                    <div className="flex items-center gap-3 text-xs font-medium text-text-muted mb-1">
                                        <span className="text-primary uppercase tracking-wider font-bold">{t("news.cat.interviews")}</span>
                                        <span>•</span>
                                        <span>12 Oct, 2024</span>
                                    </div>
                                    <h4 className="text-xl font-bold font-display text-text-main leading-tight group-hover:text-primary transition-colors">
                                        {t("news.post3.title")}
                                    </h4>
                                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                                        {t("news.post3.desc")}
                                    </p>
                                    <div className="flex items-center gap-1 text-primary text-sm font-bold mt-2 hover:underline decoration-2 underline-offset-4 decoration-primary/30">
                                        <span>{t("news.read_more")}</span>
                                        <span className="material-icons-round text-[16px]">arrow_outward</span>
                                    </div>
                                </div>
                            </article>

                            <div className="h-px w-full bg-accent/30"></div>

                            {/* Article Item 3 */}
                            <article className="flex flex-col md:flex-row gap-6 group cursor-pointer">
                                <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-accent/20 relative">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi3tldwN747u61SxqwRlBhuK5amVBBGtguI8AGgErMXNNJLcfETIyphL24XxPCnqWwlHG8QUUQKqCh1qK0MRTacCaKSgT8yGKSOlppLTsLGLGt_df8JxDktPkRXbg81rSX42i1lmsrtYLozqWQ7ePiS9pX7bKgOV9myKaQblqLwAJSgTWsPsW2mWED_H5brmVZRHHQVBIaPSjLieS9ewL8Ydq9JoMcvVkBjJ8pQP-bfBPQFFyV06LS0T2mkbnYUjuZSWrXD2ZaVhqP"
                                        alt="Imagen de artículo"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-2">
                                    <div className="flex items-center gap-3 text-xs font-medium text-text-muted mb-1">
                                        <span className="text-primary uppercase tracking-wider font-bold">{t("news.cat.events")}</span>
                                        <span>•</span>
                                        <span>08 Oct, 2024</span>
                                    </div>
                                    <h4 className="text-xl font-bold font-display text-text-main leading-tight group-hover:text-primary transition-colors">
                                        {t("news.post4.title")}
                                    </h4>
                                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                                        {t("news.post4.desc")}
                                    </p>
                                    <div className="flex items-center gap-1 text-primary text-sm font-bold mt-2 hover:underline decoration-2 underline-offset-4 decoration-primary/30">
                                        <span>{t("news.read_more")}</span>
                                        <span className="material-icons-round text-[16px]">arrow_outward</span>
                                    </div>
                                </div>
                            </article>

                            {/* Pagination (Visual) */}
                            <div className="flex items-center gap-2 mt-4 pt-4">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md shadow-primary/20">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-accent/50 transition-colors">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-accent/50 transition-colors">3</button>
                                <span className="text-text-muted mx-2">...</span>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-accent/50 transition-colors">
                                    <span className="material-icons-round">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="w-full lg:w-[360px] flex flex-col gap-8 shrink-0">
                        {/* Newsletter Card */}
                        <div className="bg-accent/30 p-8 rounded-3xl relative overflow-hidden border border-accent/50">
                            {/* Organic background decoration */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm mb-2">
                                    <span className="material-icons-round text-2xl">mail</span>
                                </div>
                                <h3 className="text-xl font-bold font-display text-secondary">{t("news.newsletter.title")}</h3>
                                <p className="text-sm text-text-muted mb-2">
                                    {t("news.newsletter.desc")}
                                </p>
                                <form className="flex flex-col gap-3">
                                    <input className="w-full rounded-xl border border-accent/50 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main placeholder:text-text-muted/60" placeholder={t("news.newsletter.placeholder")} type="email" />
                                    <button className="w-full rounded-xl bg-primary hover:bg-[#689153] text-white font-bold py-3 text-sm transition-all shadow-md shadow-primary/20" type="submit">
                                        {t("news.newsletter.btn")}
                                    </button>
                                </form>
                                <p className="text-xs text-text-muted text-center mt-2">
                                    {t("news.newsletter.footer")}
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold font-display text-secondary flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                {t("news.sidebar.categories")}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <Link href="#" className="px-4 py-2 rounded-xl bg-white border border-accent/50 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors shadow-sm">{t("news.cat.clinical")} (12)</Link>
                                <Link href="#" className="px-4 py-2 rounded-xl bg-white border border-accent/50 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors shadow-sm">{t("news.cat.events")} (5)</Link>
                                <Link href="#" className="px-4 py-2 rounded-xl bg-white border border-accent/50 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors shadow-sm">{t("news.cat.research")} (8)</Link>
                                <Link href="#" className="px-4 py-2 rounded-xl bg-white border border-accent/50 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors shadow-sm">{t("news.cat.interviews")} (15)</Link>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex flex-col gap-4 mt-4">
                            <h3 className="text-lg font-bold font-display text-secondary flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                {t("news.sidebar.follow")}
                            </h3>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-accent/50">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-accent/50">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-accent/50">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.185 3.362c.636-.247 1.363-.416 2.427-.465C7.674 2.013 8.028 2 10.52 2h1.795zM12.315 3.824h-1.8c-2.52 0-2.83.01-3.71.05-.885.04-1.36.195-1.68.32-.42.16-.72.35-1.04.67-.315.315-.5.615-.66 1.035-.125.32-.28.795-.32 1.68-.04.88-.05 1.19-.05 3.71v1.8c0 2.52.01 2.83.05 3.71.04.885.195 1.36.32 1.68.16.42.35.72.67 1.04.315.315.615.5 1.035.66.32.125.795.28 1.68.32.88.04 1.19.05 3.71.05h1.8c2.52 0 2.83-.01 3.71-.05.885-.04 1.36-.195 1.68-.32.42-.16.72-.35 1.04-.67.315-.315.5-.615.66-1.035.125-.32.28-.795.32-1.68.04-.88.05-1.19.05-3.71v-1.8c0-2.52-.01-2.83-.05-3.71-.04-.885-.195-1.36-.32-1.68-.16-.42-.35-.72-.67-1.04-.315-.315-.615-.5-1.035-.66-.32-.125-.795-.28-1.68-.32-.88-.04-1.19-.05-3.71-.05zm1.8 5.61a3.57 3.57 0 11-7.14 0 3.57 3.57 0 017.14 0zm-1.8 0a1.77 1.77 0 10-3.54 0 1.77 1.77 0 003.54 0zm4.53-4.57a1.19 1.19 0 11-2.38 0 1.19 1.19 0 012.38 0z" fillRule="evenodd"></path></svg>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm border border-accent/50">
                                    <span className="material-icons-round text-lg">podcasts</span>
                                </a>
                            </div>
                        </div>

                        {/* Upcoming Event Mini Card */}
                        <div className="mt-4 p-5 rounded-3xl bg-white border border-accent/50 flex flex-col gap-4 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-primary tracking-wider">{t("news.sidebar.event.next")}</span>
                                <span className="material-icons-round text-secondary text-lg">event</span>
                            </div>
                            <div className="relative z-10 flex gap-4 items-center">
                                <div className="flex flex-col items-center justify-center bg-accent/30 rounded-2xl p-3 min-w-[60px] border border-accent/50">
                                    <span className="text-xs font-bold text-secondary uppercase">Nov</span>
                                    <span className="text-2xl font-black text-text-main">12</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold font-display text-secondary text-base leading-tight">{t("news.sidebar.event.title")}</h4>
                                    <p className="text-xs text-text-muted flex items-center gap-1">
                                        <span className="material-icons-round text-[14px]">location_on</span>
                                        Buenos Aires, Argentina
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
