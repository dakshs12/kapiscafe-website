import fs from "fs/promises";
import path from "path";
import { MenuItem } from "./cms-utils";

const DATA_PATH = path.join(process.cwd(), "data", "menu.json");

/**
 * Reads all menu items from data/menu.json on server
 */
export async function getMenuItemsServer(): Promise<MenuItem[]> {
  try {
    const fileContent = await fs.readFile(DATA_PATH, "utf8");
    const items: MenuItem[] = JSON.parse(fileContent);
    return items;
  } catch (error) {
    console.error("Error reading menu.json:", error);
    return [];
  }
}

/**
 * Saves all menu items to data/menu.json on server
 */
export async function saveMenuItemsServer(items: MenuItem[]): Promise<void> {
  const dir = path.dirname(DATA_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving menu.json:", error);
    throw new Error("Failed to save menu items.");
  }
}

/**
 * Adds a new menu item on server
 */
export async function addMenuItemServer(
  itemData: Omit<MenuItem, "_uid" | "component">
): Promise<MenuItem> {
  const items = await getMenuItemsServer();
  const newItem: MenuItem = {
    ...itemData,
    _uid: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    component: "menuItem",
    inStock: itemData.inStock !== undefined ? itemData.inStock : true,
    isPopular: !!itemData.isPopular,
  };

  items.push(newItem);
  await saveMenuItemsServer(items);
  return newItem;
}

/**
 * Updates an existing menu item by ID on server
 */
export async function updateMenuItemServer(
  id: string,
  updates: Partial<MenuItem>
): Promise<MenuItem | null> {
  const items = await getMenuItemsServer();
  const index = items.findIndex((item) => item._uid === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    _uid: items[index]._uid,
    component: "menuItem",
  };

  await saveMenuItemsServer(items);
  return items[index];
}

/**
 * Deletes a menu item by ID on server
 */
export async function deleteMenuItemServer(id: string): Promise<boolean> {
  const items = await getMenuItemsServer();
  const filtered = items.filter((item) => item._uid !== id);
  if (filtered.length === items.length) return false;

  await saveMenuItemsServer(filtered);
  return true;
}

/**
 * Toggles stock availability for a menu item on server
 */
export async function toggleItemAvailabilityServer(id: string): Promise<MenuItem | null> {
  const items = await getMenuItemsServer();
  const index = items.findIndex((item) => item._uid === id);
  if (index === -1) return null;

  const current = items[index].inStock !== false;
  items[index].inStock = !current;

  await saveMenuItemsServer(items);
  return items[index];
}
