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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Menu", href: "/menu", icon: "🍕" },
    { name: "Custom Cakes", href: "/custom-cakes", icon: "🎂" },
    { name: "Location", href: "/location", icon: "📍" },
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
                  {link.name}
                  
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
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5"
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-secondary-white z-40 flex flex-col justify-center items-center transition-all duration-500 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`font-serif text-4xl font-bold transition-colors flex items-center gap-3 ${
                  isActive ? "text-primary-teal" : "text-secondary-brown"
                }`}
              >
                <span>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
          <Link 
            href="/menu" 
            className="mt-4 px-8 py-4 bg-primary-mustard text-secondary-white font-serif text-xl rounded-full shadow-lg"
          >
            Order Online
          </Link>
        </div>
      </div>
    </>
  );
}
