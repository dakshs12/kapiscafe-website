import CakeOrderForm from "@/components/CakeOrderForm";

export default function CustomCakesPage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="hero-section flex flex-col items-center justify-center py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            Custom <span className="text-primary-mustard">Cakes</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-secondary-brown/80 max-w-2xl mx-auto px-4">
            Bespoke creations for your special moments. Let us bring your vision to life.
          </p>
        </div>
      </section>
      
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[var(--color-secondary-white)]">
        <CakeOrderForm />
      </section>
    </div>
  );
}
