"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=2000&auto=format&fit=crop",
    lines: [
      { text: "Be empathetic", bg: "bg-[#a15547]" },
      { text: "and patient", bg: "bg-[#a15547]", ml: "ml-12 md:ml-32" },
      { text: "with kids", bg: "bg-[#d58f76]", ml: "ml-6 md:ml-16" }
    ],
    align: "left"
  },
  {
    id: 2,
    image: "https://mindcare.qodeinteractive.com/wp-content/uploads/2019/12/h3-rev-img-2-1.jpg",
    lines: [
      { text: "Psychology", bg: "bg-[#d58f76]" },
      { text: "programme", bg: "bg-[#a15547]", mr: "mr-8 md:mr-20" },
      { text: "school", bg: "bg-[#d58f76]", mr: "mr-4 md:mr-10" }
    ],
    align: "right"
  },
  {
    id: 3,
    image: "https://mindcare.qodeinteractive.com/wp-content/uploads/2019/12/h3-rev-img-3.jpg",
    lines: [
      { text: "Teenager needs", bg: "bg-[#a15547]" },
      { text: "girls & boys", bg: "bg-[#d58f76]", ml: "ml-8 md:ml-20" }
    ],
    align: "left"
  }
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="w-full h-[calc(100vh-96px)] relative overflow-hidden group bg-black">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === activeSlide ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        ></div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-4 sm:px-12 lg:px-[140px]">
        {/* We use key={activeSlide} to force re-render and re-trigger animations */}
        <div key={activeSlide} className={`flex flex-col gap-4 ${slides[activeSlide].align === 'right' ? 'items-end' : 'items-start'}`}>
          {slides[activeSlide].lines.map((line: any, i) => (
            <div key={i} className={`relative inline-block w-fit ${line.ml || ''} ${line.mr || ''}`}>
              <div 
                className={`absolute inset-0 ${line.bg} -left-6 -right-6 -top-2 -bottom-2 z-0 origin-left animate-reveal-bg`} 
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
              ></div>
              <h1 
                className="relative z-10 text-white font-serif text-[60px] md:text-[100px] leading-[0.9] tracking-tight font-semibold animate-fade-in-up" 
                style={{ animationDelay: `${i * 150 + 200}ms`, animationFillMode: 'both' }}
              >
                {line.text}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Controls (Arrows) */}
      <div onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20 p-4">
        <svg width="40" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </div>
      <div onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20 p-4">
        <svg width="40" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <div 
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
              idx === activeSlide ? "bg-[#d58f76]" : "bg-white/50 hover:bg-white"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
}
