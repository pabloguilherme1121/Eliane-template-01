import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { products, type Product } from "@/lib/catalog";
import { addCartLine, calculateSubtotal, restoreSelection, setCartLineQuantity, type CartLine } from "@/lib/cart-logic";

type StoreContextValue = {
  hydrated: boolean;
  favorites: string[];
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  notice: string | null;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addToCart: (product: Product, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  dismissNotice: () => void;
};

const STORAGE_KEY = "eliane-fashion-store-v1";
const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = restoreSelection(raw, products);
        setFavorites(saved.favorites);
        setCart(saved.cart);
      })
      .catch(() => setNotice("Não foi possível restaurar sua sacola agora."))
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites, cart })).catch(() => {
      setNotice("Não foi possível salvar sua seleção neste momento.");
    });
  }, [cart, favorites, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice, pathname]);

  const toggleFavorite = (productId: string) => {
    if (!products.some((product) => product.id === productId)) return;
    const removing = favorites.includes(productId);
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
    setNotice(removing ? "Removido dos favoritos." : "Guardado nos favoritos.");
  };

  const addToCart = (product: Product, size: string) => {
    if (!products.some((item) => item.id === product.id) || !product.sizes.includes(size)) {
      setNotice("Selecione um tamanho disponível.");
      return;
    }
    setCart((current) => addCartLine(current, product, size));
    setNotice(`${product.name} foi adicionado à sacola (sujeito à disponibilidade).`);
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    setCart((current) => setCartLineQuantity(current, productId, size, quantity));
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((current) => current.filter((line) => !(line.productId === productId && line.size === size)));
    setNotice("Item removido da sacola.");
  };

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = calculateSubtotal(cart, products);
    return {
      hydrated,
      favorites,
      cart,
      cartCount,
      subtotal,
      notice,
      toggleFavorite,
      isFavorite: (productId) => favorites.includes(productId),
      addToCart,
      updateQuantity,
      removeFromCart,
      dismissNotice: () => setNotice(null),
    };
  }, [cart, favorites, hydrated, notice]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return context;
}
