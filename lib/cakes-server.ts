import fs from "fs/promises";
import path from "path";

export type CakeOrderStatus = "Pending" | "Contacted" | "Confirmed" | "Completed";

export interface CakeOrder {
  id: string;
  name: string;
  phone: string;
  date: string;
  occasion: string;
  tier: string;
  weight: string;
  flavour: string;
  topper?: string;
  notes?: string;
  status: CakeOrderStatus;
  createdAt: string;
}

export interface CakeFlavour {
  id: string;
  name: string;
  notes: string;
}

export interface CakeConfig {
  minNoticeHours: number;
  flavours: CakeFlavour[];
}

const ORDERS_PATH = path.join(process.cwd(), "data", "cake-orders.json");
const CONFIG_PATH = path.join(process.cwd(), "data", "cake-config.json");

/**
 * Reads all cake orders from data/cake-orders.json
 */
export async function getCakeOrdersServer(): Promise<CakeOrder[]> {
  try {
    const fileContent = await fs.readFile(ORDERS_PATH, "utf8");
    const orders: CakeOrder[] = JSON.parse(fileContent);
    // Sort descending by createdAt
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error reading cake-orders.json:", error);
    return [];
  }
}

/**
 * Saves all cake orders to data/cake-orders.json
 */
export async function saveCakeOrdersServer(orders: CakeOrder[]): Promise<void> {
  const dir = path.dirname(ORDERS_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving cake-orders.json:", error);
    throw new Error("Failed to save cake orders.");
  }
}

/**
 * Adds a new cake order to the ledger
 */
export async function addCakeOrderServer(
  orderData: Omit<CakeOrder, "id" | "status" | "createdAt"> & {
    status?: CakeOrderStatus;
    createdAt?: string;
  }
): Promise<CakeOrder> {
  const orders = await getCakeOrdersServer();
  const newOrder: CakeOrder = {
    id: `cake-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: orderData.name || "Anonymous Customer",
    phone: orderData.phone || "",
    date: orderData.date || "",
    occasion: orderData.occasion || "Celebration",
    tier: orderData.tier || "Single Tier",
    weight: orderData.weight || "1kg",
    flavour: orderData.flavour || "Belgian Truffle",
    topper: orderData.topper || "",
    notes: orderData.notes || "",
    status: orderData.status || "Pending",
    createdAt: orderData.createdAt || new Date().toISOString(),
  };

  orders.unshift(newOrder);
  await saveCakeOrdersServer(orders);
  return newOrder;
}

/**
 * Updates an order status (Pending -> Contacted -> Confirmed -> Completed)
 */
export async function updateCakeOrderStatusServer(
  id: string,
  status: CakeOrderStatus
): Promise<CakeOrder | null> {
  const orders = await getCakeOrdersServer();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index].status = status;
  await saveCakeOrdersServer(orders);
  return orders[index];
}

/**
 * Deletes a cake order from the ledger
 */
export async function deleteCakeOrderServer(id: string): Promise<boolean> {
  const orders = await getCakeOrdersServer();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;

  await saveCakeOrdersServer(filtered);
  return true;
}

/**
 * Default fallback cake config
 */
const DEFAULT_CONFIG: CakeConfig = {
  minNoticeHours: 48,
  flavours: [
    { id: "Belgian Truffle", name: "Belgian Truffle", notes: "Rich dark chocolate & smooth cream" },
    { id: "Biscoff Crunch", name: "Biscoff Crunch", notes: "Caramelized lotus biscuits & creamy layers" },
    { id: "Red Velvet", name: "Red Velvet", notes: "Soft red sponge with cream cheese frosting" },
    { id: "Fresh Fruit Vanilla", name: "Fresh Fruit Vanilla", notes: "Pure vanilla sponge with seasonal fresh fruits" },
    { id: "Pistachio Rose", name: "Pistachio Rose", notes: "Pistachio sponge with light rose cream" },
    { id: "Custom Flavour", name: "Custom / Other Flavour", notes: "Tell us your own favourite flavour combination" },
  ],
};

/**
 * Reads cake form configuration from data/cake-config.json
 */
export async function getCakeConfigServer(): Promise<CakeConfig> {
  try {
    const fileContent = await fs.readFile(CONFIG_PATH, "utf8");
    const config: CakeConfig = JSON.parse(fileContent);
    return config;
  } catch (error) {
    console.error("Error reading cake-config.json, returning default:", error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Saves cake form configuration to data/cake-config.json
 */
export async function updateCakeConfigServer(config: CakeConfig): Promise<CakeConfig> {
  const dir = path.dirname(CONFIG_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
    return config;
  } catch (error) {
    console.error("Error saving cake-config.json:", error);
    throw new Error("Failed to save cake configuration.");
  }
}
