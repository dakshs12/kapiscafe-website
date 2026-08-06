import InteractiveCakeHero from "@/components/InteractiveCakeHero";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <InteractiveCakeHero />
      <FeaturedCarousel />
    </main>
  );
}
