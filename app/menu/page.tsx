"use client";

import { useEffect, useState, useRef } from "react";
import { getMenuItems, MenuItem } from "@/lib/cms-utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const categories = ["All", "Savoury & Fast Food", "Breads & Buns", "Cookies & Puffs", "Cakes & Desserts", "Beverages"];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMenuItems().then((data) => {
      setItems(data);
      setFilteredItems(data);
    });
  }, []);

  const handleFilter = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === cat));
    }
  };

  // Group the currently filtered items by their subCategory
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.subCategory]) {
      acc[item.subCategory] = [];
    }
    acc[item.subCategory].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".menu-group-card");
    if (cards.length === 0) return;
    
    // Reset opacity and y before animating (important for reuse)
    gsap.set(cards, { opacity: 0, y: 30 });
    
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, { scope: gridRef, dependencies: [filteredItems] });

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="hero-section flex flex-col items-center justify-center py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-secondary-brown mb-4 sm:mb-6">
            Our <span className="text-primary-mustard">Menu</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-secondary-brown/80 font-sans max-w-2xl mx-auto px-4">
            Discover our delicious range of freshly baked goods, made with love every single day.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full">
        
        {/* Horizontal scroll container for mobile */}
        <div className="flex overflow-x-auto hide-scrollbar items-center justify-start md:justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`flex-shrink-0 whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm sm:text-base font-sans transition-colors duration-300 ${
                activeCategory === cat 
                  ? "bg-primary-teal text-secondary-white" 
                  : "bg-transparent border border-primary-teal text-primary-teal hover:bg-primary-teal/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grouped Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {Object.entries(groupedItems).map(([subCategory, items]) => (
            <div
              key={subCategory}
              className="menu-group-card opacity-0 bg-secondary-white rounded-2xl shadow-sm border border-secondary-brown/10 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className="bg-secondary-white border-b border-primary-mustard/20 p-6 text-center">
                <h3 className="text-2xl font-bold font-serif text-primary-mustard uppercase tracking-wider">
                  {subCategory}
                </h3>
              </div>
              
              {/* Card Body - Item List */}
              <div className="p-6 flex flex-col">
                {items.map((item, index) => (
                  <div 
                    key={item._uid} 
                    className={`flex justify-between items-start py-4 ${
                      index !== items.length - 1 ? 'border-b border-dotted border-secondary-brown/20' : ''
                    }`}
                  >
                    <div className="flex flex-col pr-4">
                      <span className="font-bold font-sans text-secondary-brown text-lg">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-sm font-sans text-secondary-brown/70 mt-1 leading-relaxed">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <span className="font-bold font-sans text-secondary-brown shrink-0 whitespace-nowrap pt-1">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
