import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import WebinarCalendar from "@/components/WebinarCalendar";
import AibaptStats from "@/components/AibaptStats";
import AibaptTraumaInfo from "@/components/AibaptTraumaInfo";
import AibaptValueProps from "@/components/AibaptValueProps";
import AibaptEvents from "@/components/AibaptEvents";
import AibaptFAQ from "@/components/AibaptFAQ";

import { supabaseAdmin } from "@/lib/supabase-server";

interface PageProps {
  params: Promise<{ lang: 'es' | 'pt' }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  let events: any[] = [];
  try {
    const { data, error } = await supabaseAdmin
      .from('proximos_eventos')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(3);
    if (!error) {
      events = data || [];
    }
  } catch (error) {
    console.warn("Error fetching events for homepage:", error);
  }

  return (
    <div className="flex flex-col w-full bg-[var(--background)]">
      {/* Hero Section (Mindcare Interactive Slider) */}
      <HeroSlider key={`hero-${lang}`} lang={lang} />

      {/* Webinar Calendar Section */}
      {/* @ts-ignore */}
      <WebinarCalendar key={`calendar-${lang}`} lang={lang} />

      {/* AIBAPT Events Section */}
      <AibaptEvents key={`events-${lang}`} events={events} />

      {/* AIBAPT Stats Section */}
      <AibaptStats key={`stats-${lang}`} />

      {/* AIBAPT Trauma Info Section */}
      <AibaptTraumaInfo key={`trauma-${lang}`} />

      {/* AIBAPT Value Props Section */}
      <AibaptValueProps key={`benefits-${lang}`} />

      {/* AIBAPT FAQ Section */}
      <AibaptFAQ key={`faq-${lang}`} />

    </div>
  );
}
