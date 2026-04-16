import React from 'react';

export const VisaIcon = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center justify-center ${className}`}>
        <span className="text-[#1A1F71] font-[900] italic tracking-[-0.1em] text-lg select-none" style={{ fontFamily: 'sans-serif' }}>
            VISA
        </span>
    </div>
);

export const MastercardIcon = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center justify-center ${className}`}>
        <div className="relative w-8 h-5 flex items-center justify-center">
            <div className="absolute left-0 w-5 h-5 rounded-full bg-[#EB001B]"></div>
            <div className="absolute right-0 w-5 h-5 rounded-full bg-[#F79E1B] opacity-80"></div>
        </div>
    </div>
);

export const PayPalLogo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center justify-center gap-0.5 ${className}`}>
        <span className="text-[#003087] font-black italic text-lg tracking-tighter select-none">Pay</span>
        <span className="text-[#009cde] font-black italic text-lg tracking-tighter select-none">Pal</span>
    </div>
);
