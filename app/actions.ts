"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  CakeOrder,
  CakeOrderStatus,
  CakeConfig,
  getCakeOrdersServer,
  addCakeOrderServer,
  updateCakeOrderStatusServer,
  deleteCakeOrderServer,
  getCakeConfigServer,
  updateCakeConfigServer,
} from "@/lib/cakes-server";

import { MenuItem } from "@/lib/cms-utils";
import {
  getMenuItemsServer,
  addMenuItemServer,
  updateMenuItemServer,
  deleteMenuItemServer,
  toggleItemAvailabilityServer,
} from "@/lib/menu-server";

// ==========================================
// CUSTOM CAKE ORDERS PUBLIC SUBMISSION
// ==========================================

export async function submitCustomCakeOrder(formData: FormData) {
  try {
    const rawName = (formData.get("fullName") || formData.get("name") || "").toString().trim();
    const rawPhone = (formData.get("phone") || "").toString().trim();
    const rawDate = (formData.get("eventDate") || formData.get("date") || "").toString().trim();
    const rawOccasion = (formData.get("occasion") || "Celebration").toString().trim();
    const rawTier = (formData.get("tier") || "Single Tier").toString().trim();
    const rawWeight = (formData.get("weight") || "1kg").toString().trim();
    const rawFlavour = (formData.get("flavour") || "Belgian Truffle").toString().trim();
    const rawTopper = (formData.get("topperText") || formData.get("topper") || "").toString().trim();
    const rawNotes = (formData.get("designNotes") || formData.get("notes") || "").toString().trim();

    const newOrder = await addCakeOrderServer({
      name: rawName,
      phone: rawPhone,
      date: rawDate,
      occasion: rawOccasion,
      tier: rawTier,
      weight: rawWeight,
      flavour: rawFlavour,
      topper: rawTopper,
      notes: rawNotes,
      status: "Pending",
    });

    console.log("🎂 Custom Cake Order Persisted:", newOrder);

    revalidatePath("/admin/cakes");
    revalidatePath("/admin");

    return { success: true, order: newOrder };
  } catch (error: any) {
    console.error("Error submitting custom cake order:", error);
    return { success: false, error: error?.message || "Failed to persist cake inquiry." };
  }
}

// ==========================================
// ADMIN AUTHENTICATION ACTIONS
// ==========================================

export async function adminLogin(formData: FormData) {
  const password = formData.get("password");
  const expectedPassword = process.env.ADMIN_PASSWORD || "kapis2026";

  if (typeof password === "string" && password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }

  return { success: false, error: "Incorrect password. Please try again." };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

// ==========================================
// MENU MANAGEMENT SERVER ACTIONS
// ==========================================

export async function getMenuItems(): Promise<MenuItem[]> {
  return getMenuItemsServer();
}

export async function createMenuItem(
  itemData: Omit<MenuItem, "_uid" | "component">
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const newItem = await addMenuItemServer(itemData);
    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/admin");
    return { success: true, item: newItem };
  } catch (error: any) {
    console.error("Failed to create menu item:", error);
    return { success: false, error: error?.message || "Failed to create menu item." };
  }
}

export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await updateMenuItemServer(id, updates);
    if (!updated) {
      return { success: false, error: "Item not found." };
    }

    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/admin");
    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Failed to update menu item:", error);
    return { success: false, error: error?.message || "Failed to update menu item." };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const deleted = await deleteMenuItemServer(id);
    if (!deleted) {
      return { success: false, error: "Item not found." };
    }

    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete menu item:", error);
    return { success: false, error: error?.message || "Failed to delete menu item." };
  }
}

export async function toggleItemAvailability(id: string) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await toggleItemAvailabilityServer(id);
    if (!updated) {
      return { success: false, error: "Item not found." };
    }

    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/admin");
    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Failed to toggle item availability:", error);
    return { success: false, error: error?.message || "Failed to toggle availability." };
  }
}

// ==========================================
// CUSTOM CAKE ORDERS & CONFIG SERVER ACTIONS
// ==========================================

export async function getCakeOrders(): Promise<CakeOrder[]> {
  return getCakeOrdersServer();
}

export async function updateCakeOrderStatus(id: string, status: CakeOrderStatus) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await updateCakeOrderStatusServer(id, status);
    if (!updated) {
      return { success: false, error: "Order not found." };
    }

    revalidatePath("/admin/cakes");
    revalidatePath("/admin");
    return { success: true, order: updated };
  } catch (error: any) {
    console.error("Failed to update cake order status:", error);
    return { success: false, error: error?.message || "Failed to update order status." };
  }
}

export async function deleteCakeOrder(id: string) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const deleted = await deleteCakeOrderServer(id);
    if (!deleted) {
      return { success: false, error: "Order not found." };
    }

    revalidatePath("/admin/cakes");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete cake order:", error);
    return { success: false, error: error?.message || "Failed to delete cake order." };
  }
}

export async function getCakeConfig(): Promise<CakeConfig> {
  return getCakeConfigServer();
}

export async function updateCakeConfig(config: CakeConfig) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await updateCakeConfigServer(config);
    revalidatePath("/custom-cakes");
    revalidatePath("/admin/cakes");
    return { success: true, config: updated };
  } catch (error: any) {
    console.error("Failed to update cake configuration:", error);
    return { success: false, error: error?.message || "Failed to update configuration." };
  }
}
