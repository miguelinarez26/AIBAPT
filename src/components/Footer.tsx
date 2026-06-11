import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-background-light pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Link href="/">
                <Image 
                  src="/images/logo_aibapt.png" 
                  alt="AIBAPT Logo" 
                  width={240} 
                  height={80} 
                  className="object-contain w-auto h-16"
                />
              </Link>
            </div>
            <p className="text-text-light text-sm leading-relaxed mb-6">
              Providing professional online therapy and counseling services to help you navigate life's challenges.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-text-light mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-text-light">
              <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
              <li><Link href="/services" className="hover:text-accent">Our Services</Link></li>
              <li><Link href="/therapists" className="hover:text-accent">Our Therapists</Link></li>
              <li><Link href="/appointment" className="hover:text-accent">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-text-light mb-6">Services</h3>
            <ul className="space-y-4 text-sm text-text-light">
              <li><Link href="/services/individual" className="hover:text-accent">Individual Therapy</Link></li>
              <li><Link href="/services/couples" className="hover:text-accent">Couples Therapy</Link></li>
              <li><Link href="/services/family" className="hover:text-accent">Family Counseling</Link></li>
              <li><Link href="/services/teen" className="hover:text-accent">Teen Therapy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-text-light mb-6">Contact</h3>
            <ul className="space-y-4 text-sm text-text-light">
              <li>hello@onlinetherapy.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Available 24/7 online</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-text-light">
          <p>© {new Date().getFullYear()} Online Therapy. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
