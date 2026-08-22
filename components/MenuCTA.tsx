"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MenuCTA() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current || !contentRef.current) return;

    // Animate the card scaling and fading in
    gsap.fromTo(
      cardRef.current,
      { scale: 0.95, opacity: 0, y: 40 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );

    // Stagger the text inside
    gsap.fromTo(
      contentRef.current.children,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-10 px-4 md:py-16 md:px-8 bg-secondary-white overflow-hidden flex justify-center">
      <div 
        ref={cardRef} 
        className="w-full max-w-5xl bg-secondary-brown rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-mustard/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        {/* Left Side: Image */}
        <div className="w-full md:w-5/12 relative h-56 md:h-auto min-h-[250px]">
          <Image 
            src="/cakes.jpg" 
            alt="Delicious baked goods" 
            fill
            className="object-cover"
          />
          {/* Gradient overlay to blend with the dark background */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-secondary-brown via-secondary-brown/40 to-transparent" />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center relative z-10">
          <div ref={contentRef} className="flex flex-col items-start space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-secondary-white leading-tight">
              Craving Something <br/><span className="text-primary-mustard italic">Delicious?</span>
            </h2>
            <p className="text-sm md:text-base text-secondary-white/80 font-sans leading-relaxed max-w-sm">
              Explore our wide range of freshly baked breads, custom cakes, and artisanal savouries made to perfection.
            </p>
            <div className="pt-2">
              <Link 
                href="/menu" 
                className="group inline-flex items-center px-6 py-3 bg-primary-mustard text-secondary-brown font-sans font-bold text-base rounded-full transition-all duration-300 hover:bg-secondary-white hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span>Explore Full Menu</span>
                <svg className="w-4 h-4 ml-2 -mr-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
