"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CakeOrderForm from "@/components/CakeOrderForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CustomCakesPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animations for Hero
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-title", {
        y: 25,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-tagline",
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".milestone-step",
          {
            y: 12,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.3"
        );
    },
    { scope: pageRef }
  );

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-secondary-white text-secondary-brown relative"
    >
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 flex flex-col gap-10 sm:gap-14">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Hero Title in The Seasons */}
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-secondary-brown tracking-tight leading-tight mb-4">
            Custom Cakes
          </h1>

          {/* Tagline in primary-mustard */}
          <p className="hero-tagline text-lg sm:text-xl md:text-2xl text-primary-mustard font-sans font-medium max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            Freshly baked custom cakes made for your special celebrations and milestones
          </p>

          {/* 3-Step Mini Horizontal Milestone Indicator */}
          <div className="w-full max-w-2xl mx-auto pt-2 pb-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2 px-4 py-3 sm:py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary-mustard/20 shadow-sm font-sans text-xs sm:text-sm">
              
              {/* Step 1 */}
              <div className="milestone-step flex items-center gap-2 text-secondary-brown font-semibold">
                <span className="w-6 h-6 rounded-full bg-primary-teal text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  1
                </span>
                <span>Choose Cake Size</span>
              </div>

              {/* Connector Arrow 1 */}
              <div className="hidden sm:flex items-center text-primary-mustard/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="milestone-step flex items-center gap-2 text-secondary-brown font-semibold">
                <span className="w-6 h-6 rounded-full bg-primary-teal text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  2
                </span>
                <span>Pick Your Flavour</span>
              </div>

              {/* Connector Arrow 2 */}
              <div className="hidden sm:flex items-center text-primary-mustard/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="milestone-step flex items-center gap-2 text-secondary-brown font-semibold">
                <span className="w-6 h-6 rounded-full bg-primary-teal text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  3
                </span>
                <span>Share Your Design</span>
              </div>

            </div>
          </div>
        </section>

        {/* CAKE ORDER FORM & SUMMARY */}
        <section className="w-full">
          <CakeOrderForm />
        </section>

      </div>
    </div>
  );
}
