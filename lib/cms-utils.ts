export interface MenuItem {
  _uid: string;
  component: "menuItem";
  category: "Cakes" | "Breads" | "Pastries" | "Beverages";
  title: string;
  description: string;
  price: string;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  // Simulate network delay for CMS fetch
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      _uid: "item-1",
      component: "menuItem",
      category: "Cakes",
      title: "Classic Chocolate Fudge",
      description: "Decadent dark chocolate layers with a rich fudge frosting.",
      price: "$35.00",
    },
    {
      _uid: "item-2",
      component: "menuItem",
      category: "Breads",
      title: "Artisan Sourdough",
      description: "Naturally leavened with a perfectly crisp crust and chewy center.",
      price: "$8.50",
    },
    {
      _uid: "item-3",
      component: "menuItem",
      category: "Pastries",
      title: "Almond Croissant",
      description: "Flaky all-butter pastry filled with sweet almond frangipane.",
      price: "$5.25",
    },
    {
      _uid: "item-4",
      component: "menuItem",
      category: "Beverages",
      title: "Kapi's Cold Brew",
      description: "Our signature house blend, slowly steeped for 18 hours.",
      price: "$4.50",
    },
    {
      _uid: "item-5",
      component: "menuItem",
      category: "Cakes",
      title: "Vanilla Bean Dream",
      description: "Light vanilla sponge layered with Madagascar vanilla bean buttercream.",
      price: "$30.00",
    },
    {
      _uid: "item-6",
      component: "menuItem",
      category: "Pastries",
      title: "Pain au Chocolat",
      description: "Classic French pastry filled with rich dark chocolate batons.",
      price: "$4.75",
    }
  ];
}
