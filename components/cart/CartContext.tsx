"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type CartProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartProduct[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Omit<CartProduct, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "natt-store-carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar el carrito del localStorage y validarlo contra Supabase (eliminar borrados)
  useEffect(() => {
    async function loadAndValidateCart() {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            const ids = parsedCart.map((p: CartProduct) => p.id);

            // Consultar a Supabase cuáles de estos IDs siguen activos y existen
            const { data, error } = await supabase
              .from("productos")
              .select("id, name, category, price, image, active, stock")
              .in("id", ids)
              .eq("active", true);

            if (!error && data) {
              const activeProductsMap = new Map(data.map((p: any) => [p.id, p]));

              // Filtrar solo los productos que siguen existiendo y actualizar sus datos vigentes (precio, nombre, etc.)
              const validItems: CartProduct[] = parsedCart
                .filter((item: CartProduct) => activeProductsMap.has(item.id))
                .map((item: CartProduct) => {
                  const freshData: any = activeProductsMap.get(item.id);
                  return {
                    ...item,
                    name: freshData.name || item.name,
                    price: freshData.price ?? item.price,
                    image: freshData.image || item.image,
                    category: freshData.category || item.category,
                  };
                });

              setItems(validItems);
            } else {
              setItems([]);
            }
          }
        }
      } catch {
        setItems([]);
      } finally {
        setIsLoaded(true);
      }
    }

    loadAndValidateCart();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Si el navegador no permite almacenamiento, el carrito
      // seguirá funcionando durante la sesión actual.
    }
  }, [items, isLoaded]);

  const addToCart = (
    product: Omit<CartProduct, "quantity">,
    quantity = 1
  ) => {
    setItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  const value = {
    items,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider");
  }

  return context;
}