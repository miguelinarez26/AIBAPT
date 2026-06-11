"use client";

import { useState } from "react";

export default function AibaptFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(1);

  const faqs = Array(10).fill(null).map((_, i) => ({
    question: `Lorem ipsum dolor sit amet, consectetur adipiscing elit ${i + 1}?`,
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  }));

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-background-light px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-4xl md:text-[56px] font-serif text-text-light leading-[1.1] mb-12">
          Preguntas Frecuentes
        </h2>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            
            return (
              <div 
                key={index} 
                className={`w-full rounded-[24px] overflow-hidden transition-all duration-300 cursor-pointer ${isActive ? 'bg-highlight' : 'bg-white hover:bg-white/90'}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="px-8 py-6 md:py-8 flex justify-between items-center">
                  <h3 className="text-[22px] md:text-[26px] font-serif text-text-light pr-4">
                    {faq.question}
                  </h3>
                  <div className="shrink-0 text-text-light">
                    {isActive ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-text-dark text-[16px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
