export interface MenuItem {
  _uid: string;
  component: "menuItem";
  category: string;
  subCategory: string;
  title: string;
  description: string;
  price: string;
  inStock?: boolean;
  isPopular?: boolean;
}

export { getMenuItems } from "@/app/actions";
