import React from "react";
import CakeManager from "@/components/admin/CakeManager";
import { getCakeOrdersServer, getCakeConfigServer } from "@/lib/cakes-server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Custom Cake Portal | Kapi's Bakehouse Admin",
  description: "Manage incoming custom cake orders, WhatsApp consultations, and order form options.",
};

export default async function AdminCakesPage() {
  const [orders, config] = await Promise.all([
    getCakeOrdersServer(),
    getCakeConfigServer(),
  ]);

  return <CakeManager initialOrders={orders} initialConfig={config} />;
}
