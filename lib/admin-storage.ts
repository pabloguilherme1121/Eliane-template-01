import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const ADMIN_STORAGE_KEYS = {
  products: "elianefashion.admin.products.v1",
  orders: "elianefashion.admin.orders.v1",
  settings: "elianefashion.admin.settings.v2",
} as const;

async function read(key: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") return window.localStorage.getItem(key);
  return AsyncStorage.getItem(key);
}

async function write(key: string, value: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

export async function loadAdminState<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await read(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export async function saveAdminState<T>(key: string, value: T) {
  try {
    await write(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing or restricted environments.
  }
}
