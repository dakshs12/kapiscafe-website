"use client";

import { submitCustomCakeOrder } from "@/app/actions";

export default function CakeOrderForm() {
  return (
    <form 
      action={submitCustomCakeOrder} 
      className="max-w-2xl mx-auto w-full bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm border border-primary-mustard/20 flex flex-col gap-5 sm:gap-6"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-secondary-brown mb-2 sm:mb-4 font-serif">
        Start Your Order
      </h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="fullName" className="font-semibold text-secondary-brown text-sm sm:text-base">
          Full Name
        </label>
        <input 
          type="text" 
          id="fullName" 
          name="fullName" 
          required 
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-secondary-white text-secondary-brown border border-secondary-brown/20 focus:outline-none focus:ring-2 focus:ring-primary-mustard focus:border-transparent transition-shadow"
          placeholder="Jane Doe"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="eventDate" className="font-semibold text-secondary-brown text-sm sm:text-base">
          Event Date
        </label>
        <input 
          type="date" 
          id="eventDate" 
          name="eventDate" 
          required 
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-secondary-white text-secondary-brown border border-secondary-brown/20 focus:outline-none focus:ring-2 focus:ring-primary-mustard focus:border-transparent transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="tierSize" className="font-semibold text-secondary-brown text-sm sm:text-base">
          Cake Tier Size
        </label>
        <select 
          id="tierSize" 
          name="tierSize" 
          required 
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-secondary-white text-secondary-brown border border-secondary-brown/20 focus:outline-none focus:ring-2 focus:ring-primary-mustard focus:border-transparent transition-shadow appearance-none"
        >
          <option value="">Select a size...</option>
          <option value="1-tier">1 Tier (Serves 10-15)</option>
          <option value="2-tier">2 Tiers (Serves 25-40)</option>
          <option value="3-tier">3 Tiers (Serves 50-75)</option>
          <option value="custom">Custom / Larger</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="designNotes" className="font-semibold text-secondary-brown text-sm sm:text-base">
          Design Notes
        </label>
        <textarea 
          id="designNotes" 
          name="designNotes" 
          rows={4} 
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-secondary-white text-secondary-brown border border-secondary-brown/20 focus:outline-none focus:ring-2 focus:ring-primary-mustard focus:border-transparent transition-shadow resize-none"
          placeholder="Tell us about the theme, colors, or any specific ideas you have!"
        ></textarea>
      </div>

      <button 
        type="submit" 
        className="mt-2 sm:mt-4 w-full bg-primary-teal text-secondary-white font-bold py-3 sm:py-4 rounded-xl shadow hover:shadow-md hover:opacity-90 transition-all text-base sm:text-lg"
      >
        Submit Order Request
      </button>
    </form>
  );
}
