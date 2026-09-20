"use client";

import React, { useState, useTransition, useMemo } from "react";
import { MenuItem } from "@/lib/cms-utils";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
} from "@/app/actions";

interface MenuManagerProps {
  initialItems: MenuItem[];
}

const CATEGORIES = [
  "All",
  "Savoury & Fast Food",
  "Breads & Buns",
  "Cookies & Puffs",
  "Cakes & Desserts",
  "Beverages",
] as const;

export default function MenuManager({ initialItems }: MenuManagerProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Inline Price Editing State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePrices, setInlinePrices] = useState<Record<string, string>>({});
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Known subcategories mapped to categories for convenience
  const subcategoriesByCategory = useMemo(() => {
    const map: Record<string, string[]> = {};
    items.forEach((item) => {
      if (!map[item.category]) map[item.category] = [];
      if (!map[item.category].includes(item.subCategory)) {
        map[item.category].push(item.subCategory);
      }
    });
    return map;
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subCategory.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Statistics
  const totalItemsCount = items.length;
  const inStockCount = items.filter((i) => i.inStock !== false).length;
  const outOfStockCount = totalItemsCount - inStockCount;

  // --- Handlers ---

  // Quick Inline Price Edit
  const handlePriceBlur = async (item: MenuItem) => {
    const newPriceRaw = inlinePrices[item._uid];
    if (newPriceRaw === undefined || newPriceRaw.trim() === "") {
      setEditingPriceId(null);
      return;
    }

    const formattedPrice = newPriceRaw.trim().startsWith("₹")
      ? newPriceRaw.trim()
      : `₹${newPriceRaw.trim()}`;

    if (formattedPrice === item.price) {
      setEditingPriceId(null);
      return;
    }

    setSavingPriceId(item._uid);
    startTransition(async () => {
      const res = await updateMenuItem(item._uid, { price: formattedPrice });
      setSavingPriceId(null);
      setEditingPriceId(null);

      if (res.success && res.item) {
        setItems((prev) =>
          prev.map((i) => (i._uid === item._uid ? { ...i, price: formattedPrice } : i))
        );
        showToast(`Price for "${item.title}" updated to ${formattedPrice}`);
      } else {
        showToast(res.error || "Failed to update price", "error");
      }
    });
  };

  // Toggle Stock Availability
  const handleToggleStock = async (item: MenuItem) => {
    const nextStatus = item.inStock === false; // Toggle
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i._uid === item._uid ? { ...i, inStock: nextStatus } : i))
    );

    startTransition(async () => {
      const res = await toggleItemAvailability(item._uid);
      if (res.success && res.item) {
        showToast(
          `"${item.title}" is now marked as ${nextStatus ? "In Stock" : "Sold Out"}`
        );
      } else {
        // Revert on error
        setItems((prev) =>
          prev.map((i) => (i._uid === item._uid ? { ...i, inStock: !nextStatus } : i))
        );
        showToast("Failed to update availability status", "error");
      }
    });
  };

  // Delete Item
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    const target = deletingItem;

    startTransition(async () => {
      const res = await deleteMenuItem(target._uid);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i._uid !== target._uid));
        setDeletingItem(null);
        showToast(`"${target.title}" was removed from the menu.`);
      } else {
        showToast(res.error || "Failed to delete item", "error");
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all transform animate-fadeIn ${
            toast.type === "success"
              ? "bg-[#362417] text-white border border-primary-mustard/40"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-5 h-5 text-[#26BCB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-primary-mustard/20 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-primary-mustard">
            Menu Management
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-secondary-brown mt-1">
            Menu Manager
          </h1>
          <p className="text-xs sm:text-sm text-secondary-brown/70 mt-1 max-w-xl">
            Edit live prices inline, toggle stock availability, and organize items across categories.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-teal hover:bg-[#20a8a4] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] cursor-pointer flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Add New Item</span>
        </button>
      </div>

      {/* Controls Bar: Search & Category Filter Pills */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-primary-mustard/20 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-brown/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, subcategory (e.g. Pizza, Shakes), or ingredients..."
            className="w-full pl-11 pr-4 py-3 bg-secondary-white rounded-2xl border border-secondary-brown/15 text-sm text-secondary-brown placeholder-secondary-brown/40 focus:outline-none focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-brown/40 hover:text-secondary-brown cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? items.length
                : items.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                    : "bg-secondary-white text-secondary-brown/80 border-secondary-brown/15 hover:border-primary-teal/40 hover:text-secondary-brown"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-secondary-brown/10 text-secondary-brown/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Summary Status Strip */}
        <div className="flex flex-wrap items-center justify-between text-xs text-secondary-brown/70 pt-2 border-t border-secondary-brown/10">
          <div>
            Showing <strong className="text-secondary-brown">{filteredItems.length}</strong> of{" "}
            <strong className="text-secondary-brown">{totalItemsCount}</strong> items
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{inStockCount} In Stock</span>
            </span>
            {outOfStockCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{outOfStockCount} Sold Out</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Items Table */}
      <div className="bg-white rounded-3xl border border-primary-mustard/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-[11px] uppercase font-bold tracking-wider text-secondary-brown/60 border-b border-secondary-brown/10 bg-[#FAF7F2]/60">
                <th className="py-3.5 pl-6">Item</th>
                <th className="py-3.5 px-4">Category / Subcategory</th>
                <th className="py-3.5 px-4">Price (Inline Edit)</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-brown/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondary-brown/60">
                    <p className="font-serif text-lg font-bold text-secondary-brown mb-1">
                      No menu items found
                    </p>
                    <p className="text-xs">
                      Try clearing your search query or selecting a different category.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isInStock = item.inStock !== false;
                  const isEditingPrice = editingPriceId === item._uid;
                  const currentInlinePrice =
                    inlinePrices[item._uid] !== undefined
                      ? inlinePrices[item._uid]
                      : item.price.replace("₹", "");

                  return (
                    <tr
                      key={item._uid}
                      className={`hover:bg-[#FAF7F2]/50 transition-colors ${
                        !isInStock ? "opacity-75 bg-stone-50/50" : ""
                      }`}
                    >
                      {/* Item Details */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-secondary-brown text-sm sm:text-base">
                            {item.title}
                          </span>
                          {item.isPopular && (
                            <span className="px-2 py-0.5 rounded-full bg-primary-mustard/15 text-primary-mustard text-[10px] font-bold uppercase tracking-wider">
                              Bestseller
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-secondary-brown/65 italic mt-0.5 line-clamp-1 max-w-sm">
                            {item.description}
                          </p>
                        )}
                      </td>

                      {/* Category & Subcategory */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-secondary-brown">
                          {item.category}
                        </div>
                        <div className="text-[11px] text-primary-teal font-medium mt-0.5">
                          {item.subCategory}
                        </div>
                      </td>

                      {/* Price with Quick Inline Edit */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-primary-mustard font-bold text-sm">₹</span>
                          <input
                            type="text"
                            value={isEditingPrice ? currentInlinePrice : item.price.replace("₹", "")}
                            onFocus={() => {
                              setEditingPriceId(item._uid);
                              setInlinePrices((prev) => ({
                                ...prev,
                                [item._uid]: item.price.replace("₹", ""),
                              }));
                            }}
                            onChange={(e) => {
                              setInlinePrices((prev) => ({
                                ...prev,
                                [item._uid]: e.target.value,
                              }));
                            }}
                            onBlur={() => handlePriceBlur(item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              } else if (e.key === "Escape") {
                                setEditingPriceId(null);
                              }
                            }}
                            className="w-20 px-2.5 py-1 text-sm font-bold text-secondary-brown bg-secondary-white hover:bg-white rounded-lg border border-secondary-brown/20 focus:border-primary-teal focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-teal transition-all font-sans"
                            title="Click to edit price directly"
                          />
                          {savingPriceId === item._uid && (
                            <svg className="animate-spin w-3.5 h-3.5 text-primary-teal" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                          )}
                        </div>
                      </td>

                      {/* Stock Availability Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(item)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            isInStock
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                          title="Click to toggle stock status"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isInStock ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span>{isInStock ? "In Stock" : "Sold Out"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 rounded-xl text-secondary-brown/70 hover:text-primary-teal hover:bg-primary-teal/10 transition-colors cursor-pointer"
                            title="Edit full item details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-2 rounded-xl text-secondary-brown/70 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD NEW ITEM */}
      {isAddModalOpen && (
        <ItemModal
          title="Add New Menu Item"
          subcategoriesByCategory={subcategoriesByCategory}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={async (itemData) => {
            const res = await createMenuItem(itemData);
            if (res.success && res.item) {
              setItems((prev) => [...prev, res.item!]);
              setIsAddModalOpen(false);
              showToast(`"${res.item.title}" added to menu.`);
            } else {
              showToast(res.error || "Failed to add item", "error");
            }
          }}
        />
      )}

      {/* MODAL: EDIT ITEM */}
      {editingItem && (
        <ItemModal
          title="Edit Menu Item"
          initialData={editingItem}
          subcategoriesByCategory={subcategoriesByCategory}
          onClose={() => setEditingItem(null)}
          onSubmit={async (updates) => {
            const res = await updateMenuItem(editingItem._uid, updates);
            if (res.success && res.item) {
              setItems((prev) =>
                prev.map((i) => (i._uid === editingItem._uid ? res.item! : i))
              );
              setEditingItem(null);
              showToast(`"${res.item.title}" updated.`);
            } else {
              showToast(res.error || "Failed to update item", "error");
            }
          }}
        />
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif text-secondary-brown">
                Delete "{deletingItem.title}"?
              </h3>
              <p className="text-xs sm:text-sm text-secondary-brown/70 mt-1 leading-relaxed">
                This will permanently remove this item from your menu. Customers on the website will no longer see it.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-5 py-2.5 rounded-xl border border-secondary-brown/20 text-secondary-brown font-semibold text-xs sm:text-sm hover:bg-secondary-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Delete Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Reusable Item Add/Edit Modal ---

interface ItemModalProps {
  title: string;
  initialData?: MenuItem;
  subcategoriesByCategory: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (item: Omit<MenuItem, "_uid" | "component">) => Promise<void>;
}

function ItemModal({
  title,
  initialData,
  subcategoriesByCategory,
  onClose,
  onSubmit,
}: ItemModalProps) {
  const [itemName, setItemName] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price.replace("₹", "") || "");
  const [category, setCategory] = useState(initialData?.category || "Savoury & Fast Food");
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || "Pizza");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [isCustomSubCategory, setIsCustomSubCategory] = useState(false);
  const [description, setDescription] = useState(initialData?.description || "");
  const [isPopular, setIsPopular] = useState(!!initialData?.isPopular);
  const [inStock, setInStock] = useState(initialData?.inStock !== false);
  const [loading, setLoading] = useState(false);

  const availableSubcategories = subcategoriesByCategory[category] || [];

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const available = subcategoriesByCategory[newCat] || [];
    if (available.length > 0) {
      setSubCategory(available[0]);
      setIsCustomSubCategory(false);
    } else {
      setIsCustomSubCategory(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !price.trim()) return;

    const finalSub = isCustomSubCategory
      ? customSubCategory.trim() || "General"
      : subCategory;

    const formattedPrice = price.trim().startsWith("₹")
      ? price.trim()
      : `₹${price.trim()}`;

    setLoading(true);
    try {
      await onSubmit({
        title: itemName.trim(),
        price: formattedPrice,
        category,
        subCategory: finalSub,
        description: description.trim(),
        isPopular,
        inStock,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-primary-mustard/20 shadow-2xl space-y-6 my-8 font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-secondary-brown/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary-mustard">
              Menu Item Details
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-secondary-brown">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-secondary-brown/60 hover:text-secondary-brown hover:bg-secondary-brown/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-brown">
                Item Name <span className="text-primary-mustard">*</span>
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Belgian Truffle Pastry"
                className="px-3.5 py-2.5 bg-secondary-white rounded-xl border border-secondary-brown/20 text-sm text-secondary-brown focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-brown">
                Price (₹) <span className="text-primary-mustard">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-mustard font-bold text-sm">
                  ₹
                </span>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="149"
                  className="w-full pl-7 pr-3.5 py-2.5 bg-secondary-white rounded-xl border border-secondary-brown/20 text-sm text-secondary-brown focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-brown">
                Category <span className="text-primary-mustard">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3.5 py-2.5 bg-secondary-white rounded-xl border border-secondary-brown/20 text-sm text-secondary-brown focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all"
              >
                <option value="Savoury & Fast Food">Savoury & Fast Food</option>
                <option value="Breads & Buns">Breads & Buns</option>
                <option value="Cookies & Puffs">Cookies & Puffs</option>
                <option value="Cakes & Desserts">Cakes & Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-brown flex items-center justify-between">
                <span>Subcategory <span className="text-primary-mustard">*</span></span>
                <button
                  type="button"
                  onClick={() => setIsCustomSubCategory(!isCustomSubCategory)}
                  className="text-[11px] text-primary-teal hover:underline cursor-pointer"
                >
                  {isCustomSubCategory ? "Pick existing" : "+ New"}
                </button>
              </label>

              {isCustomSubCategory ? (
                <input
                  type="text"
                  required
                  value={customSubCategory}
                  onChange={(e) => setCustomSubCategory(e.target.value)}
                  placeholder="e.g. Croissants"
                  className="px-3.5 py-2.5 bg-secondary-white rounded-xl border border-secondary-brown/20 text-sm text-secondary-brown focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all"
                />
              ) : (
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-secondary-white rounded-xl border border-secondary-brown/20 text-sm text-secondary-brown focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all"
                >
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary-brown flex items-center justify-between">
              <span>Description / Ingredients</span>
              <span className="text-[11px] text-secondary-brown/50 font-normal">Optional</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rich dark chocolate cream layered between soft chocolate sponge..."
              className="px-3.5 py-2.5 bg-secondary-white rounded-xl border border-secondary-brown/20 text-sm text-secondary-brown focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all resize-none"
            />
          </div>

          {/* Badges & Flags */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-secondary-brown cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-primary-teal focus:ring-primary-teal border-secondary-brown/30"
              />
              <span>Mark as Bestseller</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-secondary-brown cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-primary-teal focus:ring-primary-teal border-secondary-brown/30"
              />
              <span>Available in Stock</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-brown/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-secondary-brown/20 text-secondary-brown font-semibold text-xs sm:text-sm hover:bg-secondary-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary-teal hover:bg-[#20a8a4] text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
