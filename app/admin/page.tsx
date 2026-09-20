import React from "react";
import Link from "next/link";
import { getMenuItems } from "@/lib/cms-utils";
import { getCakeOrdersServer } from "@/lib/cakes-server";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [menuItems, cakeOrders] = await Promise.all([
    getMenuItems(),
    getCakeOrdersServer(),
  ]);

  const totalMenuItems = menuItems.length;
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));
  const activeCategoriesCount = categories.length;

  const pendingCakeInquiriesCount = cakeOrders.filter(
    (o) => o.status === "Pending"
  ).length;
  const recentOrders = cakeOrders.slice(0, 5);


  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-primary-mustard/20 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-primary-mustard">
            Overview Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-secondary-brown mt-1">
            Bakehouse Console
          </h1>
          <p className="text-xs sm:text-sm text-secondary-brown/70 mt-1 max-w-xl">
            Live overview of menu items, custom cake order inquiries, and operational metrics.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/menu?action=new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-teal hover:bg-[#20a8a4] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add Menu Item</span>
          </Link>

          <Link
            href="/admin/cakes"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-secondary-brown/20 bg-white hover:bg-[#FAF7F2] text-secondary-brown text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <svg className="w-4 h-4 text-primary-mustard" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Cake Requests</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Metric 1: Total Menu Items */}
        <div className="bg-white p-6 rounded-3xl border border-primary-mustard/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-teal/5 rounded-full transform translate-x-4 -translate-y-4 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-brown/60">
              Total Menu Items
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary-teal/10 text-primary-teal flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold text-secondary-brown">
              {totalMenuItems}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live & Available
            </span>
          </div>
          <p className="text-xs text-secondary-brown/65 mt-2">
            Active items across all categories
          </p>
        </div>

        {/* Metric 2: Active Categories */}
        <div className="bg-white p-6 rounded-3xl border border-primary-mustard/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-mustard/10 rounded-full transform translate-x-4 -translate-y-4 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-brown/60">
              Active Categories
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary-mustard/15 text-primary-mustard flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold text-secondary-brown">
              {activeCategoriesCount}
            </span>
            <span className="text-xs font-semibold text-primary-mustard bg-primary-mustard/10 px-2 py-0.5 rounded-full">
              Core Sections
            </span>
          </div>
          <p className="text-xs text-secondary-brown/65 mt-2">
            Organized in 2-column menu layout
          </p>
        </div>

        {/* Metric 3: Pending Cake Inquiries */}
        <div className="bg-white p-6 rounded-3xl border border-primary-mustard/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-teal/5 rounded-full transform translate-x-4 -translate-y-4 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-brown/60">
              Pending Cake Inquiries
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary-teal/10 text-primary-teal flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9V9a2 2 0 00-2-2H8a2 2 0 00-2 2v3h12z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold text-secondary-brown">
              {pendingCakeInquiriesCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Requires Review
            </span>
          </div>
          <p className="text-xs text-secondary-brown/65 mt-2">
            Direct WhatsApp custom cake requests
          </p>
        </div>
      </div>

      {/* RECENT CAKE INQUIRIES & CATEGORIES OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Inquiries Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-primary-mustard/20 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-secondary-brown/10">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-secondary-brown">
                Recent Custom Cake Inquiries
              </h3>
              <p className="text-xs text-secondary-brown/65">
                Latest customer custom cake requests received
              </p>
            </div>
            <Link
              href="/admin/cakes"
              className="text-xs font-bold text-primary-teal hover:text-[#20a8a4] transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-[11px] uppercase font-bold tracking-wider text-secondary-brown/60 border-b border-secondary-brown/10">
                  <th className="pb-3 pl-1">Customer</th>
                  <th className="pb-3">Details</th>
                  <th className="pb-3">Celebration Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-1 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-brown/5">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-secondary-brown/50">
                      No cake inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((inq) => {
                    const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                    const greeting = `Hello ${inq.name}! This is Kapi's Bakehouse following up on your custom cake inquiry.`;

                    const statusStyle =
                      inq.status === "Pending"
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : inq.status === "Contacted"
                        ? "bg-sky-50 text-sky-800 border-sky-300"
                        : inq.status === "Confirmed"
                        ? "bg-indigo-50 text-indigo-800 border-indigo-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300";

                    return (
                      <tr key={inq.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3.5 pl-1">
                          <div className="font-bold text-secondary-brown">{inq.name}</div>
                          <div className="text-[11px] text-secondary-brown/60 font-mono">{inq.phone}</div>
                        </td>
                        <td className="py-3.5">
                          <div className="font-semibold text-secondary-brown">{inq.tier} ({inq.weight})</div>
                          <div className="text-[11px] text-primary-mustard font-medium">{inq.flavour}</div>
                        </td>
                        <td className="py-3.5">
                          <div className="font-medium text-secondary-brown">
                            {inq.date
                              ? new Date(inq.date + "T00:00:00").toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "TBD"}
                          </div>
                          <div className="text-[11px] text-secondary-brown/60">{inq.occasion}</div>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3.5 pr-1 text-right">
                          <a
                            href={`https://wa.me/${fullPhone}?text=${encodeURIComponent(greeting)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors text-xs font-bold"
                          >
                            <span>WhatsApp</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Distribution (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-primary-mustard/20 p-6 sm:p-7 shadow-sm">
          <div className="pb-4 mb-4 border-b border-secondary-brown/10">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-secondary-brown">
              Menu Categories
            </h3>
            <p className="text-xs text-secondary-brown/65">
              Breakdown of items by category
            </p>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat).length;
              const percentage = Math.round((count / totalMenuItems) * 100);
              return (
                <div key={cat} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-secondary-brown">{cat}</span>
                    <span className="text-primary-mustard font-bold">{count} items</span>
                  </div>
                  <div className="w-full h-2 bg-secondary-brown/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-teal rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-secondary-brown/10">
            <Link
              href="/admin/menu"
              className="w-full py-2.5 px-4 rounded-xl border border-primary-teal/40 text-primary-teal hover:bg-primary-teal hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Manage All Menu Items</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
