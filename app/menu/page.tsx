"use client";

import { useEffect, useState, useRef } from "react";
import { getMenuItems, MenuItem } from "@/lib/cms-utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const categories = [
  "Savoury & Fast Food", 
  "Breads & Buns", 
  "Cookies & Puffs", 
  "Cakes & Desserts", 
  "Beverages"
];

const popularItems = ["Margherita", "Choco Chip Cookies", "Cold Coffee"];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Savoury & Fast Food");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMenuItems().then((data) => {
      setItems(data);
      setFilteredItems(data.filter(item => item.category === "Savoury & Fast Food"));
    });
  }, []);

  const handleFilter = (cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setFilteredItems(items.filter(item => item.category === cat));
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.subCategory]) {
      acc[item.subCategory] = [];
    }
    acc[item.subCategory].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Enforce specific visual ordering for subcategories (e.g. shift Puffs below Premium Cookies)
  const subCategoryOrder = [
    "Premium Cookies",
    "Puffs",
    "Signature Cookies"
  ];

  const sortedGroupedItems = Object.entries(groupedItems).sort(([a], [b]) => {
    const indexA = subCategoryOrder.indexOf(a);
    const indexB = subCategoryOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0; // maintain original order for other categories
  });

  useGSAP(() => {
    const sections = gsap.utils.toArray(".bistro-section");
    if (sections.length === 0) return;
    
    gsap.fromTo(sections, 
      { opacity: 0, y: 15 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      }
    );
  }, { scope: gridRef, dependencies: [filteredItems] });

  return (
    <div className="flex flex-col flex-1 bg-secondary-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-10 md:py-16 px-4 sm:px-6 relative">
        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-[#362417] mb-4">
            Our Menu
          </h1>
          <div className="w-16 h-1 bg-[#CE9E1D] rounded-full mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-[#362417]/80 font-sans max-w-2xl mx-auto px-4">
            Discover our delicious range of freshly baked goods, made with love every single day.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto w-full relative">
        
        {/* Sticky Tab Navigation */}
        <div className="sticky top-[68px] lg:top-[88px] z-40 bg-secondary-white/95 backdrop-blur-md pt-4 pb-4 mb-10 -mx-4 px-4 md:mx-0 md:px-0 border-b border-stone-200">
          <div className="flex overflow-x-auto hide-scrollbar items-center justify-start md:justify-center gap-3 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`flex-shrink-0 whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm sm:text-base font-sans transition-all duration-300 cursor-pointer ${
                  activeCategory === cat 
                    ? "bg-[#26BCB8] text-white shadow-md" 
                    : "bg-transparent border border-stone-300 text-stone-500 hover:bg-stone-100 hover:text-[#362417]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bistro Board Masonry Layout */}
        <div ref={gridRef} className="columns-1 md:columns-2 gap-x-12 [column-fill:_balance]">
          {sortedGroupedItems.map(([subCategory, items]) => (
            <div key={subCategory} className="bistro-section flex flex-col break-inside-avoid inline-block w-full mb-10">
              {/* Editorial Section Header */}
              <div className="mb-6 pb-2 border-b-2 border-[#CE9E1D]">
                <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#362417] tracking-wide">
                  {subCategory}
                </h3>
              </div>
              
              {/* Menu Items */}
              <div className="flex flex-col space-y-6">
                {items.map((item) => {
                  const isPopular = popularItems.includes(item.title);
                  return (
                    <div key={item._uid} className="flex flex-col">
                      <div className="flex items-end justify-between w-full">
                        {/* Item Name & Badge */}
                        <div className="flex items-center">
                          <span className="font-bold font-sans text-[#362417] text-lg">
                            {item.title}
                          </span>
                          {isPopular && (
                            <span className="bg-[#26BCB8]/10 text-[#26BCB8] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-3 tracking-wide uppercase mt-0.5">
                              Bestseller
                            </span>
                          )}
                        </div>
                        
                        {/* Dotted Leader Line */}
                        <div className="border-b-2 border-dotted border-stone-300 flex-grow mx-3 mb-1.5"></div>
                        
                        {/* Price */}
                        <span className="font-bold font-sans text-[#CE9E1D] shrink-0 whitespace-nowrap text-lg">
                          {item.price}
                        </span>
                      </div>
                      
                      {/* Description */}
                      {item.description && (
                        <p className="text-sm font-sans italic text-[#362417]/70 mt-1.5 leading-relaxed max-w-[85%]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
