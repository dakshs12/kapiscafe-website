import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-secondary-brown text-secondary-white pt-8 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 md:px-10 lg:px-12 border-t-[5px] border-primary-mustard mt-auto z-10 relative">
      {/* MOBILE LAYOUT (< sm) */}
      <div className="sm:hidden flex flex-col mb-6">
        {/* Row 1: Logo on Left, Tagline on Right */}
        <div className="flex items-center gap-4 text-left">
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/kapis-logo.svg" 
              alt="Kapi's Bakehouse" 
              width={110} 
              height={38} 
              className="w-24 h-auto object-contain" 
            />
          </Link>
          <p className="text-xs font-sans text-secondary-white/85 leading-relaxed">
            Born in Pithampur. Made with love. Baked fresh. Your daily dose of happiness in every bite.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-white/10 my-5"></div>

        {/* Row 2: Visit Us on Left, Follow Us on Right */}
        <div className="grid grid-cols-2 gap-4 text-left items-start">
          {/* Left Column: Visit Us */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-serif font-bold text-primary-mustard tracking-wide">
              Visit Us
            </h3>
            <div className="flex flex-col space-y-1.5 font-sans text-xs text-secondary-white/80">
              <p>
                <a 
                  href="https://maps.app.goo.gl/QsVUuLzjFhJMsGos6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary-mustard transition-colors duration-300 leading-snug block"
                >
                  112, Medicaps Business Park, Pithampur
                </a>
              </p>
              <p>
                <a 
                  href="mailto:kitchen@kapisbakehouse.com" 
                  className="hover:text-primary-mustard transition-colors duration-300 text-[11px] break-all block"
                >
                  kitchen@kapisbakehouse.com
                </a>
              </p>
              <p className="flex flex-col space-y-0.5 text-[11px]">
                <a href="tel:+919109991600" className="hover:text-primary-mustard transition-colors duration-300">
                  +91 91099 91600
                </a>
                <a href="tel:+919109991601" className="hover:text-primary-mustard transition-colors duration-300">
                  +91 91099 91601
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Follow Us */}
          <div className="flex flex-col space-y-2 pl-2">
            <h3 className="text-sm font-serif font-bold text-primary-mustard tracking-wide">
              Follow Us
            </h3>
            <ul className="flex flex-col space-y-1.5 font-sans text-xs text-secondary-white/80">
              <li>
                <a 
                  href="https://www.instagram.com/kapisbakehouse/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary-mustard transition-colors duration-300 flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/people/Kapis-Bake-House/61576453959869/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary-mustard transition-colors duration-300 flex items-center gap-1.5"
                >
                  <span>Facebook</span>
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 3: Quick Links at the End */}
        <div className="border-t border-secondary-white/10 mt-5 pt-4 text-left">
          <span className="text-[11px] uppercase tracking-wider font-bold text-primary-mustard font-sans block mb-2">
            Quick Links
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-secondary-white/80">
            <Link href="/" className="hover:text-primary-mustard transition-colors">Home</Link>
            <span className="text-secondary-white/30">•</span>
            <Link href="/menu" className="hover:text-primary-mustard transition-colors">Our Menu</Link>
            <span className="text-secondary-white/30">•</span>
            <Link href="/custom-cakes" className="hover:text-primary-mustard transition-colors">Custom Cakes</Link>
            <span className="text-secondary-white/30">•</span>
            <Link href="/location" className="hover:text-primary-mustard transition-colors">Location & Hours</Link>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (sm: and above) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8 sm:mb-12 max-w-7xl mx-auto">
        
        {/* Brand Column */}
        <div className="flex flex-col items-start space-y-4 sm:space-y-5">
          <Link href="/">
            <Image 
              src="/kapis-logo.svg" 
              alt="Kapi's Bakehouse" 
              width={160} 
              height={56} 
              className="w-36 sm:w-40 md:w-44 h-auto object-contain" 
            />
          </Link>
          <p className="text-sm sm:text-base font-sans text-secondary-white/80 text-left max-w-sm leading-relaxed">
            Born in Pithampur. Made with love. Baked fresh. Your daily dose of happiness in every bite.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col items-start space-y-4 sm:space-y-5 lg:pl-6">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-primary-mustard tracking-wide">Quick Links</h3>
          <ul className="flex flex-col space-y-2.5 font-sans text-sm sm:text-base text-left">
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
        <div className="flex flex-col items-start space-y-4 sm:space-y-5 lg:pl-6">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-primary-mustard tracking-wide">Follow Us</h3>
          <ul className="flex flex-col space-y-2.5 font-sans text-sm sm:text-base text-left">
            <li>
              <a href="https://www.instagram.com/kapisbakehouse/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-mustard transition-colors duration-300">Instagram</a>
            </li>
            <li>
              <a href="https://www.facebook.com/people/Kapis-Bake-House/61576453959869/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-mustard transition-colors duration-300">Facebook</a>
            </li>
          </ul>
        </div>

        {/* Location & Contact Column */}
        <div className="flex flex-col items-start space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-primary-mustard tracking-wide">Visit Us</h3>
          <div className="flex flex-col space-y-2.5 font-sans text-sm sm:text-base text-left text-secondary-white/80">
            <p>
              <a href="https://maps.app.goo.gl/QsVUuLzjFhJMsGos6" target="_blank" rel="noopener noreferrer" className="hover:text-primary-mustard transition-colors duration-300">
                112, Medicaps Business Park, <br />Mhow-Neemuch Road, Pithampur
              </a>
            </p>
            <p>
              <a href="mailto:kitchen@kapisbakehouse.com" className="hover:text-primary-mustard transition-colors duration-300">kitchen@kapisbakehouse.com</a>
            </p>
            <p className="flex flex-col space-y-1">
              <a href="tel:+919109991600" className="hover:text-primary-mustard transition-colors duration-300">+91 91099 91600</a>
              <a href="tel:+919109991601" className="hover:text-primary-mustard transition-colors duration-300">+91 91099 91601</a>
            </p>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-4 sm:pt-8 border-t border-secondary-white/10 flex items-center justify-center text-xs sm:text-sm font-sans text-secondary-white/50">
        <p>&copy; {new Date().getFullYear()} Kapi's Bakehouse. All rights reserved.</p>
      </div>
    </footer>
  );
}
