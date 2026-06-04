import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-[var(--background)] z-50 sticky top-0 transition-all duration-300">
      <div className="w-full px-4 md:px-8 lg:px-[140px] h-24 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* Clover/Heart Icon SVG */}
          <div className="text-[#4D9595] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="text-3xl text-[#333333] tracking-tight flex items-center">
            Online<span className="font-serif italic text-[#4D9595]">Therapy</span>
          </div>
        </div>
        
        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-2 font-medium text-base text-[#333333]">
          {/* Home - Active state pill */}
          <Link href="/" className="bg-[#F8DAD2] px-5 py-2 rounded-full transition-all duration-300">Home</Link>
          
          {/* Services with Mega Menu */}
          <div className="group relative">
            <Link href="/services" className="flex items-center gap-1 px-5 py-2 rounded-full hover:bg-[#F8DAD2] transition-all duration-300">
              Services 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-[40%] w-[650px] h-[450px] bg-[#F7EFE5] rounded-[32px] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 overflow-hidden z-50">
              {/* Mega Menu Image Side */}
              <div className="relative w-full h-full bg-gray-200">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop')" }}></div>
                {/* Contact Us Pill floating over image */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 group/btn cursor-pointer">
                  <Link href="/contact" className="bg-[#F2E2C6] text-[#333333] px-5 py-2.5 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center">Contact Us</Link>
                  <Link href="/contact" className="bg-[#F2E2C6] text-[#333333] w-[38px] h-[38px] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
              {/* Mega Menu Links Side */}
              <div className="px-10 py-8 flex flex-col justify-between h-full">
                <h3 className="text-[26px] font-serif italic text-[#333333] tracking-tight">All Services</h3>
                <div className="flex flex-col gap-1 text-[#555555] text-[14px] font-light">
                  <Link href="/services/individual" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Individual Therapy</Link>
                  <Link href="/services/couples" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Couples Therapy</Link>
                  <Link href="/services/family" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Family Counseling</Link>
                  <Link href="/services/teen" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Teen Therapy</Link>
                  <Link href="/services/depression" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Depression Therapy</Link>
                  <Link href="/services/supportive" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Supportive Counseling</Link>
                  <Link href="/services/trauma" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Trauma & PTSD Therapy</Link>
                  <Link href="/services/burnout" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Burnout Recovery</Link>
                  <Link href="/services/self-esteem" className="block px-4 py-2 -mx-4 rounded-md hover:bg-[#FADCD4] hover:text-[#333333] transition-colors">Self-Esteem Counseling</Link>
                </div>
              </div>

            </div>
          </div>

          <div className="group relative">
            <Link href="/therapists" className="flex items-center gap-1 px-5 py-2 rounded-full hover:bg-[#F8DAD2] transition-all duration-300">
              Therapists 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </Link>
          </div>
          
          <div className="group relative">
            <Link href="/pages" className="flex items-center gap-1 px-5 py-2 rounded-full hover:bg-[#F8DAD2] transition-all duration-300">
              Pages 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </Link>
          </div>
          
          <Link href="/contacts" className="px-5 py-2 rounded-full hover:bg-[#F8DAD2] transition-all duration-300">Contacts</Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="text-[#333333] hover:text-[#4D9595] p-2 transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          
          <div className="flex items-center gap-2 group cursor-pointer">
            <Link href="/appointment" className="bg-[#4D9595] text-white px-7 py-3 rounded-full font-medium transition-transform duration-300 group-hover:-translate-y-1">
              Get Started
            </Link>
            <Link href="/appointment" className="bg-[#4D9595] text-white w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
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
