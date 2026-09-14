"use client";

import React from "react";
import CakeOrderForm from "@/components/CakeOrderForm";

export default function CustomCakesPage() {
  return (
    <div
      className="min-h-screen bg-secondary-white text-secondary-brown relative"
    >
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12 lg:py-14 flex flex-col gap-8 sm:gap-10">

        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto flex flex-col items-center">

          {/* Hero Title in The Seasons */}
          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary-brown tracking-tight leading-tight mb-3 sm:mb-4">
            Custom Cakes
          </h1>

          {/* Tagline in primary-mustard */}
          <p className="hero-tagline text-base sm:text-lg md:text-xl text-primary-mustard font-sans font-medium max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
            Freshly baked custom cakes made for your special celebrations.
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
