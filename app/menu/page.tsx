import { getMenuItems } from "@/lib/cms-utils";

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="flex flex-col flex-1">
      <section className="hero-section flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden">
        <div className="z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-primary-mustard">Menu</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-brown/80 max-w-2xl mx-auto">
            Discover our delicious range of freshly baked goods, made with love every single day.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item._uid}
              className="menu-item-card bg-secondary-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-primary-mustard/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-teal mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-secondary-brown">
                    {item.title}
                  </h3>
                </div>
                <span className="text-lg font-bold text-primary-mustard ml-4 shrink-0">
                  {item.price}
                </span>
              </div>
              <p className="text-secondary-brown/80 text-sm mt-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
