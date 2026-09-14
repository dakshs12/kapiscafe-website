"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OurStory() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<HTMLParagraphElement[]>([]);

  const sectionHeadingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Image Animation
    gsap.fromTo(
      imageRef.current,
      { scale: 1.1, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );

    // Text Stagger Animation
    const elementsToAnimate = [sectionHeadingRef.current, headingRef.current, ...textRefs.current];
    gsap.fromTo(
      elementsToAnimate,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef });

  const addToRefs = (el: HTMLParagraphElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="pt-20 pb-24 px-6 md:px-12 md:pl-12 border-t border-primary-mustard/20 bg-secondary-white overflow-hidden">
      
      {/* Section Heading */}
      <div className="mb-8 md:mb-14 w-full z-10 pointer-events-none">
        <h2 ref={sectionHeadingRef} className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-secondary-brown">
          Our Story
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start w-full">
        
        {/* Left Column: Image */}
        <div 
          ref={imageRef} 
          className="relative w-11/12 aspect-[4/5] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <Image 
            src="/storefront.jpg" 
            alt="Kapi's Bakehouse Storefront" 
            fill 
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover"
          />
        </div>

        {/* Right Column: Story Content */}
        <div className="flex flex-col space-y-8">
          <h2 
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-mustard leading-[1.15]"
          >
            Born in Pithampur. Made with love. Baked fresh.
          </h2>
          
          <div className="space-y-6 text-base md:text-lg text-secondary-brown font-sans leading-relaxed">
            <p ref={addToRefs}>
              Welcome to Kapi’s Bakehouse, Pithampur’s first bakery built with a simple wish, to bring something fresh, honest and truly enjoyable to our city.
            </p>
            <p ref={addToRefs}>
              Kapi’s was started by Mr. Brajesh Raghuvanshi with a vision to serve Pithampur better food options, something fresh, trustworthy and made with care. 
            </p>
            <p ref={addToRefs}>
              Being a part of the Pithampur corporate community himself, he often felt there was a gap for a place that offers healthy, fresh and reliable snacking options for everyday life. That’s how Kapi’s began, as a small idea to make better food more accessible and a space that brings together bakery, café, sweets, savouries and gifting under one roof.
            </p>
            <p ref={addToRefs}>
              At Kapi’s, you’ll find a mix of traditional favourites and modern flavours, made using carefully chosen ingredients and prepared with attention to quality and taste. 
            </p>
            <p ref={addToRefs}>
              Whether you’re here for a quick bite, a family treat or a thoughtful gift, Kapi’s is made to be your everyday stop for something fresh and satisfying.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
