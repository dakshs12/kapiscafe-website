"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LocationInfo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Left column slides in from left
    gsap.from(leftColRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

    // Right column slides in from right
    gsap.from(rightColRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch">
      {/* Left Column */}
      <div ref={leftColRef} className="flex flex-col justify-center gap-8 text-secondary-brown font-sans p-2 sm:p-4 md:p-8">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
            Visit Kapi's Bakehouse
          </h2>
          <p className="text-lg leading-relaxed text-secondary-brown/90">
            We can't wait to welcome you. Stop by to enjoy our freshly baked artisan breads, decadent cakes, and aromatic coffee in a warm, inviting atmosphere.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Address */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-mustard mb-2">
              Our Bakery
            </h3>
            <p className="text-xl leading-relaxed">
              112, Medicaps Business Park, Mhow-Neemuch Road,<br />
              Pithampur, Madhya Pradesh, 454775
            </p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-mustard mb-2">
              Opening Hours
            </h3>
            <p className="text-xl leading-relaxed">
              Monday &ndash; Sunday<br />
              8:00 AM &ndash; 10:00 PM
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-mustard mb-2">
              Get in Touch
            </h3>
            <p className="text-xl leading-relaxed">
              +91 91099 91600<br />
              +91 91099 91601<br />
              kitchen@kapisbakehouse.com
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div ref={rightColRef} className="w-full h-[400px] md:h-auto min-h-[500px] p-2 sm:p-4 md:p-8">
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-xl border-4 border-white/50">
          <iframe
            src="https://www.google.com/maps?q=112,+Medicaps+Business+Park,+Mhow-Neemuch+Road,+Pithampur&output=embed"
            className="absolute top-0 left-0 w-full h-full border-0 transition-all duration-700"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
