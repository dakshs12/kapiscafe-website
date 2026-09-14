"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", desktopName: "Home", href: "/", number: "01" },
    { name: "Our Menu", desktopName: "Menu", href: "/menu", number: "02" },
    { name: "Custom Cakes", desktopName: "Custom Cakes", href: "/custom-cakes", number: "03" },
    { name: "Location & Hours", desktopName: "Location", href: "/location", number: "04" },
  ];

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 w-full relative transition-all duration-300 ${
          isScrolled 
            ? "bg-secondary-white/90 backdrop-blur-md py-2.5 sm:py-3 shadow-md" 
            : "bg-secondary-white py-3 sm:py-3.5 md:py-4"
        }`}
      >
        {/* Minimal Glowing Brand Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-mustard shadow-[0_0_6px_0px] shadow-primary-mustard/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity z-50 relative">
            <Image 
              src="/kapis-logo.svg" 
              alt="Kapi's Bakehouse" 
              width={130} 
              height={46} 
              className="w-28 sm:w-32 md:w-36 h-auto object-contain"
              priority
              loading="eager"
            />
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`relative font-semibold text-sm lg:text-base tracking-wide transition-colors group flex justify-center ${
                    isActive ? "text-primary-teal" : "text-secondary-brown hover:text-primary-teal"
                  }`}
                >
                  {link.desktopName}
                  
                  {/* Animated Underline */}
                  <span 
                    className={`absolute -bottom-1 left-0 h-[2px] bg-primary-teal transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Right: CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 sm:gap-6 z-50 relative">
            <Link 
              href="/menu" 
              className="hidden sm:flex items-center justify-center px-5 py-2 bg-primary-mustard text-secondary-white font-semibold text-sm sm:text-base rounded-full shadow-md shadow-primary-mustard/20 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              Order Online
            </Link>

            {/* Hamburger Button */}
            <button 
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-secondary-brown transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`w-6 h-0.5 bg-secondary-brown transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
              <span className={`w-6 h-0.5 bg-secondary-brown transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Professional Mobile Menu Overlay (z-[100] to sit above all page elements) */}
      <div 
        className={`fixed inset-0 bg-secondary-white z-[100] flex flex-col justify-between transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
      >
        {/* Top Header inside overlay */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between border-b border-primary-mustard/20 bg-secondary-white">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/kapis-logo.svg" 
              alt="Kapi's Bakehouse" 
              width={120} 
              height={42} 
              className="w-28 sm:w-32 h-auto object-contain"
            />
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-secondary-brown/5 hover:bg-secondary-brown/10 flex items-center justify-center text-secondary-brown transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Central Navigation Items */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 max-w-md mx-auto w-full py-6">
          <span className="text-[11px] uppercase tracking-widest font-bold text-primary-mustard font-sans mb-3">
            Navigation
          </span>

          <div className="flex flex-col divide-y divide-secondary-brown/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-4 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-baseline gap-3.5">
                    <span className={`text-xs font-mono font-bold tracking-wider transition-colors ${
                      isActive ? "text-primary-teal" : "text-primary-mustard/70 group-hover:text-primary-mustard"
                    }`}>
                      {link.number}
                    </span>
                    <span className={`font-serif text-2xl sm:text-3xl font-bold transition-all duration-200 ${
                      isActive 
                        ? "text-primary-teal translate-x-1" 
                        : "text-secondary-brown group-hover:text-primary-mustard group-hover:translate-x-1"
                    }`}>
                      {link.name}
                    </span>
                  </div>

                  <svg 
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive 
                        ? "text-primary-teal opacity-100" 
                        : "text-secondary-brown/30 opacity-0 group-hover:opacity-100 group-hover:text-primary-mustard group-hover:translate-x-1"
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link 
              href="/menu" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary-mustard hover:bg-primary-mustard/90 text-white font-sans font-bold text-base shadow-md flex items-center justify-center gap-2 tracking-wide transition-all active:scale-[0.99]"
            >
              <span>Order Online</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Bar inside overlay */}
        <div className="px-6 py-4 border-t border-secondary-brown/10 bg-[#FAF7F2] text-center font-sans">
          <p className="text-xs text-secondary-brown/75 font-medium">
            Born in Pithampur • Fresh Bakes, Happy Days
          </p>
          <p className="text-[11px] text-primary-mustard font-semibold mt-0.5">
            +91 91099 91600
          </p>
        </div>
      </div>
    </>
  );
}
