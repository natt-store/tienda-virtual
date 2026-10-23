"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
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
  
  // Estado para la notificación flotante (Toast)
  const [toastProduct, setToastProduct] = useState<CartProduct | null>(null);

  // Cargar el carrito del localStorage y validarlo contra Supabase
  useEffect(() => {
    async function loadAndValidateCart() {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            const ids = parsedCart.map((p: CartProduct) => p.id);

            const { data, error } = await supabase
              .from("productos")
              .select("id, name, category, price, image, active, stock")
              .in("id", ids)
              .eq("active", true);

            if (!error && data) {
              const activeProductsMap = new Map(data.map((p: any) => [p.id, p]));

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
      // Manejo seguro si el almacenamiento falla
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

      let updatedItems;
      if (existingProduct) {
        updatedItems = currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...currentItems, { ...product, quantity }];
      }

      return updatedItems;
    });

    // Disparamos la notificación bonita con el producto añadido
    setToastProduct({ ...product, quantity });

    // Ocultar el toast automáticamente a los 5 segundos
    setTimeout(() => {
      setToastProduct((current) => (current?.id === product.id ? null : current));
    }, 5000);
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
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // ERROR CORREGIDO AQUÍ: se quitó 'fnTotalItems' y quedó como función limpia
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* =========================================================
          NOTIFICACIÓN FLOTANTE (TOAST) ELEGANTE
      ========================================================= */}
      {toastProduct && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-[#fffaf5] p-4 shadow-[0_20px_50px_rgba(70,45,35,0.18)] backdrop-blur-md">
            <div
              className="absolute left-0 right-0 top-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg, #ff1493, #00d9d9)",
              }}
            />

            <div className="flex items-start gap-3">
              {/* Miniatura del producto */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#24191f]/10 bg-[#efe4da]">
                {toastProduct.image ? (
                  <Image
                    src={toastProduct.image}
                    alt={toastProduct.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff1493]">
                  ¡Agregado al carrito! ✨
                </p>
                <h4 className="text-xs font-black text-[#24191f] truncate mt-0.5">
                  {toastProduct.name}
                </h4>
                <p className="text-xs font-bold text-[#67545d] mt-0.5">
                  {formatPrice(toastProduct.price)} ({toastProduct.quantity} ud)
                </p>
              </div>

              {/* Botón cerrar */}
              <button
                type="button"
                onClick={() => setToastProduct(null)}
                className="text-[#67545d] hover:text-[#24191f] p-1"
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>

            {/* Botones de acción */}
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#24191f]/6">
              <button
                type="button"
                onClick={() => setToastProduct(null)}
                className="flex-1 rounded-full border border-[#24191f]/10 bg-white py-2 text-center text-xs font-bold text-[#67545d] transition hover:bg-[#f5eee7]"
              >
                Seguir comprando
              </button>
              
              <Link
                href="/carrito"
                onClick={() => setToastProduct(null)}
                className="flex-1 rounded-full bg-[#ff1493] py-2 text-center text-xs font-black text-white shadow-[0_5px_15px_rgba(255,20,147,0.3)] transition hover:bg-[#ff2fa4]"
              >
                Ver carrito / Pagar
              </Link>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider");
  }

  return context;
}