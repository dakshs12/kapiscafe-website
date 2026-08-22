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
  
  const frameCount = 87;
  const currentFrame = (index: number) => {
    // frame_000034.webp through frame_000120.webp
    const paddedIndex = (index + 34).toString().padStart(6, '0');
    return `/cake-sequence/frame_${paddedIndex}.webp`;
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top", // Timeline runs for the full duration the wrapper is on screen
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });

    // Animate the frames smoothly across the full scroll distance
    tl.to(cakeSeq, {
      frame: frameCount - 1,
      snap: "frame",
      duration: 1, 
      ease: "none",
      onUpdate: render,
    }, 0);

  }, { scope: containerRef });

  return (
    // Outer container defines the total scroll distance. 
    // 125vh means it pins for 25vh (reaching ~frame 50) and then scrolls up for 100vh.
    <div ref={containerRef} className="relative w-full bg-[var(--color-secondary-brown)]" style={{ height: "125vh" }}>
      {/* Inner sticky container pins natively until the wrapper bottom pushes it up */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
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
    </div>
  );
}
