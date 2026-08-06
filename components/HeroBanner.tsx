"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroBanner() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".animate-up", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.1,
    });
  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="flex flex-col items-center justify-center text-center py-24 md:py-32 px-4 sm:px-6 flex-1 min-h-[80vh] relative overflow-hidden"
    >
      <div className="z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-4 sm:mb-6 text-secondary-brown tracking-tight leading-tight">
          Kapi's Bakehouse
        </h1>
        <p className="animate-up text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10 text-primary-mustard font-medium">
          Fresh Bakes &bull; Happy Days
        </p>
        <div className="animate-up mt-2 sm:mt-4">
          <Link 
            href="/menu" 
            className="inline-block bg-primary-teal text-secondary-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            View Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
