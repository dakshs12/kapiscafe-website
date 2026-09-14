export interface MenuItem {
  _uid: string;
  component: "menuItem";
  category: string;
  subCategory: string;
  title: string;
  description: string;
  price: string;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  // Simulate network delay for CMS fetch
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
        "_uid": "item-1",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pizza",
        "title": "Margherita",
        "description": "Cheese & Herbs",
        "price": "₹149"
    },
    {
        "_uid": "item-2",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pizza",
        "title": "Extra Cheese Pizza",
        "description": "",
        "price": "₹179"
    },
    {
        "_uid": "item-3",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pizza",
        "title": "Simply Veg",
        "description": "Cheese, Onion & Capsicum",
        "price": "₹159"
    },
    {
        "_uid": "item-4",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pizza",
        "title": "Farm Fresh",
        "description": "Cheese, Bell Peppers, Mushroom & Onion",
        "price": "₹179"
    },
    {
        "_uid": "item-5",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pizza",
        "title": "Peri Peri Paneer",
        "description": "Cheese, Spicy Paneer, Onion & Capsicum",
        "price": "₹199"
    },
    {
        "_uid": "item-6",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pizza",
        "title": "Extra Cheese",
        "description": "",
        "price": "₹30"
    },
    {
        "_uid": "item-7",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pasta",
        "title": "Red Sauce Pasta",
        "description": "",
        "price": "₹199"
    },
    {
        "_uid": "item-8",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pasta",
        "title": "White Sauce Pasta",
        "description": "",
        "price": "₹199"
    },
    {
        "_uid": "item-9",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Pasta",
        "title": "Pink Sauce Pasta",
        "description": "",
        "price": "₹225"
    },
    {
        "_uid": "item-10",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Lasagne",
        "title": "Veg Lasagne",
        "description": "",
        "price": "₹249"
    },
    {
        "_uid": "item-11",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Garlic Bread",
        "title": "Garlic Bread",
        "description": "",
        "price": "₹99"
    },
    {
        "_uid": "item-12",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Garlic Bread",
        "title": "Cheese Garlic Bread",
        "description": "",
        "price": "₹129"
    },
    {
        "_uid": "item-13",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Garlic Bread",
        "title": "Chilli Garlic Bread",
        "description": "",
        "price": "₹129"
    },
    {
        "_uid": "item-14",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Garlic Bread",
        "title": "Paneer Garlic Bread",
        "description": "",
        "price": "₹169"
    },
    {
        "_uid": "item-15",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Burger",
        "title": "Veg Burger",
        "description": "",
        "price": "₹79"
    },
    {
        "_uid": "item-16",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Burger",
        "title": "Veg Cheese Burger",
        "description": "",
        "price": "₹89"
    },
    {
        "_uid": "item-17",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Burger",
        "title": "Makhani Paneer Burger",
        "description": "",
        "price": "₹129"
    },
    {
        "_uid": "item-18",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Patties & Samosa",
        "title": "Butter Samosa",
        "description": "",
        "price": "₹30"
    },
    {
        "_uid": "item-19",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Patties & Samosa",
        "title": "Veg Samosa",
        "description": "",
        "price": "₹35"
    },
    {
        "_uid": "item-20",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Patties & Samosa",
        "title": "Paneer Patties",
        "description": "",
        "price": "₹40"
    },
    {
        "_uid": "item-21",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Patties & Samosa",
        "title": "Peri Peri Samosa",
        "description": "",
        "price": "₹45"
    },
    {
        "_uid": "item-22",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Fries",
        "title": "Salted Fries",
        "description": "",
        "price": "₹69"
    },
    {
        "_uid": "item-23",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Fries",
        "title": "Peri Peri Fries",
        "description": "",
        "price": "₹79"
    },
    {
        "_uid": "item-24",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Fries",
        "title": "Cheese Fries",
        "description": "",
        "price": "₹99"
    },
    {
        "_uid": "item-25",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Grilled Sandwich",
        "title": "Veg Grilled Sandwich",
        "description": "",
        "price": "₹99"
    },
    {
        "_uid": "item-26",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Grilled Sandwich",
        "title": "Cheese Chutney Sandwich",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-27",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Grilled Sandwich",
        "title": "Paneer Grilled Sandwich",
        "description": "",
        "price": "₹139"
    },
    {
        "_uid": "item-28",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Maggi",
        "title": "Plain Maggi",
        "description": "",
        "price": "₹69"
    },
    {
        "_uid": "item-29",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Maggi",
        "title": "Veg Maggi",
        "description": "",
        "price": "₹89"
    },
    {
        "_uid": "item-30",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Maggi",
        "title": "Cheese Maggi",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-31",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Momos",
        "title": "Veg Momos",
        "description": "6 Pcs.",
        "price": "₹75"
    },
    {
        "_uid": "item-32",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Momos",
        "title": "Paneer Momos",
        "description": "6 Pcs.",
        "price": "₹99"
    },
    {
        "_uid": "item-33",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Spiral Roll",
        "description": "",
        "price": "₹70"
    },
    {
        "_uid": "item-34",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Veg Roll",
        "description": "",
        "price": "₹70"
    },
    {
        "_uid": "item-35",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Pasta Roll",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-36",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Chilli Paneer Roll",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-37",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Veg Pizza Bun",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-38",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Chinese Roll",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-39",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Chatpata Paneer Roll",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-40",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Veg Cheese Bun",
        "description": "",
        "price": "₹90"
    },
    {
        "_uid": "item-41",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Paneer Kulcha",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-42",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Paneer Naan",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-43",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Pasta Sandwich",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-44",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Chilli Paneer Pizza",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-45",
        "component": "menuItem",
        "category": "Savoury & Fast Food",
        "subCategory": "Snacks & Savouries",
        "title": "Chilli Paneer Hot Dog",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-46",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Kulcha",
        "description": "",
        "price": "₹35"
    },
    {
        "_uid": "item-47",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Milk Bread",
        "description": "",
        "price": "₹40"
    },
    {
        "_uid": "item-48",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Jumbo Bread",
        "description": "6 slices",
        "price": "₹40"
    },
    {
        "_uid": "item-49",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Brown Bread",
        "description": "",
        "price": "₹50"
    },
    {
        "_uid": "item-50",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "100% Atta Bread",
        "description": "",
        "price": "₹50"
    },
    {
        "_uid": "item-51",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Family Bread",
        "description": "",
        "price": "₹50"
    },
    {
        "_uid": "item-52",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Multigrain Bread",
        "description": "",
        "price": "₹55"
    },
    {
        "_uid": "item-53",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Jumbo Bread",
        "description": "full",
        "price": "₹180"
    },
    {
        "_uid": "item-54",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Garlic Loaf",
        "description": "",
        "price": "₹40"
    },
    {
        "_uid": "item-55",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Garlic Bread Round",
        "description": "",
        "price": "₹45"
    },
    {
        "_uid": "item-56",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Fruit Bread Round",
        "description": "",
        "price": "₹50"
    },
    {
        "_uid": "item-57",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Breads",
        "title": "Focaccia",
        "description": "",
        "price": "₹60"
    },
    {
        "_uid": "item-58",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Buns & Bases",
        "title": "Fruit Buns",
        "description": "",
        "price": "₹25"
    },
    {
        "_uid": "item-59",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Buns & Bases",
        "title": "Pizza Base",
        "description": "",
        "price": "₹30"
    },
    {
        "_uid": "item-60",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Buns & Bases",
        "title": "Burger Buns",
        "description": "",
        "price": "₹35"
    },
    {
        "_uid": "item-61",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Buns & Bases",
        "title": "Pav Buns",
        "description": "",
        "price": "₹35"
    },
    {
        "_uid": "item-62",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Buns & Bases",
        "title": "Hot Dog Buns",
        "description": "",
        "price": "₹35"
    },
    {
        "_uid": "item-63",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Soup Sticks",
        "description": "",
        "price": "₹65"
    },
    {
        "_uid": "item-64",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Lavash",
        "description": "",
        "price": "₹75"
    },
    {
        "_uid": "item-65",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Saunf Rusk",
        "description": "",
        "price": "₹75"
    },
    {
        "_uid": "item-66",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Butter milk Rusk",
        "description": "",
        "price": "₹75"
    },
    {
        "_uid": "item-67",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Butter Garlic Toast",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-68",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Suji Elaichi Rusk",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-69",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Sugar-Free Rusk",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-70",
        "component": "menuItem",
        "category": "Breads & Buns",
        "subCategory": "Toasts & Rusks",
        "title": "Cake Rusk",
        "description": "",
        "price": "₹120"
    },
    {
        "_uid": "item-71",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "French Heart Cookies",
        "description": "",
        "price": "₹90"
    },
    {
        "_uid": "item-72",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "Sugar-Free Cornflake Cookies",
        "description": "",
        "price": "₹120"
    },
    {
        "_uid": "item-73",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "Choco Chip Cookies",
        "description": "",
        "price": "₹140"
    },
    {
        "_uid": "item-74",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "Multigrain Cookies",
        "description": "",
        "price": "₹140"
    },
    {
        "_uid": "item-75",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "Oats Cookies",
        "description": "",
        "price": "₹140"
    },
    {
        "_uid": "item-76",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "Dry Fruits Millet Cookies",
        "description": "",
        "price": "₹225"
    },
    {
        "_uid": "item-77",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Premium Cookies",
        "title": "Biscoff Cookies",
        "description": "",
        "price": "₹225"
    },
    {
        "_uid": "item-78",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Chocolate Delight Cookies",
        "description": "",
        "price": "₹90"
    },
    {
        "_uid": "item-79",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Peanut Cookies",
        "description": "",
        "price": "₹90"
    },
    {
        "_uid": "item-80",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Marble Cookies",
        "description": "",
        "price": "₹90"
    },
    {
        "_uid": "item-81",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Karachi Fruit Cookies",
        "description": "",
        "price": "₹90"
    },
    {
        "_uid": "item-82",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Besan Barfi",
        "description": "",
        "price": "₹100"
    },
    {
        "_uid": "item-83",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Badam Naan Khatai",
        "description": "",
        "price": "₹110"
    },
    {
        "_uid": "item-84",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Elaichi Naan Khatai",
        "description": "",
        "price": "₹110"
    },
    {
        "_uid": "item-85",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Milk Coconut Cookies",
        "description": "",
        "price": "₹120"
    },
    {
        "_uid": "item-86",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Salted Jeera Cookies",
        "description": "",
        "price": "₹120"
    },
    {
        "_uid": "item-87",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Salted Ajwain Cookies",
        "description": "",
        "price": "₹120"
    },
    {
        "_uid": "item-88",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Sesame Jaggery Cookies",
        "description": "",
        "price": "₹150"
    },
    {
        "_uid": "item-89",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Signature Cookies",
        "title": "Kaju Pista Cookies",
        "description": "",
        "price": "₹160"
    },
    {
        "_uid": "item-90",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Puffs",
        "title": "Ajwain Masala Puff",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-91",
        "component": "menuItem",
        "category": "Cookies & Puffs",
        "subCategory": "Puffs",
        "title": "Jeera Puff",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-92",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Fruit Muffin",
        "description": "1 Pc.",
        "price": "₹25"
    },
    {
        "_uid": "item-93",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Chocolate Muffin",
        "description": "",
        "price": "₹25"
    },
    {
        "_uid": "item-94",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Choco Chip Tea Cake",
        "description": "150 g",
        "price": "₹90"
    },
    {
        "_uid": "item-95",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Muffin Box",
        "description": "4 Pcs.",
        "price": "₹90"
    },
    {
        "_uid": "item-96",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Choco Chip Tea Cake",
        "description": "200 g",
        "price": "₹120"
    },
    {
        "_uid": "item-97",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Mini Muffin Box",
        "description": "Vanilla",
        "price": "₹150"
    },
    {
        "_uid": "item-98",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Mini Muffin Box",
        "description": "Chocolate",
        "price": "₹160"
    },
    {
        "_uid": "item-99",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Tea Cakes & Muffins",
        "title": "Choco Chip Tea Cake",
        "description": "400 g",
        "price": "₹230"
    },
    {
        "_uid": "item-100",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Brownies",
        "title": "Brownie Walnut",
        "description": "",
        "price": "₹60"
    },
    {
        "_uid": "item-101",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Brownies",
        "title": "Chocolava",
        "description": "",
        "price": "₹80"
    },
    {
        "_uid": "item-102",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Desserts",
        "title": "Ice Cream",
        "description": "",
        "price": "₹49"
    },
    {
        "_uid": "item-103",
        "component": "menuItem",
        "category": "Cakes & Desserts",
        "subCategory": "Desserts",
        "title": "Brownie with Hot Chocolate",
        "description": "",
        "price": "₹129"
    },
    {
        "_uid": "item-104",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Mocktails",
        "title": "Fresh Lime Water",
        "description": "",
        "price": "₹49"
    },
    {
        "_uid": "item-105",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Mocktails",
        "title": "Fresh Lime Soda",
        "description": "",
        "price": "₹59"
    },
    {
        "_uid": "item-106",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Mocktails",
        "title": "Blue Lagoon",
        "description": "",
        "price": "₹89"
    },
    {
        "_uid": "item-107",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Mocktails",
        "title": "Virgin Mojito",
        "description": "",
        "price": "₹89"
    },
    {
        "_uid": "item-108",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Cold Coffee",
        "description": "",
        "price": "₹99"
    },
    {
        "_uid": "item-109",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Banana Shake",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-110",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Chikoo Shake",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-111",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Sitafal Shake",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-112",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Strawberry Shake",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-113",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Blueberry Shake",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-114",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Chocolate Shake",
        "description": "",
        "price": "₹109"
    },
    {
        "_uid": "item-115",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Oreo Shake",
        "description": "",
        "price": "₹129"
    },
    {
        "_uid": "item-116",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Kit Kat Shake",
        "description": "",
        "price": "₹129"
    },
    {
        "_uid": "item-117",
        "component": "menuItem",
        "category": "Beverages",
        "subCategory": "Shakes",
        "title": "Brownie Shake",
        "description": "",
        "price": "₹129"
    }
];
}
