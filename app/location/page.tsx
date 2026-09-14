import LocationInfo from "@/components/LocationInfo";

export default function LocationPage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="hero-section flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary-brown tracking-tight leading-tight mb-3 sm:mb-4">
            Our Location
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-mustard font-sans font-medium max-w-2xl mx-auto leading-relaxed px-4">
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
