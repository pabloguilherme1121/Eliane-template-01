import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { products, type Product } from "@/lib/catalog";
import { addCartLine, calculateSubtotal, getCartAdditionStatus, parsePersistedSelection, setCartLineQuantity, type CartLine } from "@/lib/cart-logic";
import { createLatestWriteQueue, readStoredSelection } from "@/lib/persistence";

type StoreContextValue = {
  hydrated: boolean;
  favorites: string[];
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  notice: string | null;
  storageWarning: string | null;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addToCart: (product: Product, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  dismissNotice: () => void;
  dismissStorageWarning: () => void;
};

const STORAGE_KEY = "eliane-fashion-store-v1";
const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const cartRef = useRef<CartLine[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [persistSelection] = useState(() => createLatestWriteQueue(
    (snapshot) => AsyncStorage.setItem(STORAGE_KEY, snapshot),
    () => setNotice("Não foi possível salvar sua seleção neste momento."),
  ));

  useEffect(() => {
    let cancelled = false;
    void readStoredSelection(
      () => AsyncStorage.getItem(STORAGE_KEY),
      (raw) => parsePersistedSelection(raw, products),
    ).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setFavorites(result.selection.favorites);
        cartRef.current = result.selection.cart;
        setCart(result.selection.cart);
        setStorageReady(true);
      } else {
        setStorageWarning("Não foi possível acessar seus itens salvos. Alterações desta sessão não serão gravadas para proteger os dados anteriores.");
      }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated || !storageReady) return;
    void persistSelection(JSON.stringify({ favorites, cart }));
  }, [cart, favorites, hydrated, storageReady, persistSelection]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice, pathname]);

  const toggleFavorite = (productId: string) => {
    if (!hydrated) { setNotice("Aguarde o carregamento da sua seleção."); return; }
    if (!products.some((product) => product.id === productId)) return;
    const removing = favorites.includes(productId);
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
    setNotice(removing ? "Removido dos favoritos." : "Guardado nos favoritos.");
  };

  const addToCart = (product: Product, size: string) => {
    if (!hydrated) { setNotice("Aguarde o carregamento da sua seleção."); return; }
    const catalogProduct = products.find((item) => item.id === product.id);
    if (!catalogProduct) { setNotice("Peça indisponível no catálogo."); return; }
    const status = getCartAdditionStatus(cartRef.current, catalogProduct, size);
    if (status !== "added") {
      const messages = {
        "invalid-size": "Selecione um tamanho disponível.",
        "cart-full": "Sua sacola atingiu o limite de itens desta demonstração.",
        "quantity-limit": "Você já selecionou a quantidade máxima deste tamanho.",
      } as const;
      setNotice(messages[status]);
      return;
    }
    const next = addCartLine(cartRef.current, catalogProduct, size);
    cartRef.current = next;
    setCart(next);
    setNotice(`${catalogProduct.name} foi adicionado à sacola (sujeito à disponibilidade).`);
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (!hydrated) return;
    const next = setCartLineQuantity(cartRef.current, productId, size, quantity);
    cartRef.current = next;
    setCart(next);
  };

  const removeFromCart = (productId: string, size: string) => {
    if (!hydrated) return;
    const next = cartRef.current.filter((line) => !(line.productId === productId && line.size === size));
    cartRef.current = next;
    setCart(next);
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
      storageWarning,
      toggleFavorite,
      isFavorite: (productId) => favorites.includes(productId),
      addToCart,
      updateQuantity,
      removeFromCart,
      dismissNotice: () => setNotice(null),
      dismissStorageWarning: () => setStorageWarning(null),
    };
  }, [cart, favorites, hydrated, notice, storageWarning]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return context;
}
