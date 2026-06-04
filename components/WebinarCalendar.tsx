"use client";

import { useState } from "react";
import Link from "next/link";

const webinars: Record<number, { title: string; time: string; speaker: string; desc: string; available: number }> = {
  5: {
    title: "Understanding Anxiety",
    time: "18:00 - 19:30",
    speaker: "Dr. Emily Carter",
    desc: "A comprehensive guide to managing daily stress and anxiety triggers. We will explore evidence-based strategies and mindfulness techniques to help you regain control and find inner peace.",
    available: 12
  },
  12: {
    title: "Couples Communication",
    time: "19:00 - 20:30",
    speaker: "Michael Johnson",
    desc: "Learn effective strategies to communicate better with your partner. This session covers active listening, resolving conflicts healthily, and building a stronger emotional connection.",
    available: 8
  },
  19: {
    title: "Navigating Teen Emotions",
    time: "17:00 - 18:30",
    speaker: "Dr. Sarah Mitchell",
    desc: "Tools for parents to support adolescents through emotional changes. We'll discuss the developing teenage brain, setting healthy boundaries, and fostering open dialogue at home.",
    available: 5
  },
  26: {
    title: "Burnout Recovery",
    time: "18:30 - 20:00",
    speaker: "Dr. Emily Carter",
    desc: "Identifying the signs of burnout and actionable steps to reclaim your energy. Perfect for professionals feeling overwhelmed by the demands of modern life.",
    available: 15
  }
};

export default function WebinarCalendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(19);
  
  const selectedEvent = selectedDate ? webinars[selectedDate] : null;

  return (
    <section className="w-full bg-[#F4F1EB] py-24 px-4 sm:px-8 lg:px-[140px] flex flex-col lg:flex-row gap-16 xl:gap-32 items-center lg:items-start justify-center">
      {/* Left: Calendar Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden shrink-0">
        {/* Header */}
        <div className="bg-[#0F75A1] text-white p-5 flex justify-between items-center">
          <button className="text-white hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="font-bold tracking-[0.1em] text-[15px]">JUNE 2026</span>
          <button className="text-white hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-[#0D658C] text-white text-[11px] font-semibold tracking-wider py-3">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-[15px] text-center">
          {Array.from({ length: 35 }).map((_, i) => {
            const date = i + 1;
            const isValidDate = date <= 30;
            const isGreyCol = i % 2 !== 0; 
            const isEvent = isValidDate ? webinars[date] : null;
            const isSelected = selectedDate === date;
            const isCurrentDay = date === 4;

            return (
              <div 
                key={i} 
                className={`h-[65px] flex items-center justify-center relative ${isGreyCol ? 'bg-[#F9F9F9]' : 'bg-white'} ${isValidDate ? 'text-[#555555]' : 'text-transparent pointer-events-none'}`}
              >
                {isEvent ? (
                  <button 
                    onClick={() => setSelectedDate(date)}
                    className={`w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center group ${isSelected ? 'bg-[#C89B7B] text-white shadow-md scale-105' : 'hover:bg-[#E8D5C8] text-[#333333]'}`}
                  >
                    <span>{date}</span>
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-white shadow-lg text-[#333333] text-xs font-medium py-1.5 px-3 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-10 pointer-events-none">
                      {isEvent.available} Available
                      {/* Tooltip Arrow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </div>
                  </button>
                ) : isValidDate ? (
                  <div className={`w-11 h-11 flex items-center justify-center rounded-full ${isCurrentDay ? 'border-2 border-[#0F75A1] text-[#0F75A1] font-medium' : ''}`}>
                    {date}
                  </div>
                ) : (
                  <span>{date}</span> // Hidden text to keep cell size
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Details Panel */}
      <div className="flex-1 max-w-[540px]">
        <p className="text-[#C89B7B] text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">Webinar Details</p>
        
        {selectedEvent ? (
          <div key={selectedDate} className="animate-fade-in-up">
            <h2 className="text-4xl md:text-[44px] font-serif text-[#261C4F] mb-6 leading-tight">{selectedEvent.title}</h2>
            <p className="text-[#666666] text-lg leading-relaxed mb-10">{selectedEvent.desc}</p>
            
            <div className="border-t border-[#E5E5E5] py-5 flex justify-between items-center">
               <span className="font-serif text-[#261C4F] text-xl">{selectedEvent.speaker}</span>
               <span className="text-[#666666]">{selectedEvent.time}</span>
            </div>
            <div className="border-t border-[#E5E5E5] mb-10"></div>
            
            <button className="bg-[#C89B7B] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#B0876B] transition-colors shadow-sm text-[15px]">
              Register Now
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-4xl md:text-[44px] font-serif text-[#261C4F] mb-6 leading-tight">Select a date</h2>
            <p className="text-[#666666] text-lg leading-relaxed">Click on a highlighted date in the calendar to view webinar details and register for our upcoming online sessions.</p>
          </div>
        )}

        <div className="mt-14">
          <Link href="/webinars" className="text-[#0F75A1] font-medium hover:text-[#0D658C] flex items-center gap-2 transition-colors w-fit group">
            View all upcoming webinars 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
