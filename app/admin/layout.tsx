import React from "react";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";

export const metadata = {
  title: "Admin Console | Kapi's Bakehouse",
  description: "Management portal for Kapi's Bakehouse operations, menu, and inquiries.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "authenticated";

  // Login page handling:
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      redirect("/admin");
    }
    return <>{children}</>;
  }

  // Protected admin routes:
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
