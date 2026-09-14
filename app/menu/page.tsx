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

  // Explicit 2-column layout definition for each category to guarantee consistent placement across all screen sizes
  const categoryColumnLayout: Record<string, { left: string[]; right: string[] }> = {
    "Cakes & Desserts": {
      left: ["Tea Cakes & Muffins"],
      right: ["Brownies", "Desserts"],
    },
    "Breads & Buns": {
      left: ["Breads", "Bread & Buns"],
      right: ["Buns & Bases", "Toasts & Rusks"],
    },
    "Beverages": {
      left: ["Mocktails"],
      right: ["Shakes"],
    },
    "Cookies & Puffs": {
      left: ["Premium Cookies", "Puffs"],
      right: ["Signature Cookies"],
    },
    "Savoury & Fast Food": {
      left: ["Pizza", "Pasta", "Lasagne", "Garlic Bread", "Burger", "Patties & Samosa"],
      right: ["Fries", "Grilled Sandwich", "Maggi", "Momos", "Snacks & Savouries"],
    },
  };

  const currentLayout = categoryColumnLayout[activeCategory] || {
    left: Object.keys(groupedItems).slice(0, Math.ceil(Object.keys(groupedItems).length / 2)),
    right: Object.keys(groupedItems).slice(Math.ceil(Object.keys(groupedItems).length / 2)),
  };

  const leftSubcategories = currentLayout.left.filter((sub) => groupedItems[sub]);
  const rightSubcategories = currentLayout.right.filter((sub) => groupedItems[sub]);

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

  const renderSection = (subCategory: string, categoryItems: MenuItem[]) => {
    if (!categoryItems || categoryItems.length === 0) return null;
    return (
      <div key={subCategory} className="bistro-section flex flex-col w-full mb-10">
        {/* Editorial Section Header */}
        <div className="mb-6 pb-2 border-b-2 border-[#CE9E1D]">
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#362417] tracking-wide">
            {subCategory === "Bread & Buns" ? "Breads" : subCategory}
          </h3>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-6">
          {categoryItems.map((item) => {
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
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-secondary-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 relative">
        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary-brown tracking-tight leading-tight mb-3 sm:mb-4">
            Our Menu
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-mustard font-sans font-medium max-w-2xl mx-auto leading-relaxed px-4">
            Discover our delicious range of freshly baked goods.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto w-full relative">

        {/* Sticky Tab Navigation */}
        <div className="sticky top-[58px] sm:top-[62px] md:top-[66px] z-30 bg-secondary-white/95 backdrop-blur-md pt-2.5 pb-2.5 sm:pt-4 sm:pb-4 mb-6 sm:mb-10 -mx-4 px-4 md:mx-0 md:px-0 border-b border-stone-200">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs sm:text-sm md:text-base font-sans transition-all duration-300 cursor-pointer ${activeCategory === cat
                    ? "bg-[#26BCB8] text-white shadow-md"
                    : "bg-white/80 border border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-[#362417]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Editorial Menu Layout */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start">
          {/* Left Column */}
          <div className="flex flex-col w-full">
            {leftSubcategories.map((subCategory) => renderSection(subCategory, groupedItems[subCategory]))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-full">
            {rightSubcategories.map((subCategory) => renderSection(subCategory, groupedItems[subCategory]))}
          </div>
        </div>
      </section>
    </div>
  );
}
