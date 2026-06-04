export default function AibaptStats() {
  const stats = [
    { number: "500+", label: "MIEMBROS ACTIVOS" },
    { number: "20+", label: "PAÍSES" },
    { number: "50+", label: "EVENTOS ANUALES" },
    { number: "12", label: "INVESTIGACIONES" },
  ];

  return (
    <section className="w-full py-20 bg-white border-t border-[#e5e5e5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-[#e5e5e5]">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center pt-8 md:pt-0 first:pt-0">
              <h3 className="text-5xl md:text-[64px] font-serif text-[#261C4F] mb-3">{stat.number}</h3>
              <p className="text-[#C89B7B] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
