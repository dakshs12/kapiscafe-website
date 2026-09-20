import React from "react";
import { getMenuItems } from "@/lib/cms-utils";
import MenuManager from "@/components/admin/MenuManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu Manager | Kapi's Bakehouse Admin",
  description: "Manage items, prices, and stock availability across all categories.",
};

export default async function AdminMenuPage() {
  const menuItems = await getMenuItems();

  return <MenuManager initialItems={menuItems} />;
}
