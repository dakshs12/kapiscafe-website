"use client";

import React, { useRef, useState } from "react";
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
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    const cardWidth = clientWidth * 0.8;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(Math.max(index, 0), items.length - 1));
  };

  const scrollToSlide = (idx: number) => {
    if (!mobileScrollRef.current) return;
    const targetCard = mobileScrollRef.current.children[idx] as HTMLElement;
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop: Horizontal Scroll with ScrollTrigger Pinning
      const cards = gsap.utils.toArray<HTMLElement>(".desktop-feature-card");
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

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div className="block w-full overflow-visible">
      <section ref={containerRef} className="bg-secondary-white py-10 sm:py-12 md:py-0 w-full overflow-hidden">
        <div className="md:min-h-screen flex flex-col pt-4 sm:pt-6 md:pt-36 lg:pt-40 pb-8 sm:pb-12 relative">
          
          {/* Section Heading */}
          <div className="px-6 md:px-12 md:pl-16 mb-6 sm:mb-8 md:mb-10 w-full z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-secondary-brown">
              Our Specialties
            </h2>
            <p className="text-xs sm:text-sm text-secondary-brown/70 font-sans md:hidden mt-1">
              Swipe to explore our signature bakes
            </p>
          </div>

          {/* MOBILE: Sleek Swipeable Touch Carousel (Hidden on Desktop) */}
          <div className="md:hidden px-6 w-full">
            <div 
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4.5 pb-4 -mx-6 px-6 hide-scrollbar"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="w-[82vw] max-w-[340px] flex-shrink-0 snap-center flex flex-col bg-white rounded-3xl p-3.5 border border-primary-mustard/20 shadow-md"
                >
                  <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden mb-3.5 bg-secondary-brown/10">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      sizes="82vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-1.5 pb-1">
                    <h3 className="text-xl font-bold font-serif text-secondary-brown mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-secondary-brown/75 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === idx
                      ? "w-6 bg-primary-mustard shadow-xs"
                      : "w-2 bg-secondary-brown/25 hover:bg-secondary-brown/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP: Pin-and-Scroll Horizontal Carousel (Hidden on Mobile) */}
          <div 
            ref={wrapperRef} 
            className="hidden md:flex flex-row gap-8 md:gap-12 lg:gap-16 px-6 md:px-12 md:pl-16 w-max items-start"
          >
            {items.map((item) => (
              <div 
                key={item.id} 
                className="desktop-feature-card flex flex-col w-[48vw] lg:w-[40vw] xl:w-[36vw] 2xl:w-[32vw] flex-shrink-0"
              >
                <div className="relative w-full aspect-[4/3] max-h-[min(42vh,380px)] rounded-2xl overflow-hidden shadow-xl mb-4 sm:mb-5 bg-secondary-brown/10">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 1024px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-serif text-secondary-brown mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-secondary-brown/80 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
            {/* Spacer pad for desktop horizontal scroll to finish cleanly */}
            <div className="w-[10vw] flex-shrink-0" />
          </div>
          
        </div>
      </section>
    </div>
  );
}
