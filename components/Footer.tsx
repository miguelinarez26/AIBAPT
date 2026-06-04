import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#E8ECE1] pt-16 pb-8 border-t border-[#D1D6C9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-2xl font-serif text-[#7A8B76] font-semibold mb-6">
              Online Therapy
            </div>
            <p className="text-[#333333] text-sm leading-relaxed mb-6">
              Providing professional online therapy and counseling services to help you navigate life's challenges.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-[#333333] mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-[#333333]">
              <li><Link href="/about" className="hover:text-[#D28C67]">About Us</Link></li>
              <li><Link href="/services" className="hover:text-[#D28C67]">Our Services</Link></li>
              <li><Link href="/therapists" className="hover:text-[#D28C67]">Our Therapists</Link></li>
              <li><Link href="/appointment" className="hover:text-[#D28C67]">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-[#333333] mb-6">Services</h3>
            <ul className="space-y-4 text-sm text-[#333333]">
              <li><Link href="/services/individual" className="hover:text-[#D28C67]">Individual Therapy</Link></li>
              <li><Link href="/services/couples" className="hover:text-[#D28C67]">Couples Therapy</Link></li>
              <li><Link href="/services/family" className="hover:text-[#D28C67]">Family Counseling</Link></li>
              <li><Link href="/services/teen" className="hover:text-[#D28C67]">Teen Therapy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-[#333333] mb-6">Contact</h3>
            <ul className="space-y-4 text-sm text-[#333333]">
              <li>hello@onlinetherapy.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Available 24/7 online</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#D1D6C9] flex flex-col md:flex-row justify-between items-center text-xs text-[#333333]">
          <p>© {new Date().getFullYear()} Online Therapy. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#D28C67]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#D28C67]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
