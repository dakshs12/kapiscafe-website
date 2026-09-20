"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/actions";

interface AdminDashboardShellProps {
  children: React.ReactNode;
}

export default function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/admin",
      exact: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: "Menu Manager",
      href: "/admin/menu",
      exact: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: "Cake Orders",
      href: "/admin/cakes",
      exact: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9V9a2 2 0 00-2-2H8a2 2 0 00-2 2v3h12z" />
        </svg>
      ),
    },
  ];

  const isTabActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-secondary-white font-sans text-secondary-brown">
      {/* MOBILE TOP BAR (sticky on mobile) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-secondary-brown/10 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/kapis-logo.svg"
            alt="Kapi's Bakehouse"
            width={100}
            height={36}
            className="w-24 h-auto object-contain"
          />
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-primary-mustard/15 text-primary-mustard">
            Admin
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-secondary-brown hover:bg-secondary-white focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop: static left, Mobile: slide drawer) */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-secondary-brown/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand & Logo Section */}
        <div>
          <div className="p-6 border-b border-secondary-brown/10 flex items-center justify-between">
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <Image
                src="/kapis-logo.svg"
                alt="Kapi's Bakehouse"
                width={120}
                height={44}
                className="w-28 h-auto object-contain"
                priority
              />
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-primary-teal/15 text-primary-teal">
                Console
              </span>
            </Link>

            {/* Close button inside mobile drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-secondary-brown/60 hover:text-secondary-brown p-1.5 rounded-lg"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-secondary-brown/50">
              Management
            </div>

            {navItems.map((item) => {
              const active = isTabActive(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-primary-teal text-white shadow-sm shadow-primary-teal/30"
                      : "text-secondary-brown/75 hover:text-secondary-brown hover:bg-secondary-brown/5"
                  }`}
                >
                  <span className={active ? "text-white" : "text-primary-teal"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-4 border-t border-secondary-brown/10 space-y-3 bg-[#FAF7F2]">
          {/* Quick Link to Live Website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-secondary-brown/70 hover:text-primary-mustard hover:bg-white transition-all border border-secondary-brown/10"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-mustard" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Live Website</span>
            </span>
            <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Admin User Card & Logout Form */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-teal/20 text-primary-teal font-bold text-xs flex items-center justify-center font-serif">
                KB
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-secondary-brown leading-tight">
                  Admin Manager
                </span>
                <span className="text-[10px] text-secondary-brown/60 leading-tight">
                  Kapi's Bakehouse
                </span>
              </div>
            </div>

            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out of Admin Console"
                className="p-2 rounded-lg text-secondary-brown/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-secondary-brown/10 shadow-xs">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-primary-mustard">
              Admin Console
            </span>
            <h2 className="text-xl font-bold font-serif text-secondary-brown">
              Kapi's Bakehouse Operations
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Live</span>
            </div>

            <form action={adminLogout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-secondary-brown/20 text-xs font-semibold text-secondary-brown hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
