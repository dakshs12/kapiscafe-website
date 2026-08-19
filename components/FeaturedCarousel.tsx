"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const items = [
  {
    id: 1,
    title: "Customised Cakes",
    description: "Bespoke handcrafted cakes made to celebrate your sweetest moments and special occasions.",
    image: "/cakes.jpg",
  },
  {
    id: 2,
    title: "Chocolaty Brownies",
    description: "Fudgy, rich, and loaded with premium chocolate for an intensely decadent treat.",
    image: "/brownie.jpeg",
  },
  {
    id: 3,
    title: "Signature Cookies",
    description: "Freshly baked with pure butter, rich aroma, and the perfect melt-in-your-mouth crunch.",
    image: "/cookies.jpg",
  },
  {
    id: 4,
    title: "Gift Hampers",
    description: "Thoughtfully curated hampers overflowing with gourmet baked delights, perfect for gifting.",
    image: "/gifthamper.jpg",
  },
];

export default function FeaturedCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // gsap.matchMedia helps perfectly handle responsive animations
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop: Horizontal Scroll
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      if (!wrapperRef.current || cards.length === 0) return;

      const tween = gsap.to(wrapperRef.current, {
        x: () => -(wrapperRef.current!.scrollWidth - document.documentElement.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${wrapperRef.current!.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
      
      return () => {
        tween.kill();
      };
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile: Vertical stack with subtle fade up
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", 
            toggleActions: "play none none reverse",
          }
        });
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div className="block w-full overflow-visible">
      <section ref={containerRef} className="bg-secondary-white py-16 md:py-0 w-full overflow-hidden">
        <div className="md:min-h-screen flex flex-col pt-32 md:pt-40 pb-16 relative">
          
          {/* Title for the section */}
          <div className="px-6 md:px-12 md:pl-12 mb-10 md:mb-16 w-full z-10 pointer-events-none">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-secondary-brown">
              Our Specialties
            </h2>
          </div>

          {/* Carousel Wrapper */}
          <div 
            ref={wrapperRef} 
            className="flex flex-col md:flex-row gap-12 md:gap-16 px-6 md:px-12 md:pl-12 w-full md:w-max md:items-start"
            style={{ width: "max-content" }}
          >
            {items.map((item) => (
              <div 
                key={item.id} 
                className="feature-card flex flex-col w-full md:w-[50vw] lg:w-[40vw] flex-shrink-0"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-6 bg-secondary-brown/10">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-serif text-secondary-brown mb-3">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-secondary-brown/80 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
            {/* Add a spacer pad for desktop horizontal scroll to finish cleanly */}
            <div className="hidden md:block w-[20vw] flex-shrink-0" />
          </div>
          
        </div>
      </section>
    </div>
  );
}
