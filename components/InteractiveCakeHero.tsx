"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveCakeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const frameCount = 175;
  const currentFrame = (index: number) => {
    // ezgif-frame-001.jpg through 175
    const paddedIndex = (index + 1).toString().padStart(3, '0');
    return `/cake-sequence/ezgif-frame-${paddedIndex}.jpg`;
  };

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const images: HTMLImageElement[] = [];
    const cakeSeq = {
      frame: 0
    };

    // Preload first image and set canvas intrinsic size
    const img = new Image();
    img.src = currentFrame(0);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      render();
    };

    // Preload all remaining images for smooth playback
    for (let i = 0; i < frameCount; i++) {
      const image = new Image();
      image.src = currentFrame(i);
      images.push(image);
    }

    function render() {
      const img = images[cakeSeq.frame];
      if (img && img.complete) {
         context!.clearRect(0, 0, canvas!.width, canvas!.height);
         context!.drawImage(img, 0, 0);
      }
    }

    // Set up the ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // The user will scroll for 300% of the viewport height to complete the animation
        scrub: 0.5,
        pin: true,
      }
    });

    // Animate the frames
    tl.to(cakeSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
    }, 0);

    // Fade out text early in the scroll sequence
    tl.to(textRef.current, {
      opacity: 0,
      y: -100,
      duration: 0.2, // Since it's a timeline tied to scroll, this represents 20% of the scroll progress
      ease: "power2.out"
    }, 0);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[var(--color-secondary-brown)] overflow-hidden">
      {/* 
        The canvas uses object-cover to seamlessly scale and crop the sequence 
        images exactly like background-size: cover, ensuring full responsiveness 
        on mobile and desktop without complex JS resize logic.
      */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div 
        ref={textRef} 
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-6 pointer-events-none"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-secondary-white font-serif drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">
          Kapi's Bakehouse
        </h1>
        <p className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl text-primary-mustard font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Fresh Bakes &bull; Happy Days
        </p>
      </div>
    </div>
  );
}
