"use client";

import React, { useState, useTransition, useMemo } from "react";
import {
  CakeOrder,
  CakeOrderStatus,
  CakeConfig,
  CakeFlavour,
} from "@/lib/cakes-server";
import {
  updateCakeOrderStatus,
  deleteCakeOrder,
  updateCakeConfig,
  getCakeOrders,
} from "@/app/actions";

interface CakeManagerProps {
  initialOrders: CakeOrder[];
  initialConfig: CakeConfig;
}

const STATUS_OPTIONS: CakeOrderStatus[] = [
  "Pending",
  "Contacted",
  "Confirmed",
  "Completed",
];

export default function CakeManager({
  initialOrders,
  initialConfig,
}: CakeManagerProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "config">("orders");
  const [orders, setOrders] = useState<CakeOrder[]>(initialOrders);
  const [config, setConfig] = useState<CakeConfig>(initialConfig);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<CakeOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<CakeOrder | null>(null);

  // Config editing state
  const [configNoticeHours, setConfigNoticeHours] = useState(
    initialConfig.minNoticeHours || 48
  );
  const [configFlavours, setConfigFlavours] = useState<CakeFlavour[]>(
    initialConfig.flavours || []
  );
  const [newFlavourName, setNewFlavourName] = useState("");
  const [newFlavourNotes, setNewFlavourNotes] = useState("");

  // Toast & Async transitions
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        order.name.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query) ||
        order.flavour.toLowerCase().includes(query) ||
        order.occasion.toLowerCase().includes(query) ||
        order.tier.toLowerCase().includes(query) ||
        (order.notes && order.notes.toLowerCase().includes(query)) ||
        (order.topper && order.topper.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      contacted: orders.filter((o) => o.status === "Contacted").length,
      confirmed: orders.filter((o) => o.status === "Confirmed").length,
      completed: orders.filter((o) => o.status === "Completed").length,
    };
  }, [orders]);

  // Refresh orders from server
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getCakeOrders();
      setOrders(fresh);
      showToast("Inquiries refreshed.");
    } catch {
      showToast("Failed to refresh inquiries.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Status progression cycle
  const getNextStatus = (current: CakeOrderStatus): CakeOrderStatus => {
    switch (current) {
      case "Pending":
        return "Contacted";
      case "Contacted":
        return "Confirmed";
      case "Confirmed":
        return "Completed";
      case "Completed":
        return "Pending";
    }
  };

  // Status update
  const handleStatusChange = async (id: string, newStatus: CakeOrderStatus) => {
    setUpdatingOrderId(id);
    startTransition(async () => {
      const res = await updateCakeOrderStatus(id, newStatus);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Order status updated to "${newStatus}".`);
      } else {
        showToast(res.error || "Failed to update status.", "error");
      }
      setUpdatingOrderId(null);
    });
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    const targetId = deletingOrder.id;
    startTransition(async () => {
      const res = await deleteCakeOrder(targetId);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== targetId));
        showToast("Inquiry removed from ledger.");
        setDeletingOrder(null);
        if (selectedOrder?.id === targetId) setSelectedOrder(null);
      } else {
        showToast(res.error || "Failed to delete order.", "error");
      }
    });
  };

  // Build prefilled WhatsApp URL for consultation
  const getWhatsAppLink = (order: CakeOrder) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const formattedDate = order.date
      ? new Date(order.date + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "your upcoming celebration";

    const greeting = `Hello ${order.name || "there"}! 👋

This is Kapi's Bakehouse following up on your custom cake inquiry for ${formattedDate}.

🎂 *Order Specifications:*
• Tier: ${order.tier}
• Weight: ${order.weight}
• Flavour: ${order.flavour}
• Occasion: ${order.occasion}${
      order.topper ? `\n• Message on Cake: "${order.topper}"` : ""
    }${order.notes ? `\n• Design Notes: ${order.notes}` : ""}

We'd love to finalize the design details and confirm your booking!`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(greeting)}`;
  };

  // Configurator: Add flavour
  const handleAddFlavour = () => {
    const trimmedName = newFlavourName.trim();
    if (!trimmedName) {
      showToast("Please enter a flavour name.", "error");
      return;
    }

    if (configFlavours.some((f) => f.id.toLowerCase() === trimmedName.toLowerCase())) {
      showToast("This flavour already exists.", "error");
      return;
    }

    const newFlavour: CakeFlavour = {
      id: trimmedName,
      name: trimmedName,
      notes: newFlavourNotes.trim() || "Freshly baked handcrafted flavour",
    };

    setConfigFlavours([...configFlavours, newFlavour]);
    setNewFlavourName("");
    setNewFlavourNotes("");
    showToast(`Added "${trimmedName}" to flavour list.`);
  };

  // Configurator: Remove flavour
  const handleRemoveFlavour = (flavourId: string) => {
    if (configFlavours.length <= 1) {
      showToast("You must keep at least one flavour.", "error");
      return;
    }
    setConfigFlavours(configFlavours.filter((f) => f.id !== flavourId));
    showToast("Flavour removed.");
  };

  // Configurator: Save configuration
  const handleSaveConfig = () => {
    const newConfig: CakeConfig = {
      minNoticeHours: Number(configNoticeHours) || 48,
      flavours: configFlavours,
    };

    startTransition(async () => {
      const res = await updateCakeConfig(newConfig);
      if (res.success && res.config) {
        setConfig(res.config);
        showToast("Cake form configuration saved and live on website!");
      } else {
        showToast(res.error || "Failed to save configuration.", "error");
      }
    });
  };

  // Reset flavours to standard defaults
  const handleResetFlavours = () => {
    const defaults: CakeFlavour[] = [
      { id: "Belgian Truffle", name: "Belgian Truffle", notes: "Rich dark chocolate & smooth cream" },
      { id: "Biscoff Crunch", name: "Biscoff Crunch", notes: "Caramelized lotus biscuits & creamy layers" },
      { id: "Red Velvet", name: "Red Velvet", notes: "Soft red sponge with cream cheese frosting" },
      { id: "Fresh Fruit Vanilla", name: "Fresh Fruit Vanilla", notes: "Pure vanilla sponge with seasonal fresh fruits" },
      { id: "Pistachio Rose", name: "Pistachio Rose", notes: "Pistachio sponge with light rose cream" },
      { id: "Custom Flavour", name: "Custom / Other Flavour", notes: "Tell us your own favourite flavour combination" },
    ];
    setConfigFlavours(defaults);
    setConfigNoticeHours(48);
    showToast("Reset form options to defaults. Click 'Save Changes' to apply.");
  };

  // Status pill styling
  const getStatusBadgeStyle = (status: CakeOrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200";
      case "Contacted":
        return "bg-sky-50 text-sky-800 border-sky-300 ring-1 ring-sky-200";
      case "Confirmed":
        return "bg-indigo-50 text-indigo-800 border-indigo-300 ring-1 ring-indigo-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-800 text-white border-emerald-700"
              : "bg-red-700 text-white border-red-600"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER & PORTAL NAVIGATION TABS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary-mustard/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-primary-mustard">
              Admin Portal
            </span>
            <span className="text-secondary-brown/40">•</span>
            <span className="text-xs font-semibold text-secondary-brown/70">
              Cake Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-secondary-brown mt-1">
            Custom Cake Operations
          </h1>
          <p className="text-xs sm:text-sm text-secondary-brown/70 mt-1 max-w-xl">
            Review incoming cake inquiries, trigger instant WhatsApp consultations, and customize options on the public order form.
          </p>
        </div>

        {/* Tab Toggle Switch */}
        <div className="flex items-center p-1.5 bg-[#FAF7F2] rounded-2xl border border-secondary-brown/15 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-primary-teal text-white shadow-sm"
                : "text-secondary-brown/70 hover:text-secondary-brown"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span>Orders Inbox</span>
            {counts.pending > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === "orders"
                    ? "bg-white text-primary-teal"
                    : "bg-amber-500 text-white"
                }`}
              >
                {counts.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "config"
                ? "bg-primary-teal text-white shadow-sm"
                : "text-secondary-brown/70 hover:text-secondary-brown"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Form Options Configurator</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: ORDERS / INQUIRIES INBOX */}
      {/* ========================================== */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Controls: Status Filter Pills & Search */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-primary-mustard/20 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStatusFilter("All")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "All"
                    ? "bg-secondary-brown text-white shadow-sm"
                    : "bg-secondary-white text-secondary-brown/70 hover:text-secondary-brown border border-secondary-brown/15"
                }`}
              >
                All ({counts.all})
              </button>

              <button
                onClick={() => setStatusFilter("Pending")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === "Pending"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Pending ({counts.pending})</span>
              </button>

              <button
                onClick={() => setStatusFilter("Contacted")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === "Contacted"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>Contacted ({counts.contacted})</span>
              </button>

              <button
                onClick={() => setStatusFilter("Confirmed")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === "Confirmed"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Confirmed ({counts.confirmed})</span>
              </button>

              <button
                onClick={() => setStatusFilter("Completed")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === "Completed"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Completed ({counts.completed})</span>
              </button>
            </div>

            {/* Search Bar & Refresh */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <svg
                  className="w-4 h-4 text-secondary-brown/40 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search client, phone, flavour..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-secondary-white rounded-xl border border-secondary-brown/20 text-secondary-brown focus:outline-none focus:border-primary-mustard"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary-brown/40 hover:text-secondary-brown"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh inquiries"
                className="p-2.5 rounded-xl border border-secondary-brown/20 text-secondary-brown/70 hover:text-secondary-brown hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div className="bg-white rounded-3xl border border-primary-mustard/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-[11px] uppercase font-bold tracking-wider text-secondary-brown/60 border-b border-secondary-brown/10 bg-[#FAF7F2]">
                    <th className="py-4 pl-6">Client Name & Phone</th>
                    <th className="py-4 px-4">Event Date & Occasion</th>
                    <th className="py-4 px-4">Tier Size & Weight</th>
                    <th className="py-4 px-4">Flavour</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 pr-6 text-right">Consultation & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-brown/10">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-secondary-brown/60">
                        <div className="w-12 h-12 rounded-full bg-secondary-brown/5 flex items-center justify-center mx-auto mb-3 text-secondary-brown/40">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="font-semibold text-sm">No cake inquiries found</p>
                        <p className="text-xs text-secondary-brown/50 mt-1">
                          {searchQuery || statusFilter !== "All"
                            ? "Try adjusting your search query or status filter."
                            : "Customer custom cake submissions will appear here automatically."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const nextStatus = getNextStatus(order.status);
                      const waUrl = getWhatsAppLink(order);

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-[#FAF7F2]/60 transition-colors group"
                        >
                          {/* Client Name & Contact */}
                          <td className="py-4 pl-6">
                            <div className="font-bold text-secondary-brown flex items-center gap-1.5">
                              <span>{order.name || "Anonymous Client"}</span>
                            </div>
                            <div className="text-[11px] font-mono text-secondary-brown/70 flex items-center gap-1 mt-0.5">
                              <span>{order.phone || "No phone provided"}</span>
                            </div>
                            <div className="text-[10px] text-secondary-brown/40 mt-1">
                              Received:{" "}
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </td>

                          {/* Event Date & Occasion */}
                          <td className="py-4 px-4">
                            <div className="font-semibold text-secondary-brown flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-primary-mustard flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>
                                {order.date
                                  ? new Date(
                                      order.date + "T00:00:00"
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Pending Date"}
                              </span>
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-teal/10 text-primary-teal">
                              {order.occasion || "Celebration"}
                            </span>
                          </td>

                          {/* Tier Size & Weight */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-secondary-brown">
                              {order.tier || "Single Tier"}
                            </div>
                            <div className="text-xs text-secondary-brown/70 mt-0.5">
                              {order.weight || "1kg"}
                            </div>
                            {order.topper && (
                              <div
                                title={order.topper}
                                className="text-[11px] font-serif italic text-primary-mustard truncate max-w-[140px] mt-1"
                              >
                                "{order.topper}"
                              </div>
                            )}
                          </td>

                          {/* Flavour */}
                          <td className="py-4 px-4">
                            <div className="font-serif font-bold text-secondary-brown max-w-[150px] truncate">
                              {order.flavour}
                            </div>
                            {order.notes && (
                              <div
                                title={order.notes}
                                className="text-[11px] text-secondary-brown/60 truncate max-w-[160px] mt-0.5"
                              >
                                {order.notes}
                              </div>
                            )}
                          </td>

                          {/* Status Pill & Action */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1.5">
                              {/* Status Badge */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                                  order.status
                                )}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    order.status === "Pending"
                                      ? "bg-amber-500"
                                      : order.status === "Contacted"
                                      ? "bg-sky-500"
                                      : order.status === "Confirmed"
                                      ? "bg-indigo-500"
                                      : "bg-emerald-500"
                                  }`}
                                ></span>
                                <span>{order.status}</span>
                              </span>

                              {/* Toggle Next Action Button */}
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id, nextStatus)
                                }
                                disabled={
                                  isPending && updatingOrderId === order.id
                                }
                                title={`Advance status to ${nextStatus}`}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary-brown/70 hover:text-primary-teal transition-colors cursor-pointer self-start"
                              >
                                <span>Set to {nextStatus}</span>
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>

                          {/* Consultation & Actions */}
                          <td className="py-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Direct WhatsApp Consultation Button */}
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open WhatsApp chat with prefilled greeting"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
                              >
                                <svg
                                  className="w-3.5 h-3.5 fill-current"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                </svg>
                                <span>WhatsApp</span>
                              </a>

                              {/* View Details Modal Trigger */}
                              <button
                                onClick={() => setSelectedOrder(order)}
                                title="View full inquiry details"
                                className="p-2 rounded-xl border border-secondary-brown/20 text-secondary-brown/70 hover:text-secondary-brown hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>

                              {/* Delete Order Button */}
                              <button
                                onClick={() => setDeletingOrder(order)}
                                title="Delete inquiry"
                                className="p-2 rounded-xl border border-secondary-brown/20 text-secondary-brown/40 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
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
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: FORM OPTIONS CONFIGURATOR */}
      {/* ========================================== */}
      {activeTab === "config" && (
        <div className="space-y-8">
          {/* NOTICE HOURS PANEL */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary-mustard/20 shadow-sm">
            <div className="pb-4 mb-6 border-b border-secondary-brown/10">
              <span className="text-xs uppercase tracking-widest font-bold text-primary-mustard">
                Advance Notice Settings
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-secondary-brown mt-1">
                Minimum Advance Notice Hours
              </h2>
              <p className="text-xs sm:text-sm text-secondary-brown/70 mt-1 max-w-2xl">
                Define the minimum preparation time required for custom cake orders. This automatically updates the public calendar date picker minimum selectable date and the order warning banner on <code>/custom-cakes</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[24, 48, 72, 96].map((hours) => {
                const isSelected = configNoticeHours === hours;
                return (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setConfigNoticeHours(hours)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary-teal bg-primary-teal/10 ring-2 ring-primary-teal/40 shadow-sm"
                        : "border-secondary-brown/15 bg-secondary-white hover:border-primary-teal/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-base text-secondary-brown">
                        {hours} Hours
                      </span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-teal"></span>
                      )}
                    </div>
                    <p className="text-xs text-secondary-brown/70">
                      {hours === 24
                        ? "1 Day Notice (Rush)"
                        : hours === 48
                        ? "2 Days Notice (Recommended)"
                        : hours === 72
                        ? "3 Days Notice (Standard)"
                        : "4 Days Notice (Speciality)"}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Hours Input */}
            <div className="flex items-center gap-3 max-w-sm">
              <label htmlFor="customHours" className="text-xs font-semibold text-secondary-brown whitespace-nowrap">
                Or enter custom hours:
              </label>
              <input
                id="customHours"
                type="number"
                min="1"
                max="360"
                value={configNoticeHours}
                onChange={(e) => setConfigNoticeHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 px-3 py-2 text-sm bg-secondary-white rounded-xl border border-secondary-brown/20 text-secondary-brown focus:outline-none focus:border-primary-mustard text-center font-bold"
              />
              <span className="text-xs text-secondary-brown/60">hours</span>
            </div>
          </div>

          {/* FLAVOURS CONFIGURATOR PANEL */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary-mustard/20 shadow-sm">
            <div className="pb-4 mb-6 border-b border-secondary-brown/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-primary-mustard">
                  Public Form Options
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-secondary-brown mt-1">
                  Cake Flavours Management
                </h2>
                <p className="text-xs sm:text-sm text-secondary-brown/70 mt-1 max-w-2xl">
                  Add, remove, or customize the flavour cards displayed on the customer-facing cake design portal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFlavours}
                className="text-xs font-semibold text-secondary-brown/60 hover:text-primary-mustard transition-colors self-start sm:self-auto"
              >
                Reset to Standard Flavours
              </button>
            </div>

            {/* Current Flavours List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {configFlavours.map((flavour, idx) => (
                <div
                  key={flavour.id + idx}
                  className="p-4 rounded-2xl border border-secondary-brown/15 bg-secondary-white flex items-start justify-between gap-3 group hover:border-primary-teal/40 transition-colors"
                >
                  <div>
                    <h4 className="font-serif font-bold text-secondary-brown text-base">
                      {flavour.name}
                    </h4>
                    <p className="text-xs text-secondary-brown/70 mt-1">
                      {flavour.notes}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-secondary-brown/40">
                      ID: {flavour.id}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFlavour(flavour.id)}
                    title={`Remove ${flavour.name}`}
                    className="p-1.5 rounded-lg text-secondary-brown/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Flavour Form */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-secondary-brown/15">
              <h3 className="font-serif font-bold text-secondary-brown text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-teal/15 text-primary-teal flex items-center justify-center text-xs font-bold font-sans">
                  +
                </span>
                <span>Add a New Flavour Option</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-4 flex flex-col gap-1.5">
                  <label htmlFor="flavourName" className="text-xs font-semibold text-secondary-brown">
                    Flavour Name <span className="text-primary-mustard">*</span>
                  </label>
                  <input
                    id="flavourName"
                    type="text"
                    value={newFlavourName}
                    onChange={(e) => setNewFlavourName(e.target.value)}
                    placeholder="e.g. Belgian Truffle, Mango Cream"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-secondary-brown/20 text-secondary-brown focus:outline-none focus:border-primary-mustard"
                  />
                </div>

                <div className="sm:col-span-6 flex flex-col gap-1.5">
                  <label htmlFor="flavourNotes" className="text-xs font-semibold text-secondary-brown">
                    Short Description / Tasting Notes
                  </label>
                  <input
                    id="flavourNotes"
                    type="text"
                    value={newFlavourNotes}
                    onChange={(e) => setNewFlavourNotes(e.target.value)}
                    placeholder="e.g. Rich dark chocolate with smooth cream layers"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-secondary-brown/20 text-secondary-brown focus:outline-none focus:border-primary-mustard"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddFlavour}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary-teal hover:bg-[#20a8a4] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    + Add Flavour
                  </button>
                </div>
              </div>
            </div>

            {/* Save Configuration Action Bar */}
            <div className="mt-8 pt-6 border-t border-secondary-brown/10 flex items-center justify-between">
              <div className="text-xs text-secondary-brown/70">
                Total flavours active: <strong>{configFlavours.length}</strong> • Min notice: <strong>{configNoticeHours} hours</strong>
              </div>

              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-mustard hover:bg-[#b88c19] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: ORDER DETAILS DIALOG */}
      {/* ========================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-primary-mustard/30 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-secondary-brown/10 mb-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-primary-mustard">
                  Order Details
                </span>
                <h3 className="font-serif text-2xl font-bold text-secondary-brown">
                  {selectedOrder.name || "Custom Cake Inquiry"}
                </h3>
                <span className="text-xs text-secondary-brown/50 font-mono">
                  ID: {selectedOrder.id}
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-secondary-brown/50 hover:text-secondary-brown"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Specifications Grid */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF7F2]">
                <div>
                  <span className="text-secondary-brown/60 block text-xs">Phone / WhatsApp</span>
                  <span className="font-bold text-secondary-brown font-mono text-sm">
                    {selectedOrder.phone}
                  </span>
                </div>
                <div>
                  <span className="text-secondary-brown/60 block text-xs">Celebration Date</span>
                  <span className="font-bold text-secondary-brown text-sm">
                    {selectedOrder.date
                      ? new Date(selectedOrder.date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-secondary-brown/60 block text-xs">Occasion</span>
                  <span className="font-semibold text-secondary-brown">
                    {selectedOrder.occasion}
                  </span>
                </div>
                <div>
                  <span className="text-secondary-brown/60 block text-xs">Current Status</span>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF7F2]">
                <div>
                  <span className="text-secondary-brown/60 block text-xs">Structure & Tiers</span>
                  <span className="font-serif font-bold text-secondary-brown text-sm">
                    {selectedOrder.tier}
                  </span>
                </div>
                <div>
                  <span className="text-secondary-brown/60 block text-xs">Weight</span>
                  <span className="font-bold text-secondary-brown text-sm">
                    {selectedOrder.weight}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-secondary-brown/60 block text-xs">Cake Flavour</span>
                  <span className="font-serif font-bold text-secondary-brown text-base text-primary-mustard">
                    {selectedOrder.flavour}
                  </span>
                </div>
              </div>

              {selectedOrder.topper && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                  <span className="text-xs font-semibold text-amber-900 block mb-1">
                    Cake Topper / Written Message:
                  </span>
                  <p className="font-serif italic text-secondary-brown text-base">
                    "{selectedOrder.topper}"
                  </p>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="p-4 rounded-2xl bg-secondary-white border border-secondary-brown/10">
                  <span className="text-xs font-semibold text-secondary-brown block mb-1">
                    Design Theme & Colour Notes:
                  </span>
                  <p className="text-secondary-brown/90 leading-relaxed whitespace-pre-wrap">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              <div className="text-[11px] text-secondary-brown/50 pt-2">
                Order Received: {new Date(selectedOrder.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-secondary-brown/10 flex flex-wrap items-center justify-between gap-3">
              {/* Quick Status Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-secondary-brown">Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id,
                      e.target.value as CakeOrderStatus
                    )
                  }
                  className="px-3 py-1.5 rounded-xl border border-secondary-brown/20 bg-white text-xs font-bold text-secondary-brown focus:outline-none focus:border-primary-mustard"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>Open WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: DELETE ORDER CONFIRMATION */}
      {/* ========================================== */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-xl font-bold font-serif text-secondary-brown text-center mb-2">
              Delete Cake Inquiry?
            </h3>
            <p className="text-xs sm:text-sm text-secondary-brown/70 text-center mb-6">
              Are you sure you want to remove the inquiry from <strong>{deletingOrder.name}</strong> ({deletingOrder.flavour})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-secondary-brown/20 text-secondary-brown text-xs font-bold hover:bg-secondary-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                {isPending ? "Deleting..." : "Yes, Delete Inquiry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
