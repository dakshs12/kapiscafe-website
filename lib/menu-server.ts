import { MenuItem } from "./cms-utils";
import { readJsonStorage, writeJsonStorage } from "./storage-helper";

/**
 * Reads all menu items from persistent storage (local disk, /tmp, or Cloud KV)
 */
export async function getMenuItemsServer(): Promise<MenuItem[]> {
  return readJsonStorage<MenuItem[]>("menu", "menu.json", []);
}

/**
 * Saves all menu items to persistent storage (local disk, /tmp, or Cloud KV)
 */
export async function saveMenuItemsServer(items: MenuItem[]): Promise<void> {
  await writeJsonStorage("menu", "menu.json", items);
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
