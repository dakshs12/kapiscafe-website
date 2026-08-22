import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-secondary-brown text-secondary-white pt-16 pb-8 px-8 md:px-16 lg:px-24 border-t-[6px] border-primary-mustard mt-auto z-10 relative">
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col items-center sm:items-start space-y-6">
          <Link href="/">
            <Image 
              src="/kapis-logo.svg" 
              alt="Kapi's Bakehouse" 
              width={200} 
              height={70} 
              className="w-44 md:w-52 h-auto object-contain" 
            />
          </Link>
          <p className="text-base md:text-lg font-sans text-secondary-white/80 text-center sm:text-left max-w-sm leading-relaxed">
            Born in Pithampur. Made with love. Baked fresh. Your daily dose of happiness in every bite.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col items-center sm:items-start space-y-6 lg:pl-8">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-mustard tracking-wide">Quick Links</h3>
          <ul className="flex flex-col space-y-3 font-sans text-base md:text-lg text-center sm:text-left">
            <li>
              <Link href="/" className="hover:text-primary-mustard transition-colors duration-300">Home</Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-primary-mustard transition-colors duration-300">Our Menu</Link>
            </li>
            <li>
              <Link href="/custom-cakes" className="hover:text-primary-mustard transition-colors duration-300">Custom Cakes</Link>
            </li>
            <li>
              <Link href="/location" className="hover:text-primary-mustard transition-colors duration-300">Location & Hours</Link>
            </li>
          </ul>
        </div>

        {/* Socials Column */}
        <div className="flex flex-col items-center sm:items-start space-y-6 lg:pl-8">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-mustard tracking-wide">Follow Us</h3>
          <ul className="flex flex-col space-y-3 font-sans text-base md:text-lg text-center sm:text-left">
            <li>
              <a href="https://www.instagram.com/kapisbakehouse/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-mustard transition-colors duration-300">Instagram</a>
            </li>
            <li>
              <a href="https://www.facebook.com/people/Kapis-Bake-House/61576453959869/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-mustard transition-colors duration-300">Facebook</a>
            </li>
          </ul>
        </div>

        {/* Location & Contact Column */}
        <div className="flex flex-col items-center sm:items-start space-y-6">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-mustard tracking-wide">Visit Us</h3>
          <div className="flex flex-col space-y-3 font-sans text-base md:text-lg text-center sm:text-left text-secondary-white/80">
            <p>
              <a href="https://maps.app.goo.gl/QsVUuLzjFhJMsGos6" target="_blank" rel="noopener noreferrer" className="hover:text-primary-mustard transition-colors duration-300">
                112, Medicaps Business Park, <br />Mhow-Neemuch Road, Pithampur
              </a>
            </p>
            <p>
              <a href="mailto:hello@kapisbakehouse.com" className="hover:text-primary-mustard transition-colors duration-300">hello@kapisbakehouse.com</a>
            </p>
            <p>
              <a href="tel:+919876543210" className="hover:text-primary-mustard transition-colors duration-300">+91 98765 43210</a>
            </p>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="w-full mx-auto pt-8 border-t border-secondary-white/10 flex items-center justify-center text-sm md:text-base font-sans text-secondary-white/50">
        <p>&copy; {new Date().getFullYear()} Kapi's Bakehouse. All rights reserved.</p>
      </div>
    </footer>
  );
}
