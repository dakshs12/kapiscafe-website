import InteractiveCakeHero from "@/components/InteractiveCakeHero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import OurStory from "@/components/OurStory";
import MenuCTA from "@/components/MenuCTA";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <InteractiveCakeHero />
      <FeaturedCarousel />
      <OurStory />
      <MenuCTA />
    </main>
  );
}
