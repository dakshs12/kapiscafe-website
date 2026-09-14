import LocationInfo from "@/components/LocationInfo";

export default function LocationPage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="hero-section flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
            Our <span className="text-primary-mustard">Location</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-secondary-brown/80 max-w-2xl mx-auto px-4">
            Come visit us and enjoy the cozy atmosphere at Kapi's Bakehouse.
          </p>
        </div>
      </section>
      
      <section className="py-6 sm:py-8 px-4 sm:px-6 bg-[var(--color-secondary-white)] overflow-hidden">
        <LocationInfo />
      </section>
    </div>
  );
}
