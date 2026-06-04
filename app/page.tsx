import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import WebinarCalendar from "@/components/WebinarCalendar";
import AibaptStats from "@/components/AibaptStats";
import AibaptTraumaInfo from "@/components/AibaptTraumaInfo";
import AibaptValueProps from "@/components/AibaptValueProps";
import AibaptEvents from "@/components/AibaptEvents";
import AibaptFAQ from "@/components/AibaptFAQ";

export default function Home() {
  const services = [
    { title: "Individual Therapy", desc: "One-on-one sessions tailored to your unique needs." },
    { title: "Couples Therapy", desc: "Strengthen your relationship and improve communication." },
    { title: "Family Counseling", desc: "Resolve conflicts and build a healthier family dynamic." },
    { title: "Teen Therapy", desc: "Support for adolescents navigating complex emotions." },
    { title: "Depression Therapy", desc: "Evidence-based treatment to help you find joy again." },
    { title: "Supportive Counseling", desc: "A safe space to process life transitions." },
  ];

  const therapists = [
    { name: "Dr. Emily Carter, PhD", role: "Clinical Psychologist" },
    { name: "Michael Johnson, LCSW", role: "Licensed Social Worker" },
    { name: "Dr. Sarah Mitchell, PsyD", role: "Couples Therapist" },
  ];

  return (
    <div className="flex flex-col w-full bg-[var(--background)]">
      {/* Hero Section (Mindcare Interactive Slider) */}
      <HeroSlider />

      {/* Webinar Calendar Section */}
      <WebinarCalendar />

      {/* Services Section */}
      <section className="w-full py-24 bg-[var(--background)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-[56px] font-serif text-[var(--foreground)] mb-6 leading-tight">
              Support Tailored <span className="text-[var(--primary)] italic">to Your Needs</span>
            </h2>
            <p className="text-[var(--text-gray)] text-lg">Compassionate therapy for every stage of life.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service, idx) => {
              const bgColors = ['bg-[#FDFDFD]', 'bg-[#FDF0BE]', 'bg-[#FAD9D3]', 'bg-[#BBD0BD]'];
              const bgClass = bgColors[idx];

              return (
                <div key={idx} className="flex flex-col group h-full">
                  {/* Top Image Half */}
                  <div className="w-full h-64 relative rounded-t-[32px] overflow-hidden bg-[#D4DFD7]">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop')` }}>
                    </div>
                  </div>
                  {/* Bottom Colored Half */}
                  <div className={`${bgClass} flex-grow rounded-b-[32px] p-8 md:p-10 flex flex-col justify-between items-start`}>
                    <div>
                      <h3 className="text-[28px] font-serif text-[var(--foreground)] mb-4 leading-tight">{service.title}</h3>
                      <p className="text-[var(--text-gray)] text-base leading-relaxed mb-6">{service.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AIBAPT Stats Section */}
      <AibaptStats />

      {/* AIBAPT Trauma Info Section */}
      <AibaptTraumaInfo />

      {/* AIBAPT Value Props Section */}
      <AibaptValueProps />

      {/* AIBAPT Events Section */}
      <AibaptEvents />

      {/* AIBAPT FAQ Section */}
      <AibaptFAQ />

    </div>
  );
}
