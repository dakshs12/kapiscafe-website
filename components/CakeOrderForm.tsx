"use client";

import React, { useState, useEffect } from "react";
import { submitCustomCakeOrder } from "@/app/actions";
import CustomDatePicker from "./CustomDatePicker";

export default function CakeOrderForm() {
  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [tier, setTier] = useState("2-Tier");
  const [weight, setWeight] = useState("2kg");
  const [flavour, setFlavour] = useState("Belgian Truffle");
  const [customFlavour, setCustomFlavour] = useState("");
  const [notes, setNotes] = useState("");
  const [topperText, setTopperText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [minDate, setMinDate] = useState("");

  // Set min date (48 hours from today) on client mount to avoid hydration mismatch
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper formatting for summary date
  const formatDisplayDate = (dString: string) => {
    if (!dString) return "Date to be confirmed (min. 48h)";
    const dateObj = new Date(dString + "T00:00:00");
    if (isNaN(dateObj.getTime())) return dString;
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const occasionsList = ["Birthday", "Wedding", "Anniversary", "Milestone", "Baby Shower", "Corporate", "Other"];

  const tierOptions = [
    { id: "Single Tier", label: "Single Tier", desc: "For small parties", serves: "4 - 12 guests" },
    { id: "2-Tier", label: "2-Tier", desc: "Classic celebration", serves: "15 - 30 guests" },
    { id: "3-Tier", label: "3-Tier", desc: "Large celebration", serves: "35 - 75+ guests" },
  ];

  const weightOptions = [
    { id: "0.5kg", label: "0.5kg", serves: "4 - 6 guests" },
    { id: "1kg", label: "1kg", serves: "8 - 12 guests" },
    { id: "2kg", label: "2kg", serves: "18 - 24 guests" },
    { id: "3kg+", label: "3kg+", serves: "30+ guests" },
  ];

  const flavourOptions = [
    { id: "Belgian Truffle", name: "Belgian Truffle", notes: "Rich dark chocolate & smooth cream" },
    { id: "Biscoff Crunch", name: "Biscoff Crunch", notes: "Caramelized lotus biscuits & creamy layers" },
    { id: "Red Velvet", name: "Red Velvet", notes: "Soft red sponge with cream cheese frosting" },
    { id: "Fresh Fruit Vanilla", name: "Fresh Fruit Vanilla", notes: "Pure vanilla sponge with seasonal fresh fruits" },
    { id: "Pistachio Rose", name: "Pistachio Rose", notes: "Pistachio sponge with light rose cream" },
    { id: "Custom Flavour", name: "Custom / Other Flavour", notes: "Tell us your own favourite flavour combination" },
  ];

  // Effective flavour label for preview
  const displayFlavour =
    flavour === "Custom Flavour"
      ? customFlavour.trim()
        ? `Custom: ${customFlavour.trim()}`
        : "Custom Flavour (specify below)"
      : flavour;

  // Build pre-filled WhatsApp message URL
  const generateWhatsAppUrl = () => {
    const chosenFlavour =
      flavour === "Custom Flavour"
        ? customFlavour.trim() || "Custom Flavour"
        : flavour;
    const formattedDate = formatDisplayDate(eventDate);
    const weightServes = weightOptions.find((w) => w.id === weight)?.serves || "";

    const lines = [
      "*New Custom Cake Request - Kapi's Bakehouse*",
      "",
      "*Customer Details:*",
      `• Name: ${fullName.trim() || "Not specified"}`,
      `• Phone: ${phone.trim() || "Not specified"}`,
      "",
      "*Cake Specifications:*",
      `• Structure / Tiers: ${tier}`,
      `• Weight: ${weight}${weightServes ? ` (${weightServes})` : ""}`,
      `• Flavour: ${chosenFlavour}`,
      `• Occasion: ${occasion}`,
      `• Celebration Date: ${formattedDate}`,
    ];

    if (topperText.trim()) {
      lines.push(`• Message on Cake / Topper: "${topperText.trim()}"`);
    }

    if (notes.trim()) {
      lines.push("");
      lines.push("*Design & Colour Notes:*");
      lines.push(notes.trim());
    }

    lines.push("");
    lines.push("_Sent via kapisbakehouse.com_");

    const message = lines.join("\n");
    return `https://wa.me/919109991600?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const waUrl = generateWhatsAppUrl();

    try {
      const formData = new FormData(e.currentTarget);
      if (flavour === "Custom Flavour" && customFlavour.trim()) {
        formData.set("flavour", `Custom: ${customFlavour.trim()}`);
      }
      formData.set("name", fullName);
      formData.set("date", eventDate);
      formData.set("topper", topperText);
      formData.set("notes", notes);

      await submitCustomCakeOrder(formData);
    } catch (err) {
      console.error("Error logging cake order:", err);
    } finally {
      setIsSubmitting(false);
      // Attempt to open WhatsApp directly in new window/tab
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    const waUrl = generateWhatsAppUrl();
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 md:p-14 bg-white rounded-3xl border border-primary-mustard/30 shadow-xl text-center font-sans">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
        </div>
        <span className="inline-block px-4 py-1 rounded-full bg-primary-mustard/15 text-primary-mustard text-xs font-semibold uppercase tracking-widest mb-3">
          Order Ready for WhatsApp
        </span>
        <h2 className="text-3xl sm:text-4xl text-secondary-brown font-serif font-bold mb-4">
          Thank you, {fullName || "valued customer"}!
        </h2>
        <p className="text-secondary-brown/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-6 font-sans">
          Your custom cake specifications for <strong className="text-secondary-brown">{formatDisplayDate(eventDate)}</strong> are ready.
        </p>

        {/* WhatsApp Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>Open in WhatsApp to Confirm</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl border border-secondary-brown/20 text-secondary-brown hover:bg-secondary-white font-medium text-base transition-colors duration-200 cursor-pointer"
          >
            Design Another Cake
          </button>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-primary-mustard/20 max-w-md mx-auto text-sm text-secondary-brown/90 mb-2 text-left space-y-2">
          <p className="font-semibold text-secondary-brown flex items-center gap-2">
            <svg className="w-4 h-4 text-[#25D366] fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            Direct WhatsApp Booking (+91 91099 91600)
          </p>
          <p className="text-xs text-secondary-brown/75 leading-relaxed">
            If WhatsApp didn't pop up automatically, tap the green button above to send your pre-filled custom cake request directly to our bakery team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="cake-order-form" className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Hidden inputs for form data */}
        <input type="hidden" name="tier" value={tier} />
        <input type="hidden" name="weight" value={weight} />
        <input type="hidden" name="flavour" value={flavour === "Custom Flavour" ? customFlavour : flavour} />
        <input type="hidden" name="occasion" value={occasion} />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">

          {/* LEFT COLUMN: Configurator (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">

            {/* SECTION 1: Occasion & Date */}
            <div className="cake-form-section bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-primary-mustard/20 shadow-sm">
              <div className="flex items-center gap-3 pb-3.5 mb-5 border-b border-secondary-brown/10">
                <span className="w-8 h-8 rounded-full bg-primary-mustard/15 text-primary-mustard font-bold text-sm flex items-center justify-center font-sans">
                  01
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-secondary-brown font-bold tracking-wide">
                    Occasion & Date
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-brown/70 font-sans">
                    Tell us who this celebration is for and when you need it delivered.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
                {/* Client Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fullName" className="text-sm font-semibold text-secondary-brown">
                    Your Name <span className="text-primary-mustard">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anya Sharma"
                    className="w-full px-4 py-3 text-secondary-brown bg-secondary-white rounded-xl border border-secondary-brown/20 focus:outline-none focus:border-primary-mustard focus:ring-1 focus:ring-primary-mustard transition-all text-sm"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-secondary-brown">
                    Phone / WhatsApp Number <span className="text-primary-mustard">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 text-secondary-brown bg-secondary-white rounded-xl border border-secondary-brown/20 focus:outline-none focus:border-primary-mustard focus:ring-1 focus:ring-primary-mustard transition-all text-sm"
                  />
                </div>

                {/* Event Date (Min 48 Hours) */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="eventDate" className="text-sm font-semibold text-secondary-brown">
                      Event / Celebration Date <span className="text-primary-mustard">*</span>
                    </label>
                    <span className="text-xs text-primary-mustard font-medium">
                      Minimum 48 hours notice required
                    </span>
                  </div>
                  <CustomDatePicker
                    id="eventDate"
                    name="eventDate"
                    value={eventDate}
                    onChange={(dateStr) => setEventDate(dateStr)}
                    minDate={minDate}
                    required
                  />
                  <p className="text-[11px] text-secondary-brown/60">
                    Orders require at least 48 hours notice so our chefs can bake and decorate your cake fresh.
                  </p>
                </div>

                {/* Occasion Selector */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-secondary-brown">
                    Celebration Type
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {occasionsList.map((occ) => (
                      <button
                        type="button"
                        key={occ}
                        onClick={() => setOccasion(occ)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${occasion === occ
                          ? "bg-secondary-brown text-white border-secondary-brown shadow-sm"
                          : "bg-secondary-white text-secondary-brown/80 border-secondary-brown/15 hover:border-primary-mustard hover:text-secondary-brown"
                          }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Cake Size & Tiers */}
            <div className="cake-form-section bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-primary-mustard/20 shadow-sm">
              <div className="flex items-center gap-3 pb-3.5 mb-5 border-b border-secondary-brown/10">
                <span className="w-8 h-8 rounded-full bg-primary-mustard/15 text-primary-mustard font-bold text-sm flex items-center justify-center font-sans">
                  02
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-secondary-brown font-bold tracking-wide">
                    Cake Size & Tiers
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-brown/70 font-sans">
                    Choose how many tiers and how much cake you need for your guests.
                  </p>
                </div>
              </div>

              {/* Number of Tiers */}
              <div className="mb-6 font-sans">
                <label className="text-sm font-semibold text-secondary-brown block mb-3">
                  Number of Tiers <span className="text-primary-mustard">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tierOptions.map((opt) => {
                    const isSelected = tier === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setTier(opt.id)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer ${isSelected
                          ? "border-primary-mustard bg-primary-mustard/10 shadow-sm ring-2 ring-primary-mustard/40"
                          : "border-secondary-brown/15 bg-secondary-white hover:border-primary-mustard/50"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-serif font-bold text-base ${isSelected ? "text-secondary-brown" : "text-secondary-brown/90"}`}>
                            {opt.label}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary-mustard bg-primary-mustard" : "border-secondary-brown/30"
                              }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-brown/70">{opt.desc}</p>
                        <span className="inline-block mt-2 text-[11px] font-semibold text-primary-mustard">
                          {opt.serves}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cake Weight & Servings */}
              <div className="font-sans">
                <label className="text-sm font-semibold text-secondary-brown block mb-3">
                  Cake Weight & Servings <span className="text-primary-mustard">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {weightOptions.map((w) => {
                    const isSelected = weight === w.id;
                    return (
                      <button
                        type="button"
                        key={w.id}
                        onClick={() => setWeight(w.id)}
                        className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${isSelected
                          ? "border-primary-mustard bg-primary-mustard text-white shadow-sm"
                          : "border-secondary-brown/15 bg-secondary-white text-secondary-brown hover:border-primary-mustard/60"
                          }`}
                      >
                        <div className="font-bold text-base">{w.label}</div>
                        <div className={`text-[11px] ${isSelected ? "text-white/90" : "text-secondary-brown/65"}`}>
                          {w.serves}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: Cake Flavour */}
            <div className="cake-form-section bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-primary-mustard/20 shadow-sm">
              <div className="flex items-center gap-3 pb-3.5 mb-5 border-b border-secondary-brown/10">
                <span className="w-8 h-8 rounded-full bg-primary-mustard/15 text-primary-mustard font-bold text-sm flex items-center justify-center font-sans">
                  03
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-secondary-brown font-bold tracking-wide">
                    Cake Flavour
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-brown/70 font-sans">
                    Choose from our popular flavours or enter your own custom flavour.
                  </p>
                </div>
              </div>

              {/* Flavour Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                {flavourOptions.map((flav) => {
                  const isSelected = flavour === flav.id;
                  return (
                    <button
                      type="button"
                      key={flav.id}
                      onClick={() => setFlavour(flav.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${isSelected
                        ? "border-primary-teal bg-primary-teal/10 ring-2 ring-primary-teal/40 shadow-sm"
                        : "border-secondary-brown/15 bg-secondary-white hover:border-primary-teal/40"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif font-bold text-secondary-brown text-base">
                          {flav.name}
                        </span>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-teal"></span>
                        )}
                      </div>
                      <p className="text-xs text-secondary-brown/70 leading-snug">
                        {flav.notes}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Custom Flavour Input Field */}
              {flavour === "Custom Flavour" && (
                <div className="mt-4 pt-4 border-t border-secondary-brown/10 font-sans flex flex-col gap-1.5 animate-fadeIn">
                  <label htmlFor="customFlavour" className="text-sm font-semibold text-secondary-brown flex items-center justify-between">
                    <span>Describe Your Custom Flavour <span className="text-primary-mustard">*</span></span>
                  </label>
                  <input
                    type="text"
                    id="customFlavour"
                    value={customFlavour}
                    onChange={(e) => setCustomFlavour(e.target.value)}
                    required={flavour === "Custom Flavour"}
                    placeholder="e.g. Pineapple Delight, Hazelnut Praline, Mango Cream, Mocha..."
                    className="w-full px-4 py-3 text-secondary-brown bg-secondary-white rounded-xl border border-primary-teal/50 focus:outline-none focus:border-primary-mustard focus:ring-1 focus:ring-primary-mustard transition-all text-sm shadow-xs"
                  />
                  <p className="text-xs text-secondary-brown/60">
                    Let us know what flavours, fruits, or fillings you love.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 4: Design & Personal Message */}
            <div className="cake-form-section bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-primary-mustard/20 shadow-sm font-sans">
              <div className="flex items-center gap-3 pb-3.5 mb-5 border-b border-secondary-brown/10">
                <span className="w-8 h-8 rounded-full bg-primary-mustard/15 text-primary-mustard font-bold text-sm flex items-center justify-center">
                  04
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-secondary-brown font-bold tracking-wide">
                    Design & Personal Message
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-brown/70">
                    Tell us your theme ideas, colours, and any message you want written on the cake.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Cake Topper / Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="topperText" className="text-sm font-semibold text-secondary-brown flex items-center justify-between">
                    <span>Message on Cake / Topper Text</span>
                    <span className="text-xs text-secondary-brown/50 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    id="topperText"
                    name="topperText"
                    value={topperText}
                    onChange={(e) => setTopperText(e.target.value)}
                    placeholder="e.g. 'Happy 30th Rhea' or 'Happy Anniversary Mom & Dad'"
                    className="w-full px-4 py-3 text-secondary-brown bg-secondary-white rounded-xl border border-secondary-brown/20 focus:outline-none focus:border-primary-mustard focus:ring-1 focus:ring-primary-mustard transition-all text-sm"
                  />
                </div>

                {/* Theme & Design Notes */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="designNotes" className="text-sm font-semibold text-secondary-brown flex items-center justify-between">
                    <span>Design Theme & Colour Notes</span>
                    <span className="text-xs text-secondary-brown/50 font-normal">Optional</span>
                  </label>
                  <textarea
                    id="designNotes"
                    name="designNotes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your preferred colours, theme, piping style, or specific details you would like us to include..."
                    className="w-full px-4 py-3 text-secondary-brown bg-secondary-white rounded-xl border border-secondary-brown/20 focus:outline-none focus:border-primary-mustard focus:ring-1 focus:ring-primary-mustard transition-all text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Cake Summary (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <div className="summary-card bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border-2 border-primary-mustard/30 shadow-xl overflow-hidden relative">

              {/* Subtle Watermark Ornament */}
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-primary-mustard/5 rounded-full pointer-events-none"></div>

              {/* Summary Header */}
              <div className="border-b border-secondary-brown/10 pb-4 mb-5">
                <div className="mb-2">
                  <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-primary-mustard/15 text-primary-mustard font-sans">
                    Summary
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-primary-mustard font-bold">
                  Your Cake Summary
                </h3>
                <p className="text-xs text-secondary-brown/70 font-sans mt-1">
                  Overview of your custom cake order.
                </p>
              </div>

              {/* Summary Specifications Table */}
              <div className="space-y-4 font-sans text-sm mb-6">

                {/* Number of Tiers */}
                <div className="flex items-start justify-between py-2 border-b border-secondary-brown/5">
                  <span className="text-secondary-brown/60 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary-mustard" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Tiers
                  </span>
                  <span className="font-serif font-bold text-secondary-brown text-right">
                    {tier}
                  </span>
                </div>

                {/* Weight & Servings */}
                <div className="flex items-start justify-between py-2 border-b border-secondary-brown/5">
                  <span className="text-secondary-brown/60 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary-mustard" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Weight & Servings
                  </span>
                  <span className="font-semibold text-secondary-brown text-right">
                    {weight} <span className="text-xs text-primary-mustard font-normal">({weightOptions.find((w) => w.id === weight)?.serves})</span>
                  </span>
                </div>

                {/* Flavour */}
                <div className="flex items-start justify-between py-2 border-b border-secondary-brown/5">
                  <span className="text-secondary-brown/60 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Flavour
                  </span>
                  <span className="font-serif font-bold text-secondary-brown text-right max-w-[190px] truncate">
                    {displayFlavour}
                  </span>
                </div>

                {/* Event Date */}
                <div className="flex items-start justify-between py-2 border-b border-secondary-brown/5">
                  <span className="text-secondary-brown/60 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary-mustard" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Event Date
                  </span>
                  <span className="font-semibold text-secondary-brown text-right">
                    {formatDisplayDate(eventDate)}
                  </span>
                </div>

                {/* Occasion */}
                <div className="flex items-start justify-between py-2 border-b border-secondary-brown/5">
                  <span className="text-secondary-brown/60 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H4a2 2 0 00-2 2v2a2 2 0 002 2h16a2 2 0 002-2v-2a2 2 0 00-2-2h-8zM4 14v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                    </svg>
                    Occasion
                  </span>
                  <span className="font-medium text-secondary-brown text-right">
                    {occasion}
                  </span>
                </div>

                {/* Cake Message / Topper */}
                {topperText ? (
                  <div className="flex items-start justify-between py-2">
                    <span className="text-secondary-brown/60 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-primary-mustard" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Message on Cake
                    </span>
                    <span className="font-serif italic text-primary-mustard text-right font-medium max-w-[180px] truncate">
                      "{topperText}"
                    </span>
                  </div>
                ) : null}

              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold text-base tracking-wide shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2.5 group cursor-pointer disabled:opacity-75"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>{isSubmitting ? "Preparing WhatsApp..." : "Send Request via WhatsApp"}</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <p className="text-[11px] text-center text-secondary-brown/60 font-sans mt-3">
                Opens directly in WhatsApp (+91 91099 91600) with your cake specifications pre-filled.
              </p>
            </div>
          </div>

        </div>

        {/* BAKEHOUSE NOTICE BANNER */}
        <div className="cake-form-section mt-8 sm:mt-12 bg-[#FDFBF7] border border-primary-mustard/30 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-mustard/15 text-primary-mustard flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wider font-bold text-primary-mustard block mb-1">
                Important Order Notice
              </span>
              <p className="text-secondary-brown text-sm sm:text-base leading-relaxed">
                <strong>Please note:</strong> Custom cakes need at least <strong>48 hours</strong> to prepare. Our team will contact you on WhatsApp within <strong>4 business hours</strong> to discuss your design and give you the final price.
              </p>
            </div>
            <a
              href="https://wa.me/919109991600"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary-mustard/40 bg-white text-secondary-brown font-semibold text-xs sm:text-sm hover:bg-primary-mustard hover:text-white transition-all shadow-sm flex-shrink-0"
            >
              <span>Chat on WhatsApp</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

      </form>
    </div>
  );
}
